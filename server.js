const express = require("express");
const cors = require("cors");
const cheerio = require("cheerio");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors()); // Allow all CORS requests

app.get("/api/rss", async (req, res) => {
  try {
    const url = req.query.url;

    const domain = new URL(url).origin;

    if (!url) {
      return res.status(400).json({ error: "URL parameter is required" });
    }

    const response = await fetch(url);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Failed to fetch resource: ${response.statusText}` });
    }

    console.log(domain);

    const html = await response.text();

    const $ = cheerio.load(html);

    const feedLink = $(
      'link[rel="alternate"][type="application/rss+xml"][href], link[rel="alternate"][type="application/atom+xml"][href], a[href*="atom"], a[href*="rss"]'
    ).attr("href");

    const absoluteFeedLink = feedLink.startsWith("/")
      ? domain + feedLink
      : feedLink;

    res.json({ feedLink: absoluteFeedLink });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
