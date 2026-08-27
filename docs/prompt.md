# BUILD: "Bale Ram Rama Shankar Jewellers" — cinematic scroll-scrub showroom tour

## ROLE
You are building a one-page, scroll-driven 3D showroom tour. The user's scroll wheel IS the
camera dolly. There is no autoplay, no play button, no scrubber. Scroll forward = camera moves
forward through the shop. Scroll back = camera reverses. Every frame is deterministic.

## THE ASSETS
Seven real photographs of the shop, in /plates-source. Map them to camera plates as follows:

  shop photo baleram.jpg          -> plate-00-exterior     storefront, Devanagari sign, glass doors
  SHOWCASE 3.jpg                  -> plate-01-gold         gold wall, marigold garlands, lit counters
  SHOECASE 2.jpg                  -> plate-02-bridal       pink arched alcove, bridal sets on busts
  SHOWCASE 5.jpg                  -> plate-03-silver       silver plates/tea sets, magenta shelving
  SHOWCASE 4.jpg                  -> plate-04-crystal      crystal + brass idols in glass cabinets
  SHOWCASE 1 ENTERING ACTION.jpg  -> plate-05-lounge       yellow chairs, wood ceiling, brand wall
  SHOWCASE 1.jpg                  -> plate-06-lounge-wide  spare / fallback framing

No stock photography. No AI-generated interiors. These plates are the entire film.

# ============================================================================
# STAGE 0 — PLATE PREP. DO THIS BEFORE YOU WRITE A SINGLE LINE OF CODE.
# ============================================================================

## 0A. REMOVE EVERY PERSON. THIS IS A HARD GATE.
No recognisable human being may appear in any plate that ships. Not a face, not a limb, not a
silhouette, not a reflection in the showcase glass. The shop must read as still, lit, and waiting —
an empty stage the camera moves through. A stranger caught mid-stride in a hero frame instantly
reads as a Google Maps screenshot and destroys the whole illusion.

Three of the seven plates contain people. Fix each one:

  plate-00-exterior — THREE masked pedestrians across the bottom of the frame, plus a partial
    figure at the right edge.
    Fix: crop to the top 62% of the source height (x 0-100%, y 0-62%). Drops all four figures,
    keeps the signboard, both display windows and the doorway. The resulting ~2.2:1 letterbox is
    BETTER for an approach shot than the original framing — lean into it.

  plate-02-bridal — a reclining figure under a white cloth in the bottom-right quadrant, with a
    bare limb visible at the frame edge.
    Fix: crop to the top 56% of the source height (x 0-100%, y 0-56%). Keeps the full pink arch,
    the shelf and every necklace bust. Drops the figure and the cluttered counter below it.

  plate-03-silver — a man in a red shirt seated on the sofa at the left edge.
    Fix: crop x 27%-100%, full height. Keeps the entire lit silver shelving unit and the tufted
    sofa. Drops him cleanly at the frame edge.

  The remaining four plates (gold, crystal, lounge, lounge-wide) are already empty. Leave their
  framing alone.

If full-resolution originals are supplied later, prefer generative fill / content-aware removal
over cropping, so the original composition survives. Cropping is the fallback, not the ideal.
Either way the gate is identical: zero people.

Also remove, by clone/heal or by crop: loose wires, wall-mounted switchboards, the portable AC
unit at the right of the silver plate, plastic stools, price tags, calculators, and anything
resting on a counter that is not merchandise. Ceiling CCTV domes may stay — they read as security,
which is reassuring in a jeweller.

## 0B. REFINE GRADE — apply identically to all plates so they cut together
These are phone snapshots under mixed tungsten and LED. Grade them into one film:

  1. White balance — neutralise the green-yellow tungsten cast. Interior whites (ceiling, marble
     floor, necklace busts) must read neutral, NOT yellow.
  2. Lift the shadows slightly, then crush the black point back — depth without murk.
  3. Contrast +7%, saturation +6%, gamma 0.98. Do not go further; oversaturated gold turns orange
     and instantly looks fake.
  4. Protect the metals. Gold must stay gold, not amber. Silver must stay neutral, not blue.
     Mask the metal ranges and pull them back if the global grade pushes them.
  5. The magenta showcase lighting is the shop's real signature — keep it, but drop it ~10% so it
     glows rather than clips.
  6. Unsharp mask, radius 5, amount 0.75. Sharpen once, at the end, after any resize.
  7. Finish every plate with a 40% vignette and 4% grain so they sit in the same air.

