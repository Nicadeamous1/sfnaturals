# Validation and review report

Date: 2026-09-16. Review preview: http://127.0.0.1:4188 (this computer only). Production remains version 11; no Sites deployment was performed.

## Results
- Typecheck, lint and build passed. Node tests: 5/5. Browser scenarios: 11/11. npm audit: 0 vulnerabilities after removing the temporary Lighthouse audit dependency.
- Browser coverage: six story stages, pause/resume, still-image switch, offscreen suspension, phone and reduced motion, WebGL initialization failure, failed model request, context loss, JavaScript-disabled HTML, existing product dialogs/CTA, low memory and simulated document visibility changes.
- Desktop, laptop, tablet and phone screenshots inspected; no horizontal overflow or browser errors. Original ocean.js and ambient.js are unchanged from accepted production.
- Final compressed model decoded and freshly imported in Blender: 14,272 triangles, 13 meshes, six materials, three textures. Geometry hard gate passed; six-view evidence inspected. Separate label surfaces mean this is not a watertight manufacturing model.

## Payload and performance
Optimized GLB: 188,544 bytes (raw: 1,436,372); embedded textures: 110,704 bytes. Static WebP: 54,496 bytes. Baked reflection texture: 113,269 bytes. Lazy renderer: 655,620 bytes; entry: 1,926; shared chunk: 634. These are file sizes before HTTP compression; the GLB is not the entire experience payload.

| Measurement | Desktop | Phone |
|---|---|---|
| Lighthouse 12.6.1 performance | 88 | 81 |
| Lighthouse accessibility / best practices / SEO | 100 / 100 / 100 | 100 / 100 / 100 |
| Simulated LCP | 726 ms | 5,107 ms |
| Simulated total blocking time | 290 ms | 0 ms |
| Observed local LCP | 236 ms | 108 ms |
| Observed initial resource bytes | 1,416,479 | 458,146 |
| Rendering | about 60 fps, DPR <=1.5 | static; no GLB or renderer bundle |

Observed throttled phone (1.6 Mbps, 150 ms latency, CPU 4x): LCP 1,236 ms; load 2,716 ms. This is a separate experiment from Lighthouse simulation, not a replacement for its 5.1-second mobile result. Tablet emulation rendered about 30 fps at DPR 1. Viewport/CPU emulation on this computer is not physical mobile-device testing. Lighthouse preceded the final equivalent config-driven cue refactor and dependency removal; final build/browser results and observed measurements cover the delivered implementation.

## Review limitations / manual work
- Lighthouse's mobile LCP remains a performance limitation to evaluate on target devices and deployed hosting before production approval.
- Preview is local only; no externally shareable staging endpoint was provisioned.
- Exact video companion Blender-to-web skill repository could not be verified from the description, creator article or searches. Caption retrieval was empty; video frames were not independently inspected. The documented official glTF fallback was used. No claim is made that undisclosed video requirements were installed.
- Obtain print-ready flat artwork, measured packaging dimensions/materials, and approved ingredients/claims/weight. Current textures preserve supplied raster artwork; geometry and contents are presentation approximations.
- Physical device and assistive-technology user testing remain advisable. Automated accessibility scores do not establish complete accessibility. Hidden-state test used a simulated event.
- Production publication requires the owner's explicit approval after review.

Evidence: browser-tests.json, measured-performance.json, lighthouse-summary.json, model-import-metrics.json, asset-payload.json, bundle-sizes.json and toolchain-verification.json. Human-readable Lighthouse reports and screenshots are in outputs/.

## Current review scope
A later commerce-first brief superseded the live-3D homepage presentation. The pipeline remains available in /3d-study.html, while the homepage uses original coastal artwork and protected environmental motion. See hero-decision.md for the current visual decision and validation. Do not apply this study's Lighthouse scores to the new hero.
