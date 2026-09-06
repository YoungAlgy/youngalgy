# Algy's House art and audio credits

## Algy's House

### Modern Interiors by LimeZu

> Modern Interiors art by LimeZu (limezu.itch.io), used under the paid full-version commercial license. Credit is required.

The full paid pack stays outside this repository at
`C:\Users\Algy\Desktop\Files\pixel art\moderninteriors-win`. The room ships
one derived 256x320 atlas at
`public/sprites/interiors/algy_house_16.png`. It contains only the
native-resolution cuts recorded below, including the appended September 5 cuts. Source rectangles use
`(x, y, width, height)` pixels.

- `1_Interiors/16x16/Room_Builder_subfiles/Room_Builder_Floors_16x16.png`
  - Warm wood floor. Cell `(0,12)`. Rect `(0,192,16,16)`.
- `1_Interiors/16x16/Room_Builder_subfiles/Room_Builder_Walls_16x16.png`
  - Warm plaster wall. Cell `(5,12)`. Rect `(80,192,16,16)`.
- `1_Interiors/16x16/Theme_Sorter/17_Visibile_Upstairs_System_16x16.png`
  - Warm wooden staircase. Columns `0-2`, rows `18-21`. Rect `(0,288,48,64)`.
  - Matching warm stairwell landing. Columns `8-12`, rows `18-21`. Rect `(128,288,80,64)`.
- `1_Interiors/16x16/Theme_Sorter/5_Classroom_and_library_16x16.png`
  - Green-screen CRT desk. Columns `10-12`, rows `5-6`. Rect `(160,80,48,32)`.
- `1_Interiors/16x16/Theme_Sorter_Singles/4_Bedroom_Singles/Bedroom_Singles_13.png`
  - Bed. Whole-file rect `(0,0,48,48)`.
- `1_Interiors/16x16/Theme_Sorter_Singles/4_Bedroom_Singles/Bedroom_Singles_421.png`
  - Window left section. Whole-file rect `(0,0,32,48)`.
- `1_Interiors/16x16/Theme_Sorter_Singles/4_Bedroom_Singles/Bedroom_Singles_422.png`
  - Window right section. Whole-file rect `(0,0,16,48)`.
- `1_Interiors/16x16/Theme_Sorter_Singles/6_Music_and_Sport/Music_and_Sport_Singles_43.png`
  - Tall speaker. Whole-file rect `(0,0,16,48)`.
- `1_Interiors/16x16/Theme_Sorter_Singles/6_Music_and_Sport/Music_and_Sport_Singles_66.png`
  - Keyboard. Whole-file rect `(0,0,32,16)`.
- `1_Interiors/16x16/Theme_Sorter_Singles/6_Music_and_Sport/Music_and_Sport_Singles_83.png`
  - Vocal microphone and stand. Whole-file rect `(0,0,32,32)`.
- `1_Interiors/16x16/Theme_Sorter_Singles/6_Music_and_Sport/Music_and_Sport_Singles_183.png`
  - Stereo or amp. Whole-file rect `(0,0,16,32)`.
- `1_Interiors/16x16/Theme_Sorter_Singles/11_Halloween_Singles/Halloween_Singles_99.png`
  - Framed skull art. Whole-file rect `(0,0,16,32)`.

The output layout is floor `(0,0)`, wall `(1,0)`, stereo `(2,0)` 1x2,
CRT desk `(4,0)` 3x2, bed `(8,0)` 3x3, window `(12,0)` 3x3,
speaker `(0,3)` 1x3, keyboard `(2,3)` 2x1, skull `(4,3)` 1x2, and
microphone `(6,3)` 2x2. The appended pieces are warm wooden stairs `(0,6)`
3x4 and the matching warm stairwell landing `(4,6)` 5x4.
Both licensed stair cuts stay reserved in the atlas and are not rendered in the
current house build. The active two-way staircase uses original AI-assisted
pixel art generated for this room, then locally extracted, transparency-cleaned,
resized, and reduced to the room palette by
`dev-review/_extract_generated_stairs.py`. The runtime files are
`public/sprites/interiors/algy-house-stair-ground.png` at 48x40 pixels and
`public/sprites/interiors/algy-house-stair-upstairs.png` at 48x28 pixels. Their
local generation source is
`C:\Users\Algy\.codex\generated_images\01a045aa-43cc-7c23-86ca-89167defd256\exec-1f64afed-a92a-4e68-9eaa-f81a30641cdd.png`.
They are drawn at the room's native 3x scale. No pixels from another game or
from the licensed stair cuts are present in these two files. Source pixels and
atlas indexes stay intact.
The renderer also repairs the high west post's overlap with the top tread by
reusing its existing shaft rect `(4,4,3,5)` and base rect `(4,9,3,1)` from the
48x40 ground-stair sprite as foreground slices. No image file, imported source
cell, palette or atlas index was changed for that layering repair.
`scripts/algy-house-art-extract.mjs` can rebuild the atlas or verify it
pixel-for-pixel against the licensed source files.

