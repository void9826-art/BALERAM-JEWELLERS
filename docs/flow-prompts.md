# GOOGLE FLOW / VEO 3.1 — production pack
## Cinematic scroll-scrub showroom walkthrough · Bale Ram Rama Shankar Jewellers

---

# HOW THIS PIPELINE WORKS

Flow does NOT replace the scroll rig — it replaces the *plates*. Veo generates the moving footage;
the browser scrubs it with scroll; your typography goes on top in HTML, never inside the video.

  STAGE 1  Nano Banana Pro (free, inside Flow)  -> clean, high-res start frames from your photos
  STAGE 2  Veo 3.1 Frames-to-Video              -> six 8-second camera moves
  STAGE 3  Stitch the six clips                 -> one continuous ~48s walkthrough
  STAGE 4  Re-encode all-keyframe               -> makes it scrubbable
  STAGE 5  HTML/CSS typography layer on top     -> the ghost words and side panels

## THREE RULES THAT DECIDE WHETHER THIS WORKS

**1. Never let Veo generate your text.** Not the ghost words, not the panel copy, and absolutely
not the Devanagari. AI video renders text as garbled pseudo-glyphs, and Devanagari conjuncts are
the worst case in the entire failure mode. Every prompt below ends with `No subtitles. No text
overlays.` Your typography is HTML sitting above the `<video>` element — which is what you want
anyway: it stays crisp at 4K, it reverses correctly on scroll-back, and you can edit the copy
without regenerating a single credit's worth of video.

**2. Stage 1 solves your resolution problem.** Your photos are 243×174 Google thumbnails, far too
small to be hero plates — but they are *plenty* as conditioning references for Nano Banana Pro.
You regenerate each showcase clean and high-res. The people, the AC unit, the wires and the
switchboards all disappear at this stage, before a single video credit is spent. Do not skip
Stage 1 and feed thumbnails straight into Frames-to-Video.

**3. Chain the clips by frame, not by vibe.** Flow lets you save any video frame as a reusable
image asset. The LAST frame of each clip becomes the START frame of the next one. That is the only
way six separate 8-second generations read as one unbroken walk through one real shop. Do this
even though it costs an extra step — without it, the lighting and geometry drift between scenes
and the whole illusion collapses.

---

# STAGE 1 — CLEAN PLATES IN NANO BANANA PRO

Upload the matching thumbnail as a reference image, then run the prompt. Free, unlimited, inside
Flow. Iterate here until the frame is genuinely beautiful — every credit you spend in Stage 2 is
100× more expensive, and a weak start frame guarantees a weak clip.

The three plates with people in them are marked. Emptiness is described as a *state*, not as a
subtraction, because Veo and Imagen both handle positive description far better than negation.

### 1.0 — EXTERIOR  [source: shop photo baleram.jpg — HAS PEOPLE]
```
Photorealistic architectural photograph of a small Indian jewellery shop storefront on a city
street, shot from across the road at chest height. A black signboard with gold Devanagari lettering
runs the full width above the entrance. Two lit display windows flank a dark glass doorway; warm
gold light spills out from the interior. The pavement in front is completely empty and clear — an
early morning street before the shop has opened, quiet and deserted. Clean swept concrete, no
parked vehicles, no pedestrians, no crowd. Soft overcast morning light, neutral white balance,
sharp architectural detail, 35mm lens look, high resolution.
```

### 1.1 — GOLD WALL  [source: SHOWCASE 3.jpg]
```
Photorealistic interior of an Indian gold jewellery showroom, shot square to the back wall. Tiered
display shelves hold gold necklaces and bangles on deep red velvet trays, lit from above by warm
spotlights. Fresh orange marigold garlands hang in swags across the top of the frame and down the
left edge, close to the lens and slightly out of focus. A polished glass counter runs along the
bottom of the frame. The room is empty and still — no staff, no customers, closing time. Clean
uncluttered surfaces, nothing resting on the counter. Warm gold light, neutral whites, rich but
unsaturated colour, sharp focus on the merchandise, high resolution.
```

### 1.2 — BRIDAL ALCOVE  [source: SHOECASE 2.jpg — HAS PEOPLE]
```
Photorealistic interior detail of an Indian bridal jewellery display. A tall arched alcove lit in
deep magenta holds white velvet busts displaying full bridal gold necklace sets — rani haar,
chokers, layered temple jewellery. Ornate carved gold-toned frame around the arch. Shot dead
centre, lens level with the middle shelf. The space in front of the alcove is completely clear and
empty — polished floor, nothing and no one in the foreground. Deep magenta and oxblood palette,
gold catching the light, dramatic showcase lighting, shallow depth of field, high resolution.
```

### 1.3 — SILVER HALL  [source: SHOWCASE 5.jpg — HAS PEOPLE]
```
Photorealistic interior of an Indian silverware showroom. A tall recessed display unit lit in warm
magenta holds ornate silver plates, tea sets, tumblers and serving trays arranged on glass shelves.
A cream tufted leather sofa sits below, unoccupied. Textured wallpaper on either side. The room is
empty and quiet, freshly cleaned, closing time. Clear uncluttered floor — no appliances, no stools,
no clutter along the walls. Silver reads neutral and bright, not blue. Warm ambient light with
magenta accent glow, sharp detail on the metalwork, high resolution.
```

