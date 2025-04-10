import * as cheerio from "cheerio";
import RSS from "rss";

export async function news() {
  const html = await fetch(
    "https://www.elderscrollsonline.com/cn/news?page=1",
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        cookie: "age_gate=568022400&1671009942;APE-Age-Gate=1",
      },
    },
  ).then((res) => res.text());

  const $ = cheerio.load(html);
  const feed = new RSS({
    title: "Elder Scrolls Online News",
    description: "Latest news and updates from Elder Scrolls Online",
    feed_url: "https://www.elderscrollsonline.com/cn/news",
    site_url: "https://www.elderscrollsonline.com/cn/news",
    pubDate: new Date().toUTCString(),
    language: "zh-CN",
  });

  $("article.tier-2-list-item").each((_, news) => {
    const title = $("h3", news).text();
    const url = $("a", news).attr("href") as string;
    const pubDate = $("p.date", news).text()
      .trim()
      .substring(0, 10)
      .replaceAll("/", "-");
    const description = $("p", news).text();
    const image = $("img", news).data("lazy-src") as string;
    const tags = $("p.date a", news).map((_, tag) => $(tag).text()).get();
    feed.item({
      title,
      description: `<img src="${image}" alt="${title}"/><br>${description}`,
      url,
      categories: tags,
      date: new Date(pubDate).toUTCString(),
    });
  });
  return feed.xml();
}
