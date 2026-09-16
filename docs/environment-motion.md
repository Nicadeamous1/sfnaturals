# Realistic environmental motion

## Current result
The accepted commerce-first layout, immediate Shop buttons, product cards and original artwork are retained. Only environmental overlays changed. Preview: http://127.0.0.1:4188/. No production deployment.

- **Coast / Tallow Balm:** recorded ocean waves replace sinusoidal image-strip distortion. One undistorted video plane sits behind a precise feathered protective matte. Recorded wavefronts and reflections stay coherent; there is no reversing ping-pong water. Depth blur and a teal grade match the supplied photo. The same film is reused in the lower balm chapter.
- **Soap sky:** one rigid cloud field drifts under a constant wind direction, with a long dissolve closing a 24-second cycle. No per-row deformation. The soap and all artwork remain outside the mask.
- **Citrus:** softly defocused leaf-shadow clusters move under a shared wind field on background canopy and exposed stone. Oranges, jars, label and foreground remain protected. This is dappled-light compositing, not fabricated 3D branches or newly filmed foliage. There is no fruit resampling or full-image brightness pulse.

## Source and license
Ocean: [Calm Ocean Waves at Sunset, William Chen](https://www.pexels.com/video/calm-ocean-waves-at-sunset-34754995/), under the [Pexels License](https://www.pexels.com/license/), retrieved 2026-09-16. The license permits free website use and modification. No paid/trial generation, subscriptions or asset purchases were used. Attribution and precise provenance are retained in dist/assets/motion/provenance.json. No endorsement is implied.

The 3840x2160 original was downloaded temporarily for production, not included in the site/repository. A 13-second excerpt starting at second 4 becomes a silent 12-second loop: crop, scale, teal grade, depth blur, one-second dissolve, H.264 faststart. The completed derivative is 593,467 bytes, 960x360, 24fps. Recreate using FFMPEG_EXECUTABLE and scripts/prepare-water.mjs with the downloaded source. That full source is approximately 1.12 GB; the final site only ships the small derivative. The temporary FFmpeg utility is not a project runtime dependency.

## What visual review caught
The first filmed composite was too sharp and gray, exposing its boundary around the circular artwork. Depth blur, color matching and a tighter mask corrected this before delivery. The supplied image contains a large circular artwork panel as well as jars; this source composition remains intact. The surrounding environment changes, not the artwork itself.

Captured full after-cycles: coast 14 seconds, clouds 26 seconds, citrus 18 seconds. Frame-by-frame contact sheets were inspected. Six-second before samples are included for comparison. The cloud and light effects are deliberately quieter than the ocean, and do not create physical foliage motion from a flat image. Additional branch motion would require a clean background plate or matching footage; none is falsely claimed.

## Verification
- Ten focused environmental checks pass: protected products, simulated hidden document, pause/resume/shop dialog, cloud and citrus periodicity/protection, offscreen ocean pause, reduced motion, save-data, unavailable video, and phone rendering.
- Seven commerce-hero scenario groups pass, including desktop/tablet/two phones, immediate shop actions, all product cards/dialogs, reduced motion and no-JavaScript imagery/link.
- Node tests 5/5; typecheck, lint, build and motion-script syntax checks pass.
- Tested overlay alpha is exactly zero over jars/labels/wood, soap foreground and protected citrus regions. Original source imagery remains unchanged.
- Decoded ocean loop boundary mean RGB difference: 1.849/255 versus 1.082/255 for a normal neighboring frame; full mid-cycle difference 13.872/255. It is a soft forward-motion dissolve, not a mathematically identical endpoint or reverse playback. Browser seeking did not provide reliable frame-difference evidence, so this check used independently decoded frames.
- Cloud/citrus cyclic endpoint differences were below 0.001/255 including raster-rounding noise. Rendering runs at about 20 composite updates per second. Main-thread draw submission averaged ~0.09 ms/cloud and ~0.34 ms/citrus on this computer; these figures exclude GPU completion and video decoding.
- Reduced motion and save-data do not download footage. Video failure keeps the original image. Offscreen, hidden or user-paused video stops. Video loading waits for initial page/image loading; hidden dialog artwork is lazy-loaded.

## Observed performance
| Case | LCP | Initial resource bytes, including video | Long-task excess during observation |
|---|---:|---:|---:|
| Desktop 1440x1000, local | 284 ms | 1,502,118 | 96 ms |
| Phone 390x844, local | 120 ms | 1,345,704 | 58 ms |
| Phone, 1.6 Mbps / 150 ms latency / CPU 4x | 3,644 ms | 1,345,704 | 657 ms |

The first throttled trial reached 6,128 ms LCP because video competed with images. Deferring video and lazy-loading the hidden dialog improved that to 3,644 ms. This remains a tradeoff and requires physical-device review; these are local emulated observations, not new Lighthouse scores or a claim of perfect mobile performance. Video is cached and reused by both coastal scenes. Frame counts show playback continues after loading.

## Review artifacts
outputs/motion/coastal-motion.mp4, cloud-motion.mp4, citrus-motion.mp4; hero/soap/lotion-before.webm; hero-after.png and phone-after.png; full-cycle contact sheets. Canvas clips show actual browser-composited environmental layers with original artwork; full-page screenshots show their placement in the accepted layout.

Authoritative implementation: dist/environment-motion.js and the three small scene wrappers. Evidence: environment-motion-tests.json, environment-video-seam.json, environment-performance.json, coastal-hero-validation.json. The local preview server remains running. Production publication still requires separate explicit approval.
