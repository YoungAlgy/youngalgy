# House update, September 8, 2026

Status: published and directly verified. The bounded read-only watch passed:
31 samples over 15 minutes 41 seconds, with zero failures.

The owner approved publishing the current house and town work with a dated backup.
This release started on verified YoungAlgy main `7f766bf`, retaining the live
production integration. Only nine reviewed shared House source/test files change.

Published at 2026-09-08 17:24 UTC from
`3a9503d2ce49f598aa034f2eefadb33533c92f30`. Branch
`release/town-house-art-20260908` was pushed, and YoungAlgy `main` was
fast-forward pushed to the same source. Current Pages deployment:
`8d30ff1b-a2cc-424a-a187-295ce59ae5ab`.

Includes furniture-edge walkability, stair visibility corrections, the computer
line `Codex is thinking...`, and immediate safe exit fade. Production homepage
metadata, CSS, legal copy, routes, headers, redirects, dependencies, room art and
original audio remain unchanged. The production build guard is unchanged.

Full House checks: 179 tests across 20 files, typecheck, lint and production
build/asset/route/metadata guard passed. Existing React act warnings and stale
Browserslist data remain separate maintenance notes.

All 13 selected production House assets match the candidate bytes. Fresh live
statuses and selected security headers match the verified baseline. Desktop
and phone candidate previews covered both floors, the exact computer line and
the immediate exit fade. The live production flow entered the House as Mitch
by stepping up from Town's porch `(31,28)` and remained in the same browser tab.
Both stairs, the computer line, immediate exit fade, porch return and second
entry passed on the live sites with Mitch retained. Phone dialogue layout was
checked at 390 by 844. The live House HTML matched the exact built document.

The paired Town source is `213da67e86759f5fe72ddc1225e5ba52a40b0258`,
published as Worker v120 `b51b07f6-25ad-40c1-aa7f-7aa8a7ca6607` through
deployment `4f819cb8-1fe3-4cee-938c-96b56f1ed002`. The read-only production
watch passed 31 samples over 941,010 ms with zero failures. Both provider
identities matched at the start and end. See the evidence folder's `watch.json`.
This is a bounded release check, not ongoing monitoring.

Previous Pages production, verified September 8:
`19aef7ff-d940-4d3e-b619-f471df6bb1b7`, source
`c401c9918f86c748e8ecdaf54a6160e285691222`.
Source backups are under
`C:\Users\Algy\Desktop\Files\town-house-art-backup-20260908`.
Evidence is under `C:\Users\Algy\Desktop\Files\town-house-art-evidence-20260908`.
Only restore a prior version after checking for newer releases.

Future work stays local until the owner asks to publish again.
