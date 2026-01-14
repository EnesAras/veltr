import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const MODE = process.argv[2] || "all";

const Q = { avif: 50, webp: 60, jpg: 75 };

function exists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function outPath(inFile, width, ext) {
  const dir = path.dirname(inFile);
  const base = path.basename(inFile, path.extname(inFile));
  return path.join(dir, `${base}-${width}.${ext}`);
}

async function makeVariants(inFile, widths, exts) {
  if (!exists(inFile)) {
    console.warn(`[images] missing input: ${inFile}`);
    return;
  }

  for (const w of widths) {
    for (const ext of exts) {
      const out = outPath(inFile, w, ext);
      if (exists(out)) continue;

      let img = sharp(inFile, { failOn: "none" })
        .resize({ width: w, withoutEnlargement: true })
        .withMetadata(false);

      if (ext === "avif") img = img.avif({ quality: Q.avif });
      if (ext === "webp") img = img.webp({ quality: Q.webp });
      if (ext === "jpg") img = img.jpeg({ quality: Q.jpg, mozjpeg: true });

      await img.toFile(out);
      console.log(`[images] wrote ${path.relative(ROOT, out)}`);
    }
  }
}

async function runHero() {
  const dir = path.join(ROOT, "public/images/hero");
  const files = ["hero-01.jpg", "hero-02.jpg", "hero-03.jpg", "hero-04.jpg"].map((f) =>
    path.join(dir, f)
  );
  for (const f of files) {
    await makeVariants(f, [1200, 1600, 2000], ["avif", "webp", "jpg"]);
  }
}

async function runFeature() {
  const dir = path.join(ROOT, "public/images/feature");
  const files = ["aero-flagship.png", "echo-earbuds.png", "pulse-gaming.png"].map((f) =>
    path.join(dir, f)
  );
  for (const f of files) {
    await makeVariants(f, [1200, 1600, 2000], ["avif", "webp", "jpg"]);
  }
}

async function runEditorial() {
  const dir = path.join(ROOT, "public/assets/veltr/editorial");
  if (!exists(dir)) {
    console.warn(`[images] missing editorial dir: ${dir}`);
    return;
  }
  const files = fs
    .readdirSync(dir)
    .filter((file) => /\.(jpe?g)$/i.test(file))
    .map((file) => path.join(dir, file));

  for (const f of files) {
    await makeVariants(f, [1200, 1600, 2000], ["avif", "webp", "jpg"]);
  }
}

async function runProducts6() {
  const dir = path.join(ROOT, "public/images/products");
  const files = [
    "veltr-elite.png",
    "veltr-air.png",
    "veltr-lite.png",
    "veltr-noise-x.png",
    "veltr-studio.png",
    "veltr-studio-pro.png",
  ].map((f) => path.join(dir, f));

  for (const f of files) {
    await makeVariants(f, [800, 1200, 1600, 2000], ["avif", "webp", "jpg"]);
  }
}

(async () => {
  const start = Date.now();

  if (MODE === "hero") await runHero();
  else if (MODE === "feature") await runFeature();
  else if (MODE === "editorial") await runEditorial();
  else if (MODE === "products6") await runProducts6();
  else {
    await runHero();
    await runFeature();
    await runEditorial();
    await runProducts6();
  }

  console.log(`[images] done in ${Date.now() - start}ms`);
})().catch((err) => {
  console.error("[images] failed:", err);
  process.exit(1);
});
