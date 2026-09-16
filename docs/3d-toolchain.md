# Blender / web toolchain

Audit date: 2026-09-16. Live production remains v11; no upgrade deployment authorized.

| Component | Repository/package | Version | Purpose / install / verification / update |
|---|---|---|---|
| Blender | blender.org | 5.0.1 a3db93c5b259 | Existing D:/Blender/blender.exe reused. CLI fingerprint and MCP scene/export tests passed. Update through Blender only after regression checks. Studio upstream tests 5.2; actual installed 5.0.1 compatibility is being measured. |
| uv | astral-sh/uv | 0.12.15 | Official PowerShell installer; user .local/bin. uv --version passed. Update uv self update. |
| Bun | oven-sh/bun | 1.4.2 | Official PowerShell installer; user .bun/bin. Runs Studio MCP; actual tool calls passed. Update bun upgrade. |
| Blender MCP | ahujasid/blender-mcp redirects to ahujasid/mcp-for-blender; PyPI mcp-for-blender | 2.0.0 / add-on protocol 7 | uv tool install; official install-addon. Add-on at Blender/5.0/scripts/addons/blender_mcp.py; enabled and saved preferences. Codex registered with absolute uvx path. Local socket only; telemetry disabled. Actual MCP initialize → status → create cube → object inspection → GLB export succeeded; logs in ignored work/mcp-roundtrip.json. Update pinned package and add-on together; rerun round trip. |
| Blender Agent Studio | ifBars/blender-agent-studio | 0.6.2+codex.20260914085919 | Full Codex marketplace/plugin installation; dependencies installed in plugin cache. 11 tools listed; blender_version and blender_inspect_asset called successfully via its real MCP transport. New task may be needed for native tool-list refresh; current task can call server through MCP client. Update marketplace then plugin, install deps, rerun checks. |
| Exact Blender-to-web companion | Video RhGiG-yZP-c / Chase AI | Not retrievable | Retrieved YouTube description and creator article linking exact embedded video. Both refer to companion repo; neither exposes repo URL. Exact-ID/name/GitHub searches found no verifiable companion. Did not silently substitute a similarly named skill. Fallback below is explicitly used. |
| Web fallback | Three.js GLTFLoader + Blender glTF exporter + glTF Transform/Meshoptimizer | See package-lock.json | Maintained official glTF path; npm local install. Build, optimized export, fresh import and browser checks required. Update lockfile deliberately and repeat tests. |
| Validation | TypeScript, ESLint, Node test, Playwright, Lighthouse | See package-lock.json | Local dev dependencies; no runtime framework rewrite. Actual results recorded separately. |

## Verified sources
- https://www.youtube.com/watch?v=RhGiG-yZP-c — description retrieved; caption/video frames not yet verified.
- https://www.chaseai.io/blog/gpt-6-astra-blender-3d-websites — creator's current walkthrough and exact video embed retrieved. Requires Blender, Agent Studio, Blender-to-web skill; advocates static mobile, payload measurement, offscreen pause. No additional specific add-ons or compression packages disclosed.
- https://github.com/ahujasid/blender-mcp — current maintained repository inspected, now mcp-for-blender.
- https://github.com/ifBars/blender-agent-studio — current full plugin inspected and installed.
- https://threejs.org/docs/#examples/en/loaders/GLTFLoader
- https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html
- https://gltf-transform.dev/

No API keys, paid asset services, random add-ons, or duplicate Blender installation used. Reproducible project scripts do not embed this machine's executable path: pass BLENDER_EXECUTABLE when rebuilding. Machine paths here are audit evidence only.
