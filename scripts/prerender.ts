import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { pathToFileURL } from "url";

interface HelmetData {
  title: { toString: () => string };
  meta: { toString: () => string };
  link: { toString: () => string };
}

interface HelmetContext {
  helmet?: HelmetData;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p: string): string => path.resolve(__dirname, "..", p);

const prerender = async (): Promise<void> => {
  try {
    const template = await fs.readFile(toAbsolute("dist/index.html"), "utf-8");
    const serverEntryPath = pathToFileURL(toAbsolute("dist-ssr/prerender-entry.js")).href;

    const { render } = (await import(serverEntryPath)) as {
      render: (url: string, context: HelmetContext) => string;
    };

    const routesToPrerender = ["/", "/about", "/import", "/tickets"];

    for (const url of routesToPrerender) {
      const helmetContext: HelmetContext = {};
      const appHtml = render(url, helmetContext);
      const { helmet } = helmetContext;

      if (!helmet) {
        console.warn(`Helmet context not found for URL: ${url}`);
        continue;
      }

      const html = template
        .replace(`<!--app-html-->`, appHtml)
        .replace(`<!--helmet-title-->`, helmet.title.toString())
        .replace(`<!--helmet-meta-->`, helmet.meta.toString())
        .replace(`<!--helmet-link-->`, helmet.link.toString());

      const dirPath = toAbsolute(`dist${url}`);
      await fs.mkdir(dirPath, { recursive: true });
      const filePath = path.join(dirPath, "index.html");
      await fs.writeFile(filePath, html);
      console.log(`Pre-rendered: ${filePath}`);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    try {
      await fs.rm(toAbsolute("dist-ssr"), { recursive: true, force: true });
      await fs.unlink(toAbsolute("dist/ssr-manifest.json"));
    } catch {
      // ignore
    }
  }
};

void prerender();
