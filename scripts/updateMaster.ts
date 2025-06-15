import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const TARGET_LEVELS = [12, 11];
const LEVEL_TO_PARAM_MAP: { [level: number]: string } = {
  12: "C",
  11: "B",
  10: "A",
};
const BASE_URL = "https://textage.cc/score/";
const TARGET_URL = `${BASE_URL}index.html`;
const OUTPUT_FILE_PATH = path.resolve(dirname(fileURLToPath(import.meta.url)), "../public/data/songs.json");

interface SongInfo {
  title: string;
  url: string;
  level: number;
}

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
const allSongs: SongInfo[] = [];

try {
  for (const level of TARGET_LEVELS) {
    const levelParam = LEVEL_TO_PARAM_MAP[level];
    if (!levelParam) continue;

    const queryString = `s${levelParam}11B000`;

    await page.goto(`${TARGET_URL}?${queryString}`, { waitUntil: "networkidle0" });

    const trXPath = "/html/body/center/table[1]/tbody/tr";
    await page.waitForSelector(`xpath/${trXPath}`, { timeout: 15000 });

    const songsFromLevel = await page.evaluate(
      (baseURL: string, currentLevel: number) => {
        const songs: SongInfo[] = [];
        const COLUMNS_SCORE = 1;
        const COLUMNS_TITLE = 3;

        const trXPath = "/html/body/center/table[1]/tbody/tr";
        const trNodes = document.evaluate(trXPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        // ヘッダーはスキップ
        for (let i = 1; i < trNodes.snapshotLength; i++) {
          const trNode = trNodes.snapshotItem(i) as HTMLTableRowElement;

          const title = (trNode.cells[COLUMNS_TITLE]?.textContent || "").replace(/[\n\t]/g, "").trim();
          if (!title) {
            console.log(trNode);
            console.log(`タイトルが取得できない：${i}行目`);
            continue;
          }

          const src = trNode.cells[COLUMNS_SCORE]?.querySelector("img")?.getAttribute("src");
          const diff = src === `lv/a${currentLevel}.gif` ? "A" : src === `lv/l${currentLevel}.gif` ? "L" : null;

          if (!diff) {
            console.log(`難易度が取得できない：${title}`);
            continue;
          }

          const link = trNode.cells[COLUMNS_SCORE]?.querySelector("a");
          if (!link) {
            console.log(`リンクが取得できない：${title}`);
            continue;
          }

          songs.push({
            title: `${title}(${diff})`,
            url: `${baseURL}${link.getAttribute("href")}`,
            level: currentLevel,
          });
        }

        return songs;
      },
      BASE_URL,
      level
    );

    allSongs.push(...songsFromLevel);
    console.log(`LV ${level}: ${songsFromLevel.length}曲取得した`);
  }
} finally {
  await browser.close();
}

const uniqueSongs = Array.from(new Map(allSongs.map((song) => [song.title, song])).values());
console.log(`総計：${uniqueSongs.length}曲取得した`);

if (uniqueSongs.length === 0) {
  console.warn("取得曲数が0になってる");
}

await fs.mkdir(dirname(OUTPUT_FILE_PATH), { recursive: true });
await fs.writeFile(OUTPUT_FILE_PATH, JSON.stringify(uniqueSongs, null, 2));

console.log(`${OUTPUT_FILE_PATH}に出力した`);
