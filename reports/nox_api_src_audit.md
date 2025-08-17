# Audit nox-api-src

**Date**: 2025-08-17T17:17:21  
**Racine analysée**: `nox-api-src/`  

## Résumé

- Dossiers: 78
- Fichiers: 410
- Taille totale: 2.95 MB
- Fichiers ignorés: 1
- Doublons par nom détectés: 56 groupes
- Doublons par contenu détectés: 6 groupes

## Arborescence (profondeur limitée)

```
├── ai/  [files:5 total:7 size:150193]
  └── runners/  [files:2 total:2 size:6602]
├── api/  [files:5 total:15 size:56333]
  ├── routes/  [files:2 total:2 size:3095]
  ├── schemas/  [files:3 total:3 size:877]
  └── services/  [files:5 total:5 size:1450]
├── archive/  [files:0 total:23 size:124773]
  ├── deprecated-scripts/  [files:8 total:8 size:46516]
  ├── legacy-tests/  [files:7 total:7 size:12406]
  ├── old-api-versions/  [files:5 total:5 size:61560]
  └── old-configs/  [files:3 total:3 size:4291]
├── artifacts/  [files:0 total:27 size:83526]
  ├── 072845fdb3fc4bbe9548d4b4124d9d16/  [files:9 total:9 size:27845]
  ├── aaf61a28131a4720aa5d2e522e0dc443/  [files:9 total:9 size:27845]
  └── test123/  [files:9 total:9 size:27836]
├── auth/  [files:6 total:6 size:28130]
├── clients/  [files:3 total:3 size:29490]
├── config/  [files:1 total:4 size:2296]
  └── redis/  [files:3 total:3 size:1818]
├── dashboard/  [files:6 total:6 size:53993]
├── data/  [files:1 total:1 size:24576]
├── docs/  [files:1 total:67 size:555042]
  ├── deployment-guides/  [files:10 total:10 size:128288]
  ├── milestone-reports/  [files:21 total:21 size:162584]
  ├── phase-specifications/  [files:4 total:4 size:47012]
  ├── planning/  [files:13 total:13 size:88031]
  ├── progress-reports/  [files:11 total:11 size:83122]
  ├── session-reports/  [files:5 total:5 size:29109]
  ├── testing/  [files:1 total:1 size:7048]
  └── testing-status/  [files:1 total:1 size:4632]
├── docs-interactive/  [files:27 total:71 size:634502]
  ├── public/  [files:6 total:6 size:22988]
  ├── sdk-typescript/  [files:3 total:4 size:20527]
    └── src/  [files:1 total:1 size:11286]
  └── src/  [files:0 total:34 size:245818]
    ├── app/  [files:5 total:6 size:18323]
      └── auth/  [files:0 total:1 size:1351]
        └── callback/  [files:1 total:1 size:1351]
    ├── components/  [files:14 total:21 size:194537]
      └── ui/  [files:7 total:7 size:33417]
    ├── hooks/  [files:3 total:3 size:14332]
    ├── lib/  [files:1 total:1 size:166]
    ├── types/  [files:1 total:1 size:2782]
    └── utils/  [files:2 total:2 size:15678]
├── k8s/  [files:10 total:13 size:54819]
  └── staging/  [files:3 total:3 size:31497]
├── logs/  [files:2 total:2 size:161017]
├── migrations/  [files:1 total:1 size:14491]
├── monitoring/  [files:3 total:3 size:0]
├── nox-api/  [files:1 total:29 size:203891]
  ├── api/  [files:8 total:8 size:66121]
  ├── auth/  [files:3 total:3 size:19304]
  ├── deploy/  [files:9 total:9 size:74854]
  ├── scripts/  [files:2 total:2 size:36929]
  └── tests/  [files:6 total:6 size:6058]
├── observability/  [files:5 total:5 size:25189]
├── policy/  [files:1 total:1 size:3510]
├── quotas/  [files:7 total:7 size:55171]
├── reports/  [files:2 total:2 size:79242]
├── scripts/  [files:24 total:24 size:173356]
├── sdk/  [files:0 total:21 size:220744]
  ├── python/  [files:2 total:11 size:137425]
    └── nox_sdk/  [files:5 total:9 size:133332]
      └── ai/  [files:4 total:4 size:55690]
  └── typescript/  [files:3 total:10 size:83319]
    └── src/  [files:4 total:7 size:73773]
      └── ai/  [files:3 total:3 size:28102]
└── tests/  [files:2 total:2 size:5864]
```

## Top fichiers par taille

| Path | Size | MTime |
| --- | ---: | --- |
| `docs-interactive/package-lock.json` | 220.38 KB | 2025-08-15T15:15:14 |
| `logs/audit.jsonl` | 157.24 KB | 2025-08-13T16:43:39 |
| `reports/nox_api_src_audit.md` | 75.41 KB | 2025-08-17T16:53:05 |
| `ai/biometric_auth.py` | 46.54 KB | 2025-08-13T19:20:54 |
| `docs/deployment-guides/ENHANCED_DEPLOYMENT_GUIDE.md` | 44.28 KB | 2025-08-15T17:26:36 |
| `ai/policy_engine.py` | 34.38 KB | 2025-08-13T19:20:54 |
| `ai/ai_coordinator.py` | 32.24 KB | 2025-08-13T19:20:54 |
| `ai/security_monitor.py` | 27.05 KB | 2025-08-13T19:20:54 |
| `docs-interactive/MIGRATION_GUIDE.md` | 26.14 KB | 2025-08-15T17:26:36 |
| `docs-interactive/AUTHENTICATION_GUIDE.md` | 25.08 KB | 2025-08-15T17:26:36 |
| `data/nox.db` | 24.00 KB | 2025-08-13T13:55:09 |
| `nox-api/scripts/nox_repair.sh` | 23.71 KB | 2025-08-15T19:31:48 |
| `docs-interactive/src/components/EndpointCard.tsx` | 22.05 KB | 2025-08-15T15:55:55 |
| `sdk/python/nox_sdk/ai/biometric.py` | 21.38 KB | 2025-08-13T19:20:54 |
| `docs-interactive/src/components/SDKGenerator.tsx` | 19.79 KB | 2025-08-15T14:32:48 |
| `sdk/python/nox_sdk/client.py` | 19.74 KB | 2025-08-13T19:20:54 |
| `docs/planning/COPILOT_PLAN.md` | 19.48 KB | 2025-08-13T10:21:11 |
| `admin_audit_api.py` | 19.46 KB | 2025-08-13T17:06:47 |
| `scripts/noxctl` | 19.40 KB | 2025-08-13T13:00:24 |
| `docs-interactive/public/openapi.json` | 19.21 KB | 2025-08-13T19:50:57 |
| `sdk/python/nox_sdk/auth.py` | 19.16 KB | 2025-08-13T19:20:54 |
| `docs/deployment-guides/STAGING_VALIDATION_RELEASE_CHECKLIST.md` | 18.62 KB | 2025-08-15T17:26:36 |
| `docs-interactive/src/components/LiveAPIExplorer.tsx` | 18.45 KB | 2025-08-15T14:32:48 |
| `scripts/validate_staging.sh` | 18.37 KB | 2025-08-15T17:09:28 |
| `clients/tests_demo.py` | 18.16 KB | 2025-08-13T11:47:58 |
| `sdk/python/nox_sdk/ai/policy.py` | 18.12 KB | 2025-08-13T19:20:54 |
| `MasterPlan` | 18.00 KB | 2025-08-13T11:58:34 |
| `docs-interactive/API_USER_GUIDE.md` | 17.06 KB | 2025-08-15T17:26:36 |
| `enhanced_oauth2_service.py` | 17.01 KB | 2025-08-13T17:06:47 |
| `api/session_manager_distributed.py` | 16.99 KB | 2025-08-13T18:21:01 |
| `sdk/python/nox_sdk/utils.py` | 16.95 KB | 2025-08-13T19:20:54 |
| `api/multinode_integration.py` | 16.54 KB | 2025-08-13T18:21:01 |
| `scripts/nox_audit.py` | 16.43 KB | 2025-08-17T17:12:04 |
| `advanced_audit_middleware.py` | 16.41 KB | 2025-08-13T17:06:47 |
| `api/database_manager_multinode.py` | 15.89 KB | 2025-08-13T18:21:01 |
| `dashboard/app_v23.py` | 15.77 KB | 2025-08-13T13:59:31 |
| `docs-interactive/src/components/BundleAnalyzer.tsx` | 15.66 KB | 2025-08-15T14:32:53 |
| `audit_script.py` | 15.61 KB | 2025-08-17T16:40:12 |
| `sdk/typescript/src/client.ts` | 15.43 KB | 2025-08-13T19:20:58 |
| `docs/phase-specifications/P3.3_UXDEV_SPEC.md` | 14.62 KB | 2025-08-13T19:20:54 |
| `docs/progress-reports/COMPREHENSIVE_PROGRESS_REPORT.md` | 14.45 KB | 2025-08-15T17:26:36 |
| `migrations/v8_to_v8.0.0.sql` | 14.15 KB | 2025-08-15T17:09:28 |
| `docs-interactive/src/components/WebVitalsMonitor.tsx` | 14.12 KB | 2025-08-15T14:32:53 |
| `docs-interactive/src/components/PayloadGenerator.tsx` | 13.98 KB | 2025-08-15T14:32:48 |
| `docs-interactive/src/components/AIHelper.tsx` | 13.91 KB | 2025-08-15T13:25:37 |
| `sdk/python/nox_sdk/ai/security.py` | 13.91 KB | 2025-08-13T19:20:54 |
| `nox-api/deploy/install_nox.sh` | 13.83 KB | 2025-08-13T10:56:14 |
| `archive/old-api-versions/nox_api_v7.py` | 13.76 KB | 2025-08-13T17:06:47 |
| `scripts/backup.sh` | 13.59 KB | 2025-08-13T18:21:01 |
| `dashboard/app_v24.py` | 13.47 KB | 2025-08-13T14:18:15 |

## Inventaire des fichiers par dossier top-level

### `.`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `.copilot-instructions.md` | 3075 | `.md` | 2025-08-15T18:04:01 | `2e6ecd77f500e4089ba79a5d2b428a7902ea56ce504ba6d45b8402b3753ccd90` |
| `.dockerignore` | 648 | `` | 2025-08-13T14:10:56 | `` |
| `.env` | 1209 | `` | 2025-08-17T15:20:20 | `a913eb9fd9ff60d6c843d080f3c2b7399e74ca7d121a34a1d30ecd8c6cf3bea5` |
| `.env.example` | 2647 | `.example` | 2025-08-13T14:18:15 | `5d8b6867657979230a9ca9e57541a04888cf61b3850289921223cdd05911039c` |
| `.env.production` | 4422 | `.production` | 2025-08-15T18:55:39 | `d6a4ce7047e6014f7fc46a2d08e8aefe27a2e902674113cf06efca572c0f9c48` |
| `.env.production.example` | 4422 | `.example` | 2025-08-15T16:18:41 | `d6a4ce7047e6014f7fc46a2d08e8aefe27a2e902674113cf06efca572c0f9c48` |
| `.gitignore` | 268 | `` | 2025-08-13T08:28:51 | `` |
| `admin_audit_api.py` | 19927 | `.py` | 2025-08-13T17:06:47 | `ae6a3223880330b724e827227f42d2b4e17146f28529df0772d7aa3abd4b755e` |
| `advanced_audit_middleware.py` | 16802 | `.py` | 2025-08-13T17:06:47 | `bb0944bd70dd647b82188f624c91e2650684f831bc0eac40431b8976b07a5c76` |
| `ANALYSE_COMPLETE_NOX_PROJET.md` | 9347 | `.md` | 2025-08-17T16:40:42 | `a18f489a5078092eeeb628f858a8fbde506afaabcda0f7d51e42ca67ad3ac6e8` |
| `API_USER_GUIDE.md` | 0 | `.md` | 2025-08-15T23:14:05 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `audit_script.py` | 15984 | `.py` | 2025-08-17T16:40:12 | `cfdaaf4102b8019061f9c7288a25ded0cb96ab56b7b88b62ebec36b6c83b8429` |
| `AUTHENTICATION_GUIDE.md` | 0 | `.md` | 2025-08-15T23:14:08 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `COMPREHENSIVE_PROGRESS_REPORT.md` | 0 | `.md` | 2025-08-15T23:13:49 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `debug_api.py` | 4015 | `.py` | 2025-08-13T16:01:46 | `7c85a56d9d2f2c13fb8fa13d30191d9709bb60370c7fe84b1dc09ec6ec7675c3` |
| `DEPLOYMENT_STATUS_TRACKER.md` | 6120 | `.md` | 2025-08-15T18:05:10 | `2287bb2beb52235f19f73eed65ea0bd5e1b3603888048811dcc0a6cff072a420` |
| `docker-compose.dev.yml` | 4512 | `.yml` | 2025-08-13T18:21:04 | `02e0de7e7777b2da225a294ce081aa6978f1f8ee798ac1fb5f17eb0f7aa373ff` |
| `docker-compose.xtb.yml` | 548 | `.yml` | 2025-08-17T16:27:23 | `c01d27155a17c01fed7d28bd0ac559f80acfd34bc523687842b05c2a14670b63` |
| `docker-compose.yml` | 4022 | `.yml` | 2025-08-13T18:21:04 | `8e75c5d4e9db59a27fee974a0c8d848f002416313c62c9436e4757bf101be71a` |
| `Dockerfile` | 1615 | `` | 2025-08-13T18:21:04 | `` |
| `DOCUMENTATION.md` | 0 | `.md` | 2025-08-15T23:13:30 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `ENHANCED_DEPLOYMENT_GUIDE.md` | 0 | `.md` | 2025-08-15T23:14:11 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `enhanced_oauth2_service.py` | 17421 | `.py` | 2025-08-13T17:06:47 | `7e673348197d7375e4f4c8e1ece8596b872232a33c479810441033ca8918d920` |
| `fix_markdown.py` | 1426 | `.py` | 2025-08-15T17:26:09 | `3e369792319aa84146c5137e37bad5761aac6fc369f37f04256c09a130afe317` |
| `generate_audit.py` | 3904 | `.py` | 2025-08-17T16:43:32 | `de32dde1a132fdd0d43bb4272e651904d5a4ced0baf2b1bae03c04cdd45d119d` |
| `health-report-20250815-185635.txt` | 533 | `.txt` | 2025-08-15T18:56:35 | `4c0515f1bf6c626e07c84d095a6d65bfb432d300e506452b69a127859bac2de8` |
| `install_nox.sh` | 3990 | `.sh` | 2025-08-13T06:01:15 | `cd9ac447edf6e2ee2c7dcaea3ef29eef2d84448a7d10b0a109856c8838263297` |
| `m5x_load_test.py` | 12086 | `.py` | 2025-08-13T16:14:57 | `b202bf7ad25f0ff91ab226236368d9a6c9453cbd13dc09410a14a25c0af60c38` |
| `m5x_persistence_test.py` | 11318 | `.py` | 2025-08-13T16:14:57 | `bdc27ac29210108deb335faa8e6675220dc064c8caddd4474f9af95854e8c331` |
| `m5x_quota_analysis.py` | 10251 | `.py` | 2025-08-13T16:14:57 | `4d47a697daec809fb94ca66b6a831d56d96eccd0779fca30dbde09e7ec72db78` |
| `m6_audit_schema.sql` | 9843 | `.sql` | 2025-08-13T17:06:47 | `2850af787ac5fbfa2c9e2234054cc03625c0eccc449000713a71dcdb137ce716` |
| `m7_oauth2_schema.sql` | 9606 | `.sql` | 2025-08-13T17:06:47 | `22329f7659e16aa9d1bc4072f56d6419507a7d1228bbe9b2883c0dffce7c4d3b` |
| `Makefile` | 3973 | `` | 2025-08-17T16:27:23 | `` |
| `MasterPlan` | 18428 | `` | 2025-08-13T11:58:34 | `` |
| `metrics_chatgpt.py` | 1382 | `.py` | 2025-08-13T15:40:32 | `5c96a4f243f9e4139247ad2e9c37a676e5b24de50219a20ff73b5f88f0c9ddff` |
| `middleware.py` | 1001 | `.py` | 2025-08-13T15:40:32 | `66fa971126592d290e2d77f6bde39faf72b639184890f9d26a79aad5a6f44755` |
| `MIGRATION_GUIDE.md` | 0 | `.md` | 2025-08-15T23:14:10 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `MISSION_ACCOMPLISHED.md` | 6249 | `.md` | 2025-08-17T16:06:21 | `743b2e2c411cd7ae3d3f3fb948469b2abc55891e22c36660b4efb1ed221cc269` |
| `nox_bootstrap.sh` | 9336 | `.sh` | 2025-08-13T09:22:10 | `e0866d1598714224a3a6a94218f034fd5cc6706c8fc260b239dd13709cdd6f30` |
| `nox_client.py` | 892 | `.py` | 2025-08-13T06:23:13 | `93a676279b0de3c7611a2ec3b302334b8ed3806a321fb50a0f43bbe4e1302eb4` |
| `nox_v7.log` | 4827 | `.log` | 2025-08-13T17:49:10 | `` |
| `oauth2_config_m7.py` | 7958 | `.py` | 2025-08-13T17:06:47 | `74569fa0fb6f6a279facb4f1ef9a8a5dc0ac1a953ee9270ad8b12636a49c92e3` |
| `oauth2_endpoints.py` | 12822 | `.py` | 2025-08-13T17:06:47 | `30c63dd8d748326bd08c9e7de70cc675bbce3d5f43fdf79f023b28a233fbc3ed` |
| `OPS_QUICK_COMMAND_CARD.md` | 2926 | `.md` | 2025-08-15T18:05:10 | `a816da6404801c6bf23e04709546113e4df96042ab842f182d61b1ad25906f26` |
| `OPS_RELEASE_DAY_RUNBOOK.md` | 10340 | `.md` | 2025-08-15T18:05:10 | `8a69dff4f8615ebd3344a2668871377efbe290c26af2d98051ccece36c999b75` |
| `PROBLEM_RESOLUTION_REPORT.md` | 0 | `.md` | 2025-08-15T23:14:18 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `PRODUCTION_CREDENTIALS_GUIDE.md` | 10671 | `.md` | 2025-08-15T19:00:14 | `f01c141ce87455b38a51d032d03d28dac822cf83042f2ee7037687dd6076b863` |
| `PRODUCTION_DEPLOYMENT_GUIDE.md` | 0 | `.md` | 2025-08-15T23:13:52 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `pyproject.toml` | 442 | `.toml` | 2025-08-17T15:46:05 | `d2ddd2ff8aa97ddd0d84750d4246f81e12186a3dc7a5f526fa7a94584a20d7d1` |
| `pytest.ini` | 62 | `.ini` | 2025-08-17T15:46:05 | `f214a7c1dba349847819a02ad5fb699447c48a64e13b1b67625975e9fc7b3ac8` |
| `rate_limit_and_policy.py` | 12716 | `.py` | 2025-08-13T15:40:32 | `5c9b5729668160b29a42b31c22dbaa27e34392d1de8969341a31e3ac350bb523` |
| `README.md` | 0 | `.md` | 2025-08-15T23:13:43 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `redis-cluster.yml` | 5061 | `.yml` | 2025-08-13T18:21:04 | `0dcb0fc019d42a2ad571a28c60e28391a8e1fa4b61626da283077cd19a992295` |
| `RELEASE_TEAM_QUICK_REFERENCE.md` | 7257 | `.md` | 2025-08-15T17:26:36 | `79d8ffefece24c8f3e6c834ee63a43fbdd3b645bed72448ab78a02d1e1313d02` |
| `requirements-phase2.txt` | 1601 | `.txt` | 2025-08-13T14:54:16 | `2ae7980de0fbaf629e9d0bec9049e68cf8a9f2d5fc37504f8bc29e708954941e` |
| `requirements.txt` | 654 | `.txt` | 2025-08-13T18:21:01 | `93fade11ff4429562ff364cbd08f1a236031288e456215deda0c7f9e3b480f4b` |
| `SECTION_3_COMPLETION.md` | 7803 | `.md` | 2025-08-15T18:04:01 | `ab118886af4f0a2920e2b2aacb72a690a65fa580b3c9ad05271e9551e40bc8d3` |
| `SECTION_4_COMPLETION_REPORT.md` | 12381 | `.md` | 2025-08-15T18:05:10 | `f483e978c000034cc6f3aa17a314c5aca848bef214f009586ba4151af71e64b5` |
| `SECTIONS_1_2_COMPLETION.md` | 0 | `.md` | 2025-08-15T23:13:51 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `SESSION_COMPLETION_REPORT_M9.2.md` | 0 | `.md` | 2025-08-15T23:13:12 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `SESSION_SUMMARY.md` | 1654 | `.md` | 2025-08-15T19:48:48 | `b65cc142570fc834b5488654667f775a7d0949b9191041ab393298c75a387ad3` |
| `STAGING_CHECKLIST_COMPLETION_REPORT.md` | 9953 | `.md` | 2025-08-15T18:05:10 | `6ba5a0823fb8a5af28505f103ffd83c5ab0ae1b869ead79d4f83d82e91cd793a` |
| `STAGING_VALIDATION_RELEASE_CHECKLIST.md` | 0 | `.md` | 2025-08-15T23:14:12 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `test_api.sh` | 443 | `.sh` | 2025-08-17T15:46:05 | `ffb1c4d1523cba852909b08ca856b496ff2533568188d11785e65fd0d763418a` |
| `test_api_direct.py` | 1896 | `.py` | 2025-08-17T15:46:07 | `53b3c96d5572f879a67ee11581e0200ca2b01e280c51fe61bbd6bb7e9530bac5` |
| `test_integration_complete.py` | 4312 | `.py` | 2025-08-17T16:27:24 | `437c8d4208fa98f882939c38a250ae59e0b1b433e1a06a6a5a9e9b6cab669fd6` |
| `test_xtb_cubes.py` | 2656 | `.py` | 2025-08-17T16:06:21 | `03ae86a53bf04d27472bac5e934967f50d9095f737e98292d90a598821f5f2a8` |
| `test_xtb_runner.py` | 2926 | `.py` | 2025-08-17T16:06:21 | `1bb9b26c0c5663d3807d8ef12de9bb1f516ceac6275a3cbef2e7c5c0f55f2017` |
| `test_xtb_sync.py` | 2658 | `.py` | 2025-08-17T16:27:24 | `cfe85bdfa7be61cd70cdd8e80296a8c263ac3880b98eceb9fd912c3beeb505bb` |
| `XTB_USAGE_GUIDE.md` | 4846 | `.md` | 2025-08-17T16:06:21 | `f0540b492b26e0c5c992c084546874f8f2984c79d8bfd386bef32166b092b0ba` |

### `ai`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `ai/__init__.py` | 0 | `.py` | 2025-08-17T15:28:13 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `ai/ai_coordinator.py` | 33017 | `.py` | 2025-08-13T19:20:54 | `b7e1c0dd129d029ace2dc8df88bc06ebd4443ca0230fa5c93191cf6a934e0634` |
| `ai/biometric_auth.py` | 47662 | `.py` | 2025-08-13T19:20:54 | `697c12baab2f52024f4de2c12f3ec3065cde5975aeb9eefe1d27c4281c5bd9c4` |
| `ai/policy_engine.py` | 35209 | `.py` | 2025-08-13T19:20:54 | `30a7ce3abc2a32a3bef6aa79361dc4dbaf7abc95b6f2937502a33b237e60dd6d` |
| `ai/runners/__init__.py` | 0 | `.py` | 2025-08-17T15:28:15 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `ai/runners/xtb.py` | 6602 | `.py` | 2025-08-17T16:06:21 | `18c05ef765278bff1caae883f2d7c3b0f8a9ddc6ee865179e6f79439295003ad` |
| `ai/security_monitor.py` | 27703 | `.py` | 2025-08-13T19:20:54 | `1d383d6ae458c2ac042f0179b857f63bcdcaa9f9d918f859f20a143a3e8360db` |

### `api`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `api/__init__.py` | 0 | `.py` | 2025-08-17T15:28:04 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `api/database_manager_multinode.py` | 16272 | `.py` | 2025-08-13T18:21:01 | `c05dacdc622af896b16c70fdf68e10ac3d71113d562c150cbdb0ebab10b14d7c` |
| `api/main.py` | 307 | `.py` | 2025-08-17T15:46:05 | `e76c1d3af269fad563f738b229442bfc46f5cfdc6b1f00fbde8bd5abd4e1e3c9` |
| `api/multinode_integration.py` | 16939 | `.py` | 2025-08-13T18:21:01 | `3da87980b1d3cfa00cf15348f77445a9f3616c11be86e26eb3458ba3e630d6e5` |
| `api/routes/__init__.py` | 0 | `.py` | 2025-08-17T15:28:06 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `api/routes/jobs.py` | 3095 | `.py` | 2025-08-17T16:27:23 | `24674acc8cab6655556b6ab7451c01aa939f14ed3fab028309fc014ec0a88c1d` |
| `api/schemas/__init__.py` | 0 | `.py` | 2025-08-17T15:28:09 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `api/schemas/job.py` | 555 | `.py` | 2025-08-17T15:46:05 | `4943ee238c515c7880b16b609f3bf842550b48437aa3f39243913dca5fec1473` |
| `api/schemas/result.py` | 322 | `.py` | 2025-08-17T15:46:05 | `376f42e4df7433a7a2fa44e36daa7ffebd1ce2a7bf249ff275afadadbc684af0` |
| `api/services/__init__.py` | 0 | `.py` | 2025-08-17T15:28:11 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `api/services/queue.py` | 168 | `.py` | 2025-08-17T15:46:05 | `75e4309c23a9a30355d1f42966ff690c44e5ab1b88464644e94e120fcda92efa` |
| `api/services/settings.py` | 439 | `.py` | 2025-08-17T16:06:21 | `ca02d4ee28b56ff70daad22669e13ba65d5b1525535865779cb5ed553ef4be34` |
| `api/services/sse.py` | 657 | `.py` | 2025-08-17T15:46:05 | `2bdf6d7aa5faefe1cdf56bdaea5b621e4d9d563e00427943374f71f3bf53539b` |
| `api/services/storage.py` | 186 | `.py` | 2025-08-17T15:46:05 | `be5aa332a99a5ef3e8749856c762fb279e1208cf0ff8aa6fee39e60e92694e9e` |
| `api/session_manager_distributed.py` | 17393 | `.py` | 2025-08-13T18:21:01 | `181c38d45899237ed721cbb355abc2087d3d9ee25bd4011a0b886235b6fa663a` |

### `archive`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `archive/deprecated-scripts/debug-api.sh` | 2097 | `.sh` | 2025-08-13T14:54:16 | `6dc49e49b11d0c0de5b83edd14a87bafc590f64578d328c3f408c839721ee2a2` |
| `archive/deprecated-scripts/deploy-production.sh` | 8733 | `.sh` | 2025-08-15T18:04:01 | `5736848a0660f4193c5aeff38a68e7dcd32714f9348f9042acca30c6d6c61a35` |
| `archive/deprecated-scripts/fix_nox_layout.sh` | 2486 | `.sh` | 2025-08-13T08:36:16 | `1fd96e1881eae185c21ae640f7d3a6ab114077ba7dcfa6fa7ae0f25213d3ce1f` |
| `archive/deprecated-scripts/health-check-production.sh` | 9869 | `.sh` | 2025-08-15T16:18:41 | `8749f788fc5e3d3fb40ce4cc29c0fd7aa27990e363fa4fc2c23cbf8afe271c95` |
| `archive/deprecated-scripts/test-deployment.sh` | 8708 | `.sh` | 2025-08-13T14:10:56 | `045ab0b67255f88558b440264b56c9aafb66beb7d6bf0bc294f497da50b58f1e` |
| `archive/deprecated-scripts/test-oauth2.sh` | 8382 | `.sh` | 2025-08-13T14:18:15 | `636448c63625a3ccc75faff0943a0bd7ca6207689ecff193d36674ec1d9c9222` |
| `archive/deprecated-scripts/validate_nox.sh` | 4664 | `.sh` | 2025-08-13T10:56:14 | `80682dee542779b8d7d140d09c76c06260b09edb56e8b4400cf678ce24eb2df9` |
| `archive/deprecated-scripts/validate_performance.sh` | 1577 | `.sh` | 2025-08-15T15:55:55 | `8dc9711375461ce1402316e768e62eaaf1695e5d62c7cbcf9f9ca19949cf00a7` |
| `archive/legacy-tests/test_metrics_debug.py` | 514 | `.py` | 2025-08-13T16:01:46 | `58322c76d6756772f6ccbecf9323f74ccf8e11360b2aad09939fb1ca5135474e` |
| `archive/legacy-tests/test_middleware_debug.py` | 1853 | `.py` | 2025-08-17T15:46:07 | `3059b4efec97b65c53941379c0f0f3b97b710574725a4f21709fccea158c626a` |
| `archive/legacy-tests/test_phase21.sh` | 1970 | `.sh` | 2025-08-13T13:24:03 | `444ed97daa028c939efcf222632f84cdf4ffab00c2e6db51f8916964396b87d3` |
| `archive/legacy-tests/test_quota_api.py` | 4877 | `.py` | 2025-08-13T15:40:32 | `3209daf15f2dd6605e365ca6b2fc425eccf4570aa875b218ee66a553a069f10b` |
| `archive/legacy-tests/test_quotas.py` | 2627 | `.py` | 2025-08-17T15:46:07 | `088cc72c7d234d159b1cd802a3cddd664ba7ead02986105a1b9de107c8117137` |
| `archive/legacy-tests/test_repair_simple.sh` | 425 | `.sh` | 2025-08-13T10:56:14 | `42dc49342ffc2d03822caf9278bafeb33585779e631c950e0f6e5b5812104847` |
| `archive/legacy-tests/test_script.py` | 140 | `.py` | 2025-08-13T12:17:07 | `c1fcfd893de7c826315119c5f434c87ab5a9637a633c0db852ad32541ef8074d` |
| `archive/old-api-versions/nox_api_m6.py` | 13443 | `.py` | 2025-08-13T17:06:47 | `74d9ad36bcb712f8061b0e32a99d441b22766f9873715ff82a01c1d3021ab740` |
| `archive/old-api-versions/nox_api_v5_fixed.py` | 12620 | `.py` | 2025-08-13T16:01:46 | `4fad4113c89d1825b48f7d7d447f2eac2b3e9a4c7ed3b8ec7068cc8505f3690e` |
| `archive/old-api-versions/nox_api_v5_quotas.py` | 12170 | `.py` | 2025-08-13T16:01:46 | `93589d4a4c2746df8ffaba6520175c7606cd2909bc91b6a7a5de5a87fa83ad81` |
| `archive/old-api-versions/nox_api_v7.py` | 14090 | `.py` | 2025-08-13T17:06:47 | `ae99548e2b07351015f6210a70313afb9dcce75009b2e44ec61b21cbf7496c96` |
| `archive/old-api-versions/nox_api_v7_fixed.py` | 9237 | `.py` | 2025-08-13T17:06:47 | `956568b2b5cbc0f04409b7c4b8bc1346c3c44dca8c03be74a4e6e8c8d8725f2c` |
| `archive/old-configs/Dockerfile.api` | 1554 | `.api` | 2025-08-13T14:54:17 | `` |
| `archive/old-configs/Dockerfile.dashboard` | 1274 | `.dashboard` | 2025-08-13T14:10:56 | `` |
| `archive/old-configs/Dockerfile.dev` | 1463 | `.dev` | 2025-08-13T18:21:04 | `` |

