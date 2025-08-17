import { writeFile } from "fs/promises";
import { resolve } from "path";
import { SitemapStream, streamToPromise, SitemapItemLoose, EnumChangefreq } from "sitemap";

const hostname = "https://oyasume.github.io";

const links: SitemapItemLoose[] = [
  { url: "/iidx-rlt/", changefreq: EnumChangefreq.DAILY, priority: 1.0 },
  { url: "/iidx-rlt/about/", changefreq: EnumChangefreq.MONTHLY, priority: 0.7 },
  { url: "/iidx-rlt/import/", changefreq: EnumChangefreq.MONTHLY, priority: 0.7 },
  { url: "/iidx-rlt/tickets/", changefreq: EnumChangefreq.MONTHLY, priority: 0.7 },
];

const main = async (): Promise<void> => {
  try {
    const stream = new SitemapStream({ hostname });
    links.forEach((link) => stream.write(link));
    stream.end();

    const data = await streamToPromise(stream);
    const sitemapPath = resolve("./dist/sitemap.xml");
    await writeFile(sitemapPath, data.toString());
    console.log(`sitemap.xml created at ${sitemapPath}`);
  } catch (e) {
    console.error(e);
  }
};

void main();
