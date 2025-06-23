const express = require("express");
const router = express.Router();
const Url = require("../models/Url");
const generateShortCode = require("../utils/generateShortCode");


router.post("/shorten", async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl || !/^https?:\/\//.test(originalUrl)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    const shortCode = generateShortCode();
    const newUrl = await Url.create({ originalUrl, shortCode });
    res.json({ shortUrl: `${process.env.BASE_URL}/${shortCode}` });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/urls", async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 }).limit(100);
    const fullUrls = urls.map((u) => ({
      originalUrl: u.originalUrl,
      shortUrl: `${process.env.BASE_URL}/${u.shortCode}`,
      shortCode: u.shortCode,
      createdAt: u.createdAt,
    }));
    res.json({ urls: fullUrls });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch URLs" });
  }
});


router.delete("/urls/:code", async (req, res) => {
  try {
    const result = await Url.findOneAndDelete({ shortCode: req.params.code });

    if (!result) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.json({ message: "Short URL deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/:code", async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });
    if (url) {
      res.redirect(url.originalUrl);
    } else {
      res.status(404).send("Short URL not found");
    }
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
