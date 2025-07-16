import fs from "fs/promises";
import path from "path";
import Papa from "papaparse";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { AtariRule, SearchPattern } from "../src/types";

const SONG_RULES_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTvdia8KZZiRbJ8WmaaFw64HixFWuuYP3HuxYzqfAYKvDso8ITI0OWITchKiv04T57uD2vk0bm9sMFx/pub?output=csv";

const main = async () => {
  console.log(`Fetching song rules from ${SONG_RULES_CSV_URL}`);

  const response = await fetch(SONG_RULES_CSV_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.statusText}`);
  }
  const csvText = await response.text();

  type CsvRow = {
    曲名: string;
    説明?: string;
    優先度: string;
    皿側テキスト: string;
    皿側順不同: "TRUE" | "FALSE";
    非皿側テキスト: string;
    非皿側順不同: "TRUE" | "FALSE";
  };

  const parsed = Papa.parse<CsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    console.error("CSV parsing errors:", parsed.errors);
    throw new Error("Failed to parse CSV");
  }

  const finalRules: AtariRule[] = parsed.data
    .filter(
      (row) =>
        row.曲名 &&
        row.曲名.trim() !== "" &&
        row.優先度 &&
        row.優先度.trim() !== "" &&
        row.皿側テキスト != null &&
        row.非皿側テキスト != null
    )
    .map((row, index): AtariRule => {
      const searchPattern: SearchPattern = {
        scratchSideText: row.皿側テキスト,
        isScratchSideUnordered: row.皿側順不同 === "TRUE",
        nonScratchSideText: row.非皿側テキスト,
        isNonScratchSideUnordered: row.非皿側順不同 === "TRUE",
      };

      return {
        id: `preset-${index}`,
        songTitle: row.曲名,
        priority: parseInt(row.優先度, 10),
        description: row.説明 || "",
        patterns: [searchPattern],
      };
    });

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const outputPath = path.resolve(__dirname, "../public/data/atari-rules.json");

  await fs.mkdir(dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(finalRules, null, 2));

  console.log(`Atari rules JSON has been built successfully at: ${outputPath}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