## 0C. RESOLUTION GATE — READ BEFORE ACCEPTING THE PLATES
The supplied files are Google Business Profile thumbnails: 243x174 up to 407x289 pixels. A
full-bleed cinematic hero needs roughly 2560px on the long edge. These are about 10x too small
linearly — around 100x too few pixels. Upscaling produces mush, and no amount of grading fixes it.

  - Do NOT ship these as hero plates. They are framing references only.
  - Required: full-resolution originals, or a reshoot. Minimum 2560px long edge, ideally 4000px+.
  - A reshoot is the better answer regardless: it solves the people problem, the resolution problem
    and the framing problem in a single pass. Shot list below.

## 0D. RESHOOT SHOT LIST (hand this to whoever holds the phone)
Shoot before opening or after closing, so the shop is genuinely empty. Every shot: phone on a
tripod or braced, horizontal unless noted, HDR off, flash off, all showcase lighting ON, highest
resolution the phone offers. Three exposures of each.

  01  EXTERIOR       Stand across the road, centre the doorway, full signboard in frame.
                     Wait for a gap in foot traffic. Shoot low, roughly chest height.
  02  GOLD WALL      Square to the wall, not at an angle. Garlands in the near foreground — let
                     them fall across the edge of frame, they become the parallax layer.
  03  BRIDAL ALCOVE  Dead centre on the arch, lens at the height of the middle shelf. Every bust
                     dressed. Clear the counter completely.
  04  SILVER         Square to the shelving. Move the AC unit and the stool out of frame first.
  05  CRYSTAL/IDOLS  Straight on to the cabinets. Wipe the glass — fingerprints show at 4K.
  06  LOUNGE         From the doorway looking in, so the chairs recede and the brand wall centres.
                     Vertical is acceptable here.
  Extra: 6-8 tight detail shots — a single necklace, hands on the scale, the hallmark stamp, a
  garland close-up. These become the section breaks and the loading frame.

# ============================================================================
# STAGE 1 — THE BUILD
# ============================================================================

## THE ONE-LINE CONCEPT
The page is a single continuous camera move that walks from the pavement, through the doors, past
five showcases, and settles into the lounge. The camera makes five full stops. At each stop it
settles, and typography assembles around the fixture: ONE enormous ghost word behind the glass,
ONE text block pinned hard-left or hard-right. Then the camera releases and moves on.

## VISUAL GRAMMAR — copy this frame exactly
Reference: the ski-goggle hero (SHRED "PRO SERIES"). Reproduce its geometry, not its colours.

  - The hero fixture occupies ~68-74% of viewport height, dead centre, bottom-anchored.
  - Behind it, one word in condensed uppercase, tracking ~ -0.02em, set so large it BLEEDS off both
    edges of the viewport — the first and last letters are cut by the screen edge. Non-negotiable;
    a ghost word that fits on screen is wrong.
  - Ghost word sits at 8-14% opacity, in a LIGHTER TINT OF THE BACKGROUND ITSELF — never grey,
    never white, never gold. It reads as embossed air, not as text.
  - The fixture overlaps and occludes the ghost word's midsection. Word behind, object in front.
  - Backdrop is one flat committed hue per scene. No gradients on the base layer.
  - Floating pill navigation, fully rounded, white, centred, ~40px from top, generous inner
    padding. Wordmark left, 3 links centre, icon cluster right.

Palette — the shop's real light, not the reference's ice-blue:

  --ink        #1A1210   near-black warm brown, all body copy
  --bone       #F4EEE6   ivory, primary backdrop
  --maroon     #5E1524   deep oxblood, the alcove and bridal scenes
  --gold       #C9A227   metal accents, rules, active nav dot — sparingly, never as fill
  --rose       #B2224A   the shop's real magenta showcase lighting, used only as glow
  --champagne  #E8D9C0   ghost-word tint on bone backgrounds

Ghost word colour rule: on --bone use --champagne. On --maroon use maroon lightened 14%.

## THE CAMERA SCRIPT

### SCENE 00 — APPROACH  (plate-00-exterior)
Camera: starts 1.6x scaled and slightly low, pushes forward on Z and rises 3 degrees until the
doorway fills the frame; final 20% of the scroll pushes THROUGH the glass — doorway edges blow past
the camera and the frame whites out to --bone for 120ms.
Ghost word: the shop name in Devanagari, बाले राम रमा शंकर — bleeding off both edges.
Copy: none. A small centred kicker at the bottom: EST. {{YEAR}} · {{CITY}}, plus a scroll cue.
Scroll length: 120vh.

