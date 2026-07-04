import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const imageDir = new URL("../public/images/", import.meta.url);
const fontDir = new URL("../public/fonts/", import.meta.url);
const publicDir = new URL("../public/", import.meta.url);

const images = [
  {
    url: "https://static.tildacdn.pub/tild6337-6431-4961-a234-376639623630/ChatGPT_Image_28__20.png",
    out: "logo.webp",
    quality: 90
  },
  {
    url: "https://static.tildacdn.pub/tild6266-3463-4430-a466-303866373037/ChatGPT_Image_27__20.png",
    out: "og-zhanklod.webp",
    width: 1200,
    height: 630,
    fit: "cover",
    quality: 84
  },
  {
    url: "https://static.tildacdn.pub/tild6134-3537-4665-b335-396631623763/hero-shashlik.jpg",
    out: "hero-shashlik.webp",
    width: 1920,
    quality: 82
  },
  {
    url: "https://static.tildacdn.pub/tild3131-3933-4463-a562-383130303862/photo_2026-02-27_00-.jpg",
    out: "about-kebab.webp",
    width: 720,
    height: 720,
    fit: "cover",
    quality: 82
  },
  {
    url: "https://static.tildacdn.pub/tild3238-6561-4563-b339-386637316236/photo_2026-02-28_13-.jpg",
    out: "about-grill.webp",
    width: 720,
    height: 720,
    fit: "cover",
    quality: 82
  },
  {
    url: "https://static.tildacdn.pub/tild3863-3138-4137-b564-333932386264/photo_2026-03-02_10-.jpg",
    out: "about-dessert.webp",
    width: 720,
    height: 720,
    fit: "cover",
    quality: 82
  },
  {
    url: "https://static.tildacdn.pub/tild3961-3430-4031-b139-666662383632/photo_2026-02-19_01-.jpg",
    out: "menu-page-01.webp",
    width: 720,
    quality: 84
  },
  {
    url: "https://static.tildacdn.pub/tild3532-3162-4734-a262-313434393163/_page-0002.jpg",
    out: "menu-page-02.webp",
    width: 720,
    quality: 84
  },
  {
    url: "https://static.tildacdn.pub/tild3032-6264-4630-a338-653063326531/_page-0003.jpg",
    out: "menu-page-03.webp",
    width: 720,
    quality: 84
  },
  {
    url: "https://static.tildacdn.pub/tild6365-3631-4936-a539-626539383830/_page-0004.jpg",
    out: "menu-page-04.webp",
    width: 720,
    quality: 84
  },
  {
    url: "https://static.tildacdn.pub/tild3661-6536-4939-b237-313862346633/_page-0005.jpg",
    out: "menu-page-05.webp",
    width: 720,
    quality: 84
  },
  {
    url: "https://static.tildacdn.pub/tild3162-3638-4863-b032-333035303735/_page-0006.jpg",
    out: "menu-page-06.webp",
    width: 720,
    quality: 84
  },
  {
    url: "https://static.tildacdn.pub/tild3965-3530-4538-a262-383934383461/_page-0007.jpg",
    out: "menu-page-07.webp",
    width: 720,
    quality: 84
  },
  {
    url: "https://static.tildacdn.pub/tild3431-3834-4236-b766-633837343037/_page-0008.jpg",
    out: "menu-page-08.webp",
    width: 720,
    quality: 84
  },
  {
    url: "https://static.tildacdn.pub/tild3939-3562-4134-b639-613738333135/_page-0009.jpg",
    out: "menu-page-09.webp",
    width: 720,
    quality: 84
  },
  {
    url: "https://static.tildacdn.pub/tild6463-3234-4133-a536-616363383665/_page-0010.jpg",
    out: "menu-page-10.webp",
    width: 720,
    quality: 84
  },
  {
    url: "https://static.tildacdn.pub/tild3431-3037-4164-b630-336336653766/ChatGPT_Image_3__202.png",
    out: "banquet-table.webp",
    width: 900,
    quality: 84
  },
  {
    url: "https://static.tildacdn.pub/tild3939-3361-4538-b462-346238376334/_.png",
    out: "banquet-hall.webp",
    width: 700,
    quality: 84
  },
  {
    url: "https://static.tildacdn.pub/tild6164-3066-4864-b236-383033666361/photo.png",
    out: "banquet-food.webp",
    width: 900,
    quality: 84
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/8/83/Telegram_2019_Logo.svg",
    out: "social-telegram.webp",
    width: 128,
    height: 128,
    quality: 92
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg",
    out: "social-instagram.webp",
    width: 128,
    height: 128,
    quality: 92
  }
];

async function fetchBuffer(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function prepareImage(asset) {
  const input = await fetchBuffer(asset.url);
  let pipeline = sharp(input).rotate();

  if (asset.width || asset.height) {
    pipeline = pipeline.resize({
      width: asset.width,
      height: asset.height,
      fit: asset.fit ?? "inside",
      withoutEnlargement: true
    });
  }

  await pipeline
    .webp({
      quality: asset.quality ?? 82,
      effort: 5
    })
    .toFile(fileURLToPath(new URL(asset.out, imageDir)));
}

await mkdir(imageDir, { recursive: true });
await mkdir(fontDir, { recursive: true });

await Promise.all(images.map(prepareImage));

const font = await fetchBuffer(
  "https://static.tildacdn.com/fonts/tildasans/TildaSans-VF.woff2"
);
await writeFile(new URL("tildasans-vf.woff2", fontDir), font);

const favicon = await fetchBuffer("https://static.tildacdn.pub/img/tildafavicon.ico");
await writeFile(new URL("favicon.ico", publicDir), favicon);

const appleIcon = await fetchBuffer(
  "https://static.tildacdn.pub/tild6266-3463-4430-a466-303866373037/ChatGPT_Image_27__20.png"
);
await sharp(appleIcon)
  .resize(180, 180, { fit: "cover" })
  .png()
  .toFile(fileURLToPath(new URL("apple-touch-icon.png", publicDir)));

console.log(`Prepared ${images.length} images, font, favicon and apple icon.`);
