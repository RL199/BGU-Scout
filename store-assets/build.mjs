#!/usr/bin/env node
/**
 * BGU Scout — Chrome Web Store listing image generator.
 *
 * Renders every listing asset (store icon, small promo tile, marquee promo tile,
 * screenshots) in three design directions, using headless Chrome.
 *
 *   node store-assets/build.mjs            # render everything
 *   node store-assets/build.mjs a c        # render only directions a and c
 *   node store-assets/build.mjs --keep-html
 *
 * Output goes to store-assets/out/<direction>/.
 * Edit COPY below to change wording; edit the DIRECTIONS styles to change looks.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const OUT = path.join(HERE, 'out');
const TMP = path.join(HERE, '.build');

/* ------------------------------------------------------------------ *
 * Copy — everything user-visible lives here.
 * ------------------------------------------------------------------ */

const COPY = {
    name: 'BGU Scout',
    marquee: {
        a: {
            eyebrow: 'BGU SCOUT',
            title: 'Know the <em>curve</em><br>before you pick the course.',
            sub: 'Grade distributions for any BGU course, straight from your toolbar.'
        },
        b: {
            eyebrow: 'CHROME EXTENSION',
            title: 'BGU grade distributions,<br>in <em>one click</em>.',
            sub: 'Hebrew &amp; English · Light &amp; dark · Six color schemes',
            chips: ['Any course', 'Any semester', 'Any exam']
        },
        c: {
            eyebrow: 'FOR BEN-GURION UNIVERSITY STUDENTS',
            title: 'Every course.<br>Every <em>grade curve</em>.',
            sub: 'Pick a course, hit Display, and read the distribution — no digging through BGU4U.',
            bullets: ['Multi-course compare', 'Moodle auto-add', 'Excel export']
        }
    },
    tile: {
        a: { title: 'BGU Scout', sub: 'Grade curves for every BGU course' },
        b: { title: 'BGU Scout', sub: 'Know the curve' },
        c: { title: 'BGU Scout', sub: 'Grade distributions · one click' }
    },
    slides: [
        {
            file: '01-popup',
            eyebrow: 'THE POPUP',
            title: 'Every grade distribution, <em>one click away</em>',
            sub: 'Choose a year range, semesters and exam numbers. then hit Display.',
            img: 'popup'
        },
        {
            file: '02-customize',
            eyebrow: 'OPTIONS',
            title: 'Make it <em>yours</em>',
            sub: 'Six color schemes, light or dark, and dual language support.',
            img: 'options1'
        },
        {
            file: '03-hebrew',
            eyebrow: 'עברית · HEBREW',
            title: 'Full Hebrew, <em>full RTL</em>',
            sub: '<span dir="rtl">כל התוסף תומך בעברית, כולל פריסה מימין לשמאל.</span>',
            img: 'options2'
        },
        {
            file: '04-moodle',
            eyebrow: 'MOODLE',
            title: 'Your courses,<br><em>added automatically</em>',
            sub: 'Turn on Auto-Add and open Moodle, your course list fills itself.',
            img: 'options1',
            layout: 'split',
            crop: { x: 1742, y: 6, w: 920, h: 1245 }
        }
    ]
};

/* ------------------------------------------------------------------ *
 * Sources
 * ------------------------------------------------------------------ */

const SRC = {
    popup: { file: 'Screenshots/popupScreenshot.png', w: 1280, h: 800 },
    options1: { file: 'Screenshots/optionsScreenshot1.png', w: 2654, h: 1268 },
    options2: { file: 'Screenshots/optionsScreenshot2.png', w: 2659, h: 1273 },
    icon: { file: 'extension-icons/icon-128.png', w: 128, h: 128 }
};

const dataUri = (rel) =>
    'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, rel)).toString('base64');

for (const key of Object.keys(SRC)) SRC[key].uri = dataUri(SRC[key].file);