### SCENE 01 — THE GOLD WALL  (plate-01-gold)   [SHOWCASE 1 of 5]
Camera: slow lateral truck left-to-right across the wall, 6% Z push. Garlands parallax past the
lens in the near foreground.
Ghost word: 22K
Panel side: LEFT
  Eyebrow  — SHOWCASE 01
  Headline — Gold that is / weighed in front / of you.
  Body     — Every piece hallmarked. Every gram shown on the scale before it is wrapped.
             Bangles, chains, kadas, mangalsutras.
  Link     — See the gold collection →

### SCENE 02 — THE BRIDAL ALCOVE  (plate-02-bridal)   [SHOWCASE 2 of 5]
Camera: dolly in hard and centre on the arch. Rotate 4 degrees on Y as it approaches, so the arch
swings open. Slowest, most reverent move on the page.
Backdrop shifts to --maroon here. Ghost word tint shifts with it.
Ghost word: BRIDAL
Panel side: RIGHT
  Eyebrow  — SHOWCASE 02
  Headline — The set she / will be / photographed in.
  Body     — Full bridal sets — rani haar, choker, maang tikka, jhumkas — matched and tried on in
             the room, under the same light as the mandap.
  Link     — Book a bridal sitting →

### SCENE 03 — THE SILVER HALL  (plate-03-silver)   [SHOWCASE 3 of 5]
Camera: tilt down from the top shelf toward the sofa, then a soft truck right. A specular sweep
crosses the silver as the camera settles.
Backdrop returns to --bone.
Ghost word: CHAANDI
Panel side: LEFT
  Eyebrow  — SHOWCASE 03
  Headline — Silver for the / house, not just / the person.
  Body     — Thalis, tea sets, glasses, pooja articles and gifting silverware. Weighed, engraved,
             boxed the same day.
  Link     — Silver & gifting →

### SCENE 04 — CRYSTAL & IDOLS  (plate-04-crystal)   [SHOWCASE 4 of 5]
Camera: push in slowly and rack focus — cabinet glass sharpens, foreground garland blurs to 12px.
The only rack-focus moment on the page; let it breathe.
Ghost word: PUJA
Panel side: RIGHT
  Eyebrow  — SHOWCASE 04
  Headline — For the shelf / that faces / east.
  Body     — Silver and crystal idols, diyas, kalash and full pooja thali sets — for weddings,
             griha pravesh and festivals.
  Link     — Pooja collection →

### SCENE 05 — THE LOUNGE  (plate-05-lounge)   [SHOWCASE 5 of 5 + CTA]
Camera: pull BACK, not forward — the only reverse move on the page. The room opens out, chairs
resolve, the brand wall centres itself. The camera comes to rest.
Ghost word: BAITHIYE
Panel side: CENTRED — break the left/right rhythm here on purpose, it signals the end.
  Eyebrow  — VISIT US
  Headline — Sit down. / Take your time.
  Body     — No commission pressure and no rushing. Tea, a chair, and every tray brought to you.
  Buttons  — [ Get directions ]  [ Call {{PHONE}} ]
  Footer strip fades up beneath: address, hours, WhatsApp, Instagram, BIS hallmark note.

## HOW THE "3D" IS ACTUALLY BUILT
There is no 3D scan and no photogrammetry. Fake the camera honestly, from stills:

1. Cut every cleaned plate into 3-4 depth layers using stacked <img> crops with transparent PNG
   mattes: NEAR (garlands, counter edge, sofa arm) / MID (the glass and product) / FAR (back wall,
   shelving) / LIGHT (an additive blend layer holding the magenta glow only).
2. Wrap each scene in a container with `perspective: 1200px; transform-style: preserve-3d`.
   Give each layer its own `translateZ`: NEAR +180px, MID 0, FAR -260px, LIGHT -300px.
3. The camera move is a transform on the CONTAINER, not on the layers. Parallax then falls out of
   the Z separation for free. Do not fake parallax by animating each layer's translateX by hand.
4. Over every scene: 4% grain, 40% vignette, and a slow-drifting bokeh canvas (18 particles max,
   gold, 2-5px, 0.15 opacity).
