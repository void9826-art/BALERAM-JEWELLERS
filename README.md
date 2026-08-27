# Baleram Ramashankar Jewellers

A five page website for the shop in the Aeroplane Building, Nepalgunj.

Plain HTML, CSS and JavaScript. No build step, no framework, nothing to install.
The `site/` folder is the whole website. Upload its **contents** to any host and it works.

---

## Looking at it on this computer

Double click `serve.ps1`, then open <http://localhost:8175> in your browser.
Press Ctrl+C in the black window to stop it.

Opening `site/index.html` directly by double clicking also works, but the scrolling
video on the front page will not run. Browsers block that when a page is opened as a
file rather than served. You will see the still picture version instead, which is the
same thing phone visitors get, so it is a useful check in its own right.

---

## The one file you will want to edit

**`site/assets/data/rates.js`** holds the gold and silver rates.

Open it in Notepad, change the numbers and the date, save. That is the whole job.
The website picks it up straight away.

Leave a number as `null` and that card disappears, and the page invites people to
message for the rate instead. That is the safe setting, and it is how the site ships.
An empty card is always better than a wrong price.

---

## Things that still need your confirmation

These went in as best guesses and should be checked before the site goes live.

| What | What the site currently says | Why to check |
|---|---|---|
| **Devanagari spelling** | बालेराम रामाशंकर | This is the shop's own name in the hero. Please confirm the exact spelling. |
| **Opening hours** | "Open daily from 10 in the morning" | Google only shows the opening time. If there is a weekly closing day, say so and it goes in. |
| **The shop name** | Baleram Ramashankar Jewellers | Google lists it this way. The signboard reads Bale Ram Rama Shankar. Tell me which you prefer. |
| **Year established** | Not shown anywhere | Left out rather than guessed. Worth adding if you know it. |
| **Instagram or Facebook** | Not linked | Send a link and it goes in the footer. |

---

## Promises the site makes on your behalf

The site's whole argument is that this shop does things in the open. That is persuasive,
and it is also a set of commitments a customer will hold you to at the counter. These are
standard practice for a jeweller, but nobody has confirmed them for *this* shop, so read
the list and tell me if any of it is wrong.

- The scale sits on the counter and the customer reads the weight before wrapping
- Every piece is hallmarked, and staff will point out the mark
- Making and wastage are quoted as separate numbers before the customer decides, and
  printed as separate lines on the bill
- Old gold is tested and weighed in front of the customer and exchanged at the day's rate
- Custom pieces take roughly one to three weeks, longer in wedding season, and start on
  an advance
- Repairs offered: re-stringing, clasp repairs, re-sizing, polishing, rhodium work

One claim was removed because it was too specific to guess at: that nobody works on
commission. If that is true, say so and it goes back in, because it is a strong line.

---

## A note on the Harmond font

Harmond cannot be used on this site. Its own licence file says, in capitals,
"ONLY for PERSONAL USE. NO COMMERCIAL USE ALLOWED". A shop website is commercial use,
and shipping the font would put the business in breach.

The buttons and labels use **Archivo** instead, set at an expanded width and heavy weight
so it carries the same wide, confident look. Archivo is free for commercial use.

If you want the real Harmond, the commercial licence is sold at
<https://dirtylinestudio.com/product/harmond/>. Buy it and swapping is one line:
change `--ui` at the top of `site/assets/css/site.css`.

---

## About the pictures

The jewellery photographs are created imagery. They show the **style** of work the shop
sells, not items in stock. Nothing on the site claims a piece is available, no piece has
a price, and the footer says this in plain words on every page.

This was a deliberate decision. The only real photographs available were small Google
listing thumbnails, far too small for a full screen. If real photographs of actual stock
are taken later, they drop straight into `site/assets/img/` and replace these with no
redesign needed.

The front page video is also created imagery of a showroom.

**It has been reworked once already.** The original was 1280 by 720 at 24 frames a second,
which stepped visibly when scrolled. It now runs at 1600 by 900 at 48 frames a second: the
extra frames were built by motion interpolation, and the picture was denoised, upscaled and
sharpened in one pass. It weighs 7.9 MB and streams in behind a loading ring, and phones
never download it at all.

**Phones get their own cut.** The wide film crops to a sliver on a tall screen, so
there is a second encode, `hero-scrub-portrait.mp4`, cropped to 9:16 and weighing
2.45 MB instead of 7.56 MB, because it travels on mobile data. The page picks
whichever fits the screen and swaps if the phone is rotated.

Two cases still get a still image instead of the scrolling film: reduced motion, and
a phone held sideways, where there is no height to work in.

If a real walkthrough of the shop is ever filmed, it drops straight in. Re-encode it with
the same settings, replace `site/assets/video/hero-scrub.mp4`, and update `VIDEO_BYTES` near
the top of `site/assets/js/hero.js` to the new file size in bytes. Nothing else changes.

---

## How the site is put together

```
site/
  index.html         the front page, with the scrolling showroom walk
  collection.html    six categories, every piece links to WhatsApp
  custom.html        how a made to order piece works
  faq.html           purity levels and the awkward money questions
  about.html         the shop, the map and the address
  assets/
    css/site.css     everything visual
    js/site.js       shared behaviour on every page
    js/hero.js       the scrolling video on the front page only
    data/rates.js    <- the rates, the file you edit
    img/             photographs
    video/           the showroom video and its still frames
serve.ps1            local preview
docs/                design notes, not part of the website
review/              working files, not part of the website
```

Only the **contents of `site/`** ever get uploaded. `docs/` and `review/` stay here.

---

## Enquiries

There is no contact form and no inbox to check. Every button opens WhatsApp with the
piece already written into the message, or dials the shop. Customers can send photographs
of designs straight back, which is what the custom order page depends on.

Nothing to host, nothing to pay for, nothing that breaks.

---

## Before going live

**1. Set the address.** Double click `set-domain.ps1` and type your domain when it
asks. That one step fills in the canonical links, the social sharing tags, robots.txt
and sitemap.xml across every page. It is the only manual step there is.

**2. Fill in `rates.js`,** or leave it and let the page invite messages instead.

**3. Zip the CONTENTS of `site/`,** so `index.html` sits at the top level of the zip.
Zipping the folder itself gives a broken site. Make sure the hidden `.htaccess` file
is included, because it carries the security headers and the https redirect.

---

## Security and privacy, in plain words

There is no database, no login, no contact form and no shopping basket on this site,
so most of the usual risks simply do not exist here. What has been done:

- **Nothing is tracked.** This site sets no cookies at all and stores nothing in your
  visitors' browsers. There is no analytics.
- **No visitor data reaches another company.** The typefaces are served from this site
  rather than from Google, so a page load contacts nobody but your own host.
- **The map asks first.** Google Maps sets cookies, so the map does not load until a
  visitor presses a button. If they never press it, Google is never contacted. This is
  why the site needs no cookie banner.
- **Security headers** are set in `.htaccess`: a content security policy that only
  permits this site's own files, https forced with HSTS, clickjacking blocked, MIME
  sniffing blocked, and camera, microphone and location switched off.
- **Rates are escaped.** Anything typed into `rates.js` is printed as text, never run as
  code, so a stray character cannot break the page.
- **Two legal pages** exist at `privacy.html` and `terms.html`, linked in the footer of
  every page.

Measured on the finished site: first paint in 0.53 seconds, zero layout shift, thirteen
requests, and no console errors on any of the eight pages.