### `artifacts`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `artifacts/072845fdb3fc4bbe9548d4b4124d9d16/charges` | 30 | `` | 2025-08-17T16:09:59 | `` |
| `artifacts/072845fdb3fc4bbe9548d4b4124d9d16/input.xyz` | 43 | `.xyz` | 2025-08-17T16:09:58 | `` |
| `artifacts/072845fdb3fc4bbe9548d4b4124d9d16/molden.input` | 952 | `.input` | 2025-08-17T16:09:59 | `` |
| `artifacts/072845fdb3fc4bbe9548d4b4124d9d16/molden.log` | 12668 | `.log` | 2025-08-17T16:09:59 | `` |
| `artifacts/072845fdb3fc4bbe9548d4b4124d9d16/wbo` | 51 | `` | 2025-08-17T16:09:59 | `` |
| `artifacts/072845fdb3fc4bbe9548d4b4124d9d16/xtb.log` | 13380 | `.log` | 2025-08-17T16:09:59 | `` |
| `artifacts/072845fdb3fc4bbe9548d4b4124d9d16/xtbopt.log` | 226 | `.log` | 2025-08-17T16:09:58 | `` |
| `artifacts/072845fdb3fc4bbe9548d4b4124d9d16/xtbrestart` | 240 | `` | 2025-08-17T16:09:59 | `` |
| `artifacts/072845fdb3fc4bbe9548d4b4124d9d16/xtbtopo.mol` | 255 | `.mol` | 2025-08-17T16:09:59 | `` |
| `artifacts/aaf61a28131a4720aa5d2e522e0dc443/charges` | 30 | `` | 2025-08-17T16:10:34 | `` |
| `artifacts/aaf61a28131a4720aa5d2e522e0dc443/input.xyz` | 43 | `.xyz` | 2025-08-17T16:10:33 | `` |
| `artifacts/aaf61a28131a4720aa5d2e522e0dc443/molden.input` | 952 | `.input` | 2025-08-17T16:10:34 | `` |
| `artifacts/aaf61a28131a4720aa5d2e522e0dc443/molden.log` | 12668 | `.log` | 2025-08-17T16:10:34 | `` |
| `artifacts/aaf61a28131a4720aa5d2e522e0dc443/wbo` | 51 | `` | 2025-08-17T16:10:34 | `` |
| `artifacts/aaf61a28131a4720aa5d2e522e0dc443/xtb.log` | 13380 | `.log` | 2025-08-17T16:10:33 | `` |
| `artifacts/aaf61a28131a4720aa5d2e522e0dc443/xtbopt.log` | 226 | `.log` | 2025-08-17T16:10:33 | `` |
| `artifacts/aaf61a28131a4720aa5d2e522e0dc443/xtbrestart` | 240 | `` | 2025-08-17T16:10:34 | `` |
| `artifacts/aaf61a28131a4720aa5d2e522e0dc443/xtbtopo.mol` | 255 | `.mol` | 2025-08-17T16:10:34 | `` |
| `artifacts/test123/charges` | 30 | `` | 2025-08-17T16:10:16 | `` |
| `artifacts/test123/input.xyz` | 34 | `.xyz` | 2025-08-17T16:10:15 | `` |
| `artifacts/test123/molden.input` | 952 | `.input` | 2025-08-17T16:10:16 | `` |
| `artifacts/test123/molden.log` | 12668 | `.log` | 2025-08-17T16:10:16 | `` |
| `artifacts/test123/wbo` | 51 | `` | 2025-08-17T16:10:16 | `` |
| `artifacts/test123/xtb.log` | 13380 | `.log` | 2025-08-17T16:10:15 | `` |
| `artifacts/test123/xtbopt.log` | 226 | `.log` | 2025-08-17T16:10:15 | `` |
| `artifacts/test123/xtbrestart` | 240 | `` | 2025-08-17T16:10:16 | `` |
| `artifacts/test123/xtbtopo.mol` | 255 | `.mol` | 2025-08-17T16:10:16 | `` |

### `auth`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `auth/__init__.py` | 778 | `.py` | 2025-08-13T13:59:31 | `b2416364ae4fcd5081deb56952254ec2bd5951dcaafb44037535a23e1b3d27cd` |
| `auth/dependencies.py` | 5094 | `.py` | 2025-08-13T13:59:31 | `1a871b18f70561dc9830c8b8b4497ccc7bf91b68df281df70d77afeacdc999b9` |
| `auth/models.py` | 6871 | `.py` | 2025-08-13T13:59:31 | `bc96951985135fa446535d91aeeb474f5ab94ba101c0c8c6fd5c4811846f3afd` |
| `auth/routes.py` | 7291 | `.py` | 2025-08-13T13:59:31 | `44fd0774e8bcdde5d88e10d6fc815d31d5fbf63e6e1ebc6cb01af699300ca36f` |
| `auth/schemas.py` | 2417 | `.py` | 2025-08-13T13:59:31 | `8141121814dad694016656367e64d31716be37f5ab7edd89733df527250b2615` |
| `auth/utils.py` | 5679 | `.py` | 2025-08-13T13:59:31 | `340b4c249865edb431a9a9bf620756ce8cde194ee440f782be4f7ea7885d0d39` |

### `clients`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `clients/nox_client.py` | 10369 | `.py` | 2025-08-13T11:47:58 | `de960e44294192d29bbb012ce2a13daa30eb2681b99d13f0c5394b9fd7444b80` |
| `clients/requirements.txt` | 525 | `.txt` | 2025-08-13T11:47:58 | `50d976b6a179fc31577cc4cae9de54b766bda7a209c85b9f6c6bfa4db5b2c2b8` |
| `clients/tests_demo.py` | 18596 | `.py` | 2025-08-13T11:47:58 | `456d8c2fbef9dba7312203ffb021a3fb59d3782163eaa5151c66fda0a84eb45f` |

### `config`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `config/prometheus-dev.yml` | 478 | `.yml` | 2025-08-13T18:21:04 | `8dfe37e210fc16ddb3f7b793f54d03baa33fbaee823b0b6dd162034795765bed` |
| `config/redis/sentinel1.conf` | 716 | `.conf` | 2025-08-13T18:21:01 | `` |
| `config/redis/sentinel2.conf` | 550 | `.conf` | 2025-08-13T18:21:01 | `` |
| `config/redis/sentinel3.conf` | 552 | `.conf` | 2025-08-13T18:21:01 | `` |

### `dashboard`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `dashboard/app.py` | 8683 | `.py` | 2025-08-13T13:37:57 | `ee8b2255487aee5fc87919108974b0465f61a9a6177946e092ddaec6db7401c5` |
| `dashboard/app_v23.py` | 16152 | `.py` | 2025-08-13T13:59:31 | `263de6dfb7323dda7d246735ce4b9812d3de16bdef851e9aa0f6736d7c82a409` |
| `dashboard/app_v24.py` | 13789 | `.py` | 2025-08-13T14:18:15 | `c180379a239de6d98d1adf06a09cbabdc31c23f14bc2887e66f13f182e7ae492` |
| `dashboard/client.py` | 2155 | `.py` | 2025-08-13T13:37:57 | `9309e969374856e099e1671bb6685a191cb4ba04f7acd83abb7e4a19d7761d4b` |
| `dashboard/client_v23.py` | 6200 | `.py` | 2025-08-13T13:59:31 | `cb0f626284314a78ef893c5efcb4d8af74b0d371c357486a5a8659b57f68bf29` |
| `dashboard/oauth2_client.py` | 7014 | `.py` | 2025-08-13T14:18:15 | `f41eb2a94575783151c5b15bacf3eed141a28f27ced0a66139aaff4bb54e0ec8` |

### `data`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `data/nox.db` | 24576 | `.db` | 2025-08-13T13:55:09 | `` |

### `docs`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `docs/deployment-guides/DEPLOYMENT.md` | 7316 | `.md` | 2025-08-13T14:10:56 | `b7937cefe91c4b5d0616ec918aa5eb10d2a3ec415e25164721914467f2735bd0` |
| `docs/deployment-guides/DEPLOYMENT_GUIDE.md` | 12843 | `.md` | 2025-08-13T18:21:01 | `d6ddf294eb40d439c7255869c4ca5b9a28c57cd7e11504204ecb8af30e37b956` |
| `docs/deployment-guides/DEPLOYMENT_STATUS_TRACKER.md` | 6091 | `.md` | 2025-08-15T17:26:36 | `65d79f17240084ec0675fc691b3ce0bf96eeb47d95b500173cda0ca8e9456278` |
| `docs/deployment-guides/ENHANCED_DEPLOYMENT_GUIDE.md` | 45347 | `.md` | 2025-08-15T17:26:36 | `02f183da60fa8393accf45ea05022564e5e0fa168c0b37b9676e22e4a2cc5222` |
| `docs/deployment-guides/OAUTH2_GUIDE.md` | 6574 | `.md` | 2025-08-13T14:18:15 | `6db9aff4d8bac767c8c2784a38b915d869ad09fef48aed7d9175baf9c14e5610` |
| `docs/deployment-guides/OPS_QUICK_COMMAND_CARD.md` | 2901 | `.md` | 2025-08-15T17:26:36 | `435fe47e341cac8a32384038734ba683609dda0caeee42de1fb81512d2fefdec` |
| `docs/deployment-guides/OPS_RELEASE_DAY_RUNBOOK.md` | 10315 | `.md` | 2025-08-15T17:26:36 | `63dc156a52801dfc16943d56927ccfcb27d4030c8669f48855619c8a841c3616` |
| `docs/deployment-guides/PRODUCTION_CREDENTIALS_GUIDE.md` | 8922 | `.md` | 2025-08-15T17:51:52 | `99288162da3fc7f9c1de78dd8cf922138bbc5d2cbb0c5a112f0ebcec3846f9b3` |
| `docs/deployment-guides/PRODUCTION_DEPLOYMENT_GUIDE.md` | 8913 | `.md` | 2025-08-15T17:26:36 | `0330e157ff8a60c395c596ebd16e0a6cccbc511de53fce5bb48b2ad72ce561f9` |
| `docs/deployment-guides/STAGING_VALIDATION_RELEASE_CHECKLIST.md` | 19066 | `.md` | 2025-08-15T17:26:36 | `03900b6a02d0443534e3096ff6dee58d8b2cd1b1e45f034204dc018222d36fe0` |
| `docs/milestone-reports/COMPLETION_REPORT.md` | 5294 | `.md` | 2025-08-13T10:56:14 | `9a11ea493b68157ac3ce0413f0ad92e206ea3bcafac54ae7aba63cd6036f7eed` |
| `docs/milestone-reports/M5X_COMPLETION_SUMMARY.md` | 2586 | `.md` | 2025-08-13T17:06:47 | `2827ec22cb766048e109777a126202408a943e23eb1cdf9ab8bb7398ab40819f` |
| `docs/milestone-reports/M6_COMPLETION_SUMMARY.md` | 6854 | `.md` | 2025-08-13T17:06:47 | `cbb10c709c853d5e8ab79a1bb6a798866c44958b2d99c8aef88c99d15d6452ef` |
| `docs/milestone-reports/M7_COMPLETION_SUMMARY.md` | 8753 | `.md` | 2025-08-13T17:06:47 | `fabf528ccb3f8c7158a01de498f6c730994110ca7feaa32a497a81a8bec7245c` |
| `docs/milestone-reports/M8_COMPLETION_SUMMARY.md` | 6437 | `.md` | 2025-08-13T18:21:01 | `51336c59547e0ac9f5068225a7c2f8e9a4a269ba57af232eb68baf1e881f1519` |
| `docs/milestone-reports/M9.1_SUMMARY.md` | 4943 | `.md` | 2025-08-13T19:50:57 | `490cbb4f2337e915b203d1f3ef926e40b618a76d4eaf515ed34d80a76a23fb0a` |
| `docs/milestone-reports/M9.2_COMPLETION_SUMMARY.md` | 10055 | `.md` | 2025-08-15T13:25:34 | `7b659963df0c8db278d6627828e56191e31b45c0621387c78295055f8ee3f778` |
| `docs/milestone-reports/M9.3_COMPLETION_SUMMARY.md` | 5757 | `.md` | 2025-08-15T14:32:43 | `41f5a131763d006dfee9a57806a99d9b71225fa7d2e88d4a94505c01a10854c3` |
| `docs/milestone-reports/M9.4_COMPLETION_SUMMARY.md` | 7903 | `.md` | 2025-08-15T14:32:43 | `bf1fcc661b8b5191ff9ce24a44aa86f936d3bed116b01d9aa0b250e30914b687` |
| `docs/milestone-reports/M9.5_ADVANCED_UI_COMPLETE.md` | 6430 | `.md` | 2025-08-15T15:04:32 | `9a7ea8388c7d84f874c99a11f3eb267bfe5bf8d3c23330b22b1d29ee5f5bbe8f` |
| `docs/milestone-reports/M9.5_COMPLETION_SUMMARY.md` | 9123 | `.md` | 2025-08-15T14:32:44 | `02d78ff4d08647664262d09864f4bba6c7c94c07ed52f12b7cbb78eaded95478` |
| `docs/milestone-reports/M9.6_PERFORMANCE_COMPLETE.md` | 9014 | `.md` | 2025-08-15T14:32:45 | `c583bb4c1af00d04e91ceae287bc10a6f8c91d553d10d79a6933b72832c406c3` |
| `docs/milestone-reports/P3.1_COMPLETION_REPORT.md` | 6729 | `.md` | 2025-08-13T18:21:01 | `44c059d984c8da1d96207b8ad32e7eff57fecd122157400a45d482fee3345e54` |
| `docs/milestone-reports/P3.2_COMPLETION_REPORT.md` | 12905 | `.md` | 2025-08-13T19:20:54 | `f2c89c61318a751a0691c7ff37413c15aca97aa76b7264f7716860c2afb6dded` |
| `docs/milestone-reports/STEP21_COMPLETION_REPORT.md` | 6329 | `.md` | 2025-08-13T13:24:03 | `7f527aa48066498347c433947ff8a3883ca94aceb2cde2eb186f6713d0a61f98` |
| `docs/milestone-reports/STEP23_COMPLETION_REPORT.md` | 8926 | `.md` | 2025-08-13T13:59:31 | `bdb7b89b3ca331ecadadfd10486633414ca1383dde745e6595b36a0a4dbad196` |
| `docs/milestone-reports/STEP3_COMPLETION_REPORT.md` | 5352 | `.md` | 2025-08-13T11:04:45 | `9646d16e342cdddd145307ac30be01d57cfdb45e78c2c61edb436e5f6c893c18` |
| `docs/milestone-reports/STEP4_COMPLETION_REPORT.md` | 6986 | `.md` | 2025-08-13T11:41:18 | `244254bce325cb6b484036efc626630a38be5e4df43f7a2c2eecb6f3684dd689` |
| `docs/milestone-reports/STEP5_COMPLETION_REPORT.md` | 10572 | `.md` | 2025-08-13T11:47:58 | `8316e93f4f3fcf8f83126ea0498d63e0fb054ca29ff7db36ddf072d0679445d7` |
| `docs/milestone-reports/STEP6_COMPLETION_REPORT.md` | 10039 | `.md` | 2025-08-13T11:57:22 | `df109c368e399c171df5f5a006dc8730459b91a0cde2f81d382b76b0dcef80ea` |
| `docs/milestone-reports/STEP7_COMPLETION_REPORT.md` | 11597 | `.md` | 2025-08-13T12:17:07 | `1c7c8d05dc3b95b3fbcc60eac3c6706b92e6812d04d360584f0c1833117fa1ce` |
| `docs/phase-specifications/P3.1_MULTINODE_SPEC.md` | 12745 | `.md` | 2025-08-13T18:21:01 | `d35a92dc59b62ec433a522d75e1c1df3d97e608ce4ae32c61bc22afb3a289391` |
| `docs/phase-specifications/P3.2_AIIAM_SPEC.md` | 11010 | `.md` | 2025-08-13T19:20:54 | `c1d8c02d4316c75bc7e4c3a8866e90a8c01968b6fd63b3a49db81a2972b6510e` |
| `docs/phase-specifications/P3.3_TYPESCRIPT_SDK_COMPLETE.md` | 8289 | `.md` | 2025-08-13T19:20:54 | `6a3e4c429892e87bf72d27b9f36941aeb8bfadf270f0e20fc129380e9592a19d` |
| `docs/phase-specifications/P3.3_UXDEV_SPEC.md` | 14968 | `.md` | 2025-08-13T19:20:54 | `cb741d70cf31d6ba6d108fe627b26fac6e01e9b700ecda6a88b2aef9733ca496` |
| `docs/planning/AssistantDevOps.md` | 2954 | `.md` | 2025-08-13T11:58:34 | `0064dc229e3192748456c3cabd9611922b3b4b0fbd29e58ef094f1749b41d338` |
| `docs/planning/CONNECTING_NOX_IAM.md` | 1390 | `.md` | 2025-08-15T15:04:32 | `a170c41fb16904041aa14464a82e09d8aa2056d57617a0f43a475704329470c3` |
| `docs/planning/COPILOT_PLAN.md` | 19945 | `.md` | 2025-08-13T10:21:11 | `b092c38bde05964bc28af4c2b77326f315d10cd7912a79400abe8b289c7f09b3` |
| `docs/planning/IMMEDIATE_NEXT_STEPS.md` | 7078 | `.md` | 2025-08-13T12:33:44 | `0887b8f23534221b93cfbbc1863f5f2eaf311506aa97389a5f46da472cadcbc0` |
| `docs/planning/M6_AUDIT_PLAN.md` | 3893 | `.md` | 2025-08-13T17:06:47 | `ed40e9ee51bc3affebe511a303da074aa56eb595ee346a7e2e13f9385cabc441` |
| `docs/planning/M7_FINAL_VERIFICATION.md` | 7858 | `.md` | 2025-08-13T17:06:47 | `b0d6778e05c0c838c78ff909245969fc9dc268d71b54c797f209f39856bc705a` |
| `docs/planning/M7_OAUTH2_PLAN.md` | 5156 | `.md` | 2025-08-13T17:06:47 | `0cf55bf113098974fb7ae1a5cb27a96fbfae598225b90fe2cd7d8ed5a7cc0e9e` |
| `docs/planning/M8_DOCKER_CICD_PLAN.md` | 9351 | `.md` | 2025-08-13T18:21:01 | `1984a050f3405ae826bd41213acbeeab25fb95ddebf980a70930e940ac92fe17` |
| `docs/planning/PHASE2_ROADMAP.md` | 8875 | `.md` | 2025-08-13T12:33:44 | `50a6d0a79ff2952c6d09ac51b0df821cc6da99a3d39f125458dc28e59f1063dd` |
| `docs/planning/PHASE3_IMPLEMENTATION_PLAN.md` | 10892 | `.md` | 2025-08-13T18:21:01 | `7a1632f63157824ddd722d1ab3440e47baf593605037367f388080f21fcc2a31` |
| `docs/planning/PROJECT_NEXT_STEPS.md` | 1694 | `.md` | 2025-08-15T15:04:32 | `fdef8371177275d61c85c56bdee6431e5c0608bc15cfc3b766c79d465027160e` |
| `docs/planning/PROMPT_COPILOT_NEXT_STEPS.md` | 1474 | `.md` | 2025-08-15T15:04:32 | `13884a3c32afd9705a5d58ad829e5f2164bf2b701d1acf62f1230fa53743577f` |
| `docs/planning/UNIFIED_PLAN_PHASE2.md` | 7471 | `.md` | 2025-08-13T12:40:08 | `ab61f60f5e89ab0f25b49d97c9016435b66d2d692d7ed70e902799a176bf65b0` |
| `docs/progress-reports/COMPREHENSIVE_PROGRESS_REPORT.md` | 14796 | `.md` | 2025-08-15T17:26:36 | `455bbd6c34d5ecd4c26d35995d431e92375c09e59eb0ece64bf521cac2c9975f` |
| `docs/progress-reports/M9_PROGRESS_TRACKER.md` | 10418 | `.md` | 2025-08-15T14:44:43 | `e86288ddbae86de799f18748bd86312ade6fbba62122a63f4f9f647b6700fdd6` |
| `docs/progress-reports/P3_PROGRESS_REPORT.md` | 5537 | `.md` | 2025-08-13T19:24:27 | `a41e9acbf7f25fb50125fff5988d1dabfc12b5a522e96c97de4e72ac79e8d9d8` |
| `docs/progress-reports/PHASE2_PHASE3_PROGRESS.md` | 9164 | `.md` | 2025-08-13T19:20:54 | `17b61013df3e2567f5d41f0c7fa48045931b1674cec08686e743f39021831378` |
| `docs/progress-reports/PROBLEM_RESOLUTION_REPORT.md` | 4988 | `.md` | 2025-08-15T17:36:26 | `0dda2384058775e3da0dd706f48f82cd74fc007f608829252de4a7d66c1e5a42` |
| `docs/progress-reports/SECTION_3_COMPLETION.md` | 7723 | `.md` | 2025-08-15T17:26:36 | `da4988a0c517db77b1cad88b9e9394c060e27d741a65e307b5b81ef6cde6e992` |
| `docs/progress-reports/SECTION_4_COMPLETION_REPORT.md` | 12313 | `.md` | 2025-08-15T17:26:36 | `23ec0dedd6e1942255d7c266199cace7050b7f5685f266f82f09a591ff4144b6` |
| `docs/progress-reports/SECTIONS_1_2_COMPLETION.md` | 6424 | `.md` | 2025-08-15T17:26:36 | `c564aa2c70c827b6b4694231d06a7d1a3020374cd1581b1d36bc5b603ecadbcb` |
| `docs/progress-reports/STAGING_CHECKLIST_COMPLETION_REPORT.md` | 9907 | `.md` | 2025-08-15T17:26:36 | `81bc2f14333ffd78fde9098db440d44f08ad2744f9b8f300978c2db2ba44b6a2` |
| `docs/progress-reports/STEP24_PROGRESS.md` | 137 | `.md` | 2025-08-13T14:10:56 | `8c1593659ee73dc56694e5396fa70440cc925d8f5b8fa7875fa49e5133e41e5a` |
| `docs/progress-reports/STEP25_PROGRESS.md` | 1715 | `.md` | 2025-08-13T15:40:32 | `8ac3d42d199b901a3af5e8def792728c05674305e5481445d16a28d14c586a11` |
| `docs/README.md` | 5216 | `.md` | 2025-08-15T19:31:49 | `8c9af1c8edaeaf7670ec7c0945114d5f8c1857f56e11ebd3086aa14ca845de70` |
| `docs/session-reports/SESSION_COMPLETION_REPORT_M9.2.md` | 0 | `.md` | 2025-08-15T17:35:36 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `docs/session-reports/SESSION_COMPLETION_REPORT_M9.3.md` | 7073 | `.md` | 2025-08-15T14:32:43 | `3da1a35702c8a305ea5a53abc04753d755db6fd6bb9ae082275af6be790cfff7` |
| `docs/session-reports/SESSION_COMPLETION_REPORT_M9.4.md` | 7817 | `.md` | 2025-08-15T14:32:43 | `f3d2b849e92acf10039879c9ce2ebb7040ac9924a4326d3f2485b297704284a1` |
| `docs/session-reports/SESSION_COMPLETION_REPORT_M9.5.md` | 7178 | `.md` | 2025-08-15T14:32:44 | `d060a9e3fe07f30c3d1206aad1d6a0862d065ee0169a507fcf7ed1e434b1b80d` |
| `docs/session-reports/SESSION_COMPLETION_REPORT_M9.5_ADVANCED_UI.md` | 7041 | `.md` | 2025-08-15T15:04:32 | `759e1cd18dee103124558567ccc8af203f6c0d4da7cbff887082b7c7bb6f89c4` |
| `docs/testing-status/M9.5_TESTING_STATUS.md` | 4632 | `.md` | 2025-08-15T15:04:32 | `52c130b8bfbc05250337ccc9992e35da72584d65b561aad19f506eabcc3e600a` |
| `docs/testing/NOX_INTERACTIVE_TESTING_CHECKLIST.md` | 7048 | `.md` | 2025-08-15T15:04:32 | `f2402c265688a36d08beff38eee27dbb42c24c1b2643ac1e11d481924a74c44c` |

### `docs-interactive`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `docs-interactive/.copilot-instructions.md` | 2586 | `.md` | 2025-08-15T17:26:36 | `d84860270197b9a48d06f4f781d02a07834de013115e7fdf003539522f89af87` |
| `docs-interactive/.gitignore` | 480 | `` | 2025-08-13T19:43:09 | `` |
| `docs-interactive/API_USER_GUIDE.md` | 17472 | `.md` | 2025-08-15T17:26:36 | `42a9eff40892fe213e64a24f39a0dfa4d8af58f242fadb608830102709dffc87` |
| `docs-interactive/AUTHENTICATION_GUIDE.md` | 25685 | `.md` | 2025-08-15T17:26:36 | `8262afe89bd8d72229863f07479742055fadc063f8f25684bff7d49c194faee3` |
| `docs-interactive/DOCUMENTATION.md` | 1790 | `.md` | 2025-08-15T18:15:40 | `9a9fee240b89782a00cf031d3b528bd12d8fa024a4224d365ff3a25617cac4d2` |
| `docs-interactive/eslint.config.mjs` | 393 | `.mjs` | 2025-08-13T19:43:09 | `3de4ba23ff1f687685651cad622700613998de80daa30ac4d82c47776a04019d` |
| `docs-interactive/M9.2_COMPLETION_SUMMARY.md` | 0 | `.md` | 2025-08-15T17:35:26 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `docs-interactive/M9.3_COMPLETION_SUMMARY.md` | 0 | `.md` | 2025-08-15T17:35:57 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `docs-interactive/M9.4_COMPLETION_SUMMARY.md` | 0 | `.md` | 2025-08-15T17:36:04 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `docs-interactive/M9.5_COMPLETION_SUMMARY.md` | 0 | `.md` | 2025-08-15T17:36:11 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `docs-interactive/M9.6_COMPLETION_SUMMARY.md` | 4557 | `.md` | 2025-08-15T15:23:12 | `98ce434f52f4a83601072a9ae5f35f8e42a4264486ebc292c6d1e3dc47455ec2` |
| `docs-interactive/M9.6_PERFORMANCE_COMPLETE.md` | 0 | `.md` | 2025-08-15T17:36:19 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `docs-interactive/M9.6_PERFORMANCE_RESULTS.md` | 8846 | `.md` | 2025-08-15T15:23:12 | `29850f305875250d50393eeddbb464a2e118ac10c6e0ba00a0ff02114773567b` |
| `docs-interactive/M9_PROGRESS_TRACKER.md` | 10418 | `.md` | 2025-08-15T15:04:32 | `e86288ddbae86de799f18748bd86312ade6fbba62122a63f4f9f647b6700fdd6` |
| `docs-interactive/MIGRATION_GUIDE.md` | 26769 | `.md` | 2025-08-15T17:26:36 | `1ee610ab69ed0a49634a343ecafc45bad2d657bb8315e038bbb9158104bc57ab` |
| `docs-interactive/next-env.d.ts` | 211 | `.ts` | 2025-08-13T19:43:09 | `f2b3bca04d1bfe583daae1e1f798c92ec24bb6693bd88d0a09ba6802dee362a8` |
| `docs-interactive/next.config.js` | 3042 | `.js` | 2025-08-15T15:23:13 | `3f8e4485b26e7a738d9445fe1898d5cfcd064328ad2e79ffd5bc707cd3685882` |
| `docs-interactive/next.config.ts` | 133 | `.ts` | 2025-08-13T19:43:09 | `614bce25b089c3f19b1e17a6346c74b858034040154c6621e7d35303004767cc` |
| `docs-interactive/package-lock.json` | 225672 | `.json` | 2025-08-15T15:15:14 | `ca864534fa716bdd8afa126486a99a2e290e67be9c61f89b8b2a45af2ebc8c4a` |
| `docs-interactive/package.json` | 1010 | `.json` | 2025-08-15T15:23:12 | `66a08ad673bba20066cc4b6c7401e3c731d73fccbe778eeb7c77f0155967593e` |
| `docs-interactive/postcss.config.mjs` | 81 | `.mjs` | 2025-08-13T19:43:09 | `141ef24ca27a99d08962210fdf20212d3435fdcfa21b46cd88b44d22f751dfae` |
| `docs-interactive/public/file.svg` | 391 | `.svg` | 2025-08-13T19:43:09 | `` |
| `docs-interactive/public/globe.svg` | 1035 | `.svg` | 2025-08-13T19:43:09 | `` |
| `docs-interactive/public/next.svg` | 1375 | `.svg` | 2025-08-13T19:43:09 | `` |
| `docs-interactive/public/openapi.json` | 19674 | `.json` | 2025-08-13T19:50:57 | `7b995bd093290e25b3d937b0d3f85c25920707ba87c66185d97435184d286b80` |
| `docs-interactive/public/vercel.svg` | 128 | `.svg` | 2025-08-13T19:43:09 | `` |
| `docs-interactive/public/window.svg` | 385 | `.svg` | 2025-08-13T19:43:09 | `` |
| `docs-interactive/README.md` | 13608 | `.md` | 2025-08-15T18:21:26 | `ada91d2e7fa811f3551dd4a35a6077af31623af699e51e63d7997e53a8d50d76` |
| `docs-interactive/sdk-package.json` | 1814 | `.json` | 2025-08-15T14:32:42 | `d58ddfccd19f6d6df808481c135036c2533c18020a34d4eeb886eca7eae641d1` |
| `docs-interactive/sdk-typescript/package.json` | 1476 | `.json` | 2025-08-15T14:32:42 | `69eb0e39891745acc1389d61069beb0fc4419e4f30f65ec0c69e613b0d037b57` |
| `docs-interactive/sdk-typescript/README.md` | 6981 | `.md` | 2025-08-15T14:32:44 | `914222150a144b75c39e34c3a330d57c9294c831a5d41909a5f3a54851ff942b` |
| `docs-interactive/sdk-typescript/src/index.ts` | 11286 | `.ts` | 2025-08-15T14:32:53 | `59af7a05eface216f97b445cf5f5adaa1eca6416d6e797f691f31873fef0c0d1` |
| `docs-interactive/sdk-typescript/tsconfig.json` | 784 | `.json` | 2025-08-15T14:32:42 | `17b29a5b8033a533ca70b01b53ad11b56ffce5922cdc070e6d9b8dc7097ca207` |
| `docs-interactive/SESSION_COMPLETION_REPORT_M9.3.md` | 0 | `.md` | 2025-08-15T17:36:01 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `docs-interactive/SESSION_COMPLETION_REPORT_M9.4.md` | 0 | `.md` | 2025-08-15T17:36:05 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `docs-interactive/SESSION_COMPLETION_REPORT_M9.5.md` | 0 | `.md` | 2025-08-15T17:36:13 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `docs-interactive/src/app/auth/callback/page.tsx` | 1351 | `.tsx` | 2025-08-15T14:32:48 | `7eff98a93995da9c841e75cbd776a52bd389ae105b2f215ec3a822176eed4d19` |
| `docs-interactive/src/app/globals.css` | 4149 | `.css` | 2025-08-15T15:04:32 | `8ebf707a05645221fe7250a8f3ffb104d2b577d16c98b09a16260d94876ddc4d` |
| `docs-interactive/src/app/layout.tsx` | 1098 | `.tsx` | 2025-08-15T15:55:55 | `6a4b479e2ac8ffb0706cfb28b1eb2970befd565f34cdef2d284d7f537c74a4a4` |
| `docs-interactive/src/app/page-complex-backup.tsx` | 10655 | `.tsx` | 2025-08-15T14:56:21 | `22982c1d52d47a67543969a0b99a712f80d7ebf32f671df2a871ff1e30421989` |
| `docs-interactive/src/app/page-simple.tsx` | 535 | `.tsx` | 2025-08-15T15:04:34 | `f9afd0e46b8e624b522289a873c751aaafe8571b1b19520a519b24472850ad57` |
| `docs-interactive/src/app/page.tsx` | 535 | `.tsx` | 2025-08-15T15:04:34 | `f9afd0e46b8e624b522289a873c751aaafe8571b1b19520a519b24472850ad57` |
| `docs-interactive/src/components/AIHelper.tsx` | 14247 | `.tsx` | 2025-08-15T13:25:37 | `12826817fbc20b39afe0755115019f15a4f67621624308bdbb46843368497a9d` |
| `docs-interactive/src/components/BundleAnalyzer.tsx` | 16031 | `.tsx` | 2025-08-15T14:32:53 | `658753b94872396f6df792a1dbd69d383ca337c814e2261bc29f076d81ce817b` |
| `docs-interactive/src/components/ClientOnlyWebVitals.tsx` | 409 | `.tsx` | 2025-08-15T15:55:55 | `c301933c48a3e9abbe6d413b4a3cdab2349bcae77e31d4996eed9ff5c503e520` |
| `docs-interactive/src/components/EndpointCard.tsx` | 22575 | `.tsx` | 2025-08-15T15:55:55 | `4fe46f9c541a2942b41191a50c2d4719ea273394f5a6b7e8dd7f8a3d5fc1d71c` |
| `docs-interactive/src/components/EndpointsList.tsx` | 6838 | `.tsx` | 2025-08-15T15:23:13 | `c5107cb0d4c1e9ce936b246aeb82cd2047dec4268ad4cd4991dd818da0885974` |
| `docs-interactive/src/components/EndpointsListEnhanced.tsx` | 6196 | `.tsx` | 2025-08-15T15:04:34 | `2b58610f56d7cadf00f8980b9bfa9d7668e8b4769bb323c37e9bee5d48a4401a` |
| `docs-interactive/src/components/EndpointsListOld.tsx` | 5892 | `.tsx` | 2025-08-15T14:38:41 | `156dea9b9c976fab9b75eb234ea87a6e15b3888a1ed6735acfd7c3bec9b0a65e` |
| `docs-interactive/src/components/FloatingActions.tsx` | 6336 | `.tsx` | 2025-08-15T14:32:53 | `adb534e987503257ae1a1a26c053fa8c7c82b341788c88fae002734fc9e02131` |
| `docs-interactive/src/components/LiveAPIExplorer.tsx` | 18893 | `.tsx` | 2025-08-15T14:32:48 | `fa679792b02c11f6bcb84e3d382de20d8a3d0872dcc82bad698ea8476c989a01` |
| `docs-interactive/src/components/PayloadGenerator.tsx` | 14318 | `.tsx` | 2025-08-15T14:32:48 | `86045f570268142a7d0d8ed3f2da269a442f1376905845e74bb07b49ac1b8ff5` |
| `docs-interactive/src/components/SDKGenerator.tsx` | 20268 | `.tsx` | 2025-08-15T14:32:48 | `ed82f6a792ecaa8ebc908e2d43e886021574ff3397f885275bf8d50b85a6cded` |
| `docs-interactive/src/components/SearchAndFilters.tsx` | 11493 | `.tsx` | 2025-08-15T15:55:55 | `4f20264776887f0f6c176c82248bf9ff7a8c17c1082a53697c6269a0194cbaf0` |
| `docs-interactive/src/components/ui/Animations.tsx` | 11552 | `.tsx` | 2025-08-15T14:32:53 | `02c8076361ebe2e96ddc2defec52e4ed17c8943a058ee87c370fc00a3c7782b1` |
| `docs-interactive/src/components/ui/badge.tsx` | 1168 | `.tsx` | 2025-08-15T15:23:13 | `b77b53bfb9eb40ee0dcd1619c806e1a935478eb03994e3a5ab3192fade97cf39` |
| `docs-interactive/src/components/ui/button.tsx` | 1689 | `.tsx` | 2025-08-15T15:23:13 | `d5fb8965e7a027a5b7102c87048311b5a48d88240b996708b3552f1b5f02ea5b` |
| `docs-interactive/src/components/ui/card.tsx` | 1878 | `.tsx` | 2025-08-15T15:23:13 | `6107ca0ea6209a02933f8cec0fa360a6f9036a7f894c95469d9dea9806d1e0ae` |
| `docs-interactive/src/components/ui/LoadingComponents.tsx` | 7800 | `.tsx` | 2025-08-15T14:32:51 | `4848c6b3ef2075fc4a5e49052c733fa68a6f358e940e99fea9caf13ba438b9f5` |
| `docs-interactive/src/components/ui/progress.tsx` | 665 | `.tsx` | 2025-08-15T15:23:13 | `6df85e3c7fad4b74f5c6c4042b7afa88d5497d3bcfc5fa9fb1c33c334983e4be` |
| `docs-interactive/src/components/ui/ResponsiveUtils.tsx` | 8665 | `.tsx` | 2025-08-15T14:32:53 | `5e74d38d84817bcef0c7a9fcf3f57e511303036c61d88c4ad96d89036633cc44` |
| `docs-interactive/src/components/VirtualizedEndpointsList.tsx` | 3168 | `.tsx` | 2025-08-15T15:23:13 | `251614c57adf99aaa39aaaa50ab9ba4c5629df8f5f0ab80e1b9a618ce3c28e92` |
| `docs-interactive/src/components/WebVitalsMonitor.tsx` | 14456 | `.tsx` | 2025-08-15T14:32:53 | `3da66fa35e42d46515418681fa8d9be3bffb365b918c9d9b0ba94c622abea1ff` |
| `docs-interactive/src/hooks/useFavorites.ts` | 1731 | `.ts` | 2025-08-15T15:04:34 | `441f573393cdefe4ce59d9fb1f37b691c671409663af8bf56e9c6968a68dc98f` |
| `docs-interactive/src/hooks/usePerformanceOptimization.ts` | 8888 | `.ts` | 2025-08-15T15:55:55 | `b2473c6bf79d11f56361a112995a57dac42971ce93334daf1b820eba6c1832c8` |
| `docs-interactive/src/hooks/useTheme.tsx` | 3713 | `.tsx` | 2025-08-15T15:04:34 | `e8ba639345200329c4ff9d14256c0f74ff66da7c7f6e8076303361a7d1c990c1` |
| `docs-interactive/src/lib/utils.ts` | 166 | `.ts` | 2025-08-15T15:23:13 | `51bbf14cd1f84f49aab2e0dbee420137015d56b6677bb439e83a908cd292cce1` |
| `docs-interactive/src/types/api.ts` | 2782 | `.ts` | 2025-08-15T13:25:34 | `35c0eb62f742965f78f401b7a00fef50adbdcfcc037984f3fc3065f670cbf7cb` |
| `docs-interactive/src/utils/performance.ts` | 8054 | `.ts` | 2025-08-15T14:32:53 | `f1926fa42990c57c656b6c849e73f753cf3e300fde43dfcb274b6abf88b04acb` |
| `docs-interactive/src/utils/WebSocketPool.ts` | 7624 | `.ts` | 2025-08-15T15:23:13 | `f36011ae5c582f1d4dbae48538333a7a16347dccf9782ed4a65b1f7ed7269349` |
| `docs-interactive/tsconfig.json` | 602 | `.json` | 2025-08-13T19:43:09 | `83d292a6930a317ea31ef48e220097d2ca10c6c505f41d5954795acef48ca3b9` |