### 1.4 — CRYSTAL & IDOLS  [source: SHOWCASE 4.jpg]
```
Photorealistic interior of an Indian showroom display of crystal and silver religious articles.
Glass-fronted cabinets on two levels hold crystal figurines, silver deity idols, brass diyas and
pooja thali sets, lit from within. Orange marigold garlands hang across the top of the frame close
to the lens, softly out of focus. Spotless polished glass with no fingerprints or reflections of
people. The room is empty and still. Warm interior lighting against cool crystal highlights, crisp
detail, shallow depth of field on the foreground garlands, high resolution.
```

### 1.5 — THE LOUNGE  [source: SHOWCASE 1 ENTERING ACTION.jpg]
```
Photorealistic interior of an Indian jewellery showroom consultation lounge, shot from the doorway
looking in so the room recedes. A row of mustard-yellow velvet armchairs lines a long glass display
counter on the right. Decorative wood-slat ceiling with recessed circular lighting and black track
spotlights. A backlit brand wall at the far end. Warm marble floor. The room is completely empty
and waiting — every chair unoccupied, no staff, no customers. Warm inviting light, calm and
composed, wide-angle interior architectural photography, high resolution.
```

**Before moving on:** view all six at full size side by side. They must look like one shop on one
day under one lighting setup. If one is warmer or cooler than the rest, regenerate it — Stage 2
will amplify any mismatch, and colour-correcting six AI clips afterwards is miserable work.

---

# STAGE 2 — VEO 3.1 FRAMES TO VIDEO

Mode: **Frames to Video**. Start frame: the Stage 1 image. Duration: **8 seconds**. Leave the end
frame empty for all of these except 00 — you want Veo to invent the move, not interpolate to a
target.

Every prompt follows Flow's five-part formula: cinematography, subject, action, context, style.

### CLIP 00 — APPROACH
Start frame: 1.0 exterior
```
Slow steady dolly-in shot pushing forward toward the entrance of a small Indian jewellery shop.
The camera advances at a constant walking pace across the empty pavement, rising very slightly, the
lit doorway growing to fill the frame until the camera passes through the threshold into the warm
golden interior. The street is deserted and silent, early morning, nothing moving in frame except
the camera itself. Cinematic, smooth gimbal movement, no handheld shake, soft overcast exterior
light warming to gold interior light, 35mm lens look, shallow depth of field, film grain.
No subtitles. No text overlays.
```

### CLIP 01 — GOLD WALL
Start frame: 1.1 gold wall
```
Slow lateral tracking shot gliding left to right across a wall of gold jewellery in an Indian
showroom. The camera trucks smoothly and evenly, marigold garlands in the near foreground sweeping
past the lens and out of frame while the lit display shelves behind stay in sharp focus. The room
is empty and completely still — the only motion in the entire frame is the camera. Cinematic, slow
constant-velocity dolly on rails, warm gold spotlighting, rich colour, shallow depth of field,
subtle film grain. No subtitles. No text overlays.
```

### CLIP 02 — BRIDAL ALCOVE
Start frame: 1.2 bridal alcove
```
Very slow reverent dolly-in toward an arched magenta-lit bridal jewellery alcove, the camera
drifting a few degrees to the right as it approaches so the arch appears to open outward. Gold
necklaces on white velvet busts come progressively closer and sharper. The room is empty and
motionless, silent and still, nothing moving but the camera. Cinematic, extremely slow and steady
push-in, deep magenta and oxblood palette, dramatic showcase lighting, shallow depth of field,
gold catching the light, film grain. No subtitles. No text overlays.
```

### CLIP 03 — SILVER HALL
Start frame: 1.3 silver hall
```
Slow tilt down from the top shelf of a lit silverware display, settling and then easing into a
gentle truck to the right. Light sweeps across the polished silver plates and tea sets as the
camera moves, catching each piece in turn. The showroom is empty and still, the sofa unoccupied,
nothing in the frame moving except the camera and the travelling highlight on the metal.
Cinematic, smooth motorised tilt then lateral glide, warm ambient light with magenta accent glow,
neutral bright silver, crisp specular highlights, film grain. No subtitles. No text overlays.
```

### CLIP 04 — CRYSTAL & IDOLS
Start frame: 1.4 crystal and idols
```
Slow dolly-in toward glass cabinets of crystal and silver idols, with a deliberate rack focus: the
marigold garlands hanging in the near foreground drift out of focus as the cabinet glass and the
figurines behind them resolve into sharp detail. The room is empty and silent, entirely static, the
only movement the camera and the shifting focal plane. Cinematic, slow push-in, macro-like focus
transition, warm interior light against cool crystal highlights, shallow depth of field, film grain.
No subtitles. No text overlays.
```

