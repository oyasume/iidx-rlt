import fs from "fs/promises";
import path from "path";
import Papa from "papaparse";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { AtariRule, SearchPattern } from "../src/types";

const SONG_RULES_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTvdia8KZZiRbJ8WmaaFw64HixFWuuYP3HuxYzqfAYKvDso8ITI0OWITchKiv04T57uD2vk0bm9sMFx/pub?gid=0&single=true&output=csv";

type SongRuleCsvRow = {
  曲名: string;
  URL: string;
  説明?: string;
  優先度: string;
  皿側テキスト: string;
  皿側順不同: "TRUE" | "FALSE";
  非皿側テキスト: string;
  非皿側順不同: "TRUE" | "FALSE";
};

const fetchAndParseCsv = async <T>(url: string, options: Papa.ParseConfig<T>): Promise<T[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch CSV from ${url}: ${res.statusText}`);
  const text = await res.text();
  const parsed = Papa.parse<T>(text, options);
  if (parsed.errors.length > 0) {
    console.error("CSV parsing errors:", parsed.errors);
    throw new Error(`Failed to parse CSV from ${url}`);
  }
  return parsed.data;
};

const writeJsonFile = async (data: AtariRule[], outputPath: string): Promise<void> => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const absoluteOutputPath = path.resolve(__dirname, outputPath);
  await fs.mkdir(dirname(absoluteOutputPath), { recursive: true });
  await fs.writeFile(absoluteOutputPath, JSON.stringify(data, null, 2));
  console.log(`JSON has been built successfully at: ${absoluteOutputPath}`);
};

const isValidString = (value: unknown): value is string => {
  return typeof value === "string" && value.trim() !== "";
};

const processSongRules = (csvData: SongRuleCsvRow[]): AtariRule[] => {
  const validRows = csvData.filter(
    (row) =>
      isValidString(row.曲名) &&
      isValidString(row.URL) &&
      isValidString(row.優先度) &&
      isValidString(row.皿側テキスト) &&
      isValidString(row.非皿側テキスト)
  );

  return validRows.map((row, i): AtariRule => {
    const searchPattern: SearchPattern = {
      scratchSideText: row.皿側テキスト,
      isScratchSideUnordered: row.皿側順不同 === "TRUE",
      nonScratchSideText: row.非皿側テキスト,
      isNonScratchSideUnordered: row.非皿側順不同 === "TRUE",
    };

    return {
      id: `preset-${i}`,
      title: row.曲名,
      url: row.URL,
      priority: parseInt(row.優先度, 10),
      description: row.説明 || "",
      patterns: [searchPattern],
    };
  });
};

const main = async () => {
  const songRulesData = await fetchAndParseCsv<SongRuleCsvRow>(SONG_RULES_CSV_URL, {
    header: true,
    skipEmptyLines: true,
  });
  const finalRules = processSongRules(songRulesData);
  console.log(`Total rules built: ${finalRules.length}`);
  await writeJsonFile(finalRules, "../public/data/atari-rules.json");
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
