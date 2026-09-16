# Commerce-first hero decision

This is the current review scope, superseding the original live-3D-centered homepage brief. Production is unchanged. Preview: http://127.0.0.1:4188. Preserved interactive study: /3d-study.html.

## Homepage audit (1440 x 1000)
The former hero named balm/soap/lotion and showed a jar immediately, but its first action was a generic collection link. The live-3D journey consumed 5.258 viewport heights. The collection began 7.162 screens down; its first detail button was 8.093 screens down. The collection itself added a 3.6-screen pinned sequence. No actual price or connected purchase existed anywhere. No amount of scrolling could reveal information that had not been supplied. The isolated glossy jar read as a model, not premium coastal photography; the page prioritized presentation mechanics over product selection.

The new hero identifies Tallow Balm immediately, presents supplied coastal artwork as the dominant image, and offers SHOP TALLOW BALM and SHOP ALL PRODUCTS within the first viewport. The first opens the existing real product-details dialog. The second reaches three direct product-selection cards immediately after the hero. Sticky Shop navigation remains available. Pricing/availability are visibly pending; checkout is not simulated.

## Visual and technical comparison
| Approach | Actual evidence evaluated | Visual result | Technical tradeoff | Decision |
|---|---|---|---|---|
| A. Real-time 3D | Existing functioning Three.js prototype and its desktop screenshot | Current jar is isolated and visibly CG. It does not meet the grounded photoreal environment requirement. | ~656 KB lazy renderer + 189 KB GLB + 113 KB reflection asset; GPU and fallback requirements. A new environment would require additional modeling/art direction. | Reject current output for hero; retain study/source. |
| B. Blender cinematic | Actual hero and open-lid Blender still renders | Controlled light, but label crops carry photographic shading and jar remains a studio model. Animating this appearance does not solve the visual issue. | A render can deliver shadows/DOF without browser GPU; a finished coastal loop would need new environment production, encoding and video budget. No completed loop or video payload measurement claimed. | Do not invest in a loop until a still beats supplied artwork. |
| C. Hybrid | Actual responsive hero with original coastal artwork and sea/sky-only canvas animation | Warm directional light, original amber reflections, textured weathered wood, believable jar contact and intact artwork. Strongest available result. | 265,246-byte WebP; lightweight 2D motion, no GLB/Three fetch; static image works without animation. | Selected for this bounded proof. |

These are comparisons of the actual available outputs, not three newly completed photoreal environments. No paid generation or video credits were used. Artwork provenance remains supplied artwork; it is not represented as a newly photographed commercial shoot. No fruit or ingredients were fabricated. Existing orange/frankincense wording is from supplied artwork; product facts still require approval.

## Motion and scope
Only safe sky and side-water regions are resampled, at approximately 25 frames/second. Product, labels, fruit (none added), and wood do not deform. Pause and reduced-motion behavior are available; offscreen/hidden rendering stops. Sky drift is restrained because the source contains little cloud detail; no new cloud footage is claimed. Wave motion is the principal visible effect.

Hero motion needs zero scroll. Quick product access follows the first screen. The lower legacy ritual/collection chapters remain for context; their pinned animation length has not been redesigned in this bounded hero experiment. After hero approval, the next design pass should shorten those transitions to 0.5-1 viewport and arrange the complete WOW / SHOP / WOW / WHY / SHOP rhythm. Do not call that full-page work completed.

## Validation
Seven current hero scenarios pass: four sizes (1440x1000, 820x1180, 390x844, 375x667), motion pause/protected pixels, reduced motion and JavaScript-disabled image/link. Both hero shop actions are within the first viewport at all four sizes. All product cards open matching detail dialogs; no horizontal overflow or browser errors; no GLB requests. Screenshots were visually inspected and tablet crop corrected.

Observed local LCP: desktop 248 ms, tablet 132 ms, phone 124 ms, small phone 120 ms. These are local browser measurements, not Lighthouse scores or physical-device results. Initial resource bytes including nearby/lazy legacy content: desktop/tablet 1,231,375; phone 1,074,961. Prior Lighthouse 88/81 describes the retained 3D study, not this new hero. Build, lint, typecheck and five Node tests pass. A sandbox filesystem access error required rerunning build/tests with normal filesystem access; the rerun passed.

## Still needed
Review of this selected visual direction; actual pricing, variants, inventory and checkout provider/access; final labels and approved claims; physical-device testing; broader homepage rhythm work only after hero review. Explicit production approval remains required.

## Environmental motion upgrade
The current environmental implementation supersedes the initial scanline/sky effects described above. See environment-motion.md for filmed ocean provenance, cloud/light compositing, full-cycle evidence, protection tests and current performance. The commerce layout is unchanged.