/* ------------------------------------------------------------------ *
 * Shared pieces
 * ------------------------------------------------------------------ */

const FONT = `'Segoe UI Variable Display','Segoe UI',Rubik,'Helvetica Neue',Arial,sans-serif`;

/** Ascending bar-chart mark echoing the extension icon. */
const bars = (size, color, opacity = 1) => `
<svg class="bars" width="${size}" height="${(size * 0.78).toFixed(1)}" viewBox="0 0 64 50"
     fill="${color}" opacity="${opacity}" aria-hidden="true">
  <rect x="0"  y="31" width="12" height="19" rx="2.5"/>
  <rect x="17" y="21" width="12" height="29" rx="2.5"/>
  <rect x="34" y="11" width="12" height="39" rx="2.5"/>
  <rect x="51" y="0"  width="12" height="50" rx="2.5"/>
</svg>`;

const reset = (w, h) => `
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${w}px;height:${h}px;overflow:hidden}
body{font-family:${FONT};-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
em{font-style:normal}
img{display:block}`;

const page = (w, h, css, body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><style>${reset(w, h)}
${css}</style></head><body>${body}</body></html>`;

/* ------------------------------------------------------------------ *
 * Directions — background + typography per design option.
 * ------------------------------------------------------------------ */

const DIRECTIONS = {
    a: {
        label: 'spotlight',
        blurb: 'Dark product hero — charcoal, orange glow, screenshots in a browser frame.',
        surface: `
      background:#131517;
      background-image:
        radial-gradient(900px 560px at 10% -12%, rgba(247,148,30,.30), transparent 62%),
        radial-gradient(760px 500px at 98% 112%, rgba(247,148,30,.16), transparent 60%),
        linear-gradient(180deg,#16181a 0%,#0f1112 100%);`,
        ink: '#ffffff',
        inkSoft: 'rgba(255,255,255,.66)',
        eyebrowInk: '#ffb35c',
        accent: '#ffb35c',
        markColor: '#f7941e',
        brandMark: 'icon',
        shot: `border:1px solid rgba(255,255,255,.10);border-radius:14px;
           box-shadow:0 40px 90px rgba(0,0,0,.55),0 0 0 1px rgba(247,148,30,.10),
                      0 0 120px rgba(247,148,30,.14);`
    },
    b: {
        label: 'sunrise',
        blurb: 'Bold orange poster — maximum shelf impact, white type, no screenshot on the marquee.',
        surface: `
      background:linear-gradient(132deg,#ffb648 0%,#f7941e 46%,#e87b04 100%);`,
        ink: '#ffffff',
        inkSoft: 'rgba(255,255,255,.88)',
        eyebrowInk: 'rgba(255,255,255,.86)',
        accent: '#42280a',
        markColor: '#ffffff',
        brandMark: 'white-bars',
        shot: `border:10px solid #fff;border-radius:16px;
           box-shadow:0 34px 70px rgba(120,66,0,.34);`
    },
    c: {
        label: 'blueprint',
        blurb: 'Light and academic — graph-paper grid, dark type, orange used only as an accent.',
        surface: `
      background:#f5f6f7;
      background-image:
        linear-gradient(rgba(20,30,45,.055) 1px, transparent 1px),
        linear-gradient(90deg, rgba(20,30,45,.055) 1px, transparent 1px);
      background-size:34px 34px;`,
        veil: `background:radial-gradient(120% 100% at 50% 40%, rgba(255,255,255,0) 30%, rgba(245,246,247,.92) 100%);`,
        ink: '#15181c',
        inkSoft: '#666d76',
        eyebrowInk: '#e07b0a',
        accent: '#e07b0a',
        markColor: '#f7941e',
        brandMark: 'icon',
        shot: `border:1px solid #d9dce0;border-radius:14px;
           box-shadow:0 24px 50px rgba(20,30,45,.14);`
    }
};

