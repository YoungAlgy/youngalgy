# Algy's House homepage

The September 4, 2026 release replaces the youngalgy.com homepage with the
current explorable house. New visitors start inside on the ground floor.
The two floors, staircase transitions, upstairs stereo and saved sound settings
come from the reviewed local house. The outside door goes to https://toggle.town/.

## Release boundary

The owner explicitly approved publishing this version. Future edits stay local
until the owner asks to push or deploy again. Do not set up automatic deployment.
Cloudflare Pages project `youngalgy` has no Git integration as verified for this
release. Git pushes and Pages deployments are separate actions.

This release contains no Toggle Universe game routes, MySpace draft, account
system, database migration or billing change. Existing Alpha, Fishing, Studio
and retired-page redirects are preserved. Privacy and Terms stay available.
Their factual site and browser-storage descriptions reflect the house.

The old Landing source is preserved in Git and no longer used for the root route.

## Source and local work

This release was assembled in a clean worktree:
`C:\Users\Algy\Desktop\Files\youngalgy-house-release-20260904`.

The reviewed house source came from
`C:\Users\Algy\Desktop\Files\toggletown-algys-house`.
That sandbox and `C:\Users\Algy\youngalgy` both had unrelated unfinished work.
Do not reset or overwrite either one to reconcile this release.

Release-specific integration in this repository includes the root route,
absolute Toggle Town door destination, scoped styles, route metadata, legal
disclosure updates and build guard. Keep these when bringing over future room
updates from the sandbox.

## Checks before another release

Run `npm ci`, `npm run typecheck`, `npm run lint`, and `npm run build`.
The normal build runs the tests and production asset/route checks.
Use `npm run preview -- --host 127.0.0.1 --port 4187 --strictPort` to inspect the
built result locally. Desktop and phone browser checks must cover both stairs,
held movement, safe arrivals, reload, explicit stereo play, mute/volume, silent
reload and the outside door. Verify returning home from the legal pages too.

The initial release had 65 passing tests. Its asset guard checks the approved
song and four sprite files by SHA-256, requires static legal/retired/404 shells,
checks homepage metadata and preserves the redirect rules. Art edits need
reviewed hash updates and matching credit changes. Do not bypass the guard.

## September 4 cutover and rollback reference

The prior production deployment was:
`83f266aa-d2f1-427b-b14e-b1e92517aa81`, built from Git commit
`772bfe4d0b5e957add867e9761527cbe5874ec14`.
Its immutable URL is https://83f266aa.youngalgy.pages.dev.

If this cutover fails, use Cloudflare Pages' rollback action on that verified
production deployment, then check youngalgy.com and www.youngalgy.com again.
Do not reset a dirty checkout. For future releases, record their own current
production rollback point instead of assuming this older one is still suitable.

Deploy a preview branch first and check the actual Pages result, including
headers and music. Publish the exact verified artifact to production only after
the owner authorizes the release. Check both domains, legal pages, `/alpha` and
the other redirects after deployment. A successful upload alone is not proof
that the public domain is serving the new version.

## Mitch visit update, published September 4, 2026 (Tampa time)

Owner approval: "nice i love this we can push this".
The approved visitor update is live as Pages production deployment
`394f6ad9-e393-4e68-9b0f-84c9df4a8d12`, source `b917aa9`, on branch `main`.
Runtime commit `06bd1e8a5511225d848866d2fd2cbe6fd32fccee` was tested at
https://2139ab4c.youngalgy.pages.dev before the identical runtime files were
published. The later commit corrects CREDITS.md only. Both commits were pushed
to `origin/main`. Git integration remains absent and no automatic deploy was added.

Mitch stays the player when arriving from Toggle Town. Algy stands downstairs
and says "Money Mitch!! Great to see you bro!!" when Mitch faces and interacts
with him. Visitors retain character identity through stairs, reload and exit.
An explicit visitor exits to `https://toggle.town/pixel?character=mitch&return=algy-porch`
(or `character=algy`). A direct homepage visit still uses Algy and exits to the
town root. The strict character allowlist does not accept URL redirect targets.

Release checks passed: 77 tests, typecheck, lint, production build and the asset,
metadata and redirect guard. The existing Mitch sprite is hash-pinned and its
LimeZu source is credited. The public desktop/phone browser checks passed the
greeting, host collision, dialogue lock/focus, both floors, silent muted reload,
safe return, repeated entry and Browser Back. The original Algy door regression
also passed. Reports and screenshots are in the town release worktree under
`release-evidence/`. The matching public town Worker is
`4b88225a-c2e7-4019-b935-369b932fa538` at 100 percent.

This update's prior production rollback point is
`801a790d-e245-4139-9ba3-f0c080336f12`, source `6b88f7f`, available at
https://801a790d.youngalgy.pages.dev. Recheck the current production deployment
before any rollback. Do not use the older initial-cutover rollback by default.
No unrelated room work, routes, DNS, database, billing or secrets were changed.
Future work stays local until the owner asks to ship it.

Post-release checks confirmed both `youngalgy.com` and `www.youngalgy.com`
serve the same staged house HTML and main bundle. All 12 checked personal
routes retained their status, redirect target, content type and CSP. A fresh
direct browser visit used Algy with no duplicate host and no page errors.
The town's 11 checked routes also retained their prior responses and retired
endpoint body hashes. Production checks passed without rollback.
