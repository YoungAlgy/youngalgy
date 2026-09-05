# Algy's House art and audio credits

## Algy's House

### Modern Interiors by LimeZu

> Modern Interiors art by LimeZu (limezu.itch.io), used under the paid full-version commercial license. Credit is required.

The full paid pack stays outside this repository at
`C:\Users\Algy\Desktop\Files\pixel art\moderninteriors-win`. The room ships
one derived 256x160 atlas at
`public/sprites/interiors/algy_house_16.png`. It contains only the thirteen
native-resolution cuts listed below. Source rectangles use
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
The source workspace's `scripts/algy-house-art-extract.mjs` can rebuild the atlas or verify it
pixel-for-pixel against the licensed source files.
That workspace is `C:\Users\Algy\Desktop\Files\toggletown-algys-house`.
The extraction scripts and unused skull-detail file are not part of this release.

License summary from the pack's `LICENSE.txt`:

- Commercial and non-commercial use is allowed.
- Editing is allowed.
- Resale or redistribution of the asset pack is prohibited.
- Credit to `limezu.itch.io` is required.

### Repo by Young Algy

- Runtime file: `public/audio/repo-young-algy.mp3`
- Source supplied by the project owner:
  `C:\Users\Algy\Desktop\Files\Toggle Money\Released Songs\Repo (Young Algy).mp3`
- SHA-256:
  `F3A2E38277CD5F9687AA1EC1C0CF86A7F6660706521FD224170C1400219AE6A1`
- The upstairs stereo plays this file only after an explicit interaction.
  It uses the personal house's saved music volume and mute state, stays on during travel
  between house floors, and stops on leaving the house. Reload never autoplays.
  The stereo uses the existing `(2,0)` atlas cut listed above. No new cells or
  atlas indexes were imported for this pass.

### Toggle Town character sprites

- Algy runtime sprite: `public/sprites/characters/algy_run.png`
- Mitch runtime sprite: `public/sprites/characters/mitch_run.png`
- These existing original Toggle Town character sprites are reused for the
  approved house visitor continuity; no third-party character art was added.
- Mitch sprite SHA-256:
  `F2DA9071CEF39EEFA5EC70166698DC865A8B1B4B1F79050BD4ED6DB9729843D2`
