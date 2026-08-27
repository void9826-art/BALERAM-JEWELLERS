# ANIMATION PROMPT — scroll-scrubbed showroom camera (SHRED "PRO SERIES" style)

Build ONLY the animation. Not the marketing site, not the CMS, not the forms. The deliverable is a
motion rig: a scroll-driven camera that walks through five showcases, with typography that
assembles and disassembles at each stop.

## THE MODEL — read this before writing anything
The scroll position IS the playhead. Nothing animates on a timer. Nothing plays on load. Nothing
fires "once". If the user scrolls to 43% of the page and stops, the rig must render exactly the
frame that belongs to 43% — and scrolling back up must retrace it in reverse, pixel for pixel.

Implement as: ONE GSAP master timeline, driven by ONE ScrollTrigger with `scrub: 1`. Every scene is
a nested child timeline placed on that master at a fixed position. Never create per-scene
ScrollTriggers with their own `onEnter` callbacks — that is the thing that produces stuck states
when the user scrolls fast or reloads mid-page.

  gsap.timeline({ scrollTrigger: {
    trigger: "#stage", start: "top top", end: "+=600%",
    scrub: 1, pin: true, anticipatePin: 1,
    snap: { snapTo: "labelsDirectional", duration: 0.4, ease: "power2.inOut" }
  }})

Add a label at each scene's settle point so `labelsDirectional` snaps the camera to rest rather
than leaving it stranded mid-move.

## STAGE STRUCTURE
  #stage            position: sticky; top: 0; height: 100vh; overflow: hidden
    .scene          position: absolute; inset: 0; perspective: 1200px
      .camera       transform-style: preserve-3d   <- ALL camera transforms go HERE
        .layer.far    translateZ(-260px)  back wall, shelving
        .layer.mid    translateZ(0)       the glass and the merchandise
        .layer.near   translateZ(180px)   garlands, counter edge, sofa arm
        .layer.light  translateZ(-300px)  additive-blend magenta glow only
      .type         position: absolute; inset: 0  <- NOT inside .camera, never moves with it
        .ghost      the giant background word
        .panel      the left/right copy block

Critical: the camera transform is applied to `.camera` ONLY. The layers themselves never animate.
Parallax is a consequence of their differing translateZ under a moving perspective — it is not
something you hand-animate. If you find yourself writing per-layer translateX, the rig is wrong.

Also critical: `.type` sits OUTSIDE `.camera`. The typography is locked to the screen, not to the
room. The room moves behind the words.

## CAMERA KEYFRAMES — exact values, scene by scene
Each row is `.camera` transform at that scene's local progress. Interpolate linearly between them;
the scrub provides the smoothing.

### SCENE 00 — APPROACH  (duration 1.2 on the master)
  p0.00   scale(1.60) translate3d(0, 4%, 0)   rotateX(-3deg)
  p0.80   scale(1.05) translate3d(0, 0, 0)    rotateX(0deg)
  p1.00   scale(2.40) translate3d(0, -6%, 0)  rotateX(0deg)   opacity 0
  At p0.80->p1.00 the camera punches THROUGH the doorway. Simultaneously a full-bleed --bone
  overlay goes opacity 0 -> 1 over the last 12% and back to 0 in the first 6% of Scene 01. That
  120ms white-out is the door transit. Without it the push-through reads as a zoom, not an entry.

### SCENE 01 — GOLD WALL  (duration 1.0)   [SHOWCASE 1]
  p0.00   scale(1.14) translate3d( 7%, 0, 0)
  p0.55   scale(1.08) translate3d( 0%, 0, 0)      <- SETTLE. label "s1". Type assembles here.
  p1.00   scale(1.06) translate3d(-6%, 0, 0)
  A lateral truck. The near-layer garlands sweep past the lens because they sit at +180px.

### SCENE 02 — BRIDAL ALCOVE  (duration 1.15)   [SHOWCASE 2]
  p0.00   scale(1.00) translate3d(0, 0, 0)      rotateY( 4deg)
  p0.60   scale(1.26) translate3d(0, -2%, 0)    rotateY( 0deg)   <- SETTLE. label "s2".
  p1.00   scale(1.34) translate3d(0, -3%, 0)    rotateY(-2deg)
  The slowest move on the page. The rotateY makes the arch swing open as you approach it.
  Give this scene ~15% more scroll length than the others and do not speed it up.

### SCENE 03 — SILVER HALL  (duration 1.0)   [SHOWCASE 3]
  p0.00   scale(1.18) translate3d(0, -5%, 0)
  p0.50   scale(1.10) translate3d(0,  0%, 0)    <- SETTLE. label "s3".
  p1.00   scale(1.08) translate3d(-4%, 2%, 0)
  A tilt down that becomes a soft truck right. Fire the specular sweep (below) at p0.42.

### SCENE 04 — CRYSTAL & IDOLS  (duration 1.0)   [SHOWCASE 4]
  p0.00   scale(1.04)
  p0.55   scale(1.22)                            <- SETTLE. label "s4".
  p1.00   scale(1.30)
  Rack focus, and it is the only one on the page: over p0.00->p0.55 run
    .layer.near  filter: blur(0px)  -> blur(12px)
    .layer.mid   filter: blur(6px)  -> blur(0px)
  Let it breathe. The blur crossover is the whole point of this scene.