### CLIP 05 — THE LOUNGE  (the only reverse move — do not let it push in)
Start frame: 1.5 lounge
```
Slow steady dolly-OUT, the camera retreating backward away from a jewellery showroom consultation
lounge. The room opens up and widens as the camera withdraws, mustard-yellow armchairs and the long
glass counter resolving into a calm symmetrical composition, the backlit brand wall centring itself
at the far end. The lounge is completely empty, every chair unoccupied, warm and still. The camera
slows and comes gently to rest at the end of the move. Cinematic, smooth backward gimbal glide
decelerating to a stop, warm inviting light, wide-angle interior, film grain.
No subtitles. No text overlays.
```

## STAGE 2 WORKING NOTES

- **Chain by frame.** After each clip, save its final frame as an image asset and use it as the
  start frame for the next clip. Clip 00 ends inside the doorway — that interior frame is what
  Clip 01 should open on, not your Stage 1 gold-wall image.
- **Skip the audio.** A scroll-scrubbed video is silent by definition. Don't spend prompt space on
  SFX and don't burn credits on Highest Quality *for the audio's sake* — though do use the highest
  visual quality your tier allows.
- **Constant velocity matters more than beauty here.** A clip that eases in and out fights the
  scroll scrub, because the scroll already provides the easing. Where you get a choice, take the
  more mechanical, more even camera move. "Constant-velocity dolly on rails" is in the prompts
  deliberately.
- **Budget 2–3 generations per clip.** Frames-to-Video is ~100 credits per generation. Six clips at
  two attempts each is ~1,200 credits. Google AI Pro gives you 1,000/month — so this is roughly a
  two-month job on Pro, or one comfortable month on Ultra. Every iteration you can push back into
  the free Stage 1 image step saves you 100 credits.
- **Watermark.** Free and Pro tiers burn a visible watermark into the output. For a client-facing
  site you need Ultra, where only the invisible SynthID remains.
- **Commercial use.** Verify the current GA status of the exact Veo features you use directly with
  Google before this goes live for a real business. Pre-GA features are barred from commercial use
  regardless of what you're paying.

---

# STAGE 3 — STITCH

Do NOT export from Scene Builder. As of now its timeline state resets when you leave the project
and audio strips on export. Download the six clips individually and concatenate them yourself.

```bash
cd /c/Users/alienware/WEBSITES/baleram-jewellers/flow-clips
printf "file 'clip-00.mp4'\nfile 'clip-01.mp4'\nfile 'clip-02.mp4'\nfile 'clip-03.mp4'\nfile 'clip-04.mp4'\nfile 'clip-05.mp4'\n" > list.txt
"/c/Users/alienware/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0-full_build/bin/ffmpeg.exe" -y -f concat -safe 0 -i list.txt -c copy walkthrough-raw.mp4
```

---

# STAGE 4 — ALL-KEYFRAME ENCODE  (the step that makes it scrubbable)

This is the one non-obvious technical requirement, and skipping it is why most scroll-video sites
feel broken. Flow exports standard H.264 with long GOPs — roughly one keyframe every 2–5 seconds.
When you scrub `video.currentTime` to an arbitrary point, the browser must decode from the last
keyframe forward, so the picture lurches and lags behind the scroll. Encoding every frame as a
keyframe removes the dependency entirely. The file gets much larger; that is the trade, and it is
worth it.

```bash
"/c/Users/alienware/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0-full_build/bin/ffmpeg.exe" -y -i walkthrough-raw.mp4 -an -c:v libx264 -preset slower -crf 20 -g 1 -keyint_min 1 -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart walkthrough-scrub.mp4
```

`-g 1 -keyint_min 1 -bf 0` is the whole point: every frame independently decodable, no B-frames.
`-an` strips the audio you aren't using. Also export a WebM/VP9 twin for Firefox, and a 720p
variant — though on phones you should not be scrubbing at all.

---

# STAGE 5 — THE TYPOGRAPHY LAYER

Everything in `animation-prompt.md` still applies, with one simplification: there is no longer a
six-layer perspective stack to build, because Veo baked the camera move into the pixels. The rig
collapses to a single `<video>` element scrubbed by ScrollTrigger, with the type layer above it.

```js
gsap.timeline({ scrollTrigger: {
  trigger: "#stage", start: "top top", end: "+=600%",
  scrub: 1, pin: true, anticipatePin: 1
}})
.to(video, { currentTime: video.duration, ease: "none" }, 0)
```

Then place the ghost word and panel reveals on that same timeline at the progress values where each
clip settles — with six 8-second clips on a 48-second master, the settle points land near 0.14,
0.30, 0.47, 0.63, 0.80 and 0.95.

Carried over unchanged from the animation spec: ghost words bleed off both viewport edges; panels
alternate LEFT, RIGHT, LEFT, RIGHT, CENTRED; scene 05 pulls back; `prefers-reduced-motion` kills
the scrub; and phones get snap-scrolled poster frames instead of a scrubbed video, never a
downgraded scrub.