const surfaceCss = (d) => `
.surface{position:absolute;inset:0;${d.surface}}
${d.veil ? `.surface::after{content:'';position:absolute;inset:0;${d.veil}}` : ''}`;

/* ------------------------------------------------------------------ *
 * Store icon — 128×128, art kept inside a 96×96 safe area.
 * ------------------------------------------------------------------ */

// Opaque art in icon-128.png spans x 0..127, y 12..127.
const ART = { top: 12, h: 116 };

function iconVariants() {
    const scale = 96 / 128;
    const artTop = ART.top * scale;              // where the art starts inside the scaled png
    const artH = ART.h * scale;
    const offsetY = (128 - artH) / 2 - artTop;   // center the *art*, not the canvas

    const plate = (bg, extra = '') => `
    .plate{position:absolute;left:16px;top:16px;width:96px;height:96px;border-radius:22px;
           ${bg}${extra}}`;

    return {
        'store-icon-a-transparent': {
            transparent: true,
            html: page(128, 128, `
        img{position:absolute;left:16px;top:${offsetY.toFixed(2)}px;width:96px;}`,
                `<img src="${SRC.icon.uri}" alt="">`)
        },
        // Flat white bars read far better than a silhouetted 3-D PNG at 16px.
        'store-icon-b-orange-tile': {
            transparent: true,
            html: page(128, 128, `
        ${plate('background:linear-gradient(140deg,#ffb648,#ef8408);',
                'box-shadow:inset 0 -3px 8px rgba(120,60,0,.22);')}
        .bars{position:absolute;left:33px;top:41px;
              filter:drop-shadow(0 2px 3px rgba(110,55,0,.30));}`,
                `<div class="plate"></div>${bars(62, '#ffffff')}`)
        },
        'store-icon-c-dark-tile': {
            transparent: true,
            html: page(128, 128, `
        ${plate('background:linear-gradient(150deg,#2b2f31,#1a1c1e);',
                'box-shadow:inset 0 0 0 1px rgba(255,255,255,.07);')}
        img{position:absolute;left:32px;top:${(offsetY + 16).toFixed(2)}px;width:64px;
            filter:drop-shadow(0 3px 6px rgba(0,0,0,.45));}`,
                `<div class="plate"></div><img src="${SRC.icon.uri}" alt="">`)
        }
    };
}

/* ------------------------------------------------------------------ *
 * Marquee promo tile — 1400×560
 * ------------------------------------------------------------------ */

