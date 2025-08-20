/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://127.0.0.1:8082}"
REDIS_URL="${REDIS_URL:-redis://127.0.0.1:6379/0}"
TIMEOUT_SEC="${TIMEOUT_SEC:-180}"
XYZ="${XYZ:-}"
USE_JQ=0
command -v jq >/dev/null 2>&1 && USE_JQ=1

echo "== Nox E2E Check =="
echo "API_URL=${API_URL}"
echo "REDIS_URL=${REDIS_URL}"
echo "TIMEOUT_SEC=${TIMEOUT_SEC}"

# 1) Redis ping
echo "[1/5] Checking Redis..."
if command -v redis-cli >/dev/null 2>&1; then
  if ! redis-cli -u "${REDIS_URL}" ping | grep -q PONG; then
    echo "ERROR: Redis ping failed on ${REDIS_URL}" >&2
    exit 1
  fi
else
  echo "WARN: redis-cli not found, skipping explicit ping."
fi
echo "OK Redis"

# 2) API health
echo "[2/5] Checking API /health..."
if ! curl -fsS "${API_URL}/health" | grep -q '"status":"ok"'; then
  echo "ERROR: API /health not responding with {\"status\":\"ok\"}" >&2
  exit 1
fi
echo "OK API"

# 3) Prepare XYZ (nitrométhane minimal) si non fourni
if [[ -z "${XYZ}" ]]; then
read -r -d '' XYZ <<'XYZ_EOF'
12
nitromethane
C 0.000000 0.000000 0.000000
H 0.000000 0.000000 1.089000
H 1.026719 0.000000 -0.363000
H -0.513360 -0.889165 -0.363000
N -0.513360 0.889165 -0.363000
O -1.713360 0.889165 -0.363000
O 0.186640 1.779165 -0.363000
XYZ_EOF
fi

# 4) POST /jobs
echo "[3/5] Submitting XTB job..."
payload=$(cat <<EOF
{
  "engine":"xtb",
  "kind":"opt_properties",
  "inputs":{
    "xyz":"${XYZ//$'\n'/\\n}",
    "charge":0,
    "multiplicity":1,
    "params":{"gfn":2,"opt":true,"json":true}
  }
}
EOF
)
resp=$(curl -fsS -H "Content-Type: application/json" -d "$payload" "${API_URL}/jobs") || {
  echo "ERROR: POST /jobs failed" >&2
  exit 1
}

# Extract job_id
if [[ $USE_JQ -eq 1 ]]; then
  job_id=$(printf "%s" "$resp" | jq -r .job_id)
else
  job_id=$(python - <<'PY'
import json,sys
print(json.loads(sys.stdin.read()).get("job_id",""))
PY
<<<"$resp")
fi

if [[ -z "$job_id" || "$job_id" == "null" ]]; then
  echo "ERROR: Could not extract job_id from response: $resp" >&2
  exit 1
fi
echo "JobID: $job_id"

# 5) Poll /jobs/{id} jusqu'à completion
echo "[4/5] Waiting for completion (timeout ${TIMEOUT_SEC}s)..."
deadline=$(( $(date +%s) + TIMEOUT_SEC ))
state=""
while true; do
  status_json=$(curl -fsS "${API_URL}/jobs/${job_id}") || {
    echo "ERROR: GET /jobs/${job_id} failed" >&2
    exit 1
  }
  if [[ $USE_JQ -eq 1 ]]; then
    state=$(printf "%s" "$status_json" | jq -r .state)
  else
    state=$(python - <<'PY'
import json,sys
print(json.loads(sys.stdin.read()).get("state",""))
PY
<<<"$status_json")
  fi

  if [[ "$state" == "completed" ]]; then
    echo "State: completed"
    break
  elif [[ "$state" == "failed" ]]; then
    echo "ERROR: Job failed. Full status: $status_json" >&2
    exit 1
  fi

  if (( $(date +%s) > deadline )); then
    echo "ERROR: Timeout waiting for job completion (last state=$state)." >&2
    echo "Hint: si l'état reste 'pending', le worker Dramatiq n'est probablement pas lancé." >&2
    exit 1
  fi
  sleep 2
done

# 6) GET artifacts et vérifications
echo "[5/5] Fetching artifacts..."
artifacts_json=$(curl -fsS "${API_URL}/jobs/${job_id}/artifacts") || {
  echo "ERROR: GET /jobs/${job_id}/artifacts failed" >&2
  exit 1
}

# vérifier E_total_hartree et artefacts
check_python=$(cat <<'PY'
import json,sys
d=json.loads(sys.stdin.read())
sc=d.get("scalars",{})
arts=d.get("artifacts",[])
names=[a.get("name","") for a in arts]
ok_energy=isinstance(sc.get("E_total_hartree",None),(int,float))
ok_log=("xtb.log" in names)
ok_json=("xtbout.json" in names)
print("OK_ENERGY" if ok_energy else "NO_ENERGY")
print("OK_LOG" if ok_log else "NO_LOG")
print("OK_JSON" if ok_json else "NO_JSON")
PY
)

readarray -t results < <(python - <<PY
$check_python
PY
<<<"$artifacts_json")

if [[ "${results[0]}" != "OK_ENERGY" ]]; then
  echo "ERROR: scalar E_total_hartree absent dans la réponse." >&2
  echo "$artifacts_json"
  exit 1
fi
if [[ "${results[1]}" != "OK_LOG" ]]; then
  echo "ERROR: xtb.log manquant dans les artefacts." >&2
  echo "$artifacts_json"
  exit 1
fi
if [[ "${results[2]}" != "OK_JSON" ]]; then
  echo "WARN: xtbout.json manquant, parsing retombé sur le log/texte."
fi

echo "== SUCCESS =="
echo "Nox est opérationnel. Redis OK, API OK, worker OK, XTB OK."