#### September 5 ground-floor layout

Five new cuts are appended below pixel row 160. Every pixel in the original
256x160 region is unchanged. Source paths below are relative to
`1_Interiors/16x16/` in the same paid pack.

- Subdued brown plank texture:
  `Room_Builder_subfiles/Room_Builder_Floors_16x16.png`.
  Cells columns 4-6, rows 12-13. Rect `(64,192,48,32)`.
  Atlas pixel `(0,160)`, cells `(0,10)` spanning 3x2.
- Rose sofa: `Theme_Sorter/1_Generic_16x16.png`.
  Cells columns 6-7, rows 11-12. Rect `(96,176,32,32)`.
  Atlas pixel `(64,160)`, cells `(4,10)` spanning 2x2.
- Potted palm: `Theme_Sorter_Singles/2_Living_Room_Singles/Living_Room_Singles_14.png`.
  Whole-file rect `(0,0,32,32)`, all four source cells.
  Atlas pixel `(96,160)`, cells `(6,10)` spanning 2x2.
- Coffee table: `Theme_Sorter_Singles/2_Living_Room_Singles/Living_Room_Singles_29.png`.
  Whole-file rect `(0,0,32,32)`, all four source cells.
  Atlas pixel `(128,160)`, cells `(8,10)` spanning 2x2.
- Red and old-gold rug: `Theme_Sorter/1_Generic_16x16.png`.
  Cells columns 9-12, rows 4-6. Rect `(144,64,64,48)`.
  Atlas pixel `(0,192)`, cells `(0,12)` spanning 4x3.

The upstairs CRT station with gray locker/tower, downstairs curtain window and
skull poster reuse the already
listed atlas cuts. No new cells are needed for those objects. The room shell,
paneling, doormat, contact shadows and staggered plank seams are original canvas
pixel shapes in `algyHouseRoomArt.ts`. The new licensed plank texture is rendered
at 18 percent opacity over the original floor color to keep its contrast quiet.
Source PNG pixels are unaltered. No old atlas coordinate or stair sprite changed.

September 5 follow-up: the upstairs locked doorway reuses the original canvas
threshold and woven-mat geometry from downstairs. The ground stair sprite's
render origin is `(0.875,-0.375)`, six world pixels lower and left of the
half-tile draft, against the west wall. Its logical path is unchanged.

The bedroom reuses the existing bed cut `(128,0,48,48)`. Its shared cutaway
room shell has blue-gray paneling. The bedside lamp, downstairs window's quiet
moonlit water view, and upstairs curtain-free wooden window are original canvas
pixel shapes in `algyHouseRoomArt.ts`. The downstairs licensed curtains remain.

The owner requested a distinct bedroom nightstand and smaller rug. These two
native-resolution pieces are appended in formerly empty atlas cells, with
all eighteen earlier cuts unchanged:

- Gray two-drawer nightstand:
  `1_Interiors/16x16/Theme_Sorter_Singles/4_Bedroom_Singles/Bedroom_Singles_430.png`.
  Whole-file rect `(0,0,16,32)`, source cells `(0,0)` and `(0,1)`.
  Atlas pixel `(160,160)`, cell `(10,10)` spanning 1x2.
- Cream/taupe bedside runner:
  `1_Interiors/16x16/Theme_Sorter_Singles/4_Bedroom_Singles/Bedroom_Singles_384.png`.
  Whole-file rect `(0,0,32,16)`, source cells `(0,0)` and `(1,0)`.
  Atlas pixel `(176,160)`, cell `(11,10)` spanning 2x1.

That bedroom refinement kept the atlas at 256x240. Existing pixels, coordinates and names
are unaltered. The nightstand sits closer to the pillow and the small runner
lies beside the bed, clear of the cabinet. Downstairs art is unchanged.
Only these selected cuts enter the repo, never the full pack.

#### September 5 living room and office props

Six additional cuts extend the atlas to 256x288. Every pixel of the previous
256x240 area is preserved. These source paths are relative to
`1_Interiors/16x16/`. Whole-file cell coordinates below refer to each native
single. No source image has been rescaled or recolored in the atlas.