function marquee(key, d) {
    const c = COPY.marquee[key];
    const W = 1400, H = 560;

    const base = `
    ${surfaceCss(d)}
    .wrap{position:relative;width:${W}px;height:${H}px;overflow:hidden}
    .eyebrow{font-size:16px;font-weight:600;letter-spacing:.16em;color:${d.eyebrowInk};
             text-transform:uppercase}
    h1{font-size:50px;line-height:1.1;font-weight:700;color:${d.ink};letter-spacing:-.018em}
    h1 em{color:${d.accent}}
    p.sub{font-size:24px;line-height:1.45;color:${d.inkSoft};font-weight:400}
    .lockup{display:flex;align-items:center;gap:14px}
    .lockup .name{font-size:30px;font-weight:700;color:${d.ink};letter-spacing:-.01em}`;

    if (key === 'b') {
        // Centered poster — no screenshot.
        return page(W, H, `${base}
      .wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;
            text-align:center;padding:0 90px}
      .glow{position:absolute;left:50%;top:-34%;width:1000px;height:760px;transform:translateX(-50%);
            background:radial-gradient(closest-side, rgba(255,255,255,.26), transparent 72%)}
      .watermark{position:absolute;right:60px;bottom:-46px}
      h1{font-size:62px;margin:18px 0 0;line-height:1.08}
      p.sub{margin-top:20px;font-size:25px}
      .chips{display:flex;gap:14px;margin-top:34px}
      .chip{padding:11px 24px;border-radius:999px;background:rgba(255,255,255,.18);
            border:1px solid rgba(255,255,255,.42);color:#fff;font-size:19px;font-weight:600}
      .mark{display:flex;align-items:center;gap:18px}
      .mark .name{font-size:44px;font-weight:700;color:#fff;letter-spacing:-.02em}`,
            `<div class="surface"></div><div class="wrap">
        <div class="glow"></div><div class="watermark">${bars(360, '#ffffff', 0.14)}</div>
        <div class="mark">${bars(56, '#fff')}<span class="name">${COPY.name}</span></div>
        <h1>${c.title}</h1>
        <p class="sub">${c.sub}</p>
        <div class="chips">${c.chips.map((x) => `<span class="chip">${x}</span>`).join('')}</div>
      </div>`);
    }

    // a + c — text left, product shot right.
    const shot = key === 'a'
        ? `<div class="frame">
         <div class="chrome"><i></i><i></i><i></i></div>
         <img src="${SRC.popup.uri}" alt="">
       </div>`
        : `<img class="plain" src="${SRC.popup.uri}" alt="">`;

    return page(W, H, `${base}
    .wrap{display:flex;align-items:center}
    .col{width:610px;padding-left:74px;flex:none}
    .col .eyebrow{margin-bottom:18px}
    p.sub{margin-top:20px;max-width:512px;font-size:22px}
    .bullets{display:flex;gap:20px;margin-top:28px;flex-wrap:wrap;max-width:520px}
    .bullets span{display:flex;align-items:center;gap:9px;font-size:18px;font-weight:600;color:${d.ink}}
    .bullets i{width:8px;height:8px;border-radius:50%;background:${d.markColor};display:block}
    .stage{position:relative;flex:1;height:100%}
    .frame{position:absolute;left:30px;top:44px;width:700px;border-radius:16px;overflow:hidden;
           background:#1b1e20;${d.shot}}
    .frame .chrome{height:34px;display:flex;align-items:center;gap:8px;padding-left:16px;
                   background:#26292b;border-bottom:1px solid rgba(255,255,255,.06)}
    .frame .chrome i{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.22);display:block}
    .frame img{width:700px}
    .plain{position:absolute;left:30px;top:61px;width:700px;${d.shot}}`,
        `<div class="surface"></div><div class="wrap">
      <div class="col">
        <div class="eyebrow">${c.eyebrow}</div>
        <h1>${c.title}</h1>
        <p class="sub">${c.sub}</p>
        ${c.bullets ? `<div class="bullets">${c.bullets.map((b) => `<span><i></i>${b}</span>`).join('')}</div>` : ''}
      </div>
      <div class="stage">${shot}</div>
    </div>`);
}

/* ------------------------------------------------------------------ *
 * Small promo tile — 440×280
 * ------------------------------------------------------------------ */

