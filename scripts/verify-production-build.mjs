import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");

const HOUSE_ASSETS = new Map([
  ["audio/repo-young-algy.mp3", "F3A2E38277CD5F9687AA1EC1C0CF86A7F6660706521FD224170C1400219AE6A1"],
  ["sprites/interiors/algy_house_16.png", "E925350AA7DE0F949DC50CC46426426265718DA2D6997F9B8A3BF14A3C42D9F6"],
  ["sprites/interiors/algy-house-stair-ground.png", "39B53B534F19BBA992FD63DC4F64D7041BF7A75B5B1F0EFF81F813E9998E9B11"],
  ["sprites/interiors/algy-house-stair-upstairs.png", "A395CDEEA245FEB4CE90911D4D583520159E8B9189D094CA352BB74C316D96C2"],
  ["sprites/characters/algy_run.png", "F6750B01DDFAA13D72741E842CCA5FDB515AB3954B20C026F1B5C684165F1EBB"],
]);

const TEXT_EXTENSIONS = new Set([".css", ".html", ".js", ".json", ".map", ".svg", ".txt", ".xml"]);
const AUDIO_EXTENSIONS = new Set([".aac", ".flac", ".m4a", ".mp3", ".ogg", ".opus", ".wav"]);
const DRAFT_PATTERNS = [
  /myspace/i,
  /draft[-_]?myspace/i,
  /local profile draft/i,
  /profile under construction/i,
];

function allFiles(directory) {
  const files = [];
  const visit = (current) => {
    for (const name of readdirSync(current)) {
      const absolute = path.join(current, name);
      if (statSync(absolute).isDirectory()) visit(absolute);
      else files.push(absolute);
    }
  };
  visit(directory);
  return files;
}

function sha256(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex").toUpperCase();
}

function text(file) {
  return readFileSync(file, "utf8");
}

const failures = [];
const fail = (message) => failures.push(message);

if (!existsSync(dist)) {
  fail("dist does not exist. Run the production build before this verifier.");
} else {
  const files = allFiles(dist);
  const relativeFiles = new Map(files.map((file) => [path.relative(dist, file).replaceAll("\\", "/"), file]));

  for (const [relative, expectedHash] of HOUSE_ASSETS) {
    const file = relativeFiles.get(relative);
    if (!file) {
      fail(`required House asset is missing: ${relative}`);
    } else if (sha256(file) !== expectedHash) {
      fail(`required House asset hash does not match: ${relative}`);
    }
  }

  for (const [relative, file] of relativeFiles) {
    const extension = path.extname(relative).toLowerCase();
    if (AUDIO_EXTENSIONS.has(extension) && !HOUSE_ASSETS.has(relative)) {
      fail(`unexpected audio file: ${relative}`);
    }
    if (!TEXT_EXTENSIONS.has(extension)) continue;
    const contents = text(file);
    for (const pattern of DRAFT_PATTERNS) {
      if (pattern.test(relative) || pattern.test(contents)) {
        fail(`draft material reached dist: ${relative}`);
        break;
      }
    }
  }

  const rootHtml = relativeFiles.get("index.html");
  if (!rootHtml) {
    fail("root index.html is missing from dist");
  } else {
    const contents = text(rootHtml);
    if (!/<title>\s*Algy's House \| Young Algy\s*<\/title>/i.test(contents)) {
      fail("root House title is missing from dist/index.html");
    }
    if (!/<link\s+rel=["']canonical["']\s+href=["']https:\/\/youngalgy\.com\/["']/i.test(contents)) {
      fail("root canonical URL is missing from dist/index.html");
    }
    if (!contents.includes("og-algys-house-20260904.png")) {
      fail("root House social image is missing from dist/index.html");
    }
    for (const legacyMetadata of [
      "Healthcare Recruiting &amp; Operations",
      "Healthcare Recruiting & Operations",
      "Tampa-based healthcare recruiter",
      "Healthcare recruiting and operations.",
    ]) {
      if (contents.includes(legacyMetadata)) fail("legacy portfolio metadata remains in dist/index.html");
    }
  }

  for (const shell of ["404.html", "privacy.html", "terms.html", "retired.html"]) {
    if (!relativeFiles.has(shell)) fail(`required static shell is missing: ${shell}`);
  }

  const redirects = relativeFiles.get("_redirects");
  if (!redirects) {
    fail("_redirects is missing from dist");
  } else {
    const contents = text(redirects);
    for (const rule of [
      "/fishing https://toggle.town/fishing 301",
      "/fishing/* https://toggle.town/fishing/:splat 301",
      "/alpha https://alpha.everyday.report 301",
      "/alpha/* https://alpha.everyday.report/:splat 301",
      "/studio https://toggle.town/studio 302",
      "/studio/* https://toggle.town/studio/:splat 302",
      "/freelance /retired 200",
      "/creditkit /retired 200",
      "/baselens /retired 200",
      "/applykit /retired 200",
    ]) {
      if (!contents.includes(rule)) fail(`required redirect rule is missing: ${rule}`);
    }
    if (/^\s*\/\*\s+/m.test(contents)) fail("_redirects must not contain a catch-all rewrite");
  }
}

if (failures.length > 0) {
  console.error("Production verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Production verification passed. House assets, routes, metadata, and draft exclusions are intact.");
