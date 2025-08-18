# Intelligent AI API for Nox

Adds a natural-language agent endpoint on top of Nox’s jobs.

## Purpose
- Let the user ask in plain language:  
  *“Analyse this SMILES and give VoD/Pcj with uncertainty.”*
- Agent decides which pipelines to run and returns a summarized report.

## Endpoints
- `POST /agent/ask` → natural language → plan → jobs → summary.
- `POST /agent/run` → run a named intent with params.
- `GET /agent/state` → current memory, last runs, context.

## Features
- **Router**: intent → tool mapping (XTB, Psi4, KJ, ML, CJ).
- **Memory**: last runs, project context.
- **Persona**: profile YAML (tone, defaults, rules).
- **Guardrails**: block unsafe intents, require confirmation for long jobs.

## What you achieve
- Natural language → automated workflows.
- Automatic orchestration (multi-step pipelines).
- Context awareness & memory.
- Unified entrypoint for IAM UI.
- Foundation for autonomy.