function tile(key, d) {
    const c = COPY.tile[key];
    const W = 440, H = 280;

    const base = `
    ${surfaceCss(d)}
    .wrap{position:relative;width:${W}px;height:${H}px;overflow:hidden}
    h2{font-weight:700;letter-spacing:-.02em;color:${d.ink}}
    p{color:${d.inkSoft};font-weight:500}`;

    if (key === 'b') {
        return page(W, H, `${base}
      .wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
      .glow{position:absolute;left:50%;top:-40%;width:400px;height:340px;transform:translateX(-50%);
            background:radial-gradient(closest-side, rgba(255,255,255,.34), transparent 70%)}
      h2{font-size:44px;margin-top:16px}
      p{font-size:20px;margin-top:8px;color:rgba(255,255,255,.9)}`,
            `<div class="surface"></div><div class="wrap"><div class="glow"></div>
        ${bars(66, '#fff')}<h2>${c.title}</h2><p>${c.sub}</p></div>`);
    }

    if (key === 'a') {
        return page(W, H, `${base}
      .wrap{display:flex;flex-direction:column;justify-content:center;padding:0 34px}
      .watermark{position:absolute;right:18px;bottom:-30px}
      .row{display:flex;align-items:center;gap:14px}
      img.icon{width:52px}
      h2{font-size:38px}
      p{font-size:19px;margin-top:14px;max-width:300px;line-height:1.35}
      .rule{width:56px;height:4px;border-radius:3px;background:${d.markColor};margin-top:20px}`,
            `<div class="surface"></div><div class="wrap">
        <div class="watermark">${bars(210, '#f7941e', 0.12)}</div>
        <div class="row"><img class="icon" src="${SRC.icon.uri}" alt=""><h2>${c.title}</h2></div>
        <p>${c.sub}</p><div class="rule"></div></div>`);
    }

    return page(W, H, `${base}
    .wrap{display:flex;flex-direction:column;justify-content:center;padding:0 36px}
    .row{display:flex;align-items:center;gap:13px}
    img.icon{width:46px}
    h2{font-size:36px}
    .rule{width:74px;height:4px;border-radius:3px;background:${d.markColor};margin-top:16px}
    p{font-size:18px;margin-top:16px;line-height:1.4}
    .watermark{position:absolute;right:20px;bottom:18px}`,
        `<div class="surface"></div><div class="wrap">
      <div class="row"><img class="icon" src="${SRC.icon.uri}" alt=""><h2>${c.title}</h2></div>
      <div class="rule"></div><p>${c.sub}</p>
      <div class="watermark">${bars(58, '#f7941e', 0.30)}</div>
    </div>`);
}

/* ------------------------------------------------------------------ *
 * Screenshots — 1280×800
 * ------------------------------------------------------------------ */

const SLIDE = { W: 1280, H: 800, boxW: 1120, boxH: 512, splitH: 636 };

/** Orange 3-D icon disappears on the orange surface, so B gets a flat white mark. */
const brandMark = (d) =>
    d.brandMark === 'white-bars'
        ? bars(28, '#ffffff', 0.95)
        : `<img src="${SRC.icon.uri}" alt="">`;

function crop(src, rect, scale) {
    const { x, y, w, h } = rect;
    return `<div class="crop" style="width:${(w * scale).toFixed(1)}px;height:${(h * scale).toFixed(1)}px">
    <img src="${src.uri}" style="width:${(src.w * scale).toFixed(1)}px;
         margin-left:${(-x * scale).toFixed(1)}px;margin-top:${(-y * scale).toFixed(1)}px" alt="">
  </div>`;
}

function slide(c, d) {
    const src = SRC[c.img];
    const split = c.layout === 'split';

    const media = c.crop
        ? crop(src, c.crop, split
            ? SLIDE.splitH / c.crop.h
            : Math.min(SLIDE.boxW / c.crop.w, SLIDE.boxH / c.crop.h))
        : `<img class="shot" src="${src.uri}" alt="">`;

    const css = `
    ${surfaceCss(d)}
    .wrap{position:relative;width:${SLIDE.W}px;height:${SLIDE.H}px;overflow:hidden}
    .brand{display:flex;align-items:center;gap:10px}
    .brand img{width:26px}
    .brand span{font-size:15px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;
                color:${d.eyebrowInk}}
    h2{font-weight:700;letter-spacing:-.018em;color:${d.ink}}
    h2 em{color:${d.accent}}
    p{color:${d.inkSoft}}
    .shot{max-width:${SLIDE.boxW}px;max-height:${SLIDE.boxH}px;width:auto;height:auto;${d.shot}}
    .crop{overflow:hidden;${d.shot}}`;

    if (split) {
        return page(SLIDE.W, SLIDE.H, `${css}
      .wrap{display:flex;align-items:center;gap:60px;padding:0 80px}
      .copy{width:470px;flex:none}
      .brand{margin-bottom:22px}
      h2{font-size:44px;line-height:1.14}
      p{margin-top:18px;font-size:21px;line-height:1.45}
      .stage{flex:1;display:flex;justify-content:center}`,
            `<div class="surface"></div><div class="wrap">
        <div class="copy">
          <div class="brand">${brandMark(d)}<span>${c.eyebrow}</span></div>
          <h2>${c.title}</h2>
          <p>${c.sub}</p>
        </div>
        <div class="stage">${media}</div>
      </div>`);
    }

    return page(SLIDE.W, SLIDE.H, `${css}
    .wrap{display:flex;flex-direction:column;align-items:center;padding:56px 80px 60px}
    .brand{margin-bottom:20px}
    h2{font-size:43px;line-height:1.14;text-align:center}
    p{margin-top:14px;font-size:21px;line-height:1.4;text-align:center;max-width:840px}
    .stage{flex:1;display:flex;align-items:center;justify-content:center;width:100%;margin-top:26px}`,
        `<div class="surface"></div><div class="wrap">
      <div class="brand">${brandMark(d)}<span>${c.eyebrow}</span></div>
      <h2>${c.title}</h2>
      <p>${c.sub}</p>
      <div class="stage">${media}</div>
    </div>`);
}

