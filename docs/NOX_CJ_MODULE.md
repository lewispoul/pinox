# Cantera CJ Module (Planned)

Implement Chapman–Jouguet detonation prediction using Cantera.

## Goals
- Wrap Cantera equilibrium solver with CJ search loop.
- Support CHNO + metals/boron (B2O3(s), Al2O3(s)).
- Expose as Nox runner:
  - `POST /predict/cj/v1`
  - `POST /predict/cj-metals/v1`

## Inputs
- Formula/stoichiometry
- Density (g/cc)
- Optional ΔHf
- Thermo database (NASA-7 polynomials, YAML/CTI)

## Outputs
- Pcj (kbar), VoD (m/s, if EOS provided)
- Tcj (K), ρcj (g/cc)
- Product composition
- Artifacts: thermo file, CSV products, Hugoniot plots, JSON report

## Next steps
- Collect thermo data (CHNO + condensed species).
- Implement Gibbs minimization + root-finding loop.
- Benchmark against CHEETAH/Explo5 for RDX, HMX, TNT.