### `k8s`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `k8s/configmap.yaml` | 708 | `.yaml` | 2025-08-13T18:21:04 | `95636887170f7a9056b2f3aaeca19ab1d8abd084f7037e27f49e3311ff73398b` |
| `k8s/ingress.yaml` | 2490 | `.yaml` | 2025-08-13T18:21:04 | `ed730cf914fd83efe7bda723f36eaa9995245735c7fa8bc8cc5ea3d541a07b85` |
| `k8s/monitoring.yaml` | 9392 | `.yaml` | 2025-08-13T18:21:04 | `8fdc3c2377b8d991d0317f3815f9350a071c8d6dd3c73bfd8dd23e696b0cc9fa` |
| `k8s/namespace.yaml` | 711 | `.yaml` | 2025-08-13T18:21:04 | `83a6119eddcfd39b07bc9f71d32be245ef92b858429d3a689f4f228078854577` |
| `k8s/nox-api.yaml` | 3219 | `.yaml` | 2025-08-13T18:21:04 | `357a95cfe8ed39987c502bff1280cf75613322e76ec0b57b89531ad7c7983ec4` |
| `k8s/postgres.yaml` | 1767 | `.yaml` | 2025-08-13T18:21:04 | `6e553ed50c77334a369fb930bd08a38cf89758c70dc8e57b3ece334d4d073c17` |
| `k8s/README.md` | 794 | `.md` | 2025-08-13T18:21:01 | `de5fceb564bdacb99fc2171bb1f7dae07f8daa8eed4322a0f67076b12e26fd58` |
| `k8s/redis.yaml` | 1717 | `.yaml` | 2025-08-13T18:21:04 | `9ef80e3e917d4257a09aff935df0344fd0731b15af55a2f1197e6013d319ce5b` |
| `k8s/secrets.yaml` | 1076 | `.yaml` | 2025-08-13T18:21:04 | `6d4d239bb74fe0e24aa693c00e41cdc964ee46dc16316377cbb7efdf35db50cc` |
| `k8s/services.yaml` | 1448 | `.yaml` | 2025-08-13T18:21:04 | `d17e69241fa54d10e0fe226547d83f488fb367653a9bb60afe1f73570da93e34` |
| `k8s/staging/k8s-deployment.yml` | 10955 | `.yml` | 2025-08-15T17:09:28 | `3de0978215126a7ac1d190c98c8609cb4c246d721edeeac307fa75c6d475d9a9` |
| `k8s/staging/k8s-hpa.yml` | 9690 | `.yml` | 2025-08-15T17:09:29 | `9bafb2e6bb532740cb75ab8e2d36dd4aae368cdb21364988fa27fd4a481263ee` |
| `k8s/staging/k8s-ingress.yml` | 10852 | `.yml` | 2025-08-15T17:09:28 | `714c7703ec32d5068c058333f6dc9a1ee5ce83509b9ce3655909bf9756ed5f7e` |

### `logs`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `logs/audit.jsonl` | 161017 | `.jsonl` | 2025-08-13T16:43:39 | `` |
| `logs/nox_api_v7.log` | 0 | `.log` | 2025-08-13T16:55:38 | `` |

### `migrations`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `migrations/v8_to_v8.0.0.sql` | 14491 | `.sql` | 2025-08-15T17:09:28 | `b689ae017db06a72042d45c791345f271d18bc404208078905b2a77eff0d8c1c` |

### `monitoring`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `monitoring/alert_rules.yml` | 0 | `.yml` | 2025-08-15T12:45:11 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `monitoring/prometheus.yml` | 0 | `.yml` | 2025-08-15T12:45:10 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `monitoring/quota_alert_rules.yml` | 0 | `.yml` | 2025-08-15T12:45:14 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

### `nox-api`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `nox-api/api/nox_api.py` | 7082 | `.py` | 2025-08-13T14:36:11 | `ed2d11af514133b5e46b6d68ae7265a38e216740836aca38fae0847066d7b22e` |
| `nox-api/api/nox_api_backup.py` | 10131 | `.py` | 2025-08-13T13:16:32 | `4351bef2c842ed1cca9a8b3bb1b2bb550a419e5235f57d59f4f368a44990ee26` |
| `nox-api/api/nox_api_broken.py` | 7744 | `.py` | 2025-08-13T13:28:33 | `b606314c785b4a9bff9b2cd49ec638aa2617b92a25773981329b32867cc62afb` |
| `nox-api/api/nox_api_clean.py` | 7082 | `.py` | 2025-08-13T13:24:03 | `ed2d11af514133b5e46b6d68ae7265a38e216740836aca38fae0847066d7b22e` |
| `nox-api/api/nox_api_fixed.py` | 6953 | `.py` | 2025-08-13T13:32:23 | `a0610206ae66d5589d84058cd8d303783e335d37e10c5cff7ecb9b29b126e145` |
| `nox-api/api/nox_api_new.py` | 9914 | `.py` | 2025-08-13T13:24:03 | `8c31907a98c30257fdf14bfddd4591d630a35cb89edef81bb0481c4fd3d7d41a` |
| `nox-api/api/nox_api_oauth2.py` | 7992 | `.py` | 2025-08-13T14:36:11 | `2a7be9370960c453cf24b9fcd99b31787c95f9c183fdb5c463aac1b9c5fa3b52` |
| `nox-api/api/nox_api_v23.py` | 9223 | `.py` | 2025-08-13T13:59:31 | `c4bf8527fa27e4f23e001f3e508d6f93816b19c56a9d4f03cef4c8c44df91815` |
| `nox-api/auth/oauth2_config.py` | 3712 | `.py` | 2025-08-13T14:18:15 | `057b6b94062c1e23ebf615abd6cc771a81b26ec07cb4690101cdb751df35e037` |
| `nox-api/auth/oauth2_endpoints.py` | 7321 | `.py` | 2025-08-13T14:18:15 | `5b37490c29be50533fc39ebde1290f04e899d69b0598ef8cef873bf4b75c9a19` |
| `nox-api/auth/oauth2_service.py` | 8271 | `.py` | 2025-08-13T14:18:15 | `f0a9203b71885be4e05472f0c2bf99d209044f5591b75184186c8cec2a894095` |
| `nox-api/deploy/caddy_setup.sh` | 11852 | `.sh` | 2025-08-13T11:33:09 | `0e956130fca3fb641c353a0566a2dfc1cb229535943b1edbf8e8a08786155977` |
| `nox-api/deploy/Caddyfile.example` | 935 | `.example` | 2025-08-13T11:33:09 | `` |
| `nox-api/deploy/harden_nox.sh` | 13217 | `.sh` | 2025-08-13T11:04:45 | `33302158c60dc92e47a320ac65e66d553f8040ab05dfa8ff2eb5cd388fa5ed3b` |
| `nox-api/deploy/install_logging.sh` | 11493 | `.sh` | 2025-08-13T11:57:22 | `4d8d1016d14fd084bfe8bead1219061df41db82b78fe520fdc8d01da8f4bdf9c` |
| `nox-api/deploy/install_nox.sh` | 14158 | `.sh` | 2025-08-13T10:56:14 | `d9708849dd6d4401a68aecdfce55e9b1dd159fb5c26116b08ac9f0b76119da40` |
| `nox-api/deploy/logrotate-nox` | 1396 | `` | 2025-08-13T11:57:22 | `` |
| `nox-api/deploy/nginx_nox.conf.example` | 2826 | `.example` | 2025-08-13T11:33:09 | `` |
| `nox-api/deploy/nginx_setup.sh` | 13029 | `.sh` | 2025-08-13T11:33:09 | `bf34bef7af7dece7495166d0c94adeeeb0d78f1f449911445153b8cd2dc82632` |
| `nox-api/deploy/setup_logging.sh` | 5948 | `.sh` | 2025-08-13T11:57:22 | `fd307d0f29753bec1890f903becf4a08bd09127490181d3deec333fb1a3633a8` |
| `nox-api/requirements.txt` | 625 | `.txt` | 2025-08-13T14:18:15 | `6db98809003f7be174eb086839e3f52d0a8abaaae6afaf71927facf185bd64b4` |
| `nox-api/scripts/nox_repair.sh` | 24284 | `.sh` | 2025-08-15T19:31:48 | `1071724620e25f4f6a5be16afb5a518693f29572be089989555186f439836d10` |
| `nox-api/scripts/nox_repair_v2.sh` | 12645 | `.sh` | 2025-08-13T10:56:14 | `683466ec065ee63157989a712597c2ecc396883b7947bdf26b3f86325da23c33` |
| `nox-api/tests/curl_health.sh` | 756 | `.sh` | 2025-08-13T10:56:14 | `c26ed05561eefdb542c51a43b0279e41ad3e63b531f7bde308a6b7da6cd2a7b2` |
| `nox-api/tests/curl_put.sh` | 1090 | `.sh` | 2025-08-13T10:56:14 | `5ba7be59c4002a15cc1096c637cacd88da828eed3b31624f40bdb8368c51b479` |
| `nox-api/tests/curl_run_py.sh` | 1108 | `.sh` | 2025-08-13T10:56:14 | `4666201c380d5451c97961c15d77618785123f3051fc511f1b6d50cd9b6cf022` |
| `nox-api/tests/curl_run_sh.sh` | 1098 | `.sh` | 2025-08-13T10:56:14 | `d66eece127e76d8572b5f52ac879e0a7f98262e3075c15c03c544ffa7bb2ba97` |
| `nox-api/tests/nox_client.py` | 0 | `.py` | 2025-08-13T08:15:16 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `nox-api/tests/run_all_tests.sh` | 2006 | `.sh` | 2025-08-13T10:56:14 | `597b5dc2350c785e993b50def7cdb18f245c8e8a47b7663189cacda8c8e49c0a` |

### `observability`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `observability/metrics.py` | 9113 | `.py` | 2025-08-13T13:24:03 | `d654d69875598bdb4e0a21834b0936b3167f4691b32c3edfd3edef2ca94e8cf7` |
| `observability/metrics_backup.py` | 9113 | `.py` | 2025-08-13T13:12:45 | `d654d69875598bdb4e0a21834b0936b3167f4691b32c3edfd3edef2ca94e8cf7` |
| `observability/metrics_chatgpt.py` | 1240 | `.py` | 2025-08-13T14:54:17 | `36b9e02a565ebfed0b48fbf7362a6f989bff8aae12a94a780fbf8732552c89e1` |
| `observability/middleware.py` | 880 | `.py` | 2025-08-13T13:32:23 | `396b8400fcdb69fab67743d75e505a72af85db34eb1d8d163553ace04918b563` |
| `observability/simple_metrics.py` | 4843 | `.py` | 2025-08-13T13:24:03 | `523450b2504160ffc15273fa4bd69500010187a0c8d3c68e2d9533a972d95bbe` |

### `policy`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `policy/policies.yaml` | 3510 | `.yaml` | 2025-08-13T13:00:24 | `a90195743d7102c9f1de2efaaa292e8e1534c880d0831a58951ccff028a58f7e` |

### `quotas`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `quotas/__init__.py` | 1074 | `.py` | 2025-08-13T15:24:06 | `60d628e0fbf6c05726afeda7f351b9f90fe7ccc13d1014f9864eaa722590589f` |
| `quotas/database.py` | 13692 | `.py` | 2025-08-13T15:40:32 | `fd9383b5e0622f294ae6509cb96a533668741a52c104dd087f4cccf8af6b70a6` |
| `quotas/metrics.py` | 6564 | `.py` | 2025-08-13T15:24:06 | `f5466bad326e42b0b25077fa730c104bff3c39169adfc075e9d82588d5ed83e9` |
| `quotas/middleware.py` | 13712 | `.py` | 2025-08-13T15:40:32 | `4b90163234dd30589e4d0c612a3e82cdde584ff4d226fe15a480fe46c2a8f447` |
| `quotas/migrations.py` | 8365 | `.py` | 2025-08-13T15:24:06 | `6f557614b32a81d0aaa9253443cd5f495e04ca8b18101be68fa76915dddd5f13` |
| `quotas/models.py` | 3610 | `.py` | 2025-08-13T15:24:06 | `5c28cc396bbcca726d0f4551571a844a50f3dc0a956d119b5f7aba7111c87c5f` |
| `quotas/routes.py` | 8154 | `.py` | 2025-08-13T16:01:46 | `03a88c892534e018fd2d52ac77fb06a88570350603003b3dbd9c4668d5cd74da` |

### `reports`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `reports/M53_DEBUG_FIXES_A.md` | 2026 | `.md` | 2025-08-13T16:01:46 | `d1c744cc796206904f32bf7b920836461eda865fff3cd3faaf9beb1a835290a0` |
| `reports/nox_api_src_audit.md` | 77216 | `.md` | 2025-08-17T16:53:05 | `f91466be63180628fdd63d8f8f69fa342ae9db183cfe212bab6fb31a3c32ba57` |

### `scripts`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `scripts/backup.sh` | 13914 | `.sh` | 2025-08-13T18:21:01 | `b6c105c047ddf5fb7e0350252884160cbc8c6114e1bffcda27df4d07fc1940c2` |
| `scripts/backup_restore_cli.py` | 1668 | `.py` | 2025-08-15T19:31:49 | `df42405c8957a244d076bc823b7b188e48f52b997f312ce94cb58cae8a5b83cd` |
| `scripts/check_markdown_links.py` | 1532 | `.py` | 2025-08-15T19:00:14 | `3d35437bab8c2098db908d389df45ae3745f96fa4536c1ac687d4c683c68295c` |
| `scripts/demo_auth.py` | 5774 | `.py` | 2025-08-13T13:59:31 | `a6834d438241806aa7bc117aaf82ec86fe8e5c09487766b712d9951a67884430` |
| `scripts/deploy.sh` | 7554 | `.sh` | 2025-08-13T18:21:01 | `881559171466602a690d5e54b8f5b8b6ace7039794979940ce5fe0b713d9bc40` |
| `scripts/deploy_redis_cluster.sh` | 9648 | `.sh` | 2025-08-13T18:21:01 | `9b4e936b0d7080c1f969b6fa1e54b2f68dc71d84a33f81d0931545286f6ce598` |
| `scripts/health-check.sh` | 11813 | `.sh` | 2025-08-13T18:21:01 | `b380a1dd193f30003d7895f9d2d84b6974aad300d5543880bff5fa618ef3116c` |
| `scripts/init-db.sql` | 5229 | `.sql` | 2025-08-13T14:10:56 | `d0c01533f1ae8b942664ec3aa284e985c6baf80197050c46ba9b3c5287ca4679` |
| `scripts/load-test.js` | 10369 | `.js` | 2025-08-15T17:09:31 | `3cf1db71a5f21928beff62f18b81bfca08c1c9e370130c1e7018c2118266e22a` |
| `scripts/metrics_dashboard.py` | 1623 | `.py` | 2025-08-15T19:31:49 | `de8051db4a2be521ade397682842a9bbcc5f5c47ea2dd9393e02ddb3bdfd8850` |
| `scripts/nox_audit.py` | 16829 | `.py` | 2025-08-17T17:12:04 | `2190a178939817e7f87ba558b1a467b40e4df560028008ad2e7b08f5ee379b9a` |
| `scripts/noxctl` | 19866 | `` | 2025-08-13T13:00:24 | `` |
| `scripts/noxctl-completion.bash` | 3528 | `.bash` | 2025-08-13T12:52:57 | `790cf82d32c50d19190c6bc8ca31dc21f073fea4f4a71b47f39b2b499c9f64c1` |
| `scripts/onboarding_wizard.py` | 1654 | `.py` | 2025-08-15T19:31:49 | `2e8edd5c5362c38d20e49a7c22e52e63e2ff81342d4a5df520c5456948e65ace` |
| `scripts/rate_limit_dashboard.py` | 1012 | `.py` | 2025-08-15T19:31:49 | `84ed83a682d0121757fc192769e90248ac9c99f43cebf7ce2a9bc1ad832d248b` |
| `scripts/rollback.sh` | 10268 | `.sh` | 2025-08-13T18:21:01 | `4251ea1eba3c52c6fa9faa8740df1d5ac767b469e153a60a9bc02de319299909` |
| `scripts/search_docs.py` | 1121 | `.py` | 2025-08-15T19:31:49 | `aea59ff1e0195efba0ec45c08c85fcf603d7f54095f49a285e03166617e9185a` |
| `scripts/test_auth.sh` | 4570 | `.sh` | 2025-08-13T13:59:31 | `cfd151de87dcdc7eb216a2bd9b96c6ee1c745d746ab8b6e8a7bc506db0080755` |
| `scripts/test_dashboard.sh` | 1852 | `.sh` | 2025-08-13T13:37:57 | `28a037fc749624a3b332f07e0893dc45fc7b3f4a8fbec7bdf924fc3b4a9ac39f` |
| `scripts/test_dashboard_auth.py` | 5982 | `.py` | 2025-08-13T13:59:31 | `fc3be237593643df350910516d46543e745de2c469f2265727a72a8d9df06f07` |
| `scripts/test_metrics.sh` | 2010 | `.sh` | 2025-08-13T13:24:03 | `001b6df50231c10f6ae32ceb4c78e278e72a6da29d8f2e49b2c1a6904930db86` |
| `scripts/test_redis_cluster.py` | 3510 | `.py` | 2025-08-13T18:21:04 | `dbb5f289a08b02cf9377b56b67d3ed804ed317f6a4849b903eeff2098e4c2518` |
| `scripts/validate_staging.sh` | 18807 | `.sh` | 2025-08-15T17:09:28 | `55a100ed802228c79630291b683e43941e5b2bf691fa348547af9be35236e41e` |
| `scripts/verify_env.py` | 13223 | `.py` | 2025-08-15T17:25:51 | `099e0a58f2728b4dccad023c4cbb47c2610741c5b7143505497c28b4966c3514` |

### `sdk`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `sdk/python/nox_sdk/__init__.py` | 7812 | `.py` | 2025-08-13T19:20:54 | `99eb04b377346d3d71e05df5648b2212d4713112a92d57605aacc0a959edf80f` |
| `sdk/python/nox_sdk/ai/__init__.py` | 1010 | `.py` | 2025-08-13T19:20:54 | `fe02e7b9bacd247df152c48f12caf4e8b74ec3e10e7de072ac88e65592ae04e6` |
| `sdk/python/nox_sdk/ai/biometric.py` | 21888 | `.py` | 2025-08-13T19:20:54 | `d756348c6dd5777a8c6ea95fd5a6faa0bc50929d1f0b460e76f157d2044be3c4` |
| `sdk/python/nox_sdk/ai/policy.py` | 18551 | `.py` | 2025-08-13T19:20:54 | `a6f6b406f560abfde40f367c891473a2a7615d575a5a8c73da83c0436e238fec` |
| `sdk/python/nox_sdk/ai/security.py` | 14241 | `.py` | 2025-08-13T19:20:54 | `05399c95b111872921a1d03d809d6d237978714ddd3c6439083fa45d4b80f0b9` |
| `sdk/python/nox_sdk/auth.py` | 19617 | `.py` | 2025-08-13T19:20:54 | `3e4970b740b24aeef2a3a594fb4ee9c9760d8dd21b0d4bdc837825f552a3a61b` |
| `sdk/python/nox_sdk/client.py` | 20211 | `.py` | 2025-08-13T19:20:54 | `1307450b6202df57647ad6341024f0d520cb914bd894b7295646fe1fa5ca61bd` |
| `sdk/python/nox_sdk/models.py` | 12650 | `.py` | 2025-08-13T19:20:54 | `ff319364c244875254b82f824fae268627fda365e0e602f7080035c810df3fc2` |
| `sdk/python/nox_sdk/utils.py` | 17352 | `.py` | 2025-08-13T19:20:54 | `8b527c48b9b301ee7e4fb1dbc4d77a8e7f02ef872905fd8c151ab6526ff4c0f8` |
| `sdk/python/requirements.txt` | 393 | `.txt` | 2025-08-13T19:20:54 | `fba6412a49d07152f1acf53571bc9c6bb959c2978ba44e6970caed57f7035689` |
| `sdk/python/setup.py` | 3700 | `.py` | 2025-08-13T19:20:54 | `9fb63d091a7d54c9b65883304b0776ef1ae7b5b2a9d9f673b09438b34451a077` |
| `sdk/typescript/build-test.sh` | 4629 | `.sh` | 2025-08-13T19:20:54 | `bd86abf3346b99f6f17fbafe27381b25663d553e6f96cf5e00f91d4194cf6877` |
| `sdk/typescript/package.json` | 3850 | `.json` | 2025-08-13T19:20:54 | `e7ea3898279a71e0d6a619cadfdad8995fcf37a7e46ddeabebd356293cff5a0f` |
| `sdk/typescript/src/ai/biometric.ts` | 12421 | `.ts` | 2025-08-13T19:20:58 | `97dae65941d64f734651a81db5af5ce201872f40887ff041f44325fc3ecb179b` |
| `sdk/typescript/src/ai/policy.ts` | 8978 | `.ts` | 2025-08-13T19:20:58 | `f61f22c655ddbc2619ad24cef3add86ff40de0d14831e30ae0f579503db0437f` |
| `sdk/typescript/src/ai/security.ts` | 6703 | `.ts` | 2025-08-13T19:20:58 | `2b0760d67ca7037d5a063d49f51f7895781d605f7c99fe7f81adf22ac08b48ea` |
| `sdk/typescript/src/client.ts` | 15802 | `.ts` | 2025-08-13T19:20:58 | `b1ca675bcbd0f5def6283cc6f9264a9d07bdf34342156640ebe491f4e4c28047` |
| `sdk/typescript/src/index.ts` | 6920 | `.ts` | 2025-08-13T19:20:59 | `68d91231027ab8c477e833390dd6dd19504c635313781ef833b826bd684e26a9` |
| `sdk/typescript/src/models.ts` | 9524 | `.ts` | 2025-08-13T19:20:58 | `d66ef561eb1c8474af0b9d147d76cc4fdcd3f799e9b681bf2378b97f8cae30ad` |
| `sdk/typescript/src/utils.ts` | 13425 | `.ts` | 2025-08-13T19:20:58 | `8c1de247847216435e601dfa9a3abde324d3f911b5d0b60794545aad35f639da` |
| `sdk/typescript/tsconfig.json` | 1067 | `.json` | 2025-08-13T19:20:54 | `4367bd20103f771159dfcb42fe2d535245761d363aea1c045bc62f01d0b82815` |

### `tests`

| Path | Size | Ext | MTime | SHA256 |
| --- | ---: | --- | --- | --- |
| `tests/test_api_minimal.py` | 1705 | `.py` | 2025-08-17T16:06:21 | `54487d6f45de2cfed899161e52e337eb8c05dac7efd2a02abd0c6d4303b2cf0e` |
| `tests/tests_xtb_e2e.py` | 4159 | `.py` | 2025-08-17T16:27:24 | `f2deb72be00d4fccc0da57d9d2e1a38d4b51c96112e8b5616823ff2a4a63d1dd` |

## Doublons par nom

- Référence suggérée: `PRODUCTION_DEPLOYMENT_GUIDE.md`
  - `docs/deployment-guides/PRODUCTION_DEPLOYMENT_GUIDE.md` | 8913 B | 2025-08-15T17:26:36
  - `PRODUCTION_DEPLOYMENT_GUIDE.md` | 0 B | 2025-08-15T23:13:52 (ref)
- Référence suggérée: `oauth2_endpoints.py`
  - `nox-api/auth/oauth2_endpoints.py` | 7321 B | 2025-08-13T14:18:15
  - `oauth2_endpoints.py` | 12822 B | 2025-08-13T17:06:47 (ref)
- Référence suggérée: `SESSION_COMPLETION_REPORT_M9.2.md`
  - `docs/session-reports/SESSION_COMPLETION_REPORT_M9.2.md` | 0 B | 2025-08-15T17:35:36
  - `SESSION_COMPLETION_REPORT_M9.2.md` | 0 B | 2025-08-15T23:13:12 (ref)
- Référence suggérée: `PROBLEM_RESOLUTION_REPORT.md`
  - `docs/progress-reports/PROBLEM_RESOLUTION_REPORT.md` | 4988 B | 2025-08-15T17:36:26
  - `PROBLEM_RESOLUTION_REPORT.md` | 0 B | 2025-08-15T23:14:18 (ref)
- Référence suggérée: `DOCUMENTATION.md`
  - `docs-interactive/DOCUMENTATION.md` | 1790 B | 2025-08-15T18:15:40
  - `DOCUMENTATION.md` | 0 B | 2025-08-15T23:13:30 (ref)
- Référence suggérée: `nox-api/deploy/install_nox.sh`
  - `install_nox.sh` | 3990 B | 2025-08-13T06:01:15
  - `nox-api/deploy/install_nox.sh` | 14158 B | 2025-08-13T10:56:14 (ref)
- Référence suggérée: `AUTHENTICATION_GUIDE.md`
  - `AUTHENTICATION_GUIDE.md` | 0 B | 2025-08-15T23:14:08 (ref)
  - `docs-interactive/AUTHENTICATION_GUIDE.md` | 25685 B | 2025-08-15T17:26:36
- Référence suggérée: `ENHANCED_DEPLOYMENT_GUIDE.md`
  - `docs/deployment-guides/ENHANCED_DEPLOYMENT_GUIDE.md` | 45347 B | 2025-08-15T17:26:36
  - `ENHANCED_DEPLOYMENT_GUIDE.md` | 0 B | 2025-08-15T23:14:11 (ref)
