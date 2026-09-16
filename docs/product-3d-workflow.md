# Adding another SF Naturals 3D product

## Source and approval boundaries
The site is static HTML/CSS/JavaScript, enhanced with bundled TypeScript/Three.js. It is not React. The Site production identity remains in `.openai/hosting.json`; publishing is explicitly gated on owner approval. Preview with `npm run preview`; this listens only on localhost:4188. Do not use a Sites deployment as a preview: that would replace production.

GitHub: https://github.com/Nicadeamous1/sfnaturals. The owner supplied this empty repository during the upgrade. Its `main` was seeded with the accepted Site production history at f36d90e49d548c51507b0ce82f188a218bfd202a. All upgrade work is on `feature/interactive-3d-products`.

## 1. Gather verified inputs
Obtain front/back/lid artwork, package dimensions, material specification, and verified formula. Keep actual label pixels; never reconstruct typography or invent legal text. Identify provisional artwork clearly. Existing balm raster crops and exact rectangles are in `assets/3d/textures/provenance.json`. The balm proportions are inferred (65.2mm maximum diameter, 72.08mm overall height), not manufacturing measurements. Supplied labels are not proof of final claims or formula.

## 2. Author a reusable Blender asset
Read the installed Blender Agent Studio modeling, rendering, validation, and MCP skills. Use `assets/3d/source/create_balm.py` as the reference pattern; create a new product script rather than mutating a generated GLB. Keep a deterministic clean-scene entry point, semantic components, pivots, named reference and hero cameras, dimensional constants, and packed textures. Keep editable bevels/modifiers in the `.blend`. Model the lid at its closed local origin so the timeline's lift parameter is an offset in metres.

For a product with different articulation, add a small pose adapter instead of embedding product-specific behavior in the global renderer. The current `ProductModel` adapter uses the configured `movingPart` node; a soap model can omit it. Ingredient visual cues are currently lightweight optional presentation meshes for ingredients readable on the balm artwork. Set the ingredientCues product configuration array when adding another verified formula; do not reuse these cues for lotion or soap.

Run Blender with the existing compatible installation (set `BLENDER_EXECUTABLE` in your shell):

```powershell
& $env:BLENDER_EXECUTABLE --background --factory-startup --python-exit-code 1 --python assets/3d/source/create_balm.py
```

Graybox mode adds `-- --graybox`. Compare proportions before materials. Open the hero, open-lid view, and six-view contact sheet; inspect label orientation, intersections, silhouette, highlights and rear surfaces. Preserve successful form while fixing a defect. Use source images as references, not invented exact dimensions.

## 3. Export and optimize
Export only the product collection, not lights/cameras/ground. Preserve separate moving nodes. The current model pipeline is:

```text
node scripts/extract-labels.mjs
Blender source script → .blend + raw GLB + hero/open PNG
node scripts/optimize-model.mjs
```

The optimizer deduplicates, welds and prunes; compresses original labels to WebP at quality 92 without upscaling; retains a portable interchange GLB; then applies Meshopt. Original rasters, raw export and .blend remain in source assets. Only `dist/assets/3d/*.v1.*` runtime files ship. KTX2 was considered but not selected for three small label maps because a transcoder adds complexity/payload; revisit for many high-resolution maps. Do not combine Draco and Meshopt unnecessarily.

`assets/3d/source/bake-environment.mjs` and `scripts/bake-environment.mjs` prefilter the Three.js RoomEnvironment offline. Run a local preview first, then `node scripts/bake-environment.mjs` with a Playwright-supported browser installed. The compressed half-float CubeUV texture avoids expensive per-visitor environment generation. Bump versioned filenames and matching dimensions together if regenerating at another resolution. Texture decompression failure keeps the static fallback.

Fresh-import the final optimized GLB in Three.js. For Blender validation, decode Meshopt with glTF Transform before import (Blender's importer does not natively decode this extension). Compare names, dimensions and textures with the authored `.blend`; never merely validate the earlier unoptimized file. Use Studio `blender_inspect_asset` and `blender_render_evidence` (or their CLI scripts) and save the measurements and six-view images.

## 4. Configure and integrate
Add a `ProductConfig` in `src/product3d/config.ts`: model URL, fallback URL, camera, lighting preset, semantic label names, accessibility text, interaction amplitudes and stage states. Keep visible product copy in HTML. No price, ingredient or claim belongs solely in WebGL. Add or adapt the six `data-story-step` HTML sections and a `data-product-scene` host with an ordinary fallback `<img>`.

Responsibilities:
- `ProductScene`: lifecycle, renderer/camera, observer, timing, controls and teardown.
- `ProductModel`: hierarchy, normalisation and semantic articulation.
- `ProductLighting`: precomputed reflections and key/fill lighting.
- `ProductLoader`: abortable GLB fetch and Meshopt decoding.
- `ScrollTimeline`: smooth, clamped interpolation between product stage states.
- `InteractionController`: small pointer response without scroll capture.
- `StaticFallback`: ordinary HTML image before load and on failure.
- `PerformanceMonitor`: measured frame intervals and downgrade/fallback.
- `policy`: pure capability and render scheduling rules.

High capability: 60fps target, DPR capped at 1.5. Moderate: 30fps target, DPR 1, no antialiasing. Phones below 600px, reduced motion, save-data, 2G, <=2GB reported memory or <=2 cores: static only; no 3D bundle/GLB fetch. Unknown capability data is conservative about core count. Sustained slow rendering downgrades quality then falls back. Offscreen, hidden, paused and disposed scenes do not render. Page teardown aborts fetches and releases geometry, textures, lights and renderer.

## 5. Verify before review

```text
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
npm run test:browser
```

Browser checks use `BROWSER_EXECUTABLE` or `BROWSER_CHANNEL` (default msedge), never a committed personal path. Check desktop/laptop/tablet/phone screenshots, full scroll story, pause/resume, all existing dialogs and photo-motion controls, image loading, overflow, 200% text, keyboard focus, reduced motion, model/environment failure and WebGL/context failure. Test visibility suspension and teardown. Measure on the target device when possible; viewport emulation does not establish physical phone GPU performance.

Record actual payload bytes and cold/warm browser metrics; keep Lighthouse's simulated results separate from observed local timings. Do not advertise a score from a different code revision. After review, commit and push only the feature branch, open a draft PR, and ask for explicit production approval before any Sites save/deploy flow.

## Production handoff still needs
Print-ready flat label art, verified package dimensions/materials, and confirmed product formula/claims/weights. These are product facts, not things to infer from a concept render. No checkout or price has been added. The unavailable exact video companion skill remains documented in `3d-toolchain.md`; this project uses the explicit maintained glTF fallback workflow.

