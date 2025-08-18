# Types of Agents in Nox

Nox’s “agent” is the reasoning and orchestration layer.  
Different levels of agent exist:

## 1. Reactive (task runner)
- Waits for explicit commands (e.g., run XTB).
- Simple, predictable, no initiative.

## 2. Orchestrator (workflow manager)
- Chains multiple steps (e.g., SMILES → 3D → XTB → VoD).
- Knows dependencies.

## 3. Proactive (event-driven)
- Watches folders or events.
- Triggers jobs automatically (e.g., auto-run `.xyz` dropped in ToAnalyze).

## 4. Cognitive (reasoning + planning)
- Given a high-level goal, decides which tools to use.
- Example: “Evaluate this molecule’s detonation performance” → pipeline auto-built.

## 5. Autonomous (long-term, goal-seeking)
- Works continuously in background.
- Maintains datasets, benchmarks, retrains ML.
- Needs guardrails and human confirmation.

## Nox Today
- Already has Type 1–3.
- Building toward Type 4 (cognitive).
- Raspberry Pi IAM-Node will evolve into Type 5 (autonomous).