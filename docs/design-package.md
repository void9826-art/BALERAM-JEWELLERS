# Design Package — Bale Ram Rama Shankar Jewellers

Written before the build. Every line of copy here ships verbatim.

## 1. The brand premise

One word: **weighed**. A jeweller in a small city earns trust by doing everything in the
open. The gram goes on the scale before the piece is wrapped. The purity is stamped, not
promised. The day's rate is on the wall where anyone can read it. The whole site teaches
that one idea: nothing about this shop happens behind a counter you cannot see.

Every section serves it. The rate bar posts the price. The hallmark moment stamps the
purity. The FAQ answers the money questions most shops leave vague. The collection shows
work without pretending stock is a catalogue.

## 2. Palette (sampled from the footage and the stills, not invented)

The stills all sit on deep green satin; the showroom footage is warm gold, marigold and
a maroon-rose alcove. Green ground plus gold metal is the real world of both.

```css
:root{
  --canvas:#08150E;        /* deep green-black, from the satin's shadows */
  --canvas-raised:#0D1E14;
  --panel:#12281A;
  --panel-edge:#1D3A27;
  --gold:#D8B355;          /* the accent, lifted from the satin's lit gold */
  --gold-hover:#E9C878;
  --gold-muted:#8A6E32;    /* whisper level: rules, borders, particles */
  --rose:#8D3D4D;          /* the bridal alcove's real light */
  --marigold:#D97E2B;      /* the garlands */
  --text-primary:#F2EDE0;  /* warm ivory, never pure white */
  --text-secondary:#A9B7A6;
}
```

Contrast checked: ivory on canvas 17.5:1, secondary 8.7:1, gold 9.2:1. All clear.

## 3. Type

- **Display:** Marcellus. Inscriptional Roman, reads engraved, like a hallmark punch.
- **Devanagari display:** Rozha One. High contrast, matches Marcellus's stroke modulation.
- **Body:** Karla, 400 and 500.
- **Labels:** DM Mono, 400, uppercase, wide tracking. Reads as an assay mark.

Never Inter, never Roboto.

## 4. The signature element

**The hallmark punch.** A struck circular assay mark, drawn as SVG, carrying 916 and the
purity ring. It divides sections, sits in the nav, and is the object of the interactive
moment. Remove it and the page loses its spine, which is the test.

**The interactive moment:** press and hold to strike the hallmark. The punch descends
while the visitor holds, the mark impresses into the gold, and the purity table lights up
row by row. Release early and it eases back up; it never snaps. Reduced motion gets the
struck state immediately. The visitor performs the shop's promise instead of reading it.

## 5. The band map (hero is 900vh, scroll range 800vh)

| Band | Range | Plateau | Footage moment | Copy (verbatim) | Entrance |
|---|---|---|---|---|---|
| 1 | 0.00–0.15 | 88vh | Storefront, still, sign centred | बाले राम रामा शंकर / BALE RAM RAMA SHANKAR JEWELLERS / Aeroplane Building, Nepalgunj | Wordmark settles from a struck punch; one-time load ramp |
| — | 0.15–0.23 | — | The push through the doors | (no text: the motion peak carries it) | — |
| 2 | 0.23–0.38 | 88vh | The hall opens, one-point perspective | "Walk in. / Everything is out where you can see it." | Halves parting, echoing the doors |
| 3 | 0.41–0.56 | 88vh | Lateral truck across the gold wall | "Twenty two carat. / Ninety one point six percent gold. / Stamped, not promised." | Grid snap-align, reading order |
| 4 | 0.59–0.74 | 88vh | Bridal alcove, arch centred | "The set she will be / photographed in." | Word rise, slowest on the page |
| 5 | 0.80–1.00 | 144vh | Silver and puja cabinet, at rest | "Come and see it in person." + rate line + two buttons | Word-by-word rise into a staged settle |

Band 1 skips the ease-in, band 5 skips the ease-out.

**Band 1 does real work:** the generated signboard renders the Devanagari as जेल्लेर, which
is not a word. The band lays the correctly set wordmark directly over the sign, so the
HTML type becomes the sign and the footage becomes its glow.

## 6. Static hero copy (phones and reduced motion)

Headline: "Gold you watch being weighed."
Subline: "Bale Ram Rama Shankar Jewellers, Aeroplane Building, Nepalgunj. Twenty two carat gold, hallmarked silver, and full bridal sets."
Buttons: "Message on WhatsApp" / "Call the shop"

## 7. Below the fold

1. **The rate board.** Today's gold and silver, per tola and per 10 grams, with the date it was set and an honest line that the counter price is confirmed at the counter.
2. **Four promises.** Weighed in front of you. Hallmarked, every piece. The making charge said out loud. Exchange at the day's rate.
3. **The hallmark moment** (interactive) opening the purity table: 24K/999, 22K/916, 18K/750, 14K/585, silver 925 and 999.
4. **The collection**, six categories, art direction only, each to WhatsApp.
5. **The showroom**, using the hall frame, inviting a visit.
6. **What people say**: 4.4 from 16 Google reviews, plus the shop's own line.
7. **Visit us**: address, hours, map, WhatsApp, phone.
8. **Footer** with the imagery disclosure.

**Form handling:** no form. Every action is a WhatsApp deep link with the piece pre-filled,
or a phone call. Decided with the user; it matches how customers already reach this shop
and it carries photos natively for custom orders.

## 8. Vector layer

Hand-drawn SVG: the hallmark punch, a marigold garland swag that draws itself across
section breaks, a hairline rule that grows from the panel edge. Gold dust particles at 0.12
opacity, eighteen maximum. One fixed background layer: a slow green radial drift, 72s.

## 9. Engineering

Full standard: streamed Blob with the loading ring, dt-normalised lerp resting when
converged, gated seeks with the error escape, delta-gated DOM writes, four-layer legibility,
five static-hero gates live in CSS and JS, complete without the video, reduced motion honored
in both directions.

## 10. Copy gate

Zero em dashes. Zero stock words. Body swept for AI tells. Deliberate devices that stay:
"Stamped, not promised." and the four-promise triplet rhythm.