- Référence suggérée: `README.md`
  - `docs-interactive/README.md` | 13608 B | 2025-08-15T18:21:26
  - `docs-interactive/sdk-typescript/README.md` | 6981 B | 2025-08-15T14:32:44
  - `docs/README.md` | 5216 B | 2025-08-15T19:31:49
  - `k8s/README.md` | 794 B | 2025-08-13T18:21:01
  - `README.md` | 0 B | 2025-08-15T23:13:43 (ref)
- Référence suggérée: `PRODUCTION_CREDENTIALS_GUIDE.md`
  - `docs/deployment-guides/PRODUCTION_CREDENTIALS_GUIDE.md` | 8922 B | 2025-08-15T17:51:52
  - `PRODUCTION_CREDENTIALS_GUIDE.md` | 10671 B | 2025-08-15T19:00:14 (ref)
- Référence suggérée: `API_USER_GUIDE.md`
  - `API_USER_GUIDE.md` | 0 B | 2025-08-15T23:14:05 (ref)
  - `docs-interactive/API_USER_GUIDE.md` | 17472 B | 2025-08-15T17:26:36
- Référence suggérée: `STAGING_CHECKLIST_COMPLETION_REPORT.md`
  - `docs/progress-reports/STAGING_CHECKLIST_COMPLETION_REPORT.md` | 9907 B | 2025-08-15T17:26:36
  - `STAGING_CHECKLIST_COMPLETION_REPORT.md` | 9953 B | 2025-08-15T18:05:10 (ref)
- Référence suggérée: `docs-interactive/.gitignore`
  - `.gitignore` | 268 B | 2025-08-13T08:28:51
  - `docs-interactive/.gitignore` | 480 B | 2025-08-13T19:43:09 (ref)
- Référence suggérée: `SECTION_4_COMPLETION_REPORT.md`
  - `docs/progress-reports/SECTION_4_COMPLETION_REPORT.md` | 12313 B | 2025-08-15T17:26:36
  - `SECTION_4_COMPLETION_REPORT.md` | 12381 B | 2025-08-15T18:05:10 (ref)
- Référence suggérée: `COMPREHENSIVE_PROGRESS_REPORT.md`
  - `COMPREHENSIVE_PROGRESS_REPORT.md` | 0 B | 2025-08-15T23:13:49 (ref)
  - `docs/progress-reports/COMPREHENSIVE_PROGRESS_REPORT.md` | 14796 B | 2025-08-15T17:26:36
- Référence suggérée: `middleware.py`
  - `middleware.py` | 1001 B | 2025-08-13T15:40:32 (ref)
  - `observability/middleware.py` | 880 B | 2025-08-13T13:32:23
  - `quotas/middleware.py` | 13712 B | 2025-08-13T15:40:32
- Référence suggérée: `sdk/python/requirements.txt`
  - `clients/requirements.txt` | 525 B | 2025-08-13T11:47:58
  - `nox-api/requirements.txt` | 625 B | 2025-08-13T14:18:15
  - `requirements.txt` | 654 B | 2025-08-13T18:21:01
  - `sdk/python/requirements.txt` | 393 B | 2025-08-13T19:20:54 (ref)
- Référence suggérée: `STAGING_VALIDATION_RELEASE_CHECKLIST.md`
  - `docs/deployment-guides/STAGING_VALIDATION_RELEASE_CHECKLIST.md` | 19066 B | 2025-08-15T17:26:36
  - `STAGING_VALIDATION_RELEASE_CHECKLIST.md` | 0 B | 2025-08-15T23:14:12 (ref)
- Référence suggérée: `SECTION_3_COMPLETION.md`
  - `docs/progress-reports/SECTION_3_COMPLETION.md` | 7723 B | 2025-08-15T17:26:36
  - `SECTION_3_COMPLETION.md` | 7803 B | 2025-08-15T18:04:01 (ref)
- Référence suggérée: `DEPLOYMENT_STATUS_TRACKER.md`
  - `DEPLOYMENT_STATUS_TRACKER.md` | 6120 B | 2025-08-15T18:05:10 (ref)
  - `docs/deployment-guides/DEPLOYMENT_STATUS_TRACKER.md` | 6091 B | 2025-08-15T17:26:36
- Référence suggérée: `clients/nox_client.py`
  - `clients/nox_client.py` | 10369 B | 2025-08-13T11:47:58 (ref)
  - `nox-api/tests/nox_client.py` | 0 B | 2025-08-13T08:15:16
  - `nox_client.py` | 892 B | 2025-08-13T06:23:13
- Référence suggérée: `metrics_chatgpt.py`
  - `metrics_chatgpt.py` | 1382 B | 2025-08-13T15:40:32 (ref)
  - `observability/metrics_chatgpt.py` | 1240 B | 2025-08-13T14:54:17
- Référence suggérée: `.copilot-instructions.md`
  - `.copilot-instructions.md` | 3075 B | 2025-08-15T18:04:01 (ref)
  - `docs-interactive/.copilot-instructions.md` | 2586 B | 2025-08-15T17:26:36
- Référence suggérée: `SECTIONS_1_2_COMPLETION.md`
  - `docs/progress-reports/SECTIONS_1_2_COMPLETION.md` | 6424 B | 2025-08-15T17:26:36
  - `SECTIONS_1_2_COMPLETION.md` | 0 B | 2025-08-15T23:13:51 (ref)
- Référence suggérée: `OPS_QUICK_COMMAND_CARD.md`
  - `docs/deployment-guides/OPS_QUICK_COMMAND_CARD.md` | 2901 B | 2025-08-15T17:26:36
  - `OPS_QUICK_COMMAND_CARD.md` | 2926 B | 2025-08-15T18:05:10 (ref)
- Référence suggérée: `MIGRATION_GUIDE.md`
  - `docs-interactive/MIGRATION_GUIDE.md` | 26769 B | 2025-08-15T17:26:36
  - `MIGRATION_GUIDE.md` | 0 B | 2025-08-15T23:14:10 (ref)
- Référence suggérée: `OPS_RELEASE_DAY_RUNBOOK.md`
  - `docs/deployment-guides/OPS_RELEASE_DAY_RUNBOOK.md` | 10315 B | 2025-08-15T17:26:36
  - `OPS_RELEASE_DAY_RUNBOOK.md` | 10340 B | 2025-08-15T18:05:10 (ref)
- Référence suggérée: `artifacts/aaf61a28131a4720aa5d2e522e0dc443/molden.input`
  - `artifacts/072845fdb3fc4bbe9548d4b4124d9d16/molden.input` | 952 B | 2025-08-17T16:09:59
  - `artifacts/aaf61a28131a4720aa5d2e522e0dc443/molden.input` | 952 B | 2025-08-17T16:10:34 (ref)
  - `artifacts/test123/molden.input` | 952 B | 2025-08-17T16:10:16
- Référence suggérée: `artifacts/aaf61a28131a4720aa5d2e522e0dc443/charges`
  - `artifacts/072845fdb3fc4bbe9548d4b4124d9d16/charges` | 30 B | 2025-08-17T16:09:59
  - `artifacts/aaf61a28131a4720aa5d2e522e0dc443/charges` | 30 B | 2025-08-17T16:10:34 (ref)
  - `artifacts/test123/charges` | 30 B | 2025-08-17T16:10:16
- Référence suggérée: `artifacts/aaf61a28131a4720aa5d2e522e0dc443/input.xyz`
  - `artifacts/072845fdb3fc4bbe9548d4b4124d9d16/input.xyz` | 43 B | 2025-08-17T16:09:58
  - `artifacts/aaf61a28131a4720aa5d2e522e0dc443/input.xyz` | 43 B | 2025-08-17T16:10:33 (ref)
  - `artifacts/test123/input.xyz` | 34 B | 2025-08-17T16:10:15
- Référence suggérée: `artifacts/aaf61a28131a4720aa5d2e522e0dc443/xtb.log`
  - `artifacts/072845fdb3fc4bbe9548d4b4124d9d16/xtb.log` | 13380 B | 2025-08-17T16:09:59
  - `artifacts/aaf61a28131a4720aa5d2e522e0dc443/xtb.log` | 13380 B | 2025-08-17T16:10:33 (ref)
  - `artifacts/test123/xtb.log` | 13380 B | 2025-08-17T16:10:15
- Référence suggérée: `artifacts/aaf61a28131a4720aa5d2e522e0dc443/wbo`
  - `artifacts/072845fdb3fc4bbe9548d4b4124d9d16/wbo` | 51 B | 2025-08-17T16:09:59
  - `artifacts/aaf61a28131a4720aa5d2e522e0dc443/wbo` | 51 B | 2025-08-17T16:10:34 (ref)
  - `artifacts/test123/wbo` | 51 B | 2025-08-17T16:10:16
- Référence suggérée: `artifacts/aaf61a28131a4720aa5d2e522e0dc443/molden.log`
  - `artifacts/072845fdb3fc4bbe9548d4b4124d9d16/molden.log` | 12668 B | 2025-08-17T16:09:59
  - `artifacts/aaf61a28131a4720aa5d2e522e0dc443/molden.log` | 12668 B | 2025-08-17T16:10:34 (ref)
  - `artifacts/test123/molden.log` | 12668 B | 2025-08-17T16:10:16
- Référence suggérée: `artifacts/aaf61a28131a4720aa5d2e522e0dc443/xtbrestart`
  - `artifacts/072845fdb3fc4bbe9548d4b4124d9d16/xtbrestart` | 240 B | 2025-08-17T16:09:59
  - `artifacts/aaf61a28131a4720aa5d2e522e0dc443/xtbrestart` | 240 B | 2025-08-17T16:10:34 (ref)
  - `artifacts/test123/xtbrestart` | 240 B | 2025-08-17T16:10:16
- Référence suggérée: `artifacts/aaf61a28131a4720aa5d2e522e0dc443/xtbtopo.mol`
  - `artifacts/072845fdb3fc4bbe9548d4b4124d9d16/xtbtopo.mol` | 255 B | 2025-08-17T16:09:59
  - `artifacts/aaf61a28131a4720aa5d2e522e0dc443/xtbtopo.mol` | 255 B | 2025-08-17T16:10:34 (ref)
  - `artifacts/test123/xtbtopo.mol` | 255 B | 2025-08-17T16:10:16
- Référence suggérée: `artifacts/aaf61a28131a4720aa5d2e522e0dc443/xtbopt.log`
  - `artifacts/072845fdb3fc4bbe9548d4b4124d9d16/xtbopt.log` | 226 B | 2025-08-17T16:09:58
  - `artifacts/aaf61a28131a4720aa5d2e522e0dc443/xtbopt.log` | 226 B | 2025-08-17T16:10:33 (ref)
  - `artifacts/test123/xtbopt.log` | 226 B | 2025-08-17T16:10:15
- Référence suggérée: `docs-interactive/M9_PROGRESS_TRACKER.md`
  - `docs-interactive/M9_PROGRESS_TRACKER.md` | 10418 B | 2025-08-15T15:04:32 (ref)
  - `docs/progress-reports/M9_PROGRESS_TRACKER.md` | 10418 B | 2025-08-15T14:44:43
- Référence suggérée: `docs-interactive/M9.2_COMPLETION_SUMMARY.md`
  - `docs-interactive/M9.2_COMPLETION_SUMMARY.md` | 0 B | 2025-08-15T17:35:26 (ref)
  - `docs/milestone-reports/M9.2_COMPLETION_SUMMARY.md` | 10055 B | 2025-08-15T13:25:34
- Référence suggérée: `docs-interactive/M9.5_COMPLETION_SUMMARY.md`
  - `docs-interactive/M9.5_COMPLETION_SUMMARY.md` | 0 B | 2025-08-15T17:36:11 (ref)
  - `docs/milestone-reports/M9.5_COMPLETION_SUMMARY.md` | 9123 B | 2025-08-15T14:32:44
- Référence suggérée: `docs-interactive/M9.4_COMPLETION_SUMMARY.md`
  - `docs-interactive/M9.4_COMPLETION_SUMMARY.md` | 0 B | 2025-08-15T17:36:04 (ref)
  - `docs/milestone-reports/M9.4_COMPLETION_SUMMARY.md` | 7903 B | 2025-08-15T14:32:43
- Référence suggérée: `docs-interactive/M9.3_COMPLETION_SUMMARY.md`
  - `docs-interactive/M9.3_COMPLETION_SUMMARY.md` | 0 B | 2025-08-15T17:35:57 (ref)
  - `docs/milestone-reports/M9.3_COMPLETION_SUMMARY.md` | 5757 B | 2025-08-15T14:32:43
- Référence suggérée: `docs-interactive/M9.6_PERFORMANCE_COMPLETE.md`
  - `docs-interactive/M9.6_PERFORMANCE_COMPLETE.md` | 0 B | 2025-08-15T17:36:19 (ref)
  - `docs/milestone-reports/M9.6_PERFORMANCE_COMPLETE.md` | 9014 B | 2025-08-15T14:32:45
- Référence suggérée: `docs-interactive/SESSION_COMPLETION_REPORT_M9.3.md`
  - `docs-interactive/SESSION_COMPLETION_REPORT_M9.3.md` | 0 B | 2025-08-15T17:36:01 (ref)
  - `docs/session-reports/SESSION_COMPLETION_REPORT_M9.3.md` | 7073 B | 2025-08-15T14:32:43
- Référence suggérée: `docs-interactive/SESSION_COMPLETION_REPORT_M9.5.md`
  - `docs-interactive/SESSION_COMPLETION_REPORT_M9.5.md` | 0 B | 2025-08-15T17:36:13 (ref)
  - `docs/session-reports/SESSION_COMPLETION_REPORT_M9.5.md` | 7178 B | 2025-08-15T14:32:44
- Référence suggérée: `docs-interactive/SESSION_COMPLETION_REPORT_M9.4.md`
  - `docs-interactive/SESSION_COMPLETION_REPORT_M9.4.md` | 0 B | 2025-08-15T17:36:05 (ref)
  - `docs/session-reports/SESSION_COMPLETION_REPORT_M9.4.md` | 7817 B | 2025-08-15T14:32:43
- Référence suggérée: `quotas/metrics.py`
  - `observability/metrics.py` | 9113 B | 2025-08-13T13:24:03
  - `quotas/metrics.py` | 6564 B | 2025-08-13T15:24:06 (ref)
- Référence suggérée: `sdk/python/nox_sdk/models.py`
  - `auth/models.py` | 6871 B | 2025-08-13T13:59:31
  - `quotas/models.py` | 3610 B | 2025-08-13T15:24:06
  - `sdk/python/nox_sdk/models.py` | 12650 B | 2025-08-13T19:20:54 (ref)
- Référence suggérée: `quotas/routes.py`
  - `auth/routes.py` | 7291 B | 2025-08-13T13:59:31
  - `quotas/routes.py` | 8154 B | 2025-08-13T16:01:46 (ref)
- Référence suggérée: `api/services/__init__.py`
  - `ai/__init__.py` | 0 B | 2025-08-17T15:28:13
  - `ai/runners/__init__.py` | 0 B | 2025-08-17T15:28:15
  - `api/__init__.py` | 0 B | 2025-08-17T15:28:04
  - `api/routes/__init__.py` | 0 B | 2025-08-17T15:28:06
  - `api/schemas/__init__.py` | 0 B | 2025-08-17T15:28:09
  - `api/services/__init__.py` | 0 B | 2025-08-17T15:28:11 (ref)
  - `auth/__init__.py` | 778 B | 2025-08-13T13:59:31
  - `quotas/__init__.py` | 1074 B | 2025-08-13T15:24:06
  - `sdk/python/nox_sdk/__init__.py` | 7812 B | 2025-08-13T19:20:54
  - `sdk/python/nox_sdk/ai/__init__.py` | 1010 B | 2025-08-13T19:20:54
- Référence suggérée: `sdk/python/nox_sdk/client.py`
  - `dashboard/client.py` | 2155 B | 2025-08-13T13:37:57
  - `sdk/python/nox_sdk/client.py` | 20211 B | 2025-08-13T19:20:54 (ref)
- Référence suggérée: `sdk/python/nox_sdk/utils.py`
  - `auth/utils.py` | 5679 B | 2025-08-13T13:59:31
  - `sdk/python/nox_sdk/utils.py` | 17352 B | 2025-08-13T19:20:54 (ref)
- Référence suggérée: `docs-interactive/package.json`
  - `docs-interactive/package.json` | 1010 B | 2025-08-15T15:23:12 (ref)
  - `docs-interactive/sdk-typescript/package.json` | 1476 B | 2025-08-15T14:32:42
  - `sdk/typescript/package.json` | 3850 B | 2025-08-13T19:20:54
- Référence suggérée: `docs-interactive/sdk-typescript/tsconfig.json`
  - `docs-interactive/sdk-typescript/tsconfig.json` | 784 B | 2025-08-15T14:32:42 (ref)
  - `docs-interactive/tsconfig.json` | 602 B | 2025-08-13T19:43:09
  - `sdk/typescript/tsconfig.json` | 1067 B | 2025-08-13T19:20:54
- Référence suggérée: `docs-interactive/src/lib/utils.ts`
  - `docs-interactive/src/lib/utils.ts` | 166 B | 2025-08-15T15:23:13 (ref)
  - `sdk/typescript/src/utils.ts` | 13425 B | 2025-08-13T19:20:58
- Référence suggérée: `docs-interactive/sdk-typescript/src/index.ts`
  - `docs-interactive/sdk-typescript/src/index.ts` | 11286 B | 2025-08-15T14:32:53 (ref)
  - `sdk/typescript/src/index.ts` | 6920 B | 2025-08-13T19:20:59
- Référence suggérée: `docs-interactive/src/app/page.tsx`
  - `docs-interactive/src/app/auth/callback/page.tsx` | 1351 B | 2025-08-15T14:32:48
  - `docs-interactive/src/app/page.tsx` | 535 B | 2025-08-15T15:04:34 (ref)

## Doublons par contenu (hash)

- SHA256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`  
  Référence suggérée: `api/services/__init__.py`
  - `ai/__init__.py` | 0 B | 2025-08-17T15:28:13
  - `ai/runners/__init__.py` | 0 B | 2025-08-17T15:28:15
  - `api/__init__.py` | 0 B | 2025-08-17T15:28:04
  - `api/routes/__init__.py` | 0 B | 2025-08-17T15:28:06
  - `api/schemas/__init__.py` | 0 B | 2025-08-17T15:28:09
  - `api/services/__init__.py` | 0 B | 2025-08-17T15:28:11 (ref)
  - `API_USER_GUIDE.md` | 0 B | 2025-08-15T23:14:05
  - `AUTHENTICATION_GUIDE.md` | 0 B | 2025-08-15T23:14:08
  - `COMPREHENSIVE_PROGRESS_REPORT.md` | 0 B | 2025-08-15T23:13:49
  - `docs-interactive/M9.2_COMPLETION_SUMMARY.md` | 0 B | 2025-08-15T17:35:26
  - `docs-interactive/M9.3_COMPLETION_SUMMARY.md` | 0 B | 2025-08-15T17:35:57
  - `docs-interactive/M9.4_COMPLETION_SUMMARY.md` | 0 B | 2025-08-15T17:36:04
  - `docs-interactive/M9.5_COMPLETION_SUMMARY.md` | 0 B | 2025-08-15T17:36:11
  - `docs-interactive/M9.6_PERFORMANCE_COMPLETE.md` | 0 B | 2025-08-15T17:36:19
  - `docs-interactive/SESSION_COMPLETION_REPORT_M9.3.md` | 0 B | 2025-08-15T17:36:01
  - `docs-interactive/SESSION_COMPLETION_REPORT_M9.4.md` | 0 B | 2025-08-15T17:36:05
  - `docs-interactive/SESSION_COMPLETION_REPORT_M9.5.md` | 0 B | 2025-08-15T17:36:13
  - `docs/session-reports/SESSION_COMPLETION_REPORT_M9.2.md` | 0 B | 2025-08-15T17:35:36
  - `DOCUMENTATION.md` | 0 B | 2025-08-15T23:13:30
  - `ENHANCED_DEPLOYMENT_GUIDE.md` | 0 B | 2025-08-15T23:14:11
  - `MIGRATION_GUIDE.md` | 0 B | 2025-08-15T23:14:10
  - `monitoring/alert_rules.yml` | 0 B | 2025-08-15T12:45:11
  - `monitoring/prometheus.yml` | 0 B | 2025-08-15T12:45:10
  - `monitoring/quota_alert_rules.yml` | 0 B | 2025-08-15T12:45:14
  - `nox-api/tests/nox_client.py` | 0 B | 2025-08-13T08:15:16
  - `PROBLEM_RESOLUTION_REPORT.md` | 0 B | 2025-08-15T23:14:18
  - `PRODUCTION_DEPLOYMENT_GUIDE.md` | 0 B | 2025-08-15T23:13:52
  - `README.md` | 0 B | 2025-08-15T23:13:43
  - `SECTIONS_1_2_COMPLETION.md` | 0 B | 2025-08-15T23:13:51
  - `SESSION_COMPLETION_REPORT_M9.2.md` | 0 B | 2025-08-15T23:13:12
  - `STAGING_VALIDATION_RELEASE_CHECKLIST.md` | 0 B | 2025-08-15T23:14:12
- SHA256: `d6a4ce7047e6014f7fc46a2d08e8aefe27a2e902674113cf06efca572c0f9c48`  
  Référence suggérée: `.env.production`
  - `.env.production` | 4422 B | 2025-08-15T18:55:39 (ref)
  - `.env.production.example` | 4422 B | 2025-08-15T16:18:41
- SHA256: `e86288ddbae86de799f18748bd86312ade6fbba62122a63f4f9f647b6700fdd6`  
  Référence suggérée: `docs-interactive/M9_PROGRESS_TRACKER.md`
  - `docs-interactive/M9_PROGRESS_TRACKER.md` | 10418 B | 2025-08-15T15:04:32 (ref)
  - `docs/progress-reports/M9_PROGRESS_TRACKER.md` | 10418 B | 2025-08-15T14:44:43
- SHA256: `d654d69875598bdb4e0a21834b0936b3167f4691b32c3edfd3edef2ca94e8cf7`  
  Référence suggérée: `observability/metrics.py`
  - `observability/metrics.py` | 9113 B | 2025-08-13T13:24:03 (ref)
  - `observability/metrics_backup.py` | 9113 B | 2025-08-13T13:12:45
- SHA256: `ed2d11af514133b5e46b6d68ae7265a38e216740836aca38fae0847066d7b22e`  
  Référence suggérée: `nox-api/api/nox_api.py`
  - `nox-api/api/nox_api.py` | 7082 B | 2025-08-13T14:36:11 (ref)
  - `nox-api/api/nox_api_clean.py` | 7082 B | 2025-08-13T13:24:03
- SHA256: `f9afd0e46b8e624b522289a873c751aaafe8571b1b19520a519b24472850ad57`  
  Référence suggérée: `docs-interactive/src/app/page.tsx`
  - `docs-interactive/src/app/page-simple.tsx` | 535 B | 2025-08-15T15:04:34
  - `docs-interactive/src/app/page.tsx` | 535 B | 2025-08-15T15:04:34 (ref)

## Redondances de structure et configs

- Vérifier la présence de dossiers proches comme `api`, `api-old`, `api_backup`, `archive`.
- Vérifier la duplication potentielle de modules entre `ai/`, `api/`, `scripts/`.
- Vérifier les configs multiples et chevauchantes: `pyproject.toml`, `setup.cfg`, `ruff.toml`, `.flake8`, `tsconfig.json`, `package.json`.

## Recommandations de nettoyage (non destructif)

1. Geler l'état actuel dans une branche ou un tag.
2. Écrire des tests rapides pour valider imports et endpoints critiques.
3. Consolider les duplications par nom ou par hash en gardant la référence la plus récente située dans `api/` si pertinent.
4. Déplacer artefacts, logs et caches vers `artifacts/` ou les ignorer via VCS.
5. Unifier les configurations redondantes et centraliser les scripts dans `scripts/`.

Arborescence cible suggérée:
```
nox-api-src/
  api/
  ai/
  scripts/
  tests/
  docs/
  configs/
