const express = require("express");
const cors = require("cors");
const cheerio = require("cheerio");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors()); // Allow all CORS requests

app.get("/api/rss", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: "URL parameter is required" });
    }

    const response = await fetch(url);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Failed to fetch resource: ${response.statusText}` });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $("title").text();

    const rssLink = $('link[rel="alternate"][type="application/rss+xml"]').attr(
      "href"
    );

    console.log("Title:", title);
    console.log("rssLink:", rssLink);

    res.json({ rssLink, title });
  } catch (error) {
    console.error("Error fetching or parsing RSS:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
