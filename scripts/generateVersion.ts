import fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const main = async () => {
  const versionInfo = {
    version: Date.now().toString(),
  };

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const outputPath = path.resolve(__dirname, "../public/data/version.json");
  await fs.mkdir(dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(versionInfo, null, 2));
  console.log(`version JSON has been built successfully at: ${outputPath}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