```

## Annexe A. Heuristiques

- Exclusions dossiers: .cache, .git, .github, .gitlab, .idea, .mypy_cache, .next, .parcel-cache, .pytest_cache, .turbo, .venv, .vscode, __pycache__, build, dist, node_modules, venv
- Exclusions extensions: .7z, .avi, .bz2, .gif, .gz, .ico, .jpeg, .jpg, .mkv, .mov, .mp4, .pdf, .png, .tar, .webp, .zip
- Extensions hashées: .bash, .cfg, .css, .env, .html, .ini, .js, .json, .jsx, .less, .md, .mjs, .ps1, .py, .rst, .scss, .sh, .sql, .toml, .ts, .tsx, .txt, .yaml, .yml, .zsh
- Taille dossier = somme des tailles des fichiers du sous-arbre.
- Doublons par nom: groupement insensible à la casse sur le nom de fichier.
- Doublons par hash: groupement sur SHA256 des fichiers texte/code.

## Annexe B. JSON machine lisible

```json
{"summary":{"generated_at":"2025-08-17T17:17:21","root":"nox-api-src","files":410,"folders":78,"ignored_files":1,"total_size":3090235},"folders":{".":{"path":".","file_count":410,"total_size":3090235,"direct_files":70},"data":{"path":"data","file_count":1,"total_size":24576,"direct_files":1},"tests":{"path":"tests","file_count":2,"total_size":5864,"direct_files":2},"k8s":{"path":"k8s","file_count":13,"total_size":54819,"direct_files":10},"k8s/staging":{"path":"k8s/staging","file_count":3,"total_size":31497,"direct_files":3},"artifacts":{"path":"artifacts","file_count":27,"total_size":83526,"direct_files":0},"artifacts/072845fdb3fc4bbe9548d4b4124d9d16":{"path":"artifacts/072845fdb3fc4bbe9548d4b4124d9d16","file_count":9,"total_size":27845,"direct_files":9},"artifacts/aaf61a28131a4720aa5d2e522e0dc443":{"path":"artifacts/aaf61a28131a4720aa5d2e522e0dc443","file_count":9,"total_size":27845,"direct_files":9},"artifacts/test123":{"path":"artifacts/test123","file_count":9,"total_size":27836,"direct_files":9},"clients":{"path":"clients","file_count":3,"total_size":29490,"direct_files":3},"config":{"path":"config","file_count":4,"total_size":2296,"direct_files":1},"config/redis":{"path":"config/redis","file_count":3,"total_size":1818,"direct_files":3},"config/sentinel2.conf":{"path":"config/sentinel2.conf","file_count":0,"total_size":0,"direct_files":0},"config/sentinel3.conf":{"path":"config/sentinel3.conf","file_count":0,"total_size":0,"direct_files":0},"config/sentinel1.conf":{"path":"config/sentinel1.conf","file_count":0,"total_size":0,"direct_files":0},"docs":{"path":"docs","file_count":67,"total_size":555042,"direct_files":1},"docs/testing-status":{"path":"docs/testing-status","file_count":1,"total_size":4632,"direct_files":1},"docs/progress-reports":{"path":"docs/progress-reports","file_count":11,"total_size":83122,"direct_files":11},"docs/milestone-reports":{"path":"docs/milestone-reports","file_count":21,"total_size":162584,"direct_files":21},"docs/planning":{"path":"docs/planning","file_count":13,"total_size":88031,"direct_files":13},"docs/testing":{"path":"docs/testing","file_count":1,"total_size":7048,"direct_files":1},"docs/session-reports":{"path":"docs/session-reports","file_count":5,"total_size":29109,"direct_files":5},"docs/deployment-guides":{"path":"docs/deployment-guides","file_count":10,"total_size":128288,"direct_files":10},"docs/phase-specifications":{"path":"docs/phase-specifications","file_count":4,"total_size":47012,"direct_files":4},"observability":{"path":"observability","file_count":5,"total_size":25189,"direct_files":5},"archive":{"path":"archive","file_count":23,"total_size":124773,"direct_files":0},"archive/old-api-versions":{"path":"archive/old-api-versions","file_count":5,"total_size":61560,"direct_files":5},"archive/old-configs":{"path":"archive/old-configs","file_count":3,"total_size":4291,"direct_files":3},"archive/legacy-tests":{"path":"archive/legacy-tests","file_count":7,"total_size":12406,"direct_files":7},"archive/deprecated-scripts":{"path":"archive/deprecated-scripts","file_count":8,"total_size":46516,"direct_files":8},"quotas":{"path":"quotas","file_count":7,"total_size":55171,"direct_files":7},"dashboard":{"path":"dashboard","file_count":6,"total_size":53993,"direct_files":6},"reports":{"path":"reports","file_count":2,"total_size":79242,"direct_files":2},"migrations":{"path":"migrations","file_count":1,"total_size":14491,"direct_files":1},"api":{"path":"api","file_count":15,"total_size":56333,"direct_files":5},"api/services":{"path":"api/services","file_count":5,"total_size":1450,"direct_files":5},"api/schemas":{"path":"api/schemas","file_count":3,"total_size":877,"direct_files":3},"api/routes":{"path":"api/routes","file_count":2,"total_size":3095,"direct_files":2},"ai":{"path":"ai","file_count":7,"total_size":150193,"direct_files":5},"ai/runners":{"path":"ai/runners","file_count":2,"total_size":6602,"direct_files":2},"ai/models":{"path":"ai/models","file_count":0,"total_size":0,"direct_files":0},"database":{"path":"database","file_count":0,"total_size":0,"direct_files":0},"database/init":{"path":"database/init","file_count":0,"total_size":0,"direct_files":0},"database/init/dev-data":{"path":"database/init/dev-data","file_count":0,"total_size":0,"direct_files":0},"database/dev-data":{"path":"database/dev-data","file_count":0,"total_size":0,"direct_files":0},"policy":{"path":"policy","file_count":1,"total_size":3510,"direct_files":1},"auth":{"path":"auth","file_count":6,"total_size":28130,"direct_files":6},"scripts":{"path":"scripts","file_count":24,"total_size":173356,"direct_files":24},"logs":{"path":"logs","file_count":2,"total_size":161017,"direct_files":2},"monitoring":{"path":"monitoring","file_count":3,"total_size":0,"direct_files":3},"sdk":{"path":"sdk","file_count":21,"total_size":220744,"direct_files":0},"sdk/python":{"path":"sdk/python","file_count":11,"total_size":137425,"direct_files":2},"sdk/python/nox_sdk":{"path":"sdk/python/nox_sdk","file_count":9,"total_size":133332,"direct_files":5},"sdk/python/nox_sdk/models":{"path":"sdk/python/nox_sdk/models","file_count":0,"total_size":0,"direct_files":0},"sdk/python/nox_sdk/ai":{"path":"sdk/python/nox_sdk/ai","file_count":4,"total_size":55690,"direct_files":4},"sdk/typescript":{"path":"sdk/typescript","file_count":10,"total_size":83319,"direct_files":3},"sdk/typescript/src":{"path":"sdk/typescript/src","file_count":7,"total_size":73773,"direct_files":4},"sdk/typescript/src/ai":{"path":"sdk/typescript/src/ai","file_count":3,"total_size":28102,"direct_files":3},"nox-api":{"path":"nox-api","file_count":29,"total_size":203891,"direct_files":1},"nox-api/tests":{"path":"nox-api/tests","file_count":6,"total_size":6058,"direct_files":6},"nox-api/deploy":{"path":"nox-api/deploy","file_count":9,"total_size":74854,"direct_files":9},"nox-api/api":{"path":"nox-api/api","file_count":8,"total_size":66121,"direct_files":8},"nox-api/hooks":{"path":"nox-api/hooks","file_count":0,"total_size":0,"direct_files":0},"nox-api/auth":{"path":"nox-api/auth","file_count":3,"total_size":19304,"direct_files":3},"nox-api/scripts":{"path":"nox-api/scripts","file_count":2,"total_size":36929,"direct_files":2},"docs-interactive":{"path":"docs-interactive","file_count":71,"total_size":634502,"direct_files":27},"docs-interactive/public":{"path":"docs-interactive/public","file_count":6,"total_size":22988,"direct_files":6},"docs-interactive/src":{"path":"docs-interactive/src","file_count":34,"total_size":245818,"direct_files":0},"docs-interactive/src/components":{"path":"docs-interactive/src/components","file_count":21,"total_size":194537,"direct_files":14},"docs-interactive/src/components/ui":{"path":"docs-interactive/src/components/ui","file_count":7,"total_size":33417,"direct_files":7},"docs-interactive/src/app":{"path":"docs-interactive/src/app","file_count":6,"total_size":18323,"direct_files":5},"docs-interactive/src/app/auth":{"path":"docs-interactive/src/app/auth","file_count":1,"total_size":1351,"direct_files":0},"docs-interactive/src/app/auth/callback":{"path":"docs-interactive/src/app/auth/callback","file_count":1,"total_size":1351,"direct_files":1},"docs-interactive/src/utils":{"path":"docs-interactive/src/utils","file_count":2,"total_size":15678,"direct_files":2},"docs-interactive/src/hooks":{"path":"docs-interactive/src/hooks","file_count":3,"total_size":14332,"direct_files":3},"docs-interactive/src/types":{"path":"docs-interactive/src/types","file_count":1,"total_size":2782,"direct_files":1},"docs-interactive/src/lib":{"path":"docs-interactive/src/lib","file_count":1,"total_size":166,"direct_files":1},"docs-interactive/sdk-typescript":{"path":"docs-interactive/sdk-typescript","file_count":4,"total_size":20527,"direct_files":3},"docs-interactive/sdk-typescript/src":{"path":"docs-interactive/sdk-typescript/src","file_count":1,"total_size":11286,"direct_files":1}},"files":[{"path":"generate_audit.py","size":3904,"ext":".py","mtime":"2025-08-17T16:43:32","sha256":"de32dde1a132fdd0d43bb4272e651904d5a4ced0baf2b1bae03c04cdd45d119d"},{"path":"test_api.sh","size":443,"ext":".sh","mtime":"2025-08-17T15:46:05","sha256":"ffb1c4d1523cba852909b08ca856b496ff2533568188d11785e65fd0d763418a"},{"path":"RELEASE_TEAM_QUICK_REFERENCE.md","size":7257,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"79d8ffefece24c8f3e6c834ee63a43fbdd3b645bed72448ab78a02d1e1313d02"},{"path":"PRODUCTION_DEPLOYMENT_GUIDE.md","size":0,"ext":".md","mtime":"2025-08-15T23:13:52","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"pytest.ini","size":62,"ext":".ini","mtime":"2025-08-17T15:46:05","sha256":"f214a7c1dba349847819a02ad5fb699447c48a64e13b1b67625975e9fc7b3ac8"},{"path":"debug_api.py","size":4015,"ext":".py","mtime":"2025-08-13T16:01:46","sha256":"7c85a56d9d2f2c13fb8fa13d30191d9709bb60370c7fe84b1dc09ec6ec7675c3"},{"path":"test_xtb_runner.py","size":2926,"ext":".py","mtime":"2025-08-17T16:06:21","sha256":"1bb9b26c0c5663d3807d8ef12de9bb1f516ceac6275a3cbef2e7c5c0f55f2017"},{"path":"oauth2_endpoints.py","size":12822,"ext":".py","mtime":"2025-08-13T17:06:47","sha256":"30c63dd8d748326bd08c9e7de70cc675bbce3d5f43fdf79f023b28a233fbc3ed"},{"path":"SESSION_COMPLETION_REPORT_M9.2.md","size":0,"ext":".md","mtime":"2025-08-15T23:13:12","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"advanced_audit_middleware.py","size":16802,"ext":".py","mtime":"2025-08-13T17:06:47","sha256":"bb0944bd70dd647b82188f624c91e2650684f831bc0eac40431b8976b07a5c76"},{"path":"Dockerfile","size":1615,"ext":"","mtime":"2025-08-13T18:21:04","sha256":null},{"path":"PROBLEM_RESOLUTION_REPORT.md","size":0,"ext":".md","mtime":"2025-08-15T23:14:18","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"enhanced_oauth2_service.py","size":17421,"ext":".py","mtime":"2025-08-13T17:06:47","sha256":"7e673348197d7375e4f4c8e1ece8596b872232a33c479810441033ca8918d920"},{"path":"DOCUMENTATION.md","size":0,"ext":".md","mtime":"2025-08-15T23:13:30","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"MasterPlan","size":18428,"ext":"","mtime":"2025-08-13T11:58:34","sha256":null},{"path":"admin_audit_api.py","size":19927,"ext":".py","mtime":"2025-08-13T17:06:47","sha256":"ae6a3223880330b724e827227f42d2b4e17146f28529df0772d7aa3abd4b755e"},{"path":"requirements-phase2.txt","size":1601,"ext":".txt","mtime":"2025-08-13T14:54:16","sha256":"2ae7980de0fbaf629e9d0bec9049e68cf8a9f2d5fc37504f8bc29e708954941e"},{"path":"install_nox.sh","size":3990,"ext":".sh","mtime":"2025-08-13T06:01:15","sha256":"cd9ac447edf6e2ee2c7dcaea3ef29eef2d84448a7d10b0a109856c8838263297"},{"path":"health-report-20250815-185635.txt","size":533,"ext":".txt","mtime":"2025-08-15T18:56:35","sha256":"4c0515f1bf6c626e07c84d095a6d65bfb432d300e506452b69a127859bac2de8"},{"path":"AUTHENTICATION_GUIDE.md","size":0,"ext":".md","mtime":"2025-08-15T23:14:08","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"Makefile","size":3973,"ext":"","mtime":"2025-08-17T16:27:23","sha256":null},{"path":"nox_v7.log","size":4827,"ext":".log","mtime":"2025-08-13T17:49:10","sha256":null},{"path":".env.production.example","size":4422,"ext":".example","mtime":"2025-08-15T16:18:41","sha256":"d6a4ce7047e6014f7fc46a2d08e8aefe27a2e902674113cf06efca572c0f9c48"},{"path":".env.example","size":2647,"ext":".example","mtime":"2025-08-13T14:18:15","sha256":"5d8b6867657979230a9ca9e57541a04888cf61b3850289921223cdd05911039c"},{"path":"m6_audit_schema.sql","size":9843,"ext":".sql","mtime":"2025-08-13T17:06:47","sha256":"2850af787ac5fbfa2c9e2234054cc03625c0eccc449000713a71dcdb137ce716"},{"path":"ENHANCED_DEPLOYMENT_GUIDE.md","size":0,"ext":".md","mtime":"2025-08-15T23:14:11","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":".env","size":1209,"ext":"","mtime":"2025-08-17T15:20:20","sha256":"a913eb9fd9ff60d6c843d080f3c2b7399e74ca7d121a34a1d30ecd8c6cf3bea5"},{"path":"docker-compose.dev.yml","size":4512,"ext":".yml","mtime":"2025-08-13T18:21:04","sha256":"02e0de7e7777b2da225a294ce081aa6978f1f8ee798ac1fb5f17eb0f7aa373ff"},{"path":"README.md","size":0,"ext":".md","mtime":"2025-08-15T23:13:43","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"test_xtb_sync.py","size":2658,"ext":".py","mtime":"2025-08-17T16:27:24","sha256":"cfe85bdfa7be61cd70cdd8e80296a8c263ac3880b98eceb9fd912c3beeb505bb"},{"path":"nox_bootstrap.sh","size":9336,"ext":".sh","mtime":"2025-08-13T09:22:10","sha256":"e0866d1598714224a3a6a94218f034fd5cc6706c8fc260b239dd13709cdd6f30"},{"path":"m5x_persistence_test.py","size":11318,"ext":".py","mtime":"2025-08-13T16:14:57","sha256":"bdc27ac29210108deb335faa8e6675220dc064c8caddd4474f9af95854e8c331"},{"path":"docker-compose.yml","size":4022,"ext":".yml","mtime":"2025-08-13T18:21:04","sha256":"8e75c5d4e9db59a27fee974a0c8d848f002416313c62c9436e4757bf101be71a"},{"path":"XTB_USAGE_GUIDE.md","size":4846,"ext":".md","mtime":"2025-08-17T16:06:21","sha256":"f0540b492b26e0c5c992c084546874f8f2984c79d8bfd386bef32166b092b0ba"},{"path":"audit_script.py","size":15984,"ext":".py","mtime":"2025-08-17T16:40:12","sha256":"cfdaaf4102b8019061f9c7288a25ded0cb96ab56b7b88b62ebec36b6c83b8429"},{"path":"PRODUCTION_CREDENTIALS_GUIDE.md","size":10671,"ext":".md","mtime":"2025-08-15T19:00:14","sha256":"f01c141ce87455b38a51d032d03d28dac822cf83042f2ee7037687dd6076b863"},{"path":"rate_limit_and_policy.py","size":12716,"ext":".py","mtime":"2025-08-13T15:40:32","sha256":"5c9b5729668160b29a42b31c22dbaa27e34392d1de8969341a31e3ac350bb523"},{"path":"ANALYSE_COMPLETE_NOX_PROJET.md","size":9347,"ext":".md","mtime":"2025-08-17T16:40:42","sha256":"a18f489a5078092eeeb628f858a8fbde506afaabcda0f7d51e42ca67ad3ac6e8"},{"path":"API_USER_GUIDE.md","size":0,"ext":".md","mtime":"2025-08-15T23:14:05","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"oauth2_config_m7.py","size":7958,"ext":".py","mtime":"2025-08-13T17:06:47","sha256":"74569fa0fb6f6a279facb4f1ef9a8a5dc0ac1a953ee9270ad8b12636a49c92e3"},{"path":"STAGING_CHECKLIST_COMPLETION_REPORT.md","size":9953,"ext":".md","mtime":"2025-08-15T18:05:10","sha256":"6ba5a0823fb8a5af28505f103ffd83c5ab0ae1b869ead79d4f83d82e91cd793a"},{"path":".dockerignore","size":648,"ext":"","mtime":"2025-08-13T14:10:56","sha256":null},{"path":"MISSION_ACCOMPLISHED.md","size":6249,"ext":".md","mtime":"2025-08-17T16:06:21","sha256":"743b2e2c411cd7ae3d3f3fb948469b2abc55891e22c36660b4efb1ed221cc269"},{"path":".gitignore","size":268,"ext":"","mtime":"2025-08-13T08:28:51","sha256":null},{"path":"pyproject.toml","size":442,"ext":".toml","mtime":"2025-08-17T15:46:05","sha256":"d2ddd2ff8aa97ddd0d84750d4246f81e12186a3dc7a5f526fa7a94584a20d7d1"},{"path":"SECTION_4_COMPLETION_REPORT.md","size":12381,"ext":".md","mtime":"2025-08-15T18:05:10","sha256":"f483e978c000034cc6f3aa17a314c5aca848bef214f009586ba4151af71e64b5"},{"path":"m5x_load_test.py","size":12086,"ext":".py","mtime":"2025-08-13T16:14:57","sha256":"b202bf7ad25f0ff91ab226236368d9a6c9453cbd13dc09410a14a25c0af60c38"},{"path":".env.production","size":4422,"ext":".production","mtime":"2025-08-15T18:55:39","sha256":"d6a4ce7047e6014f7fc46a2d08e8aefe27a2e902674113cf06efca572c0f9c48"},{"path":"docker-compose.xtb.yml","size":548,"ext":".yml","mtime":"2025-08-17T16:27:23","sha256":"c01d27155a17c01fed7d28bd0ac559f80acfd34bc523687842b05c2a14670b63"},{"path":"COMPREHENSIVE_PROGRESS_REPORT.md","size":0,"ext":".md","mtime":"2025-08-15T23:13:49","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"middleware.py","size":1001,"ext":".py","mtime":"2025-08-13T15:40:32","sha256":"66fa971126592d290e2d77f6bde39faf72b639184890f9d26a79aad5a6f44755"},{"path":"fix_markdown.py","size":1426,"ext":".py","mtime":"2025-08-15T17:26:09","sha256":"3e369792319aa84146c5137e37bad5761aac6fc369f37f04256c09a130afe317"},{"path":"m7_oauth2_schema.sql","size":9606,"ext":".sql","mtime":"2025-08-13T17:06:47","sha256":"22329f7659e16aa9d1bc4072f56d6419507a7d1228bbe9b2883c0dffce7c4d3b"},{"path":"test_xtb_cubes.py","size":2656,"ext":".py","mtime":"2025-08-17T16:06:21","sha256":"03ae86a53bf04d27472bac5e934967f50d9095f737e98292d90a598821f5f2a8"},{"path":"requirements.txt","size":654,"ext":".txt","mtime":"2025-08-13T18:21:01","sha256":"93fade11ff4429562ff364cbd08f1a236031288e456215deda0c7f9e3b480f4b"},{"path":"redis-cluster.yml","size":5061,"ext":".yml","mtime":"2025-08-13T18:21:04","sha256":"0dcb0fc019d42a2ad571a28c60e28391a8e1fa4b61626da283077cd19a992295"},{"path":"STAGING_VALIDATION_RELEASE_CHECKLIST.md","size":0,"ext":".md","mtime":"2025-08-15T23:14:12","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"SECTION_3_COMPLETION.md","size":7803,"ext":".md","mtime":"2025-08-15T18:04:01","sha256":"ab118886af4f0a2920e2b2aacb72a690a65fa580b3c9ad05271e9551e40bc8d3"},{"path":"DEPLOYMENT_STATUS_TRACKER.md","size":6120,"ext":".md","mtime":"2025-08-15T18:05:10","sha256":"2287bb2beb52235f19f73eed65ea0bd5e1b3603888048811dcc0a6cff072a420"},{"path":"nox_client.py","size":892,"ext":".py","mtime":"2025-08-13T06:23:13","sha256":"93a676279b0de3c7611a2ec3b302334b8ed3806a321fb50a0f43bbe4e1302eb4"},{"path":"metrics_chatgpt.py","size":1382,"ext":".py","mtime":"2025-08-13T15:40:32","sha256":"5c96a4f243f9e4139247ad2e9c37a676e5b24de50219a20ff73b5f88f0c9ddff"},{"path":".copilot-instructions.md","size":3075,"ext":".md","mtime":"2025-08-15T18:04:01","sha256":"2e6ecd77f500e4089ba79a5d2b428a7902ea56ce504ba6d45b8402b3753ccd90"},{"path":"test_integration_complete.py","size":4312,"ext":".py","mtime":"2025-08-17T16:27:24","sha256":"437c8d4208fa98f882939c38a250ae59e0b1b433e1a06a6a5a9e9b6cab669fd6"},{"path":"SESSION_SUMMARY.md","size":1654,"ext":".md","mtime":"2025-08-15T19:48:48","sha256":"b65cc142570fc834b5488654667f775a7d0949b9191041ab393298c75a387ad3"},{"path":"m5x_quota_analysis.py","size":10251,"ext":".py","mtime":"2025-08-13T16:14:57","sha256":"4d47a697daec809fb94ca66b6a831d56d96eccd0779fca30dbde09e7ec72db78"},{"path":"SECTIONS_1_2_COMPLETION.md","size":0,"ext":".md","mtime":"2025-08-15T23:13:51","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"OPS_QUICK_COMMAND_CARD.md","size":2926,"ext":".md","mtime":"2025-08-15T18:05:10","sha256":"a816da6404801c6bf23e04709546113e4df96042ab842f182d61b1ad25906f26"},{"path":"MIGRATION_GUIDE.md","size":0,"ext":".md","mtime":"2025-08-15T23:14:10","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"OPS_RELEASE_DAY_RUNBOOK.md","size":10340,"ext":".md","mtime":"2025-08-15T18:05:10","sha256":"8a69dff4f8615ebd3344a2668871377efbe290c26af2d98051ccece36c999b75"},{"path":"test_api_direct.py","size":1896,"ext":".py","mtime":"2025-08-17T15:46:07","sha256":"53b3c96d5572f879a67ee11581e0200ca2b01e280c51fe61bbd6bb7e9530bac5"},{"path":"data/nox.db","size":24576,"ext":".db","mtime":"2025-08-13T13:55:09","sha256":null},{"path":"tests/test_api_minimal.py","size":1705,"ext":".py","mtime":"2025-08-17T16:06:21","sha256":"54487d6f45de2cfed899161e52e337eb8c05dac7efd2a02abd0c6d4303b2cf0e"},{"path":"tests/tests_xtb_e2e.py","size":4159,"ext":".py","mtime":"2025-08-17T16:27:24","sha256":"f2deb72be00d4fccc0da57d9d2e1a38d4b51c96112e8b5616823ff2a4a63d1dd"},{"path":"k8s/monitoring.yaml","size":9392,"ext":".yaml","mtime":"2025-08-13T18:21:04","sha256":"8fdc3c2377b8d991d0317f3815f9350a071c8d6dd3c73bfd8dd23e696b0cc9fa"},{"path":"k8s/configmap.yaml","size":708,"ext":".yaml","mtime":"2025-08-13T18:21:04","sha256":"95636887170f7a9056b2f3aaeca19ab1d8abd084f7037e27f49e3311ff73398b"},{"path":"k8s/namespace.yaml","size":711,"ext":".yaml","mtime":"2025-08-13T18:21:04","sha256":"83a6119eddcfd39b07bc9f71d32be245ef92b858429d3a689f4f228078854577"},{"path":"k8s/services.yaml","size":1448,"ext":".yaml","mtime":"2025-08-13T18:21:04","sha256":"d17e69241fa54d10e0fe226547d83f488fb367653a9bb60afe1f73570da93e34"},{"path":"k8s/secrets.yaml","size":1076,"ext":".yaml","mtime":"2025-08-13T18:21:04","sha256":"6d4d239bb74fe0e24aa693c00e41cdc964ee46dc16316377cbb7efdf35db50cc"},{"path":"k8s/ingress.yaml","size":2490,"ext":".yaml","mtime":"2025-08-13T18:21:04","sha256":"ed730cf914fd83efe7bda723f36eaa9995245735c7fa8bc8cc5ea3d541a07b85"},{"path":"k8s/README.md","size":794,"ext":".md","mtime":"2025-08-13T18:21:01","sha256":"de5fceb564bdacb99fc2171bb1f7dae07f8daa8eed4322a0f67076b12e26fd58"},{"path":"k8s/redis.yaml","size":1717,"ext":".yaml","mtime":"2025-08-13T18:21:04","sha256":"9ef80e3e917d4257a09aff935df0344fd0731b15af55a2f1197e6013d319ce5b"},{"path":"k8s/postgres.yaml","size":1767,"ext":".yaml","mtime":"2025-08-13T18:21:04","sha256":"6e553ed50c77334a369fb930bd08a38cf89758c70dc8e57b3ece334d4d073c17"},{"path":"k8s/nox-api.yaml","size":3219,"ext":".yaml","mtime":"2025-08-13T18:21:04","sha256":"357a95cfe8ed39987c502bff1280cf75613322e76ec0b57b89531ad7c7983ec4"},{"path":"k8s/staging/k8s-deployment.yml","size":10955,"ext":".yml","mtime":"2025-08-15T17:09:28","sha256":"3de0978215126a7ac1d190c98c8609cb4c246d721edeeac307fa75c6d475d9a9"},{"path":"k8s/staging/k8s-ingress.yml","size":10852,"ext":".yml","mtime":"2025-08-15T17:09:28","sha256":"714c7703ec32d5068c058333f6dc9a1ee5ce83509b9ce3655909bf9756ed5f7e"},{"path":"k8s/staging/k8s-hpa.yml","size":9690,"ext":".yml","mtime":"2025-08-15T17:09:29","sha256":"9bafb2e6bb532740cb75ab8e2d36dd4aae368cdb21364988fa27fd4a481263ee"},{"path":"artifacts/072845fdb3fc4bbe9548d4b4124d9d16/molden.input","size":952,"ext":".input","mtime":"2025-08-17T16:09:59","sha256":null},{"path":"artifacts/072845fdb3fc4bbe9548d4b4124d9d16/charges","size":30,"ext":"","mtime":"2025-08-17T16:09:59","sha256":null},{"path":"artifacts/072845fdb3fc4bbe9548d4b4124d9d16/input.xyz","size":43,"ext":".xyz","mtime":"2025-08-17T16:09:58","sha256":null},{"path":"artifacts/072845fdb3fc4bbe9548d4b4124d9d16/xtb.log","size":13380,"ext":".log","mtime":"2025-08-17T16:09:59","sha256":null},{"path":"artifacts/072845fdb3fc4bbe9548d4b4124d9d16/wbo","size":51,"ext":"","mtime":"2025-08-17T16:09:59","sha256":null},{"path":"artifacts/072845fdb3fc4bbe9548d4b4124d9d16/molden.log","size":12668,"ext":".log","mtime":"2025-08-17T16:09:59","sha256":null},{"path":"artifacts/072845fdb3fc4bbe9548d4b4124d9d16/xtbrestart","size":240,"ext":"","mtime":"2025-08-17T16:09:59","sha256":null},{"path":"artifacts/072845fdb3fc4bbe9548d4b4124d9d16/xtbtopo.mol","size":255,"ext":".mol","mtime":"2025-08-17T16:09:59","sha256":null},{"path":"artifacts/072845fdb3fc4bbe9548d4b4124d9d16/xtbopt.log","size":226,"ext":".log","mtime":"2025-08-17T16:09:58","sha256":null},{"path":"artifacts/aaf61a28131a4720aa5d2e522e0dc443/molden.input","size":952,"ext":".input","mtime":"2025-08-17T16:10:34","sha256":null},{"path":"artifacts/aaf61a28131a4720aa5d2e522e0dc443/charges","size":30,"ext":"","mtime":"2025-08-17T16:10:34","sha256":null},{"path":"artifacts/aaf61a28131a4720aa5d2e522e0dc443/input.xyz","size":43,"ext":".xyz","mtime":"2025-08-17T16:10:33","sha256":null},{"path":"artifacts/aaf61a28131a4720aa5d2e522e0dc443/xtb.log","size":13380,"ext":".log","mtime":"2025-08-17T16:10:33","sha256":null},{"path":"artifacts/aaf61a28131a4720aa5d2e522e0dc443/wbo","size":51,"ext":"","mtime":"2025-08-17T16:10:34","sha256":null},{"path":"artifacts/aaf61a28131a4720aa5d2e522e0dc443/molden.log","size":12668,"ext":".log","mtime":"2025-08-17T16:10:34","sha256":null},{"path":"artifacts/aaf61a28131a4720aa5d2e522e0dc443/xtbrestart","size":240,"ext":"","mtime":"2025-08-17T16:10:34","sha256":null},{"path":"artifacts/aaf61a28131a4720aa5d2e522e0dc443/xtbtopo.mol","size":255,"ext":".mol","mtime":"2025-08-17T16:10:34","sha256":null},{"path":"artifacts/aaf61a28131a4720aa5d2e522e0dc443/xtbopt.log","size":226,"ext":".log","mtime":"2025-08-17T16:10:33","sha256":null},{"path":"artifacts/test123/molden.input","size":952,"ext":".input","mtime":"2025-08-17T16:10:16","sha256":null},{"path":"artifacts/test123/charges","size":30,"ext":"","mtime":"2025-08-17T16:10:16","sha256":null},{"path":"artifacts/test123/input.xyz","size":34,"ext":".xyz","mtime":"2025-08-17T16:10:15","sha256":null},{"path":"artifacts/test123/xtb.log","size":13380,"ext":".log","mtime":"2025-08-17T16:10:15","sha256":null},{"path":"artifacts/test123/wbo","size":51,"ext":"","mtime":"2025-08-17T16:10:16","sha256":null},{"path":"artifacts/test123/molden.log","size":12668,"ext":".log","mtime":"2025-08-17T16:10:16","sha256":null},{"path":"artifacts/test123/xtbrestart","size":240,"ext":"","mtime":"2025-08-17T16:10:16","sha256":null},{"path":"artifacts/test123/xtbtopo.mol","size":255,"ext":".mol","mtime":"2025-08-17T16:10:16","sha256":null},{"path":"artifacts/test123/xtbopt.log","size":226,"ext":".log","mtime":"2025-08-17T16:10:15","sha256":null},{"path":"clients/requirements.txt","size":525,"ext":".txt","mtime":"2025-08-13T11:47:58","sha256":"50d976b6a179fc31577cc4cae9de54b766bda7a209c85b9f6c6bfa4db5b2c2b8"},{"path":"clients/tests_demo.py","size":18596,"ext":".py","mtime":"2025-08-13T11:47:58","sha256":"456d8c2fbef9dba7312203ffb021a3fb59d3782163eaa5151c66fda0a84eb45f"},{"path":"clients/nox_client.py","size":10369,"ext":".py","mtime":"2025-08-13T11:47:58","sha256":"de960e44294192d29bbb012ce2a13daa30eb2681b99d13f0c5394b9fd7444b80"},{"path":"config/prometheus-dev.yml","size":478,"ext":".yml","mtime":"2025-08-13T18:21:04","sha256":"8dfe37e210fc16ddb3f7b793f54d03baa33fbaee823b0b6dd162034795765bed"},{"path":"config/redis/sentinel2.conf","size":550,"ext":".conf","mtime":"2025-08-13T18:21:01","sha256":null},{"path":"config/redis/sentinel3.conf","size":552,"ext":".conf","mtime":"2025-08-13T18:21:01","sha256":null},{"path":"config/redis/sentinel1.conf","size":716,"ext":".conf","mtime":"2025-08-13T18:21:01","sha256":null},{"path":"docs/README.md","size":5216,"ext":".md","mtime":"2025-08-15T19:31:49","sha256":"8c9af1c8edaeaf7670ec7c0945114d5f8c1857f56e11ebd3086aa14ca845de70"},{"path":"docs/testing-status/M9.5_TESTING_STATUS.md","size":4632,"ext":".md","mtime":"2025-08-15T15:04:32","sha256":"52c130b8bfbc05250337ccc9992e35da72584d65b561aad19f506eabcc3e600a"},{"path":"docs/progress-reports/PROBLEM_RESOLUTION_REPORT.md","size":4988,"ext":".md","mtime":"2025-08-15T17:36:26","sha256":"0dda2384058775e3da0dd706f48f82cd74fc007f608829252de4a7d66c1e5a42"},{"path":"docs/progress-reports/P3_PROGRESS_REPORT.md","size":5537,"ext":".md","mtime":"2025-08-13T19:24:27","sha256":"a41e9acbf7f25fb50125fff5988d1dabfc12b5a522e96c97de4e72ac79e8d9d8"},{"path":"docs/progress-reports/PHASE2_PHASE3_PROGRESS.md","size":9164,"ext":".md","mtime":"2025-08-13T19:20:54","sha256":"17b61013df3e2567f5d41f0c7fa48045931b1674cec08686e743f39021831378"},{"path":"docs/progress-reports/STAGING_CHECKLIST_COMPLETION_REPORT.md","size":9907,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"81bc2f14333ffd78fde9098db440d44f08ad2744f9b8f300978c2db2ba44b6a2"},{"path":"docs/progress-reports/SECTION_4_COMPLETION_REPORT.md","size":12313,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"23ec0dedd6e1942255d7c266199cace7050b7f5685f266f82f09a591ff4144b6"},{"path":"docs/progress-reports/STEP24_PROGRESS.md","size":137,"ext":".md","mtime":"2025-08-13T14:10:56","sha256":"8c1593659ee73dc56694e5396fa70440cc925d8f5b8fa7875fa49e5133e41e5a"},{"path":"docs/progress-reports/COMPREHENSIVE_PROGRESS_REPORT.md","size":14796,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"455bbd6c34d5ecd4c26d35995d431e92375c09e59eb0ece64bf521cac2c9975f"},{"path":"docs/progress-reports/STEP25_PROGRESS.md","size":1715,"ext":".md","mtime":"2025-08-13T15:40:32","sha256":"8ac3d42d199b901a3af5e8def792728c05674305e5481445d16a28d14c586a11"},{"path":"docs/progress-reports/SECTION_3_COMPLETION.md","size":7723,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"da4988a0c517db77b1cad88b9e9394c060e27d741a65e307b5b81ef6cde6e992"},{"path":"docs/progress-reports/M9_PROGRESS_TRACKER.md","size":10418,"ext":".md","mtime":"2025-08-15T14:44:43","sha256":"e86288ddbae86de799f18748bd86312ade6fbba62122a63f4f9f647b6700fdd6"},{"path":"docs/progress-reports/SECTIONS_1_2_COMPLETION.md","size":6424,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"c564aa2c70c827b6b4694231d06a7d1a3020374cd1581b1d36bc5b603ecadbcb"},{"path":"docs/milestone-reports/P3.1_COMPLETION_REPORT.md","size":6729,"ext":".md","mtime":"2025-08-13T18:21:01","sha256":"44c059d984c8da1d96207b8ad32e7eff57fecd122157400a45d482fee3345e54"},{"path":"docs/milestone-reports/STEP7_COMPLETION_REPORT.md","size":11597,"ext":".md","mtime":"2025-08-13T12:17:07","sha256":"1c7c8d05dc3b95b3fbcc60eac3c6706b92e6812d04d360584f0c1833117fa1ce"},{"path":"docs/milestone-reports/M9.2_COMPLETION_SUMMARY.md","size":10055,"ext":".md","mtime":"2025-08-15T13:25:34","sha256":"7b659963df0c8db278d6627828e56191e31b45c0621387c78295055f8ee3f778"},{"path":"docs/milestone-reports/M9.1_SUMMARY.md","size":4943,"ext":".md","mtime":"2025-08-13T19:50:57","sha256":"490cbb4f2337e915b203d1f3ef926e40b618a76d4eaf515ed34d80a76a23fb0a"},{"path":"docs/milestone-reports/M7_COMPLETION_SUMMARY.md","size":8753,"ext":".md","mtime":"2025-08-13T17:06:47","sha256":"fabf528ccb3f8c7158a01de498f6c730994110ca7feaa32a497a81a8bec7245c"},{"path":"docs/milestone-reports/STEP4_COMPLETION_REPORT.md","size":6986,"ext":".md","mtime":"2025-08-13T11:41:18","sha256":"244254bce325cb6b484036efc626630a38be5e4df43f7a2c2eecb6f3684dd689"},{"path":"docs/milestone-reports/M9.5_COMPLETION_SUMMARY.md","size":9123,"ext":".md","mtime":"2025-08-15T14:32:44","sha256":"02d78ff4d08647664262d09864f4bba6c7c94c07ed52f12b7cbb78eaded95478"},{"path":"docs/milestone-reports/STEP6_COMPLETION_REPORT.md","size":10039,"ext":".md","mtime":"2025-08-13T11:57:22","sha256":"df109c368e399c171df5f5a006dc8730459b91a0cde2f81d382b76b0dcef80ea"},{"path":"docs/milestone-reports/M6_COMPLETION_SUMMARY.md","size":6854,"ext":".md","mtime":"2025-08-13T17:06:47","sha256":"cbb10c709c853d5e8ab79a1bb6a798866c44958b2d99c8aef88c99d15d6452ef"},{"path":"docs/milestone-reports/STEP21_COMPLETION_REPORT.md","size":6329,"ext":".md","mtime":"2025-08-13T13:24:03","sha256":"7f527aa48066498347c433947ff8a3883ca94aceb2cde2eb186f6713d0a61f98"},{"path":"docs/milestone-reports/STEP23_COMPLETION_REPORT.md","size":8926,"ext":".md","mtime":"2025-08-13T13:59:31","sha256":"bdb7b89b3ca331ecadadfd10486633414ca1383dde745e6595b36a0a4dbad196"},{"path":"docs/milestone-reports/M9.4_COMPLETION_SUMMARY.md","size":7903,"ext":".md","mtime":"2025-08-15T14:32:43","sha256":"bf1fcc661b8b5191ff9ce24a44aa86f936d3bed116b01d9aa0b250e30914b687"},{"path":"docs/milestone-reports/P3.2_COMPLETION_REPORT.md","size":12905,"ext":".md","mtime":"2025-08-13T19:20:54","sha256":"f2c89c61318a751a0691c7ff37413c15aca97aa76b7264f7716860c2afb6dded"},{"path":"docs/milestone-reports/M8_COMPLETION_SUMMARY.md","size":6437,"ext":".md","mtime":"2025-08-13T18:21:01","sha256":"51336c59547e0ac9f5068225a7c2f8e9a4a269ba57af232eb68baf1e881f1519"},{"path":"docs/milestone-reports/M9.5_ADVANCED_UI_COMPLETE.md","size":6430,"ext":".md","mtime":"2025-08-15T15:04:32","sha256":"9a7ea8388c7d84f874c99a11f3eb267bfe5bf8d3c23330b22b1d29ee5f5bbe8f"},{"path":"docs/milestone-reports/COMPLETION_REPORT.md","size":5294,"ext":".md","mtime":"2025-08-13T10:56:14","sha256":"9a11ea493b68157ac3ce0413f0ad92e206ea3bcafac54ae7aba63cd6036f7eed"},{"path":"docs/milestone-reports/STEP3_COMPLETION_REPORT.md","size":5352,"ext":".md","mtime":"2025-08-13T11:04:45","sha256":"9646d16e342cdddd145307ac30be01d57cfdb45e78c2c61edb436e5f6c893c18"},{"path":"docs/milestone-reports/M5X_COMPLETION_SUMMARY.md","size":2586,"ext":".md","mtime":"2025-08-13T17:06:47","sha256":"2827ec22cb766048e109777a126202408a943e23eb1cdf9ab8bb7398ab40819f"},{"path":"docs/milestone-reports/M9.3_COMPLETION_SUMMARY.md","size":5757,"ext":".md","mtime":"2025-08-15T14:32:43","sha256":"41f5a131763d006dfee9a57806a99d9b71225fa7d2e88d4a94505c01a10854c3"},{"path":"docs/milestone-reports/M9.6_PERFORMANCE_COMPLETE.md","size":9014,"ext":".md","mtime":"2025-08-15T14:32:45","sha256":"c583bb4c1af00d04e91ceae287bc10a6f8c91d553d10d79a6933b72832c406c3"},{"path":"docs/milestone-reports/STEP5_COMPLETION_REPORT.md","size":10572,"ext":".md","mtime":"2025-08-13T11:47:58","sha256":"8316e93f4f3fcf8f83126ea0498d63e0fb054ca29ff7db36ddf072d0679445d7"},{"path":"docs/planning/UNIFIED_PLAN_PHASE2.md","size":7471,"ext":".md","mtime":"2025-08-13T12:40:08","sha256":"ab61f60f5e89ab0f25b49d97c9016435b66d2d692d7ed70e902799a176bf65b0"},{"path":"docs/planning/PROJECT_NEXT_STEPS.md","size":1694,"ext":".md","mtime":"2025-08-15T15:04:32","sha256":"fdef8371177275d61c85c56bdee6431e5c0608bc15cfc3b766c79d465027160e"},{"path":"docs/planning/PROMPT_COPILOT_NEXT_STEPS.md","size":1474,"ext":".md","mtime":"2025-08-15T15:04:32","sha256":"13884a3c32afd9705a5d58ad829e5f2164bf2b701d1acf62f1230fa53743577f"},{"path":"docs/planning/M6_AUDIT_PLAN.md","size":3893,"ext":".md","mtime":"2025-08-13T17:06:47","sha256":"ed40e9ee51bc3affebe511a303da074aa56eb595ee346a7e2e13f9385cabc441"},{"path":"docs/planning/COPILOT_PLAN.md","size":19945,"ext":".md","mtime":"2025-08-13T10:21:11","sha256":"b092c38bde05964bc28af4c2b77326f315d10cd7912a79400abe8b289c7f09b3"},{"path":"docs/planning/M7_FINAL_VERIFICATION.md","size":7858,"ext":".md","mtime":"2025-08-13T17:06:47","sha256":"b0d6778e05c0c838c78ff909245969fc9dc268d71b54c797f209f39856bc705a"},{"path":"docs/planning/PHASE3_IMPLEMENTATION_PLAN.md","size":10892,"ext":".md","mtime":"2025-08-13T18:21:01","sha256":"7a1632f63157824ddd722d1ab3440e47baf593605037367f388080f21fcc2a31"},{"path":"docs/planning/M7_OAUTH2_PLAN.md","size":5156,"ext":".md","mtime":"2025-08-13T17:06:47","sha256":"0cf55bf113098974fb7ae1a5cb27a96fbfae598225b90fe2cd7d8ed5a7cc0e9e"},{"path":"docs/planning/AssistantDevOps.md","size":2954,"ext":".md","mtime":"2025-08-13T11:58:34","sha256":"0064dc229e3192748456c3cabd9611922b3b4b0fbd29e58ef094f1749b41d338"},{"path":"docs/planning/CONNECTING_NOX_IAM.md","size":1390,"ext":".md","mtime":"2025-08-15T15:04:32","sha256":"a170c41fb16904041aa14464a82e09d8aa2056d57617a0f43a475704329470c3"},{"path":"docs/planning/M8_DOCKER_CICD_PLAN.md","size":9351,"ext":".md","mtime":"2025-08-13T18:21:01","sha256":"1984a050f3405ae826bd41213acbeeab25fb95ddebf980a70930e940ac92fe17"},{"path":"docs/planning/IMMEDIATE_NEXT_STEPS.md","size":7078,"ext":".md","mtime":"2025-08-13T12:33:44","sha256":"0887b8f23534221b93cfbbc1863f5f2eaf311506aa97389a5f46da472cadcbc0"},{"path":"docs/planning/PHASE2_ROADMAP.md","size":8875,"ext":".md","mtime":"2025-08-13T12:33:44","sha256":"50a6d0a79ff2952c6d09ac51b0df821cc6da99a3d39f125458dc28e59f1063dd"},{"path":"docs/testing/NOX_INTERACTIVE_TESTING_CHECKLIST.md","size":7048,"ext":".md","mtime":"2025-08-15T15:04:32","sha256":"f2402c265688a36d08beff38eee27dbb42c24c1b2643ac1e11d481924a74c44c"},{"path":"docs/session-reports/SESSION_COMPLETION_REPORT_M9.2.md","size":0,"ext":".md","mtime":"2025-08-15T17:35:36","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs/session-reports/SESSION_COMPLETION_REPORT_M9.5_ADVANCED_UI.md","size":7041,"ext":".md","mtime":"2025-08-15T15:04:32","sha256":"759e1cd18dee103124558567ccc8af203f6c0d4da7cbff887082b7c7bb6f89c4"},{"path":"docs/session-reports/SESSION_COMPLETION_REPORT_M9.3.md","size":7073,"ext":".md","mtime":"2025-08-15T14:32:43","sha256":"3da1a35702c8a305ea5a53abc04753d755db6fd6bb9ae082275af6be790cfff7"},{"path":"docs/session-reports/SESSION_COMPLETION_REPORT_M9.5.md","size":7178,"ext":".md","mtime":"2025-08-15T14:32:44","sha256":"d060a9e3fe07f30c3d1206aad1d6a0862d065ee0169a507fcf7ed1e434b1b80d"},{"path":"docs/session-reports/SESSION_COMPLETION_REPORT_M9.4.md","size":7817,"ext":".md","mtime":"2025-08-15T14:32:43","sha256":"f3d2b849e92acf10039879c9ce2ebb7040ac9924a4326d3f2485b297704284a1"},{"path":"docs/deployment-guides/PRODUCTION_DEPLOYMENT_GUIDE.md","size":8913,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"0330e157ff8a60c395c596ebd16e0a6cccbc511de53fce5bb48b2ad72ce561f9"},{"path":"docs/deployment-guides/DEPLOYMENT.md","size":7316,"ext":".md","mtime":"2025-08-13T14:10:56","sha256":"b7937cefe91c4b5d0616ec918aa5eb10d2a3ec415e25164721914467f2735bd0"},{"path":"docs/deployment-guides/ENHANCED_DEPLOYMENT_GUIDE.md","size":45347,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"02f183da60fa8393accf45ea05022564e5e0fa168c0b37b9676e22e4a2cc5222"},{"path":"docs/deployment-guides/PRODUCTION_CREDENTIALS_GUIDE.md","size":8922,"ext":".md","mtime":"2025-08-15T17:51:52","sha256":"99288162da3fc7f9c1de78dd8cf922138bbc5d2cbb0c5a112f0ebcec3846f9b3"},{"path":"docs/deployment-guides/DEPLOYMENT_GUIDE.md","size":12843,"ext":".md","mtime":"2025-08-13T18:21:01","sha256":"d6ddf294eb40d439c7255869c4ca5b9a28c57cd7e11504204ecb8af30e37b956"},{"path":"docs/deployment-guides/STAGING_VALIDATION_RELEASE_CHECKLIST.md","size":19066,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"03900b6a02d0443534e3096ff6dee58d8b2cd1b1e45f034204dc018222d36fe0"},{"path":"docs/deployment-guides/DEPLOYMENT_STATUS_TRACKER.md","size":6091,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"65d79f17240084ec0675fc691b3ce0bf96eeb47d95b500173cda0ca8e9456278"},{"path":"docs/deployment-guides/OAUTH2_GUIDE.md","size":6574,"ext":".md","mtime":"2025-08-13T14:18:15","sha256":"6db9aff4d8bac767c8c2784a38b915d869ad09fef48aed7d9175baf9c14e5610"},{"path":"docs/deployment-guides/OPS_QUICK_COMMAND_CARD.md","size":2901,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"435fe47e341cac8a32384038734ba683609dda0caeee42de1fb81512d2fefdec"},{"path":"docs/deployment-guides/OPS_RELEASE_DAY_RUNBOOK.md","size":10315,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"63dc156a52801dfc16943d56927ccfcb27d4030c8669f48855619c8a841c3616"},{"path":"docs/phase-specifications/P3.2_AIIAM_SPEC.md","size":11010,"ext":".md","mtime":"2025-08-13T19:20:54","sha256":"c1d8c02d4316c75bc7e4c3a8866e90a8c01968b6fd63b3a49db81a2972b6510e"},{"path":"docs/phase-specifications/P3.1_MULTINODE_SPEC.md","size":12745,"ext":".md","mtime":"2025-08-13T18:21:01","sha256":"d35a92dc59b62ec433a522d75e1c1df3d97e608ce4ae32c61bc22afb3a289391"},{"path":"docs/phase-specifications/P3.3_UXDEV_SPEC.md","size":14968,"ext":".md","mtime":"2025-08-13T19:20:54","sha256":"cb741d70cf31d6ba6d108fe627b26fac6e01e9b700ecda6a88b2aef9733ca496"},{"path":"docs/phase-specifications/P3.3_TYPESCRIPT_SDK_COMPLETE.md","size":8289,"ext":".md","mtime":"2025-08-13T19:20:54","sha256":"6a3e4c429892e87bf72d27b9f36941aeb8bfadf270f0e20fc129380e9592a19d"},{"path":"observability/metrics.py","size":9113,"ext":".py","mtime":"2025-08-13T13:24:03","sha256":"d654d69875598bdb4e0a21834b0936b3167f4691b32c3edfd3edef2ca94e8cf7"},{"path":"observability/metrics_backup.py","size":9113,"ext":".py","mtime":"2025-08-13T13:12:45","sha256":"d654d69875598bdb4e0a21834b0936b3167f4691b32c3edfd3edef2ca94e8cf7"},{"path":"observability/simple_metrics.py","size":4843,"ext":".py","mtime":"2025-08-13T13:24:03","sha256":"523450b2504160ffc15273fa4bd69500010187a0c8d3c68e2d9533a972d95bbe"},{"path":"observability/middleware.py","size":880,"ext":".py","mtime":"2025-08-13T13:32:23","sha256":"396b8400fcdb69fab67743d75e505a72af85db34eb1d8d163553ace04918b563"},{"path":"observability/metrics_chatgpt.py","size":1240,"ext":".py","mtime":"2025-08-13T14:54:17","sha256":"36b9e02a565ebfed0b48fbf7362a6f989bff8aae12a94a780fbf8732552c89e1"},{"path":"archive/old-api-versions/nox_api_v5_fixed.py","size":12620,"ext":".py","mtime":"2025-08-13T16:01:46","sha256":"4fad4113c89d1825b48f7d7d447f2eac2b3e9a4c7ed3b8ec7068cc8505f3690e"},{"path":"archive/old-api-versions/nox_api_v7_fixed.py","size":9237,"ext":".py","mtime":"2025-08-13T17:06:47","sha256":"956568b2b5cbc0f04409b7c4b8bc1346c3c44dca8c03be74a4e6e8c8d8725f2c"},{"path":"archive/old-api-versions/nox_api_v5_quotas.py","size":12170,"ext":".py","mtime":"2025-08-13T16:01:46","sha256":"93589d4a4c2746df8ffaba6520175c7606cd2909bc91b6a7a5de5a87fa83ad81"},{"path":"archive/old-api-versions/nox_api_m6.py","size":13443,"ext":".py","mtime":"2025-08-13T17:06:47","sha256":"74d9ad36bcb712f8061b0e32a99d441b22766f9873715ff82a01c1d3021ab740"},{"path":"archive/old-api-versions/nox_api_v7.py","size":14090,"ext":".py","mtime":"2025-08-13T17:06:47","sha256":"ae99548e2b07351015f6210a70313afb9dcce75009b2e44ec61b21cbf7496c96"},{"path":"archive/old-configs/Dockerfile.dev","size":1463,"ext":".dev","mtime":"2025-08-13T18:21:04","sha256":null},{"path":"archive/old-configs/Dockerfile.api","size":1554,"ext":".api","mtime":"2025-08-13T14:54:17","sha256":null},{"path":"archive/old-configs/Dockerfile.dashboard","size":1274,"ext":".dashboard","mtime":"2025-08-13T14:10:56","sha256":null},{"path":"archive/legacy-tests/test_quotas.py","size":2627,"ext":".py","mtime":"2025-08-17T15:46:07","sha256":"088cc72c7d234d159b1cd802a3cddd664ba7ead02986105a1b9de107c8117137"},{"path":"archive/legacy-tests/test_phase21.sh","size":1970,"ext":".sh","mtime":"2025-08-13T13:24:03","sha256":"444ed97daa028c939efcf222632f84cdf4ffab00c2e6db51f8916964396b87d3"},{"path":"archive/legacy-tests/test_quota_api.py","size":4877,"ext":".py","mtime":"2025-08-13T15:40:32","sha256":"3209daf15f2dd6605e365ca6b2fc425eccf4570aa875b218ee66a553a069f10b"},{"path":"archive/legacy-tests/test_metrics_debug.py","size":514,"ext":".py","mtime":"2025-08-13T16:01:46","sha256":"58322c76d6756772f6ccbecf9323f74ccf8e11360b2aad09939fb1ca5135474e"},{"path":"archive/legacy-tests/test_repair_simple.sh","size":425,"ext":".sh","mtime":"2025-08-13T10:56:14","sha256":"42dc49342ffc2d03822caf9278bafeb33585779e631c950e0f6e5b5812104847"},{"path":"archive/legacy-tests/test_middleware_debug.py","size":1853,"ext":".py","mtime":"2025-08-17T15:46:07","sha256":"3059b4efec97b65c53941379c0f0f3b97b710574725a4f21709fccea158c626a"},{"path":"archive/legacy-tests/test_script.py","size":140,"ext":".py","mtime":"2025-08-13T12:17:07","sha256":"c1fcfd893de7c826315119c5f434c87ab5a9637a633c0db852ad32541ef8074d"},{"path":"archive/deprecated-scripts/debug-api.sh","size":2097,"ext":".sh","mtime":"2025-08-13T14:54:16","sha256":"6dc49e49b11d0c0de5b83edd14a87bafc590f64578d328c3f408c839721ee2a2"},{"path":"archive/deprecated-scripts/fix_nox_layout.sh","size":2486,"ext":".sh","mtime":"2025-08-13T08:36:16","sha256":"1fd96e1881eae185c21ae640f7d3a6ab114077ba7dcfa6fa7ae0f25213d3ce1f"},{"path":"archive/deprecated-scripts/test-oauth2.sh","size":8382,"ext":".sh","mtime":"2025-08-13T14:18:15","sha256":"636448c63625a3ccc75faff0943a0bd7ca6207689ecff193d36674ec1d9c9222"},{"path":"archive/deprecated-scripts/validate_nox.sh","size":4664,"ext":".sh","mtime":"2025-08-13T10:56:14","sha256":"80682dee542779b8d7d140d09c76c06260b09edb56e8b4400cf678ce24eb2df9"},{"path":"archive/deprecated-scripts/validate_performance.sh","size":1577,"ext":".sh","mtime":"2025-08-15T15:55:55","sha256":"8dc9711375461ce1402316e768e62eaaf1695e5d62c7cbcf9f9ca19949cf00a7"},{"path":"archive/deprecated-scripts/test-deployment.sh","size":8708,"ext":".sh","mtime":"2025-08-13T14:10:56","sha256":"045ab0b67255f88558b440264b56c9aafb66beb7d6bf0bc294f497da50b58f1e"},{"path":"archive/deprecated-scripts/health-check-production.sh","size":9869,"ext":".sh","mtime":"2025-08-15T16:18:41","sha256":"8749f788fc5e3d3fb40ce4cc29c0fd7aa27990e363fa4fc2c23cbf8afe271c95"},{"path":"archive/deprecated-scripts/deploy-production.sh","size":8733,"ext":".sh","mtime":"2025-08-15T18:04:01","sha256":"5736848a0660f4193c5aeff38a68e7dcd32714f9348f9042acca30c6d6c61a35"},{"path":"quotas/metrics.py","size":6564,"ext":".py","mtime":"2025-08-13T15:24:06","sha256":"f5466bad326e42b0b25077fa730c104bff3c39169adfc075e9d82588d5ed83e9"},{"path":"quotas/models.py","size":3610,"ext":".py","mtime":"2025-08-13T15:24:06","sha256":"5c28cc396bbcca726d0f4551571a844a50f3dc0a956d119b5f7aba7111c87c5f"},{"path":"quotas/routes.py","size":8154,"ext":".py","mtime":"2025-08-13T16:01:46","sha256":"03a88c892534e018fd2d52ac77fb06a88570350603003b3dbd9c4668d5cd74da"},{"path":"quotas/database.py","size":13692,"ext":".py","mtime":"2025-08-13T15:40:32","sha256":"fd9383b5e0622f294ae6509cb96a533668741a52c104dd087f4cccf8af6b70a6"},{"path":"quotas/middleware.py","size":13712,"ext":".py","mtime":"2025-08-13T15:40:32","sha256":"4b90163234dd30589e4d0c612a3e82cdde584ff4d226fe15a480fe46c2a8f447"},{"path":"quotas/__init__.py","size":1074,"ext":".py","mtime":"2025-08-13T15:24:06","sha256":"60d628e0fbf6c05726afeda7f351b9f90fe7ccc13d1014f9864eaa722590589f"},{"path":"quotas/migrations.py","size":8365,"ext":".py","mtime":"2025-08-13T15:24:06","sha256":"6f557614b32a81d0aaa9253443cd5f495e04ca8b18101be68fa76915dddd5f13"},{"path":"dashboard/app_v24.py","size":13789,"ext":".py","mtime":"2025-08-13T14:18:15","sha256":"c180379a239de6d98d1adf06a09cbabdc31c23f14bc2887e66f13f182e7ae492"},{"path":"dashboard/app_v23.py","size":16152,"ext":".py","mtime":"2025-08-13T13:59:31","sha256":"263de6dfb7323dda7d246735ce4b9812d3de16bdef851e9aa0f6736d7c82a409"},{"path":"dashboard/client_v23.py","size":6200,"ext":".py","mtime":"2025-08-13T13:59:31","sha256":"cb0f626284314a78ef893c5efcb4d8af74b0d371c357486a5a8659b57f68bf29"},{"path":"dashboard/oauth2_client.py","size":7014,"ext":".py","mtime":"2025-08-13T14:18:15","sha256":"f41eb2a94575783151c5b15bacf3eed141a28f27ced0a66139aaff4bb54e0ec8"},{"path":"dashboard/client.py","size":2155,"ext":".py","mtime":"2025-08-13T13:37:57","sha256":"9309e969374856e099e1671bb6685a191cb4ba04f7acd83abb7e4a19d7761d4b"},{"path":"dashboard/app.py","size":8683,"ext":".py","mtime":"2025-08-13T13:37:57","sha256":"ee8b2255487aee5fc87919108974b0465f61a9a6177946e092ddaec6db7401c5"},{"path":"reports/nox_api_src_audit.md","size":77216,"ext":".md","mtime":"2025-08-17T16:53:05","sha256":"f91466be63180628fdd63d8f8f69fa342ae9db183cfe212bab6fb31a3c32ba57"},{"path":"reports/M53_DEBUG_FIXES_A.md","size":2026,"ext":".md","mtime":"2025-08-13T16:01:46","sha256":"d1c744cc796206904f32bf7b920836461eda865fff3cd3faaf9beb1a835290a0"},{"path":"migrations/v8_to_v8.0.0.sql","size":14491,"ext":".sql","mtime":"2025-08-15T17:09:28","sha256":"b689ae017db06a72042d45c791345f271d18bc404208078905b2a77eff0d8c1c"},{"path":"api/main.py","size":307,"ext":".py","mtime":"2025-08-17T15:46:05","sha256":"e76c1d3af269fad563f738b229442bfc46f5cfdc6b1f00fbde8bd5abd4e1e3c9"},{"path":"api/database_manager_multinode.py","size":16272,"ext":".py","mtime":"2025-08-13T18:21:01","sha256":"c05dacdc622af896b16c70fdf68e10ac3d71113d562c150cbdb0ebab10b14d7c"},{"path":"api/session_manager_distributed.py","size":17393,"ext":".py","mtime":"2025-08-13T18:21:01","sha256":"181c38d45899237ed721cbb355abc2087d3d9ee25bd4011a0b886235b6fa663a"},{"path":"api/multinode_integration.py","size":16939,"ext":".py","mtime":"2025-08-13T18:21:01","sha256":"3da87980b1d3cfa00cf15348f77445a9f3616c11be86e26eb3458ba3e630d6e5"},{"path":"api/__init__.py","size":0,"ext":".py","mtime":"2025-08-17T15:28:04","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"api/services/storage.py","size":186,"ext":".py","mtime":"2025-08-17T15:46:05","sha256":"be5aa332a99a5ef3e8749856c762fb279e1208cf0ff8aa6fee39e60e92694e9e"},{"path":"api/services/queue.py","size":168,"ext":".py","mtime":"2025-08-17T15:46:05","sha256":"75e4309c23a9a30355d1f42966ff690c44e5ab1b88464644e94e120fcda92efa"},{"path":"api/services/sse.py","size":657,"ext":".py","mtime":"2025-08-17T15:46:05","sha256":"2bdf6d7aa5faefe1cdf56bdaea5b621e4d9d563e00427943374f71f3bf53539b"},{"path":"api/services/settings.py","size":439,"ext":".py","mtime":"2025-08-17T16:06:21","sha256":"ca02d4ee28b56ff70daad22669e13ba65d5b1525535865779cb5ed553ef4be34"},{"path":"api/services/__init__.py","size":0,"ext":".py","mtime":"2025-08-17T15:28:11","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"api/schemas/result.py","size":322,"ext":".py","mtime":"2025-08-17T15:46:05","sha256":"376f42e4df7433a7a2fa44e36daa7ffebd1ce2a7bf249ff275afadadbc684af0"},{"path":"api/schemas/job.py","size":555,"ext":".py","mtime":"2025-08-17T15:46:05","sha256":"4943ee238c515c7880b16b609f3bf842550b48437aa3f39243913dca5fec1473"},{"path":"api/schemas/__init__.py","size":0,"ext":".py","mtime":"2025-08-17T15:28:09","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"api/routes/jobs.py","size":3095,"ext":".py","mtime":"2025-08-17T16:27:23","sha256":"24674acc8cab6655556b6ab7451c01aa939f14ed3fab028309fc014ec0a88c1d"},{"path":"api/routes/__init__.py","size":0,"ext":".py","mtime":"2025-08-17T15:28:06","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"ai/ai_coordinator.py","size":33017,"ext":".py","mtime":"2025-08-13T19:20:54","sha256":"b7e1c0dd129d029ace2dc8df88bc06ebd4443ca0230fa5c93191cf6a934e0634"},{"path":"ai/policy_engine.py","size":35209,"ext":".py","mtime":"2025-08-13T19:20:54","sha256":"30a7ce3abc2a32a3bef6aa79361dc4dbaf7abc95b6f2937502a33b237e60dd6d"},{"path":"ai/biometric_auth.py","size":47662,"ext":".py","mtime":"2025-08-13T19:20:54","sha256":"697c12baab2f52024f4de2c12f3ec3065cde5975aeb9eefe1d27c4281c5bd9c4"},{"path":"ai/security_monitor.py","size":27703,"ext":".py","mtime":"2025-08-13T19:20:54","sha256":"1d383d6ae458c2ac042f0179b857f63bcdcaa9f9d918f859f20a143a3e8360db"},{"path":"ai/__init__.py","size":0,"ext":".py","mtime":"2025-08-17T15:28:13","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"ai/runners/xtb.py","size":6602,"ext":".py","mtime":"2025-08-17T16:06:21","sha256":"18c05ef765278bff1caae883f2d7c3b0f8a9ddc6ee865179e6f79439295003ad"},{"path":"ai/runners/__init__.py","size":0,"ext":".py","mtime":"2025-08-17T15:28:15","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"policy/policies.yaml","size":3510,"ext":".yaml","mtime":"2025-08-13T13:00:24","sha256":"a90195743d7102c9f1de2efaaa292e8e1534c880d0831a58951ccff028a58f7e"},{"path":"auth/dependencies.py","size":5094,"ext":".py","mtime":"2025-08-13T13:59:31","sha256":"1a871b18f70561dc9830c8b8b4497ccc7bf91b68df281df70d77afeacdc999b9"},{"path":"auth/schemas.py","size":2417,"ext":".py","mtime":"2025-08-13T13:59:31","sha256":"8141121814dad694016656367e64d31716be37f5ab7edd89733df527250b2615"},{"path":"auth/models.py","size":6871,"ext":".py","mtime":"2025-08-13T13:59:31","sha256":"bc96951985135fa446535d91aeeb474f5ab94ba101c0c8c6fd5c4811846f3afd"},{"path":"auth/routes.py","size":7291,"ext":".py","mtime":"2025-08-13T13:59:31","sha256":"44fd0774e8bcdde5d88e10d6fc815d31d5fbf63e6e1ebc6cb01af699300ca36f"},{"path":"auth/utils.py","size":5679,"ext":".py","mtime":"2025-08-13T13:59:31","sha256":"340b4c249865edb431a9a9bf620756ce8cde194ee440f782be4f7ea7885d0d39"},{"path":"auth/__init__.py","size":778,"ext":".py","mtime":"2025-08-13T13:59:31","sha256":"b2416364ae4fcd5081deb56952254ec2bd5951dcaafb44037535a23e1b3d27cd"},{"path":"scripts/nox_audit.py","size":16829,"ext":".py","mtime":"2025-08-17T17:12:04","sha256":"2190a178939817e7f87ba558b1a467b40e4df560028008ad2e7b08f5ee379b9a"},{"path":"scripts/deploy.sh","size":7554,"ext":".sh","mtime":"2025-08-13T18:21:01","sha256":"881559171466602a690d5e54b8f5b8b6ace7039794979940ce5fe0b713d9bc40"},{"path":"scripts/noxctl-completion.bash","size":3528,"ext":".bash","mtime":"2025-08-13T12:52:57","sha256":"790cf82d32c50d19190c6bc8ca31dc21f073fea4f4a71b47f39b2b499c9f64c1"},{"path":"scripts/rate_limit_dashboard.py","size":1012,"ext":".py","mtime":"2025-08-15T19:31:49","sha256":"84ed83a682d0121757fc192769e90248ac9c99f43cebf7ce2a9bc1ad832d248b"},{"path":"scripts/init-db.sql","size":5229,"ext":".sql","mtime":"2025-08-13T14:10:56","sha256":"d0c01533f1ae8b942664ec3aa284e985c6baf80197050c46ba9b3c5287ca4679"},{"path":"scripts/check_markdown_links.py","size":1532,"ext":".py","mtime":"2025-08-15T19:00:14","sha256":"3d35437bab8c2098db908d389df45ae3745f96fa4536c1ac687d4c683c68295c"},{"path":"scripts/validate_staging.sh","size":18807,"ext":".sh","mtime":"2025-08-15T17:09:28","sha256":"55a100ed802228c79630291b683e43941e5b2bf691fa348547af9be35236e41e"},{"path":"scripts/test_metrics.sh","size":2010,"ext":".sh","mtime":"2025-08-13T13:24:03","sha256":"001b6df50231c10f6ae32ceb4c78e278e72a6da29d8f2e49b2c1a6904930db86"},{"path":"scripts/verify_env.py","size":13223,"ext":".py","mtime":"2025-08-15T17:25:51","sha256":"099e0a58f2728b4dccad023c4cbb47c2610741c5b7143505497c28b4966c3514"},{"path":"scripts/deploy_redis_cluster.sh","size":9648,"ext":".sh","mtime":"2025-08-13T18:21:01","sha256":"9b4e936b0d7080c1f969b6fa1e54b2f68dc71d84a33f81d0931545286f6ce598"},{"path":"scripts/load-test.js","size":10369,"ext":".js","mtime":"2025-08-15T17:09:31","sha256":"3cf1db71a5f21928beff62f18b81bfca08c1c9e370130c1e7018c2118266e22a"},{"path":"scripts/noxctl","size":19866,"ext":"","mtime":"2025-08-13T13:00:24","sha256":null},{"path":"scripts/backup_restore_cli.py","size":1668,"ext":".py","mtime":"2025-08-15T19:31:49","sha256":"df42405c8957a244d076bc823b7b188e48f52b997f312ce94cb58cae8a5b83cd"},{"path":"scripts/test_redis_cluster.py","size":3510,"ext":".py","mtime":"2025-08-13T18:21:04","sha256":"dbb5f289a08b02cf9377b56b67d3ed804ed317f6a4849b903eeff2098e4c2518"},{"path":"scripts/search_docs.py","size":1121,"ext":".py","mtime":"2025-08-15T19:31:49","sha256":"aea59ff1e0195efba0ec45c08c85fcf603d7f54095f49a285e03166617e9185a"},{"path":"scripts/onboarding_wizard.py","size":1654,"ext":".py","mtime":"2025-08-15T19:31:49","sha256":"2e8edd5c5362c38d20e49a7c22e52e63e2ff81342d4a5df520c5456948e65ace"},{"path":"scripts/test_dashboard_auth.py","size":5982,"ext":".py","mtime":"2025-08-13T13:59:31","sha256":"fc3be237593643df350910516d46543e745de2c469f2265727a72a8d9df06f07"},{"path":"scripts/test_dashboard.sh","size":1852,"ext":".sh","mtime":"2025-08-13T13:37:57","sha256":"28a037fc749624a3b332f07e0893dc45fc7b3f4a8fbec7bdf924fc3b4a9ac39f"},{"path":"scripts/test_auth.sh","size":4570,"ext":".sh","mtime":"2025-08-13T13:59:31","sha256":"cfd151de87dcdc7eb216a2bd9b96c6ee1c745d746ab8b6e8a7bc506db0080755"},{"path":"scripts/rollback.sh","size":10268,"ext":".sh","mtime":"2025-08-13T18:21:01","sha256":"4251ea1eba3c52c6fa9faa8740df1d5ac767b469e153a60a9bc02de319299909"},{"path":"scripts/demo_auth.py","size":5774,"ext":".py","mtime":"2025-08-13T13:59:31","sha256":"a6834d438241806aa7bc117aaf82ec86fe8e5c09487766b712d9951a67884430"},{"path":"scripts/backup.sh","size":13914,"ext":".sh","mtime":"2025-08-13T18:21:01","sha256":"b6c105c047ddf5fb7e0350252884160cbc8c6114e1bffcda27df4d07fc1940c2"},{"path":"scripts/metrics_dashboard.py","size":1623,"ext":".py","mtime":"2025-08-15T19:31:49","sha256":"de8051db4a2be521ade397682842a9bbcc5f5c47ea2dd9393e02ddb3bdfd8850"},{"path":"scripts/health-check.sh","size":11813,"ext":".sh","mtime":"2025-08-13T18:21:01","sha256":"b380a1dd193f30003d7895f9d2d84b6974aad300d5543880bff5fa618ef3116c"},{"path":"logs/nox_api_v7.log","size":0,"ext":".log","mtime":"2025-08-13T16:55:38","sha256":null},{"path":"logs/audit.jsonl","size":161017,"ext":".jsonl","mtime":"2025-08-13T16:43:39","sha256":null},{"path":"monitoring/prometheus.yml","size":0,"ext":".yml","mtime":"2025-08-15T12:45:10","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"monitoring/alert_rules.yml","size":0,"ext":".yml","mtime":"2025-08-15T12:45:11","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"monitoring/quota_alert_rules.yml","size":0,"ext":".yml","mtime":"2025-08-15T12:45:14","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"sdk/python/requirements.txt","size":393,"ext":".txt","mtime":"2025-08-13T19:20:54","sha256":"fba6412a49d07152f1acf53571bc9c6bb959c2978ba44e6970caed57f7035689"},{"path":"sdk/python/setup.py","size":3700,"ext":".py","mtime":"2025-08-13T19:20:54","sha256":"9fb63d091a7d54c9b65883304b0776ef1ae7b5b2a9d9f673b09438b34451a077"},{"path":"sdk/python/nox_sdk/models.py","size":12650,"ext":".py","mtime":"2025-08-13T19:20:54","sha256":"ff319364c244875254b82f824fae268627fda365e0e602f7080035c810df3fc2"},{"path":"sdk/python/nox_sdk/utils.py","size":17352,"ext":".py","mtime":"2025-08-13T19:20:54","sha256":"8b527c48b9b301ee7e4fb1dbc4d77a8e7f02ef872905fd8c151ab6526ff4c0f8"},{"path":"sdk/python/nox_sdk/__init__.py","size":7812,"ext":".py","mtime":"2025-08-13T19:20:54","sha256":"99eb04b377346d3d71e05df5648b2212d4713112a92d57605aacc0a959edf80f"},{"path":"sdk/python/nox_sdk/auth.py","size":19617,"ext":".py","mtime":"2025-08-13T19:20:54","sha256":"3e4970b740b24aeef2a3a594fb4ee9c9760d8dd21b0d4bdc837825f552a3a61b"},{"path":"sdk/python/nox_sdk/client.py","size":20211,"ext":".py","mtime":"2025-08-13T19:20:54","sha256":"1307450b6202df57647ad6341024f0d520cb914bd894b7295646fe1fa5ca61bd"},{"path":"sdk/python/nox_sdk/ai/security.py","size":14241,"ext":".py","mtime":"2025-08-13T19:20:54","sha256":"05399c95b111872921a1d03d809d6d237978714ddd3c6439083fa45d4b80f0b9"},{"path":"sdk/python/nox_sdk/ai/biometric.py","size":21888,"ext":".py","mtime":"2025-08-13T19:20:54","sha256":"d756348c6dd5777a8c6ea95fd5a6faa0bc50929d1f0b460e76f157d2044be3c4"},{"path":"sdk/python/nox_sdk/ai/__init__.py","size":1010,"ext":".py","mtime":"2025-08-13T19:20:54","sha256":"fe02e7b9bacd247df152c48f12caf4e8b74ec3e10e7de072ac88e65592ae04e6"},{"path":"sdk/python/nox_sdk/ai/policy.py","size":18551,"ext":".py","mtime":"2025-08-13T19:20:54","sha256":"a6f6b406f560abfde40f367c891473a2a7615d575a5a8c73da83c0436e238fec"},{"path":"sdk/typescript/package.json","size":3850,"ext":".json","mtime":"2025-08-13T19:20:54","sha256":"e7ea3898279a71e0d6a619cadfdad8995fcf37a7e46ddeabebd356293cff5a0f"},{"path":"sdk/typescript/tsconfig.json","size":1067,"ext":".json","mtime":"2025-08-13T19:20:54","sha256":"4367bd20103f771159dfcb42fe2d535245761d363aea1c045bc62f01d0b82815"},{"path":"sdk/typescript/build-test.sh","size":4629,"ext":".sh","mtime":"2025-08-13T19:20:54","sha256":"bd86abf3346b99f6f17fbafe27381b25663d553e6f96cf5e00f91d4194cf6877"},{"path":"sdk/typescript/src/utils.ts","size":13425,"ext":".ts","mtime":"2025-08-13T19:20:58","sha256":"8c1de247847216435e601dfa9a3abde324d3f911b5d0b60794545aad35f639da"},{"path":"sdk/typescript/src/client.ts","size":15802,"ext":".ts","mtime":"2025-08-13T19:20:58","sha256":"b1ca675bcbd0f5def6283cc6f9264a9d07bdf34342156640ebe491f4e4c28047"},{"path":"sdk/typescript/src/models.ts","size":9524,"ext":".ts","mtime":"2025-08-13T19:20:58","sha256":"d66ef561eb1c8474af0b9d147d76cc4fdcd3f799e9b681bf2378b97f8cae30ad"},{"path":"sdk/typescript/src/index.ts","size":6920,"ext":".ts","mtime":"2025-08-13T19:20:59","sha256":"68d91231027ab8c477e833390dd6dd19504c635313781ef833b826bd684e26a9"},{"path":"sdk/typescript/src/ai/security.ts","size":6703,"ext":".ts","mtime":"2025-08-13T19:20:58","sha256":"2b0760d67ca7037d5a063d49f51f7895781d605f7c99fe7f81adf22ac08b48ea"},{"path":"sdk/typescript/src/ai/policy.ts","size":8978,"ext":".ts","mtime":"2025-08-13T19:20:58","sha256":"f61f22c655ddbc2619ad24cef3add86ff40de0d14831e30ae0f579503db0437f"},{"path":"sdk/typescript/src/ai/biometric.ts","size":12421,"ext":".ts","mtime":"2025-08-13T19:20:58","sha256":"97dae65941d64f734651a81db5af5ce201872f40887ff041f44325fc3ecb179b"},{"path":"nox-api/requirements.txt","size":625,"ext":".txt","mtime":"2025-08-13T14:18:15","sha256":"6db98809003f7be174eb086839e3f52d0a8abaaae6afaf71927facf185bd64b4"},{"path":"nox-api/tests/curl_health.sh","size":756,"ext":".sh","mtime":"2025-08-13T10:56:14","sha256":"c26ed05561eefdb542c51a43b0279e41ad3e63b531f7bde308a6b7da6cd2a7b2"},{"path":"nox-api/tests/curl_run_sh.sh","size":1098,"ext":".sh","mtime":"2025-08-13T10:56:14","sha256":"d66eece127e76d8572b5f52ac879e0a7f98262e3075c15c03c544ffa7bb2ba97"},{"path":"nox-api/tests/curl_put.sh","size":1090,"ext":".sh","mtime":"2025-08-13T10:56:14","sha256":"5ba7be59c4002a15cc1096c637cacd88da828eed3b31624f40bdb8368c51b479"},{"path":"nox-api/tests/curl_run_py.sh","size":1108,"ext":".sh","mtime":"2025-08-13T10:56:14","sha256":"4666201c380d5451c97961c15d77618785123f3051fc511f1b6d50cd9b6cf022"},{"path":"nox-api/tests/run_all_tests.sh","size":2006,"ext":".sh","mtime":"2025-08-13T10:56:14","sha256":"597b5dc2350c785e993b50def7cdb18f245c8e8a47b7663189cacda8c8e49c0a"},{"path":"nox-api/tests/nox_client.py","size":0,"ext":".py","mtime":"2025-08-13T08:15:16","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"nox-api/deploy/nginx_setup.sh","size":13029,"ext":".sh","mtime":"2025-08-13T11:33:09","sha256":"bf34bef7af7dece7495166d0c94adeeeb0d78f1f449911445153b8cd2dc82632"},{"path":"nox-api/deploy/logrotate-nox","size":1396,"ext":"","mtime":"2025-08-13T11:57:22","sha256":null},{"path":"nox-api/deploy/nginx_nox.conf.example","size":2826,"ext":".example","mtime":"2025-08-13T11:33:09","sha256":null},{"path":"nox-api/deploy/install_nox.sh","size":14158,"ext":".sh","mtime":"2025-08-13T10:56:14","sha256":"d9708849dd6d4401a68aecdfce55e9b1dd159fb5c26116b08ac9f0b76119da40"},{"path":"nox-api/deploy/Caddyfile.example","size":935,"ext":".example","mtime":"2025-08-13T11:33:09","sha256":null},{"path":"nox-api/deploy/harden_nox.sh","size":13217,"ext":".sh","mtime":"2025-08-13T11:04:45","sha256":"33302158c60dc92e47a320ac65e66d553f8040ab05dfa8ff2eb5cd388fa5ed3b"},{"path":"nox-api/deploy/setup_logging.sh","size":5948,"ext":".sh","mtime":"2025-08-13T11:57:22","sha256":"fd307d0f29753bec1890f903becf4a08bd09127490181d3deec333fb1a3633a8"},{"path":"nox-api/deploy/caddy_setup.sh","size":11852,"ext":".sh","mtime":"2025-08-13T11:33:09","sha256":"0e956130fca3fb641c353a0566a2dfc1cb229535943b1edbf8e8a08786155977"},{"path":"nox-api/deploy/install_logging.sh","size":11493,"ext":".sh","mtime":"2025-08-13T11:57:22","sha256":"4d8d1016d14fd084bfe8bead1219061df41db82b78fe520fdc8d01da8f4bdf9c"},{"path":"nox-api/api/nox_api.py","size":7082,"ext":".py","mtime":"2025-08-13T14:36:11","sha256":"ed2d11af514133b5e46b6d68ae7265a38e216740836aca38fae0847066d7b22e"},{"path":"nox-api/api/nox_api_oauth2.py","size":7992,"ext":".py","mtime":"2025-08-13T14:36:11","sha256":"2a7be9370960c453cf24b9fcd99b31787c95f9c183fdb5c463aac1b9c5fa3b52"},{"path":"nox-api/api/nox_api_new.py","size":9914,"ext":".py","mtime":"2025-08-13T13:24:03","sha256":"8c31907a98c30257fdf14bfddd4591d630a35cb89edef81bb0481c4fd3d7d41a"},{"path":"nox-api/api/nox_api_clean.py","size":7082,"ext":".py","mtime":"2025-08-13T13:24:03","sha256":"ed2d11af514133b5e46b6d68ae7265a38e216740836aca38fae0847066d7b22e"},{"path":"nox-api/api/nox_api_fixed.py","size":6953,"ext":".py","mtime":"2025-08-13T13:32:23","sha256":"a0610206ae66d5589d84058cd8d303783e335d37e10c5cff7ecb9b29b126e145"},{"path":"nox-api/api/nox_api_v23.py","size":9223,"ext":".py","mtime":"2025-08-13T13:59:31","sha256":"c4bf8527fa27e4f23e001f3e508d6f93816b19c56a9d4f03cef4c8c44df91815"},{"path":"nox-api/api/nox_api_backup.py","size":10131,"ext":".py","mtime":"2025-08-13T13:16:32","sha256":"4351bef2c842ed1cca9a8b3bb1b2bb550a419e5235f57d59f4f368a44990ee26"},{"path":"nox-api/api/nox_api_broken.py","size":7744,"ext":".py","mtime":"2025-08-13T13:28:33","sha256":"b606314c785b4a9bff9b2cd49ec638aa2617b92a25773981329b32867cc62afb"},{"path":"nox-api/auth/oauth2_endpoints.py","size":7321,"ext":".py","mtime":"2025-08-13T14:18:15","sha256":"5b37490c29be50533fc39ebde1290f04e899d69b0598ef8cef873bf4b75c9a19"},{"path":"nox-api/auth/oauth2_config.py","size":3712,"ext":".py","mtime":"2025-08-13T14:18:15","sha256":"057b6b94062c1e23ebf615abd6cc771a81b26ec07cb4690101cdb751df35e037"},{"path":"nox-api/auth/oauth2_service.py","size":8271,"ext":".py","mtime":"2025-08-13T14:18:15","sha256":"f0a9203b71885be4e05472f0c2bf99d209044f5591b75184186c8cec2a894095"},{"path":"nox-api/scripts/nox_repair.sh","size":24284,"ext":".sh","mtime":"2025-08-15T19:31:48","sha256":"1071724620e25f4f6a5be16afb5a518693f29572be089989555186f439836d10"},{"path":"nox-api/scripts/nox_repair_v2.sh","size":12645,"ext":".sh","mtime":"2025-08-13T10:56:14","sha256":"683466ec065ee63157989a712597c2ecc396883b7947bdf26b3f86325da23c33"},{"path":"docs-interactive/sdk-package.json","size":1814,"ext":".json","mtime":"2025-08-15T14:32:42","sha256":"d58ddfccd19f6d6df808481c135036c2533c18020a34d4eeb886eca7eae641d1"},{"path":"docs-interactive/M9.2_COMPLETION_SUMMARY.md","size":0,"ext":".md","mtime":"2025-08-15T17:35:26","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs-interactive/DOCUMENTATION.md","size":1790,"ext":".md","mtime":"2025-08-15T18:15:40","sha256":"9a9fee240b89782a00cf031d3b528bd12d8fa024a4224d365ff3a25617cac4d2"},{"path":"docs-interactive/next.config.ts","size":133,"ext":".ts","mtime":"2025-08-13T19:43:09","sha256":"614bce25b089c3f19b1e17a6346c74b858034040154c6621e7d35303004767cc"},{"path":"docs-interactive/AUTHENTICATION_GUIDE.md","size":25685,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"8262afe89bd8d72229863f07479742055fadc063f8f25684bff7d49c194faee3"},{"path":"docs-interactive/M9.5_COMPLETION_SUMMARY.md","size":0,"ext":".md","mtime":"2025-08-15T17:36:11","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs-interactive/M9.6_PERFORMANCE_RESULTS.md","size":8846,"ext":".md","mtime":"2025-08-15T15:23:12","sha256":"29850f305875250d50393eeddbb464a2e118ac10c6e0ba00a0ff02114773567b"},{"path":"docs-interactive/README.md","size":13608,"ext":".md","mtime":"2025-08-15T18:21:26","sha256":"ada91d2e7fa811f3551dd4a35a6077af31623af699e51e63d7997e53a8d50d76"},{"path":"docs-interactive/package-lock.json","size":225672,"ext":".json","mtime":"2025-08-15T15:15:14","sha256":"ca864534fa716bdd8afa126486a99a2e290e67be9c61f89b8b2a45af2ebc8c4a"},{"path":"docs-interactive/next.config.js","size":3042,"ext":".js","mtime":"2025-08-15T15:23:13","sha256":"3f8e4485b26e7a738d9445fe1898d5cfcd064328ad2e79ffd5bc707cd3685882"},{"path":"docs-interactive/API_USER_GUIDE.md","size":17472,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"42a9eff40892fe213e64a24f39a0dfa4d8af58f242fadb608830102709dffc87"},{"path":"docs-interactive/postcss.config.mjs","size":81,"ext":".mjs","mtime":"2025-08-13T19:43:09","sha256":"141ef24ca27a99d08962210fdf20212d3435fdcfa21b46cd88b44d22f751dfae"},{"path":"docs-interactive/M9.4_COMPLETION_SUMMARY.md","size":0,"ext":".md","mtime":"2025-08-15T17:36:04","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs-interactive/next-env.d.ts","size":211,"ext":".ts","mtime":"2025-08-13T19:43:09","sha256":"f2b3bca04d1bfe583daae1e1f798c92ec24bb6693bd88d0a09ba6802dee362a8"},{"path":"docs-interactive/.gitignore","size":480,"ext":"","mtime":"2025-08-13T19:43:09","sha256":null},{"path":"docs-interactive/eslint.config.mjs","size":393,"ext":".mjs","mtime":"2025-08-13T19:43:09","sha256":"3de4ba23ff1f687685651cad622700613998de80daa30ac4d82c47776a04019d"},{"path":"docs-interactive/package.json","size":1010,"ext":".json","mtime":"2025-08-15T15:23:12","sha256":"66a08ad673bba20066cc4b6c7401e3c731d73fccbe778eeb7c77f0155967593e"},{"path":"docs-interactive/SESSION_COMPLETION_REPORT_M9.3.md","size":0,"ext":".md","mtime":"2025-08-15T17:36:01","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs-interactive/M9_PROGRESS_TRACKER.md","size":10418,"ext":".md","mtime":"2025-08-15T15:04:32","sha256":"e86288ddbae86de799f18748bd86312ade6fbba62122a63f4f9f647b6700fdd6"},{"path":"docs-interactive/SESSION_COMPLETION_REPORT_M9.5.md","size":0,"ext":".md","mtime":"2025-08-15T17:36:13","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs-interactive/.copilot-instructions.md","size":2586,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"d84860270197b9a48d06f4f781d02a07834de013115e7fdf003539522f89af87"},{"path":"docs-interactive/M9.3_COMPLETION_SUMMARY.md","size":0,"ext":".md","mtime":"2025-08-15T17:35:57","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs-interactive/M9.6_PERFORMANCE_COMPLETE.md","size":0,"ext":".md","mtime":"2025-08-15T17:36:19","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs-interactive/M9.6_COMPLETION_SUMMARY.md","size":4557,"ext":".md","mtime":"2025-08-15T15:23:12","sha256":"98ce434f52f4a83601072a9ae5f35f8e42a4264486ebc292c6d1e3dc47455ec2"},{"path":"docs-interactive/SESSION_COMPLETION_REPORT_M9.4.md","size":0,"ext":".md","mtime":"2025-08-15T17:36:05","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs-interactive/MIGRATION_GUIDE.md","size":26769,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"1ee610ab69ed0a49634a343ecafc45bad2d657bb8315e038bbb9158104bc57ab"},{"path":"docs-interactive/tsconfig.json","size":602,"ext":".json","mtime":"2025-08-13T19:43:09","sha256":"83d292a6930a317ea31ef48e220097d2ca10c6c505f41d5954795acef48ca3b9"},{"path":"docs-interactive/public/openapi.json","size":19674,"ext":".json","mtime":"2025-08-13T19:50:57","sha256":"7b995bd093290e25b3d937b0d3f85c25920707ba87c66185d97435184d286b80"},{"path":"docs-interactive/public/vercel.svg","size":128,"ext":".svg","mtime":"2025-08-13T19:43:09","sha256":null},{"path":"docs-interactive/public/window.svg","size":385,"ext":".svg","mtime":"2025-08-13T19:43:09","sha256":null},{"path":"docs-interactive/public/globe.svg","size":1035,"ext":".svg","mtime":"2025-08-13T19:43:09","sha256":null},{"path":"docs-interactive/public/next.svg","size":1375,"ext":".svg","mtime":"2025-08-13T19:43:09","sha256":null},{"path":"docs-interactive/public/file.svg","size":391,"ext":".svg","mtime":"2025-08-13T19:43:09","sha256":null},{"path":"docs-interactive/src/components/LiveAPIExplorer.tsx","size":18893,"ext":".tsx","mtime":"2025-08-15T14:32:48","sha256":"fa679792b02c11f6bcb84e3d382de20d8a3d0872dcc82bad698ea8476c989a01"},{"path":"docs-interactive/src/components/PayloadGenerator.tsx","size":14318,"ext":".tsx","mtime":"2025-08-15T14:32:48","sha256":"86045f570268142a7d0d8ed3f2da269a442f1376905845e74bb07b49ac1b8ff5"},{"path":"docs-interactive/src/components/EndpointsListEnhanced.tsx","size":6196,"ext":".tsx","mtime":"2025-08-15T15:04:34","sha256":"2b58610f56d7cadf00f8980b9bfa9d7668e8b4769bb323c37e9bee5d48a4401a"},{"path":"docs-interactive/src/components/SearchAndFilters.tsx","size":11493,"ext":".tsx","mtime":"2025-08-15T15:55:55","sha256":"4f20264776887f0f6c176c82248bf9ff7a8c17c1082a53697c6269a0194cbaf0"},{"path":"docs-interactive/src/components/FloatingActions.tsx","size":6336,"ext":".tsx","mtime":"2025-08-15T14:32:53","sha256":"adb534e987503257ae1a1a26c053fa8c7c82b341788c88fae002734fc9e02131"},{"path":"docs-interactive/src/components/EndpointsList.tsx","size":6838,"ext":".tsx","mtime":"2025-08-15T15:23:13","sha256":"c5107cb0d4c1e9ce936b246aeb82cd2047dec4268ad4cd4991dd818da0885974"},{"path":"docs-interactive/src/components/BundleAnalyzer.tsx","size":16031,"ext":".tsx","mtime":"2025-08-15T14:32:53","sha256":"658753b94872396f6df792a1dbd69d383ca337c814e2261bc29f076d81ce817b"},{"path":"docs-interactive/src/components/EndpointCard.tsx","size":22575,"ext":".tsx","mtime":"2025-08-15T15:55:55","sha256":"4fe46f9c541a2942b41191a50c2d4719ea273394f5a6b7e8dd7f8a3d5fc1d71c"},{"path":"docs-interactive/src/components/EndpointsListOld.tsx","size":5892,"ext":".tsx","mtime":"2025-08-15T14:38:41","sha256":"156dea9b9c976fab9b75eb234ea87a6e15b3888a1ed6735acfd7c3bec9b0a65e"},{"path":"docs-interactive/src/components/AIHelper.tsx","size":14247,"ext":".tsx","mtime":"2025-08-15T13:25:37","sha256":"12826817fbc20b39afe0755115019f15a4f67621624308bdbb46843368497a9d"},{"path":"docs-interactive/src/components/WebVitalsMonitor.tsx","size":14456,"ext":".tsx","mtime":"2025-08-15T14:32:53","sha256":"3da66fa35e42d46515418681fa8d9be3bffb365b918c9d9b0ba94c622abea1ff"},{"path":"docs-interactive/src/components/VirtualizedEndpointsList.tsx","size":3168,"ext":".tsx","mtime":"2025-08-15T15:23:13","sha256":"251614c57adf99aaa39aaaa50ab9ba4c5629df8f5f0ab80e1b9a618ce3c28e92"},{"path":"docs-interactive/src/components/SDKGenerator.tsx","size":20268,"ext":".tsx","mtime":"2025-08-15T14:32:48","sha256":"ed82f6a792ecaa8ebc908e2d43e886021574ff3397f885275bf8d50b85a6cded"},{"path":"docs-interactive/src/components/ClientOnlyWebVitals.tsx","size":409,"ext":".tsx","mtime":"2025-08-15T15:55:55","sha256":"c301933c48a3e9abbe6d413b4a3cdab2349bcae77e31d4996eed9ff5c503e520"},{"path":"docs-interactive/src/components/ui/ResponsiveUtils.tsx","size":8665,"ext":".tsx","mtime":"2025-08-15T14:32:53","sha256":"5e74d38d84817bcef0c7a9fcf3f57e511303036c61d88c4ad96d89036633cc44"},{"path":"docs-interactive/src/components/ui/progress.tsx","size":665,"ext":".tsx","mtime":"2025-08-15T15:23:13","sha256":"6df85e3c7fad4b74f5c6c4042b7afa88d5497d3bcfc5fa9fb1c33c334983e4be"},{"path":"docs-interactive/src/components/ui/badge.tsx","size":1168,"ext":".tsx","mtime":"2025-08-15T15:23:13","sha256":"b77b53bfb9eb40ee0dcd1619c806e1a935478eb03994e3a5ab3192fade97cf39"},{"path":"docs-interactive/src/components/ui/button.tsx","size":1689,"ext":".tsx","mtime":"2025-08-15T15:23:13","sha256":"d5fb8965e7a027a5b7102c87048311b5a48d88240b996708b3552f1b5f02ea5b"},{"path":"docs-interactive/src/components/ui/LoadingComponents.tsx","size":7800,"ext":".tsx","mtime":"2025-08-15T14:32:51","sha256":"4848c6b3ef2075fc4a5e49052c733fa68a6f358e940e99fea9caf13ba438b9f5"},{"path":"docs-interactive/src/components/ui/Animations.tsx","size":11552,"ext":".tsx","mtime":"2025-08-15T14:32:53","sha256":"02c8076361ebe2e96ddc2defec52e4ed17c8943a058ee87c370fc00a3c7782b1"},{"path":"docs-interactive/src/components/ui/card.tsx","size":1878,"ext":".tsx","mtime":"2025-08-15T15:23:13","sha256":"6107ca0ea6209a02933f8cec0fa360a6f9036a7f894c95469d9dea9806d1e0ae"},{"path":"docs-interactive/src/app/globals.css","size":4149,"ext":".css","mtime":"2025-08-15T15:04:32","sha256":"8ebf707a05645221fe7250a8f3ffb104d2b577d16c98b09a16260d94876ddc4d"},{"path":"docs-interactive/src/app/layout.tsx","size":1098,"ext":".tsx","mtime":"2025-08-15T15:55:55","sha256":"6a4b479e2ac8ffb0706cfb28b1eb2970befd565f34cdef2d284d7f537c74a4a4"},{"path":"docs-interactive/src/app/page-complex-backup.tsx","size":10655,"ext":".tsx","mtime":"2025-08-15T14:56:21","sha256":"22982c1d52d47a67543969a0b99a712f80d7ebf32f671df2a871ff1e30421989"},{"path":"docs-interactive/src/app/page.tsx","size":535,"ext":".tsx","mtime":"2025-08-15T15:04:34","sha256":"f9afd0e46b8e624b522289a873c751aaafe8571b1b19520a519b24472850ad57"},{"path":"docs-interactive/src/app/page-simple.tsx","size":535,"ext":".tsx","mtime":"2025-08-15T15:04:34","sha256":"f9afd0e46b8e624b522289a873c751aaafe8571b1b19520a519b24472850ad57"},{"path":"docs-interactive/src/app/auth/callback/page.tsx","size":1351,"ext":".tsx","mtime":"2025-08-15T14:32:48","sha256":"7eff98a93995da9c841e75cbd776a52bd389ae105b2f215ec3a822176eed4d19"},{"path":"docs-interactive/src/utils/performance.ts","size":8054,"ext":".ts","mtime":"2025-08-15T14:32:53","sha256":"f1926fa42990c57c656b6c849e73f753cf3e300fde43dfcb274b6abf88b04acb"},{"path":"docs-interactive/src/utils/WebSocketPool.ts","size":7624,"ext":".ts","mtime":"2025-08-15T15:23:13","sha256":"f36011ae5c582f1d4dbae48538333a7a16347dccf9782ed4a65b1f7ed7269349"},{"path":"docs-interactive/src/hooks/usePerformanceOptimization.ts","size":8888,"ext":".ts","mtime":"2025-08-15T15:55:55","sha256":"b2473c6bf79d11f56361a112995a57dac42971ce93334daf1b820eba6c1832c8"},{"path":"docs-interactive/src/hooks/useTheme.tsx","size":3713,"ext":".tsx","mtime":"2025-08-15T15:04:34","sha256":"e8ba639345200329c4ff9d14256c0f74ff66da7c7f6e8076303361a7d1c990c1"},{"path":"docs-interactive/src/hooks/useFavorites.ts","size":1731,"ext":".ts","mtime":"2025-08-15T15:04:34","sha256":"441f573393cdefe4ce59d9fb1f37b691c671409663af8bf56e9c6968a68dc98f"},{"path":"docs-interactive/src/types/api.ts","size":2782,"ext":".ts","mtime":"2025-08-15T13:25:34","sha256":"35c0eb62f742965f78f401b7a00fef50adbdcfcc037984f3fc3065f670cbf7cb"},{"path":"docs-interactive/src/lib/utils.ts","size":166,"ext":".ts","mtime":"2025-08-15T15:23:13","sha256":"51bbf14cd1f84f49aab2e0dbee420137015d56b6677bb439e83a908cd292cce1"},{"path":"docs-interactive/sdk-typescript/README.md","size":6981,"ext":".md","mtime":"2025-08-15T14:32:44","sha256":"914222150a144b75c39e34c3a330d57c9294c831a5d41909a5f3a54851ff942b"},{"path":"docs-interactive/sdk-typescript/package.json","size":1476,"ext":".json","mtime":"2025-08-15T14:32:42","sha256":"69eb0e39891745acc1389d61069beb0fc4419e4f30f65ec0c69e613b0d037b57"},{"path":"docs-interactive/sdk-typescript/tsconfig.json","size":784,"ext":".json","mtime":"2025-08-15T14:32:42","sha256":"17b29a5b8033a533ca70b01b53ad11b56ffce5922cdc070e6d9b8dc7097ca207"},{"path":"docs-interactive/sdk-typescript/src/index.ts","size":11286,"ext":".ts","mtime":"2025-08-15T14:32:53","sha256":"59af7a05eface216f97b445cf5f5adaa1eca6416d6e797f691f31873fef0c0d1"}],"duplicates_by_name":[[{"path":"PRODUCTION_DEPLOYMENT_GUIDE.md","size":0,"ext":".md","mtime":"2025-08-15T23:13:52","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs/deployment-guides/PRODUCTION_DEPLOYMENT_GUIDE.md","size":8913,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"0330e157ff8a60c395c596ebd16e0a6cccbc511de53fce5bb48b2ad72ce561f9"}],[{"path":"oauth2_endpoints.py","size":12822,"ext":".py","mtime":"2025-08-13T17:06:47","sha256":"30c63dd8d748326bd08c9e7de70cc675bbce3d5f43fdf79f023b28a233fbc3ed"},{"path":"nox-api/auth/oauth2_endpoints.py","size":7321,"ext":".py","mtime":"2025-08-13T14:18:15","sha256":"5b37490c29be50533fc39ebde1290f04e899d69b0598ef8cef873bf4b75c9a19"}],[{"path":"SESSION_COMPLETION_REPORT_M9.2.md","size":0,"ext":".md","mtime":"2025-08-15T23:13:12","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs/session-reports/SESSION_COMPLETION_REPORT_M9.2.md","size":0,"ext":".md","mtime":"2025-08-15T17:35:36","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}],[{"path":"PROBLEM_RESOLUTION_REPORT.md","size":0,"ext":".md","mtime":"2025-08-15T23:14:18","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs/progress-reports/PROBLEM_RESOLUTION_REPORT.md","size":4988,"ext":".md","mtime":"2025-08-15T17:36:26","sha256":"0dda2384058775e3da0dd706f48f82cd74fc007f608829252de4a7d66c1e5a42"}],[{"path":"DOCUMENTATION.md","size":0,"ext":".md","mtime":"2025-08-15T23:13:30","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs-interactive/DOCUMENTATION.md","size":1790,"ext":".md","mtime":"2025-08-15T18:15:40","sha256":"9a9fee240b89782a00cf031d3b528bd12d8fa024a4224d365ff3a25617cac4d2"}],[{"path":"install_nox.sh","size":3990,"ext":".sh","mtime":"2025-08-13T06:01:15","sha256":"cd9ac447edf6e2ee2c7dcaea3ef29eef2d84448a7d10b0a109856c8838263297"},{"path":"nox-api/deploy/install_nox.sh","size":14158,"ext":".sh","mtime":"2025-08-13T10:56:14","sha256":"d9708849dd6d4401a68aecdfce55e9b1dd159fb5c26116b08ac9f0b76119da40"}],[{"path":"AUTHENTICATION_GUIDE.md","size":0,"ext":".md","mtime":"2025-08-15T23:14:08","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs-interactive/AUTHENTICATION_GUIDE.md","size":25685,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"8262afe89bd8d72229863f07479742055fadc063f8f25684bff7d49c194faee3"}],[{"path":"ENHANCED_DEPLOYMENT_GUIDE.md","size":0,"ext":".md","mtime":"2025-08-15T23:14:11","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs/deployment-guides/ENHANCED_DEPLOYMENT_GUIDE.md","size":45347,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"02f183da60fa8393accf45ea05022564e5e0fa168c0b37b9676e22e4a2cc5222"}],[{"path":"README.md","size":0,"ext":".md","mtime":"2025-08-15T23:13:43","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"k8s/README.md","size":794,"ext":".md","mtime":"2025-08-13T18:21:01","sha256":"de5fceb564bdacb99fc2171bb1f7dae07f8daa8eed4322a0f67076b12e26fd58"},{"path":"docs/README.md","size":5216,"ext":".md","mtime":"2025-08-15T19:31:49","sha256":"8c9af1c8edaeaf7670ec7c0945114d5f8c1857f56e11ebd3086aa14ca845de70"},{"path":"docs-interactive/README.md","size":13608,"ext":".md","mtime":"2025-08-15T18:21:26","sha256":"ada91d2e7fa811f3551dd4a35a6077af31623af699e51e63d7997e53a8d50d76"},{"path":"docs-interactive/sdk-typescript/README.md","size":6981,"ext":".md","mtime":"2025-08-15T14:32:44","sha256":"914222150a144b75c39e34c3a330d57c9294c831a5d41909a5f3a54851ff942b"}],[{"path":"PRODUCTION_CREDENTIALS_GUIDE.md","size":10671,"ext":".md","mtime":"2025-08-15T19:00:14","sha256":"f01c141ce87455b38a51d032d03d28dac822cf83042f2ee7037687dd6076b863"},{"path":"docs/deployment-guides/PRODUCTION_CREDENTIALS_GUIDE.md","size":8922,"ext":".md","mtime":"2025-08-15T17:51:52","sha256":"99288162da3fc7f9c1de78dd8cf922138bbc5d2cbb0c5a112f0ebcec3846f9b3"}],[{"path":"API_USER_GUIDE.md","size":0,"ext":".md","mtime":"2025-08-15T23:14:05","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs-interactive/API_USER_GUIDE.md","size":17472,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"42a9eff40892fe213e64a24f39a0dfa4d8af58f242fadb608830102709dffc87"}],[{"path":"STAGING_CHECKLIST_COMPLETION_REPORT.md","size":9953,"ext":".md","mtime":"2025-08-15T18:05:10","sha256":"6ba5a0823fb8a5af28505f103ffd83c5ab0ae1b869ead79d4f83d82e91cd793a"},{"path":"docs/progress-reports/STAGING_CHECKLIST_COMPLETION_REPORT.md","size":9907,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"81bc2f14333ffd78fde9098db440d44f08ad2744f9b8f300978c2db2ba44b6a2"}],[{"path":".gitignore","size":268,"ext":"","mtime":"2025-08-13T08:28:51","sha256":null},{"path":"docs-interactive/.gitignore","size":480,"ext":"","mtime":"2025-08-13T19:43:09","sha256":null}],[{"path":"SECTION_4_COMPLETION_REPORT.md","size":12381,"ext":".md","mtime":"2025-08-15T18:05:10","sha256":"f483e978c000034cc6f3aa17a314c5aca848bef214f009586ba4151af71e64b5"},{"path":"docs/progress-reports/SECTION_4_COMPLETION_REPORT.md","size":12313,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"23ec0dedd6e1942255d7c266199cace7050b7f5685f266f82f09a591ff4144b6"}],[{"path":"COMPREHENSIVE_PROGRESS_REPORT.md","size":0,"ext":".md","mtime":"2025-08-15T23:13:49","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs/progress-reports/COMPREHENSIVE_PROGRESS_REPORT.md","size":14796,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"455bbd6c34d5ecd4c26d35995d431e92375c09e59eb0ece64bf521cac2c9975f"}],[{"path":"middleware.py","size":1001,"ext":".py","mtime":"2025-08-13T15:40:32","sha256":"66fa971126592d290e2d77f6bde39faf72b639184890f9d26a79aad5a6f44755"},{"path":"observability/middleware.py","size":880,"ext":".py","mtime":"2025-08-13T13:32:23","sha256":"396b8400fcdb69fab67743d75e505a72af85db34eb1d8d163553ace04918b563"},{"path":"quotas/middleware.py","size":13712,"ext":".py","mtime":"2025-08-13T15:40:32","sha256":"4b90163234dd30589e4d0c612a3e82cdde584ff4d226fe15a480fe46c2a8f447"}],[{"path":"requirements.txt","size":654,"ext":".txt","mtime":"2025-08-13T18:21:01","sha256":"93fade11ff4429562ff364cbd08f1a236031288e456215deda0c7f9e3b480f4b"},{"path":"clients/requirements.txt","size":525,"ext":".txt","mtime":"2025-08-13T11:47:58","sha256":"50d976b6a179fc31577cc4cae9de54b766bda7a209c85b9f6c6bfa4db5b2c2b8"},{"path":"sdk/python/requirements.txt","size":393,"ext":".txt","mtime":"2025-08-13T19:20:54","sha256":"fba6412a49d07152f1acf53571bc9c6bb959c2978ba44e6970caed57f7035689"},{"path":"nox-api/requirements.txt","size":625,"ext":".txt","mtime":"2025-08-13T14:18:15","sha256":"6db98809003f7be174eb086839e3f52d0a8abaaae6afaf71927facf185bd64b4"}],[{"path":"STAGING_VALIDATION_RELEASE_CHECKLIST.md","size":0,"ext":".md","mtime":"2025-08-15T23:14:12","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs/deployment-guides/STAGING_VALIDATION_RELEASE_CHECKLIST.md","size":19066,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"03900b6a02d0443534e3096ff6dee58d8b2cd1b1e45f034204dc018222d36fe0"}],[{"path":"SECTION_3_COMPLETION.md","size":7803,"ext":".md","mtime":"2025-08-15T18:04:01","sha256":"ab118886af4f0a2920e2b2aacb72a690a65fa580b3c9ad05271e9551e40bc8d3"},{"path":"docs/progress-reports/SECTION_3_COMPLETION.md","size":7723,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"da4988a0c517db77b1cad88b9e9394c060e27d741a65e307b5b81ef6cde6e992"}],[{"path":"DEPLOYMENT_STATUS_TRACKER.md","size":6120,"ext":".md","mtime":"2025-08-15T18:05:10","sha256":"2287bb2beb52235f19f73eed65ea0bd5e1b3603888048811dcc0a6cff072a420"},{"path":"docs/deployment-guides/DEPLOYMENT_STATUS_TRACKER.md","size":6091,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"65d79f17240084ec0675fc691b3ce0bf96eeb47d95b500173cda0ca8e9456278"}],[{"path":"nox_client.py","size":892,"ext":".py","mtime":"2025-08-13T06:23:13","sha256":"93a676279b0de3c7611a2ec3b302334b8ed3806a321fb50a0f43bbe4e1302eb4"},{"path":"clients/nox_client.py","size":10369,"ext":".py","mtime":"2025-08-13T11:47:58","sha256":"de960e44294192d29bbb012ce2a13daa30eb2681b99d13f0c5394b9fd7444b80"},{"path":"nox-api/tests/nox_client.py","size":0,"ext":".py","mtime":"2025-08-13T08:15:16","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}],[{"path":"metrics_chatgpt.py","size":1382,"ext":".py","mtime":"2025-08-13T15:40:32","sha256":"5c96a4f243f9e4139247ad2e9c37a676e5b24de50219a20ff73b5f88f0c9ddff"},{"path":"observability/metrics_chatgpt.py","size":1240,"ext":".py","mtime":"2025-08-13T14:54:17","sha256":"36b9e02a565ebfed0b48fbf7362a6f989bff8aae12a94a780fbf8732552c89e1"}],[{"path":".copilot-instructions.md","size":3075,"ext":".md","mtime":"2025-08-15T18:04:01","sha256":"2e6ecd77f500e4089ba79a5d2b428a7902ea56ce504ba6d45b8402b3753ccd90"},{"path":"docs-interactive/.copilot-instructions.md","size":2586,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"d84860270197b9a48d06f4f781d02a07834de013115e7fdf003539522f89af87"}],[{"path":"SECTIONS_1_2_COMPLETION.md","size":0,"ext":".md","mtime":"2025-08-15T23:13:51","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs/progress-reports/SECTIONS_1_2_COMPLETION.md","size":6424,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"c564aa2c70c827b6b4694231d06a7d1a3020374cd1581b1d36bc5b603ecadbcb"}],[{"path":"OPS_QUICK_COMMAND_CARD.md","size":2926,"ext":".md","mtime":"2025-08-15T18:05:10","sha256":"a816da6404801c6bf23e04709546113e4df96042ab842f182d61b1ad25906f26"},{"path":"docs/deployment-guides/OPS_QUICK_COMMAND_CARD.md","size":2901,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"435fe47e341cac8a32384038734ba683609dda0caeee42de1fb81512d2fefdec"}],[{"path":"MIGRATION_GUIDE.md","size":0,"ext":".md","mtime":"2025-08-15T23:14:10","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs-interactive/MIGRATION_GUIDE.md","size":26769,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"1ee610ab69ed0a49634a343ecafc45bad2d657bb8315e038bbb9158104bc57ab"}],[{"path":"OPS_RELEASE_DAY_RUNBOOK.md","size":10340,"ext":".md","mtime":"2025-08-15T18:05:10","sha256":"8a69dff4f8615ebd3344a2668871377efbe290c26af2d98051ccece36c999b75"},{"path":"docs/deployment-guides/OPS_RELEASE_DAY_RUNBOOK.md","size":10315,"ext":".md","mtime":"2025-08-15T17:26:36","sha256":"63dc156a52801dfc16943d56927ccfcb27d4030c8669f48855619c8a841c3616"}],[{"path":"artifacts/072845fdb3fc4bbe9548d4b4124d9d16/molden.input","size":952,"ext":".input","mtime":"2025-08-17T16:09:59","sha256":null},{"path":"artifacts/aaf61a28131a4720aa5d2e522e0dc443/molden.input","size":952,"ext":".input","mtime":"2025-08-17T16:10:34","sha256":null},{"path":"artifacts/test123/molden.input","size":952,"ext":".input","mtime":"2025-08-17T16:10:16","sha256":null}],[{"path":"artifacts/072845fdb3fc4bbe9548d4b4124d9d16/charges","size":30,"ext":"","mtime":"2025-08-17T16:09:59","sha256":null},{"path":"artifacts/aaf61a28131a4720aa5d2e522e0dc443/charges","size":30,"ext":"","mtime":"2025-08-17T16:10:34","sha256":null},{"path":"artifacts/test123/charges","size":30,"ext":"","mtime":"2025-08-17T16:10:16","sha256":null}],[{"path":"artifacts/072845fdb3fc4bbe9548d4b4124d9d16/input.xyz","size":43,"ext":".xyz","mtime":"2025-08-17T16:09:58","sha256":null},{"path":"artifacts/aaf61a28131a4720aa5d2e522e0dc443/input.xyz","size":43,"ext":".xyz","mtime":"2025-08-17T16:10:33","sha256":null},{"path":"artifacts/test123/input.xyz","size":34,"ext":".xyz","mtime":"2025-08-17T16:10:15","sha256":null}],[{"path":"artifacts/072845fdb3fc4bbe9548d4b4124d9d16/xtb.log","size":13380,"ext":".log","mtime":"2025-08-17T16:09:59","sha256":null},{"path":"artifacts/aaf61a28131a4720aa5d2e522e0dc443/xtb.log","size":13380,"ext":".log","mtime":"2025-08-17T16:10:33","sha256":null},{"path":"artifacts/test123/xtb.log","size":13380,"ext":".log","mtime":"2025-08-17T16:10:15","sha256":null}],[{"path":"artifacts/072845fdb3fc4bbe9548d4b4124d9d16/wbo","size":51,"ext":"","mtime":"2025-08-17T16:09:59","sha256":null},{"path":"artifacts/aaf61a28131a4720aa5d2e522e0dc443/wbo","size":51,"ext":"","mtime":"2025-08-17T16:10:34","sha256":null},{"path":"artifacts/test123/wbo","size":51,"ext":"","mtime":"2025-08-17T16:10:16","sha256":null}],[{"path":"artifacts/072845fdb3fc4bbe9548d4b4124d9d16/molden.log","size":12668,"ext":".log","mtime":"2025-08-17T16:09:59","sha256":null},{"path":"artifacts/aaf61a28131a4720aa5d2e522e0dc443/molden.log","size":12668,"ext":".log","mtime":"2025-08-17T16:10:34","sha256":null},{"path":"artifacts/test123/molden.log","size":12668,"ext":".log","mtime":"2025-08-17T16:10:16","sha256":null}],[{"path":"artifacts/072845fdb3fc4bbe9548d4b4124d9d16/xtbrestart","size":240,"ext":"","mtime":"2025-08-17T16:09:59","sha256":null},{"path":"artifacts/aaf61a28131a4720aa5d2e522e0dc443/xtbrestart","size":240,"ext":"","mtime":"2025-08-17T16:10:34","sha256":null},{"path":"artifacts/test123/xtbrestart","size":240,"ext":"","mtime":"2025-08-17T16:10:16","sha256":null}],[{"path":"artifacts/072845fdb3fc4bbe9548d4b4124d9d16/xtbtopo.mol","size":255,"ext":".mol","mtime":"2025-08-17T16:09:59","sha256":null},{"path":"artifacts/aaf61a28131a4720aa5d2e522e0dc443/xtbtopo.mol","size":255,"ext":".mol","mtime":"2025-08-17T16:10:34","sha256":null},{"path":"artifacts/test123/xtbtopo.mol","size":255,"ext":".mol","mtime":"2025-08-17T16:10:16","sha256":null}],[{"path":"artifacts/072845fdb3fc4bbe9548d4b4124d9d16/xtbopt.log","size":226,"ext":".log","mtime":"2025-08-17T16:09:58","sha256":null},{"path":"artifacts/aaf61a28131a4720aa5d2e522e0dc443/xtbopt.log","size":226,"ext":".log","mtime":"2025-08-17T16:10:33","sha256":null},{"path":"artifacts/test123/xtbopt.log","size":226,"ext":".log","mtime":"2025-08-17T16:10:15","sha256":null}],[{"path":"docs/progress-reports/M9_PROGRESS_TRACKER.md","size":10418,"ext":".md","mtime":"2025-08-15T14:44:43","sha256":"e86288ddbae86de799f18748bd86312ade6fbba62122a63f4f9f647b6700fdd6"},{"path":"docs-interactive/M9_PROGRESS_TRACKER.md","size":10418,"ext":".md","mtime":"2025-08-15T15:04:32","sha256":"e86288ddbae86de799f18748bd86312ade6fbba62122a63f4f9f647b6700fdd6"}],[{"path":"docs/milestone-reports/M9.2_COMPLETION_SUMMARY.md","size":10055,"ext":".md","mtime":"2025-08-15T13:25:34","sha256":"7b659963df0c8db278d6627828e56191e31b45c0621387c78295055f8ee3f778"},{"path":"docs-interactive/M9.2_COMPLETION_SUMMARY.md","size":0,"ext":".md","mtime":"2025-08-15T17:35:26","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}],[{"path":"docs/milestone-reports/M9.5_COMPLETION_SUMMARY.md","size":9123,"ext":".md","mtime":"2025-08-15T14:32:44","sha256":"02d78ff4d08647664262d09864f4bba6c7c94c07ed52f12b7cbb78eaded95478"},{"path":"docs-interactive/M9.5_COMPLETION_SUMMARY.md","size":0,"ext":".md","mtime":"2025-08-15T17:36:11","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}],[{"path":"docs/milestone-reports/M9.4_COMPLETION_SUMMARY.md","size":7903,"ext":".md","mtime":"2025-08-15T14:32:43","sha256":"bf1fcc661b8b5191ff9ce24a44aa86f936d3bed116b01d9aa0b250e30914b687"},{"path":"docs-interactive/M9.4_COMPLETION_SUMMARY.md","size":0,"ext":".md","mtime":"2025-08-15T17:36:04","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}],[{"path":"docs/milestone-reports/M9.3_COMPLETION_SUMMARY.md","size":5757,"ext":".md","mtime":"2025-08-15T14:32:43","sha256":"41f5a131763d006dfee9a57806a99d9b71225fa7d2e88d4a94505c01a10854c3"},{"path":"docs-interactive/M9.3_COMPLETION_SUMMARY.md","size":0,"ext":".md","mtime":"2025-08-15T17:35:57","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}],[{"path":"docs/milestone-reports/M9.6_PERFORMANCE_COMPLETE.md","size":9014,"ext":".md","mtime":"2025-08-15T14:32:45","sha256":"c583bb4c1af00d04e91ceae287bc10a6f8c91d553d10d79a6933b72832c406c3"},{"path":"docs-interactive/M9.6_PERFORMANCE_COMPLETE.md","size":0,"ext":".md","mtime":"2025-08-15T17:36:19","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}],[{"path":"docs/session-reports/SESSION_COMPLETION_REPORT_M9.3.md","size":7073,"ext":".md","mtime":"2025-08-15T14:32:43","sha256":"3da1a35702c8a305ea5a53abc04753d755db6fd6bb9ae082275af6be790cfff7"},{"path":"docs-interactive/SESSION_COMPLETION_REPORT_M9.3.md","size":0,"ext":".md","mtime":"2025-08-15T17:36:01","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}],[{"path":"docs/session-reports/SESSION_COMPLETION_REPORT_M9.5.md","size":7178,"ext":".md","mtime":"2025-08-15T14:32:44","sha256":"d060a9e3fe07f30c3d1206aad1d6a0862d065ee0169a507fcf7ed1e434b1b80d"},{"path":"docs-interactive/SESSION_COMPLETION_REPORT_M9.5.md","size":0,"ext":".md","mtime":"2025-08-15T17:36:13","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}],[{"path":"docs/session-reports/SESSION_COMPLETION_REPORT_M9.4.md","size":7817,"ext":".md","mtime":"2025-08-15T14:32:43","sha256":"f3d2b849e92acf10039879c9ce2ebb7040ac9924a4326d3f2485b297704284a1"},{"path":"docs-interactive/SESSION_COMPLETION_REPORT_M9.4.md","size":0,"ext":".md","mtime":"2025-08-15T17:36:05","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}],[{"path":"observability/metrics.py","size":9113,"ext":".py","mtime":"2025-08-13T13:24:03","sha256":"d654d69875598bdb4e0a21834b0936b3167f4691b32c3edfd3edef2ca94e8cf7"},{"path":"quotas/metrics.py","size":6564,"ext":".py","mtime":"2025-08-13T15:24:06","sha256":"f5466bad326e42b0b25077fa730c104bff3c39169adfc075e9d82588d5ed83e9"}],[{"path":"quotas/models.py","size":3610,"ext":".py","mtime":"2025-08-13T15:24:06","sha256":"5c28cc396bbcca726d0f4551571a844a50f3dc0a956d119b5f7aba7111c87c5f"},{"path":"auth/models.py","size":6871,"ext":".py","mtime":"2025-08-13T13:59:31","sha256":"bc96951985135fa446535d91aeeb474f5ab94ba101c0c8c6fd5c4811846f3afd"},{"path":"sdk/python/nox_sdk/models.py","size":12650,"ext":".py","mtime":"2025-08-13T19:20:54","sha256":"ff319364c244875254b82f824fae268627fda365e0e602f7080035c810df3fc2"}],[{"path":"quotas/routes.py","size":8154,"ext":".py","mtime":"2025-08-13T16:01:46","sha256":"03a88c892534e018fd2d52ac77fb06a88570350603003b3dbd9c4668d5cd74da"},{"path":"auth/routes.py","size":7291,"ext":".py","mtime":"2025-08-13T13:59:31","sha256":"44fd0774e8bcdde5d88e10d6fc815d31d5fbf63e6e1ebc6cb01af699300ca36f"}],[{"path":"quotas/__init__.py","size":1074,"ext":".py","mtime":"2025-08-13T15:24:06","sha256":"60d628e0fbf6c05726afeda7f351b9f90fe7ccc13d1014f9864eaa722590589f"},{"path":"api/__init__.py","size":0,"ext":".py","mtime":"2025-08-17T15:28:04","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"api/services/__init__.py","size":0,"ext":".py","mtime":"2025-08-17T15:28:11","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"api/schemas/__init__.py","size":0,"ext":".py","mtime":"2025-08-17T15:28:09","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"api/routes/__init__.py","size":0,"ext":".py","mtime":"2025-08-17T15:28:06","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"ai/__init__.py","size":0,"ext":".py","mtime":"2025-08-17T15:28:13","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"ai/runners/__init__.py","size":0,"ext":".py","mtime":"2025-08-17T15:28:15","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"auth/__init__.py","size":778,"ext":".py","mtime":"2025-08-13T13:59:31","sha256":"b2416364ae4fcd5081deb56952254ec2bd5951dcaafb44037535a23e1b3d27cd"},{"path":"sdk/python/nox_sdk/__init__.py","size":7812,"ext":".py","mtime":"2025-08-13T19:20:54","sha256":"99eb04b377346d3d71e05df5648b2212d4713112a92d57605aacc0a959edf80f"},{"path":"sdk/python/nox_sdk/ai/__init__.py","size":1010,"ext":".py","mtime":"2025-08-13T19:20:54","sha256":"fe02e7b9bacd247df152c48f12caf4e8b74ec3e10e7de072ac88e65592ae04e6"}],[{"path":"dashboard/client.py","size":2155,"ext":".py","mtime":"2025-08-13T13:37:57","sha256":"9309e969374856e099e1671bb6685a191cb4ba04f7acd83abb7e4a19d7761d4b"},{"path":"sdk/python/nox_sdk/client.py","size":20211,"ext":".py","mtime":"2025-08-13T19:20:54","sha256":"1307450b6202df57647ad6341024f0d520cb914bd894b7295646fe1fa5ca61bd"}],[{"path":"auth/utils.py","size":5679,"ext":".py","mtime":"2025-08-13T13:59:31","sha256":"340b4c249865edb431a9a9bf620756ce8cde194ee440f782be4f7ea7885d0d39"},{"path":"sdk/python/nox_sdk/utils.py","size":17352,"ext":".py","mtime":"2025-08-13T19:20:54","sha256":"8b527c48b9b301ee7e4fb1dbc4d77a8e7f02ef872905fd8c151ab6526ff4c0f8"}],[{"path":"sdk/typescript/package.json","size":3850,"ext":".json","mtime":"2025-08-13T19:20:54","sha256":"e7ea3898279a71e0d6a619cadfdad8995fcf37a7e46ddeabebd356293cff5a0f"},{"path":"docs-interactive/package.json","size":1010,"ext":".json","mtime":"2025-08-15T15:23:12","sha256":"66a08ad673bba20066cc4b6c7401e3c731d73fccbe778eeb7c77f0155967593e"},{"path":"docs-interactive/sdk-typescript/package.json","size":1476,"ext":".json","mtime":"2025-08-15T14:32:42","sha256":"69eb0e39891745acc1389d61069beb0fc4419e4f30f65ec0c69e613b0d037b57"}],[{"path":"sdk/typescript/tsconfig.json","size":1067,"ext":".json","mtime":"2025-08-13T19:20:54","sha256":"4367bd20103f771159dfcb42fe2d535245761d363aea1c045bc62f01d0b82815"},{"path":"docs-interactive/tsconfig.json","size":602,"ext":".json","mtime":"2025-08-13T19:43:09","sha256":"83d292a6930a317ea31ef48e220097d2ca10c6c505f41d5954795acef48ca3b9"},{"path":"docs-interactive/sdk-typescript/tsconfig.json","size":784,"ext":".json","mtime":"2025-08-15T14:32:42","sha256":"17b29a5b8033a533ca70b01b53ad11b56ffce5922cdc070e6d9b8dc7097ca207"}],[{"path":"sdk/typescript/src/utils.ts","size":13425,"ext":".ts","mtime":"2025-08-13T19:20:58","sha256":"8c1de247847216435e601dfa9a3abde324d3f911b5d0b60794545aad35f639da"},{"path":"docs-interactive/src/lib/utils.ts","size":166,"ext":".ts","mtime":"2025-08-15T15:23:13","sha256":"51bbf14cd1f84f49aab2e0dbee420137015d56b6677bb439e83a908cd292cce1"}],[{"path":"sdk/typescript/src/index.ts","size":6920,"ext":".ts","mtime":"2025-08-13T19:20:59","sha256":"68d91231027ab8c477e833390dd6dd19504c635313781ef833b826bd684e26a9"},{"path":"docs-interactive/sdk-typescript/src/index.ts","size":11286,"ext":".ts","mtime":"2025-08-15T14:32:53","sha256":"59af7a05eface216f97b445cf5f5adaa1eca6416d6e797f691f31873fef0c0d1"}],[{"path":"docs-interactive/src/app/page.tsx","size":535,"ext":".tsx","mtime":"2025-08-15T15:04:34","sha256":"f9afd0e46b8e624b522289a873c751aaafe8571b1b19520a519b24472850ad57"},{"path":"docs-interactive/src/app/auth/callback/page.tsx","size":1351,"ext":".tsx","mtime":"2025-08-15T14:32:48","sha256":"7eff98a93995da9c841e75cbd776a52bd389ae105b2f215ec3a822176eed4d19"}]],"duplicates_by_hash":[[{"path":"PRODUCTION_DEPLOYMENT_GUIDE.md","size":0,"ext":".md","mtime":"2025-08-15T23:13:52","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"SESSION_COMPLETION_REPORT_M9.2.md","size":0,"ext":".md","mtime":"2025-08-15T23:13:12","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"PROBLEM_RESOLUTION_REPORT.md","size":0,"ext":".md","mtime":"2025-08-15T23:14:18","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"DOCUMENTATION.md","size":0,"ext":".md","mtime":"2025-08-15T23:13:30","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"AUTHENTICATION_GUIDE.md","size":0,"ext":".md","mtime":"2025-08-15T23:14:08","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"ENHANCED_DEPLOYMENT_GUIDE.md","size":0,"ext":".md","mtime":"2025-08-15T23:14:11","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"README.md","size":0,"ext":".md","mtime":"2025-08-15T23:13:43","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"API_USER_GUIDE.md","size":0,"ext":".md","mtime":"2025-08-15T23:14:05","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"COMPREHENSIVE_PROGRESS_REPORT.md","size":0,"ext":".md","mtime":"2025-08-15T23:13:49","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"STAGING_VALIDATION_RELEASE_CHECKLIST.md","size":0,"ext":".md","mtime":"2025-08-15T23:14:12","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"SECTIONS_1_2_COMPLETION.md","size":0,"ext":".md","mtime":"2025-08-15T23:13:51","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"MIGRATION_GUIDE.md","size":0,"ext":".md","mtime":"2025-08-15T23:14:10","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs/session-reports/SESSION_COMPLETION_REPORT_M9.2.md","size":0,"ext":".md","mtime":"2025-08-15T17:35:36","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"api/__init__.py","size":0,"ext":".py","mtime":"2025-08-17T15:28:04","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"api/services/__init__.py","size":0,"ext":".py","mtime":"2025-08-17T15:28:11","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"api/schemas/__init__.py","size":0,"ext":".py","mtime":"2025-08-17T15:28:09","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"api/routes/__init__.py","size":0,"ext":".py","mtime":"2025-08-17T15:28:06","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"ai/__init__.py","size":0,"ext":".py","mtime":"2025-08-17T15:28:13","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"ai/runners/__init__.py","size":0,"ext":".py","mtime":"2025-08-17T15:28:15","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"monitoring/prometheus.yml","size":0,"ext":".yml","mtime":"2025-08-15T12:45:10","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"monitoring/alert_rules.yml","size":0,"ext":".yml","mtime":"2025-08-15T12:45:11","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"monitoring/quota_alert_rules.yml","size":0,"ext":".yml","mtime":"2025-08-15T12:45:14","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"nox-api/tests/nox_client.py","size":0,"ext":".py","mtime":"2025-08-13T08:15:16","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs-interactive/M9.2_COMPLETION_SUMMARY.md","size":0,"ext":".md","mtime":"2025-08-15T17:35:26","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs-interactive/M9.5_COMPLETION_SUMMARY.md","size":0,"ext":".md","mtime":"2025-08-15T17:36:11","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs-interactive/M9.4_COMPLETION_SUMMARY.md","size":0,"ext":".md","mtime":"2025-08-15T17:36:04","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs-interactive/SESSION_COMPLETION_REPORT_M9.3.md","size":0,"ext":".md","mtime":"2025-08-15T17:36:01","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs-interactive/SESSION_COMPLETION_REPORT_M9.5.md","size":0,"ext":".md","mtime":"2025-08-15T17:36:13","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs-interactive/M9.3_COMPLETION_SUMMARY.md","size":0,"ext":".md","mtime":"2025-08-15T17:35:57","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs-interactive/M9.6_PERFORMANCE_COMPLETE.md","size":0,"ext":".md","mtime":"2025-08-15T17:36:19","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{"path":"docs-interactive/SESSION_COMPLETION_REPORT_M9.4.md","size":0,"ext":".md","mtime":"2025-08-15T17:36:05","sha256":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}],[{"path":".env.production.example","size":4422,"ext":".example","mtime":"2025-08-15T16:18:41","sha256":"d6a4ce7047e6014f7fc46a2d08e8aefe27a2e902674113cf06efca572c0f9c48"},{"path":".env.production","size":4422,"ext":".production","mtime":"2025-08-15T18:55:39","sha256":"d6a4ce7047e6014f7fc46a2d08e8aefe27a2e902674113cf06efca572c0f9c48"}],[{"path":"docs/progress-reports/M9_PROGRESS_TRACKER.md","size":10418,"ext":".md","mtime":"2025-08-15T14:44:43","sha256":"e86288ddbae86de799f18748bd86312ade6fbba62122a63f4f9f647b6700fdd6"},{"path":"docs-interactive/M9_PROGRESS_TRACKER.md","size":10418,"ext":".md","mtime":"2025-08-15T15:04:32","sha256":"e86288ddbae86de799f18748bd86312ade6fbba62122a63f4f9f647b6700fdd6"}],[{"path":"observability/metrics.py","size":9113,"ext":".py","mtime":"2025-08-13T13:24:03","sha256":"d654d69875598bdb4e0a21834b0936b3167f4691b32c3edfd3edef2ca94e8cf7"},{"path":"observability/metrics_backup.py","size":9113,"ext":".py","mtime":"2025-08-13T13:12:45","sha256":"d654d69875598bdb4e0a21834b0936b3167f4691b32c3edfd3edef2ca94e8cf7"}],[{"path":"nox-api/api/nox_api.py","size":7082,"ext":".py","mtime":"2025-08-13T14:36:11","sha256":"ed2d11af514133b5e46b6d68ae7265a38e216740836aca38fae0847066d7b22e"},{"path":"nox-api/api/nox_api_clean.py","size":7082,"ext":".py","mtime":"2025-08-13T13:24:03","sha256":"ed2d11af514133b5e46b6d68ae7265a38e216740836aca38fae0847066d7b22e"}],[{"path":"docs-interactive/src/app/page.tsx","size":535,"ext":".tsx","mtime":"2025-08-15T15:04:34","sha256":"f9afd0e46b8e624b522289a873c751aaafe8571b1b19520a519b24472850ad57"},{"path":"docs-interactive/src/app/page-simple.tsx","size":535,"ext":".tsx","mtime":"2025-08-15T15:04:34","sha256":"f9afd0e46b8e624b522289a873c751aaafe8571b1b19520a519b24472850ad57"}]]}
```

## Checklist de validation

- [ ] Tous les chemins listés existent dans `nox-api-src/`.
- [ ] Recalculer 3 SHA256 au hasard et comparer avec le tableau.
- [ ] Les recommandations n'impliquent pas de suppression sans sauvegarde.
- [ ] Les dossiers exclus n'apparaissent pas dans l'inventaire.
- [ ] Les imports et endpoints critiques passent les tests après consolidation.
- [ ] Les chemins relatifs restent valides après tout mouvement suggéré.