/* ------------------------------------------------------------------ *
 * Render
 * ------------------------------------------------------------------ */

function findChrome() {
    const candidates = [
        process.env.CHROME_PATH,
        'C:/Program Files/Google/Chrome/Application/chrome.exe',
        'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
        'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/usr/bin/google-chrome'
    ].filter(Boolean);
    const hit = candidates.find((p) => fs.existsSync(p));
    if (!hit) throw new Error('Chrome not found — set CHROME_PATH.');
    return hit;
}

const CHROME = findChrome();
const PROFILE = path.join(TMP, 'profile');

function shoot(html, outFile, w, h, transparent) {
    const src = path.join(TMP, path.basename(outFile).replace(/\.png$/, '.html'));
    fs.writeFileSync(src, html, 'utf8');
    fs.mkdirSync(path.dirname(outFile), { recursive: true });

    execFileSync(CHROME, [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        '--force-device-scale-factor=1',
        '--virtual-time-budget=2000',
        `--user-data-dir=${PROFILE}`,
        ...(transparent ? ['--default-background-color=00000000'] : []),
        `--window-size=${w},${h}`,
        `--screenshot=${outFile}`,
        pathToFileURL(src).href
    ], { stdio: 'ignore' });

    if (!keepHtml) fs.rmSync(src, { force: true });
    console.log('  ✓', path.relative(HERE, outFile));
}

const argv = process.argv.slice(2);
const keepHtml = argv.includes('--keep-html');
const only = argv.filter((a) => !a.startsWith('--')).map((s) => s.toLowerCase());
const picked = Object.keys(DIRECTIONS).filter((k) => only.length === 0 || only.includes(k));

fs.mkdirSync(TMP, { recursive: true });

console.log('Store icons (128×128)');
for (const [name, v] of Object.entries(iconVariants())) {
    shoot(v.html, path.join(OUT, 'store-icon', `${name}.png`), 128, 128, v.transparent);
}

for (const key of picked) {
    const d = DIRECTIONS[key];
    const dir = path.join(OUT, `${key}-${d.label}`);
    console.log(`\nDirection ${key.toUpperCase()} — ${d.label}`);

    shoot(marquee(key, d), path.join(dir, `marquee-1400x560-${d.label}.png`), 1400, 560);
    shoot(tile(key, d), path.join(dir, `small-tile-440x280-${d.label}.png`), 440, 280);
    for (const s of COPY.slides) {
        shoot(slide(s, d), path.join(dir, `screenshot-${s.file}-1280x800.png`), SLIDE.W, SLIDE.H);
    }
}

if (!keepHtml) fs.rmSync(PROFILE, { recursive: true, force: true });
console.log(`\nDone → ${path.relative(ROOT, OUT)}`);