5. Between scenes, cross-dissolve over 15% of the outgoing scene's scroll range while the incoming
   camera is already moving. Never cut on a still frame.

UPGRADE PATH (note in the README, do not build now): if a 10-14s gimbal walkthrough is ever shot,
it drops straight into this rig — encode all-keyframe (`-g 1`, no B-frames), scrub `currentTime`
off the same ScrollTrigger timeline, keep every typography layer unchanged.

## TYPOGRAPHY
  Display / ghost words : Anton, or Archivo Black — condensed, heavy, uppercase.
  Devanagari display    : Mukta or Rozha One at equivalent weight.
  Headlines             : Fraunces, 300 weight, optical size high — a serif against that heavy
                          display face. Line-broken manually exactly as written above.
  Eyebrow / UI / body   : Inter. Eyebrow at 11px, 0.22em tracking, uppercase, --gold.

  Ghost word   clamp(9rem, 26vw, 30rem), line-height 0.82
  Headline     clamp(2.2rem, 4.4vw, 4.2rem), line-height 1.02
  Body         17px / 1.65, max-width 34ch, --ink at 72% opacity

## PANEL ASSEMBLE ANIMATION (identical every scene, only the side flips)
Fires when the camera reaches its stop, on a nested timeline:
  0ms    a 1px --gold rule scaleX 0 -> 1 from the panel's outer edge, 500ms, power3.out
  90ms   eyebrow fades in, 6px up, 300ms
  160ms  headline reveals line-by-line, each line masked by a clipping div,
         translateY 100% -> 0, 700ms, expo.out, 80ms stagger
  520ms  body fades in, 8px up, 450ms
  640ms  link fades in, arrow slides 6px right and settles
  Ghost word in parallel: scale 1.08 -> 1.00, blur 8px -> 0, opacity 0 -> target, 900ms
On scroll-back every step reverses cleanly — no one-shot flags, no `.once()`.

## TECHNICAL REQUIREMENTS
  - GSAP + ScrollTrigger. Lenis for smoothing (lerp 0.085).
  - Each scene is a `position: sticky; height: 100vh` stage inside a tall spacer. One master
    timeline, `scrub: 1`, plus `snap` to scene end-points, 0.4s, power2.inOut.
  - Hard preload gate: nothing renders until all plates and mattes have decoded. Centred wordmark
    with a 1px gold progress rule. No layout shift, no flash of unstyled plate.
  - `will-change: transform` only on active scene layers; strip it on exit.
  - `prefers-reduced-motion: reduce` -> static full-bleed sections, typography fades only,
    scroll-scrub disabled entirely.
  - MOBILE (< 900px): DO NOT SCRUB. Full-bleed snap-scrolled cards, one plate per card, same ghost
    word, same panel copy stacked below the fold line. Depth layers collapse to a flat image.
    This is a deliberate downgrade, not a bug.
  - Lighthouse Performance >= 90 on mobile. LCP under 2.5s. Zero CLS.
  - Semantic HTML underneath the effect — every scene is a real `<section>` with a real `<h2>`, so
    the page is readable and indexable with JS disabled.

## PLACEHOLDERS — ask me for these, do not invent them
  {{YEAR}} established · {{CITY}} · {{PHONE}} · {{FULL_ADDRESS}} · {{HOURS}}
  {{WHATSAPP}} · {{INSTAGRAM}} · {{MAPS_URL}} · exact Devanagari spelling of the shop name

## DELIVER
  index.html · styles.css · main.js · /plates (cleaned plates + mattes) · README.md
  No build step. No framework. Vanilla + GSAP from CDN.

## ACCEPTANCE CRITERIA
  1. ZERO people visible in any plate, at any point in the camera move, including in glass
     reflections. Check every scene at its start, middle and end frame.
  2. Scrolling backward reverses the camera and un-assembles the type perfectly. No stuck states.
  3. At every scene stop, the ghost word bleeds off BOTH viewport edges.
  4. The hero fixture visibly occludes the ghost word — depth is unambiguous.
  5. Text panels alternate LEFT -> RIGHT -> LEFT -> RIGHT -> CENTRE across scenes 01-05.
  6. Scene 05's camera pulls back. If it pushes in, it is wrong.
  7. Gold reads gold, not orange. Silver reads neutral, not blue.
  8. On a 375px phone nothing scrubs and nothing stutters.
