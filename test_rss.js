const Parser = require("rss-parser");

const parser = new Parser({
  headers: {
    "User-Agent": "Mozilla/5.0",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
});

async function testRss() {
  const url = 'https://news.google.com/rss/search?q=site:linkedin.com/posts+"Opportunities+For+Youth"+event+OR+summit+OR+webinar&hl=en-US&gl=US&ceid=US:en';
  try {
    const feed = await parser.parseURL(url);
    console.log(`Found ${feed.items.length} items`);
    feed.items.slice(0, 3).forEach(item => {
      console.log(item.title);
      console.log(item.link);
    });
  } catch(e) {
    console.error(e.message);
  }
}
testRss();
