# 3D upgrade requirement audit

Baseline: f36d90e49d548c51507b0ce82f188a218bfd202a (production v11). Local and fetched remote match. Branch: feature/interactive-3d-products. Production deployment prohibited pending explicit approval.

| Brief section | Acceptance / evidence | Status |
|---|---|---|
| 1 Audit | Existing static HTML/CSS/JS, Sites repository; fetched main matches HEAD; no GitHub counterpart confirmed; asset inventory; baseline tests/performance | In progress |
| 2 Toolchain | Blender 5.0.1 reused; uv 0.12.15; MCP 2.0.0 E2E object/inspect/export passed; Studio 0.6.2 full plugin installed; companion traced through video/creator, exact link unavailable | In progress |
| 3 Real labels | Extract original pixels from tallow-balm.jpg; no generated or retyped label text; identify production replacements | Pending |
| 4 Model | Separate amber jar, black lid, product volume, front/back/top labels; editable source, blend, GLB, textures, renders | Pending |
| 5 Story | Brand, front focus, lid opening, verified ingredient cues, reassembly, family; subtle pointer/idle | Pending |
| 6 Reuse | Product config + Scene/Model/Lighting/Loader/Timeline/Interaction/Fallback/Performance modules | Pending |
| 7 Optimize | GLB, meshopt evaluation, texture compression, payload report, lazy/cached assets | Pending |
| 8 Capability | Full/reduced/static modes; reduced motion, initialization/WebGL/context failure | Pending |
| 9 Performance | Offscreen/hidden suspension, clean disposal, desktop/laptop/tablet/phone/network measurements | Pending |
| 10 Identity | Existing teal/cream/burgundy/gold and accepted scenes preserved | Pending |
| 11 SEO/accessibility | HTML copy and controls remain; keyboard and screen reader behavior | Pending |
| 12 Tests | Baseline asset refs pass; no previous test suite/typecheck/lint/build. New checks + real visual inspection | In progress |
| 13 Repository | Feature branch; logical commits; push actual existing source repo; no unrelated repo/false GitHub claim | In progress |
| 14 Deliverables | All 18 enumerated below; docs/3d-toolchain.md and docs/product-3d-workflow.md | Pending |
| 15 Execution | Autonomous full loop; stop only genuine blocker or production approval | Ongoing |

## Deliverable checklist
1. Actual repository and branch: identified Sites-managed source; feature branch created.
2. Commits: pending.
3. Separate preview URL: pending; live URL must remain v11.
4. Desktop/tablet/phone screenshots: pending.
5. Blender version/path: 5.0.1, D:/Blender/blender.exe.
6. Blender MCP: 2.0.0; add-on protocol 7; E2E passed, logs work/mcp-roundtrip.json.
7. Blender Agent Studio: full plugin 0.6.2+codex.20260914085919 installed; callable test pending.
8. Exact Blender-to-web skill: video description and creator article retrieved; no repo URL supplied by either; fallback must be documented.
9. Other requirements: uv/Bun installed; Three.js/optimization/test packages installing; no unverified random add-ons.
10. Source .blend: pending.
11. GLB: pending.
12. Textures: pending.
13. Web payload: pending.
14. Mobile fallback: pending.
15. Desktop performance: pending.
16. Mobile performance: pending.
17. Tests/results: pending.
18. Manual work: production artwork/dimensions/formula confirmation; no fabricated facts.