- Television: `Theme_Sorter_Singles/2_Living_Room_Singles/Living_Room_Singles_4.png`.
  Whole rect `(0,0,32,32)`, columns 0-1 and rows 0-1.
  Atlas `(0,240)`, cells `(0,15)` spanning 2x2.
- Blue floor lamp: `Theme_Sorter_Singles/2_Living_Room_Singles/Living_Room_Singles_79.png`.
  Whole rect `(0,0,16,48)`, column 0 and rows 0-2.
  Atlas `(32,240)`, cells `(2,15)` spanning 1x3.
- Small entry plant: `Theme_Sorter_Singles/2_Living_Room_Singles/Living_Room_Singles_15.png`.
  Whole rect `(0,0,16,32)`, column 0 and rows 0-1.
  Atlas `(48,240)`, cells `(3,15)` spanning 1x2.
- Bedroom wardrobe: `Theme_Sorter_Singles/4_Bedroom_Singles/Bedroom_Singles_539.png`.
  Whole rect `(0,0,32,48)`, columns 0-1 and rows 0-2.
  Atlas `(64,240)`, cells `(4,15)` spanning 2x3.
- Office bookcase: `Theme_Sorter/5_Classroom_and_library_16x16.png`.
  Rect `(64,112,32,48)`, source columns 4-5 and rows 7-9.
  Atlas `(96,240)`, cells `(6,15)` spanning 2x3.
- Office plant: `Theme_Sorter_Singles/2_Living_Room_Singles/Living_Room_Singles_16.png`.
  Whole rect `(0,0,16,32)`, column 0 and rows 0-1.
  Atlas `(128,240)`, cells `(8,15)` spanning 1x2.

The downstairs poster is no longer drawn. Its source cut stays preserved for
the upstairs poster. New props are visual furniture with foot-based collisions
and depth sorting. No new interaction or third-party asset is implied.

Artist reference: https://limezu.itch.io/moderninteriors

License summary from the pack's `LICENSE.txt`:

- Commercial and non-commercial use is allowed.
- Editing is allowed.
- Resale or redistribution of the asset pack is prohibited.
- Credit to `limezu.itch.io` is required.

### Original Toggle Town mix, current house stereo

- Runtime file: `public/audio/toggletown-original.mp3`.
- User-created original mix, selected by the owner for the house on September 5.
- Duration: 627.620313 seconds, approximately 10 minutes 28 seconds.
- Existing source WAV export: `C:/Users/Algy/Desktop/Files/bots/toggletown.wav`.
- MP3 SHA-256: `7990A258133F0B4CA83080D70B163221F9099A30059AC2CEEBFE33D43C41D55A`.
- Reuses the existing original MP3 without transcoding or copying the WAV.
- Background autoplay is requested unmuted on each entry/reload. Positive
  saved volume is retained. An old zero/invalid value starts at 55%.
  Manual mute and zero volume still work for the current visit.
  Browser-blocked playback retries on the first tap/key or explicit Play.
  The mix loops, continues between house floors and stops/rewinds on exit.
  The upstairs speaker opens a near-only volume slider.
- Town's separate 15-minute `toggletown.mp3` is unchanged. This house selection
  is the selected track for this release.

### September 5 dining layout and tabletop TV

Five source cuts extend the atlas from 256x288 to 256x320. The entire previous
256x288 pixel region is preserved. These paths are relative to
`1_Interiors/16x16/`. All source cuts remain at their original native size.

- Small tabletop television:
  `Theme_Sorter_Singles/2_Living_Room_Singles/Living_Room_Singles_8.png`.
  Full rect `(0,0,16,16)`, source cell `(0,0)`.
  Atlas `(0,288)`, cell `(0,18)`.
- Warm wood dining table: `Theme_Sorter/1_Generic_16x16.png`.
  Rect `(80,96,48,32)`, source columns 5-7 and rows 6-7.
  Atlas `(16,288)`, columns 1-3 and rows 18-19.
- Dining chair, front: `Theme_Sorter/1_Generic_16x16.png`.
  Rect `(48,176,16,32)`, source column 3 and rows 11-12.
  Atlas `(64,288)`, column 4 and rows 18-19.
- Dining chair, facing right: `Theme_Sorter/1_Generic_16x16.png`.
  Rect `(64,176,16,32)`, source column 4 and rows 11-12.
  Atlas `(80,288)`, column 5 and rows 18-19.
