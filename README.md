# SpinVerse

Static implementation of the Figma file **SpinVerse (Copy)**
(`GrZ4Aiq9pjTUiHEvaQZJc5`), frames `13:2` (Home) and `3:210` (Rainbet LB).

## Running it

No build step. Open `index.html`, or serve the folder:

```
python -m http.server 8000
```

Then visit <http://localhost:8000>. Serving over HTTP (rather than `file://`)
lets the copy-code buttons use the async clipboard API; they fall back to
`execCommand` otherwise, so they work either way.

## Layout

```
index.html               Home
leaderboard.html         $5,000 monthly leaderboard
css/style.css            @font-face, tokens, top bar, buttons, home sections
css/leaderboard.css      podium, countdown, ranks table
css/responsive.css       all media queries
js/main.js               mobile nav, copy-code, countdown
js/leaderboard.js        dummy dataset + podium/table rendering
assets/img|svg           exported from Figma
assets/fonts             the two display faces, subset to ASCII, as WOFF

neue-corp-font-family/   original font downloads — source only,
sakana/                  not needed at runtime (~3.3MB)
```

Runtime payload is ~3.4MB, almost all of it artwork. The two font source
folders are not referenced by the site and can be excluded from a deploy.

Sections are built at their exact Figma pixel values (the source coordinates
are in the CSS comments) and centred, so the desktop rendering matches the
1920px composition. Below that, sections reflow rather than scale down.

## Fonts

All four faces from the design now render for real: **Rubik**, **Onest** and
**Blinker** from Google Fonts, plus **Sakana** (`$5 000`, `SOCIALS`) and
**PP Neue Corp Normal Ultrabold** (`100 FS`, the 1st-place prize) served
locally. The two display faces are subset to ASCII and converted to WOFF —
142KB → 28KB and 22KB → 7KB. WOFF2 would be roughly 30% smaller again, but
the `brotli` module needed to write it is not installed here.

> **Licensing.** Both display faces were supplied under personal-use-only
> licences — the 1001Fonts FFP covering Sakana explicitly excludes usage that
> "generates financial income in a business manner", and the Befonts PP Neue
> Corp download states "Personal Use Only". An affiliate site is commercial,
> so retail licences (PP Neue Corp from Pangram Pangram) are needed before
> this goes live. Swapping them is a one-line change per `@font-face` in
> `css/style.css`.

## The leaderboard data

`js/leaderboard.js` holds a **dummy** ten-player dataset and renders both the
podium and the ranks table from it. To go live, replace `LEADERBOARD.players`
with an API response of the same shape — `user`, `wagered`, `reward`, sorted
by `wagered` descending. Nothing else needs to change: ranks, ordinals, row
striping, the top-three gradients, podium placement and the headline prize
pool are all derived.

Two things were made consistent that the Figma file left contradictory:

- **The podium is now the top three of the table.** In the design they were
  unrelated sets of placeholder numbers, and 3rd place outranked 2nd on both
  wager and prize.
- **The rewards add up to the advertised pool.** $2,000 / $1,000 / $650 /
  $450 / $300 / $200 / $150 / $110 / $80 / $60 = the $5,000 in the heading,
  which the page now derives from the data rather than hard-coding.

Because the standings are client-rendered, there is a `<noscript>` notice in
place of the table. If the standings ever need to be indexable, render them
server-side instead.

## Where it departs from the Figma file

**The countdown runs.** Figma shows it frozen at 18d 12h 53m 31s; here it
counts down to 00:00 UTC on the 1st. The Figma values remain in the HTML as
the no-JS fallback.

**Responsive behaviour is invented.** The file has one 1920px desktop
composition and no smaller breakpoints, so everything under 1560px is an
interpretation, not a spec: the VIP band crops to a backdrop, the podium
stacks 1st→3rd, and the ranks table drops the Wagered column under 900px.

**The VIP band artwork is pre-flattened.** Figma composites it from five
layers, one of which colour-dodges at 65% against the `#0e0e26` base through
a pass-through group. Neither CSS `mix-blend-mode` nor an export of the
artwork group reproduces that: the group exports fully opaque with the dodge
already resolved against its own backdrop, which comes out dark purple
instead of navy blue (measured (35,20,40) against a target of (43,46,80), and
no blend mode closed the gap).

So `vip-art.png` is Figma's render of the whole band — the only node that
composites correctly — with the baked heading, body copy and button painted
out by interpolating vertically across that region. The background there is
near-uniform navy (std ~2-7 per channel), so the patch is invisible, and the
real text is drawn over it as HTML. If the band's artwork or the copy's
position ever changes in Figma, this image has to be re-made the same way.

## Still open in the design

- **The Figma podium groups are mislabelled.** The group named `2nd` holds
  the 3rd-place badge, and `3rd` holds the 2nd-place badge. The badge text,
  colours and canvas positions agree with each other, so those were used.
- **Two spellings of the handle.** The X card reads `SPINVERSEE`, the others
  `SPINVERSE`.
- **No footer or compliance text.** There is no 18+/responsible-gambling
  notice, licence details, or T&Cs anywhere in the file. Nothing was invented
  here, but an affiliate site will normally need them.
- **Every `href="#"` is an unlinked placeholder** — the design specifies no
  destinations for the nav, the social cards, or the Claim/Visit buttons.