### SCENE 05 — THE LOUNGE  (duration 1.1)   [SHOWCASE 5 + rest]
  p0.00   scale(1.45) translate3d(0, -4%, 0)
  p0.65   scale(1.00) translate3d(0,  0%, 0)    <- SETTLE. label "s5".
  p1.00   scale(0.96) translate3d(0,  0%, 0)
  The ONLY reverse move on the page. The camera pulls back and the room opens out. If this scene
  pushes in like the others, the ending has no release and the whole sequence feels unresolved.

## THE SPECULAR SWEEP (scenes 01 and 03 only)
A `linear-gradient(105deg, transparent 40%, rgba(255,255,255,.38) 50%, transparent 60%)` bar,
250% wide, `mix-blend-mode: overlay`, translateX(-60%) -> translateX(60%) over 900ms, eased
power2.inOut. It reads as a light source passing across the metal. Once per scene, at the settle.
Do not put it on every scene — it becomes a tic.

## TYPE ASSEMBLE — fires at each SETTLE label, nested on the master
  0ms    .panel .rule     scaleX 0 -> 1, transform-origin the panel's OUTER edge, 500ms power3.out
  90ms   .panel .eyebrow  opacity 0->1, y +6 -> 0, 300ms
  160ms  .panel h2        per line: each line wrapped in an overflow-hidden div,
                          inner span y 100% -> 0, 700ms expo.out, stagger 80ms
  520ms  .panel p         opacity 0->1, y +8 -> 0, 450ms
  640ms  .panel a         opacity 0->1; its arrow x 0 -> 6 -> 4, 400ms back.out(2)
  parallel:
  0ms    .ghost           scale 1.08 -> 1.00, filter blur(8px) -> blur(0), opacity 0 -> 0.12,
                          900ms power3.out

Disassemble is NOT a separate animation. Because everything lives on the scrubbed master timeline,
scrolling back plays the identical timeline in reverse automatically. Write it once.

## GHOST WORD GEOMETRY (the thing that makes it look like the reference)
  font: Anton / Archivo Black, uppercase, letter-spacing -0.02em
  font-size: clamp(9rem, 26vw, 30rem); line-height: 0.82
  position: absolute; left: 50%; top: 46%; transform: translate(-50%, -50%)
  white-space: nowrap
The word MUST be wider than the viewport so its first and last letters are cut off by the screen
edges. A ghost word that fits on screen is the single most common way this effect is gotten wrong.
Set `overflow: hidden` on #stage and let it bleed.

Z-order, strictly: .ghost is BEHIND .camera's mid and near layers, but IN FRONT of .layer.far.
The merchandise must visibly occlude the middle of the word. That occlusion is what sells depth —
without it the word looks like a flat watermark.

Words per scene: 00 = बाले राम रमा शंकर · 01 = 22K · 02 = BRIDAL · 03 = CHAANDI · 04 = PUJA ·
05 = BAITHIYE

## PANEL SIDES — alternate, do not randomise
  01 LEFT · 02 RIGHT · 03 LEFT · 04 RIGHT · 05 CENTRED
Scene 05 breaking the alternation is deliberate: it signals the sequence has ended.

## SCENE-TO-SCENE TRANSITION
Cross-dissolve the outgoing scene's opacity 1 -> 0 across the LAST 15% of its scroll range, while
the incoming scene is already at ~8% of its own camera move. The scenes overlap in motion. Never
cut on a still frame — if both cameras are parked when the dissolve happens, it reads as a
slideshow instead of a continuous walk.

## EASING
  camera moves      power2.inOut  (they are scrubbed, so this is mostly about the snap)
  type reveals      expo.out
  opacity/dissolve  none — linear, always. Eased fades look like lag under scrub.
  arrow/button      back.out(2)

## PERFORMANCE — non-negotiable
  - Animate `transform`, `opacity` and `filter` only. Never width/height/top/left/margin.
  - `will-change: transform` on the ACTIVE scene's `.camera` only. Add on scene enter, strip on
    exit. Leaving it on all six scenes will blow the GPU memory budget on mid-range Android.
  - Hard preload gate: nothing renders and the page does not become scrollable until every plate
    and matte has decoded. Show a centred wordmark with a 1px gold progress rule.
  - `blur()` is expensive. Scene 04 is the only place it animates. Cap it at 12px.
  - Target a locked 60fps on desktop. If a scene drops frames, reduce the particle count first,
    the blur second, and never the camera move.

## FALLBACKS
  - `prefers-reduced-motion: reduce` -> kill the ScrollTrigger entirely. Scenes become static
    full-height sections; typography fades in on intersection. No camera, no parallax.
  - Viewport < 900px -> DO NOT SCRUB. Replace the rig with CSS scroll-snap cards, one plate per
    card, flat images, same ghost word and same panel copy stacked beneath. Scroll-scrubbing a
    six-layer perspective stack on a phone is where this technique dies. This downgrade is
    intentional; do not "fix" it by re-enabling scrub with lower quality.

## ACCEPTANCE CRITERIA
  1. Stop scrolling anywhere and the frame is coherent — never a half-assembled panel next to a
     mid-move camera.
  2. Scroll to the bottom, then all the way back up. Every scene must return exactly to its
     opening state. No stuck opacity, no orphaned transforms, no double-fired reveals.
  3. Reload at 50% scroll depth. The rig must render the correct frame immediately, not replay
     from the start.
  4. At every settle, the ghost word bleeds off BOTH viewport edges.
  5. The merchandise occludes the ghost word's midsection in all five showcase scenes.
  6. Scene 05's camera pulls back. If it pushes in, it is wrong.
  7. Panels alternate LEFT, RIGHT, LEFT, RIGHT, CENTRED.
  8. 60fps sustained on desktop through the full scroll. No jank at the scene dissolves.