- Dining chair, facing left: `Theme_Sorter/1_Generic_16x16.png`.
  Rect `(80,176,16,32)`, source column 5 and rows 11-12.
  Atlas `(96,288)`, column 6 and rows 18-19. Both side chairs use their
  original opposing orientations, without rotating or mirroring any pixels.

The small TV is drawn on the existing coffee table. The large freestanding
screen formerly at the left of the room is replaced by a dining table and
three matching chairs. Its old atlas cut stays intact. The bookshelf and speaker reuse
their existing exact art at new positions. Credit: `limezu.itch.io`.

### September 5 screen and placement refinement

- Wide tabletop television: `Theme_Sorter/4_Bedroom_16x16.png`, relative to
  `1_Interiors/16x16/`. Source rect `(144,224,32,32)`, columns 9-10 and
  rows 14-15. Atlas `(112,288)`, columns 7-8 and rows 18-19.
- The dark bezel, reflective screen and pedestal are copied without alteration
  and displayed at 2x native size. Its base sits on the existing coffee table.
- This is the current TV. The earlier Living Room single 8 was visually
  ambiguous and read as a footrest. Its historical atlas name and pixels stay
  intact, but the room no longer renders it as the television.
- The atlas remains 256x320 with 32 exact-source cuts. All 31 earlier cuts
  retain their source pixels, coordinates and names.
- The bookshelf moves left by one tile. The stair wall opening moves left
  by three world pixels. Neither adjustment imports new art.

Credit: `limezu.itch.io`. Same licensed Modern Interiors pack and terms above.

### September 5 restored table and north-facing living room

- Restored square table: reuses the existing cut at atlas `(0,240,32,32)`
  from `Theme_Sorter_Singles/2_Living_Room_Singles/Living_Room_Singles_4.png`.
  Its historical extractor name stays unchanged. No source cell is overwritten.
- Low gray dining chair facing right: `Theme_Sorter/12_Kitchen_16x16.png`,
  source rect `(96,176,16,32)`, column 6 and rows 11-12. Atlas `(144,288)`,
  column 9 and rows 18-19.
- Low gray dining chair facing left: same Kitchen sheet, source rect
  `(80,208,16,32)`, column 5 and rows 13-14. Atlas `(160,288)`, column 10
  and rows 18-19. These are native opposing views, displayed at 2x scale.
- Source paths above are relative to `1_Interiors/16x16/`. The atlas stays
  256x320 with 34 exact-source cuts. All 32 earlier cuts remain intact.
- The north-facing red couch is original code-native pixel art in
  `drawHouseNorthFacingSofa`, `src/components/hub/algyHouseRoomArt.ts`.
  It uses an upright 32px grid with the broad backrest on the south edge.
  The earlier front-facing couch source remains in the atlas. No bitmap is
  flipped or overwritten. The licensed pack's surveyed sofas did not provide
  a verified matching rear view.
- The TV table and couch swap positions. The lamp, rug, upstairs, music and
  stair art are unchanged in this pass.

Modern Interiors source credit: `limezu.itch.io`, under the same license above.

### September 5 four-chair dining update

- Low gray dining chair facing front: `Theme_Sorter/12_Kitchen_16x16.png`,
  source rect `(16,176,16,16)`, atlas `(176,288)`.
- Low gray dining chair facing back: the same Kitchen sheet, source rect
  `(48,176,16,16)`, atlas `(192,288)`. Both are native upright gray chair
  cells, copied at 2x without rotation or flips.

These two front/back cells remain preserved but unused after the owner's
follow-up. The current room uses the original side-facing cells at `(144,288)`
and `(160,288)` twice each, adding one chair directly above each original.
No additional source art was imported for that correction.

Modern Interiors source credit: `limezu.itch.io`, under the same license above.

### Repo by Young Algy, previous house track

- Previous runtime file: `public/audio/repo-young-algy.mp3` (not shipped in this release)
- Source supplied by the project owner:
  `C:\Users\Algy\Desktop\Files\Toggle Money\Released Songs\Repo (Young Algy).mp3`
- SHA-256:
  `F3A2E38277CD5F9687AA1EC1C0CF86A7F6660706521FD224170C1400219AE6A1`
- This file remains preserved in Git history and the source music library. It is
  no longer selected or copied into the production bundle. The stereo uses the existing `(2,0)` atlas cut
  listed above. No new cells or
  atlas indexes were imported for this pass.

### Skull detail

`algy-skull-detail.svg` is original pixel art made for this room. It has no
third-party source asset. It remains outside this release because it is not
rendered by the current house.
