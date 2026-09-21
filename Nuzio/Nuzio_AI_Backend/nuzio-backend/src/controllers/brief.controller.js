const { personalizedFeed } = require("../services/news.service");

function compactSummary(text) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (!clean) return "Open the full story for more details.";
  return clean.length <= 180 ? clean : `${clean.slice(0, 177)}...`;
}

async function todayBrief(req, res) {
  const feed = await personalizedFeed(req.user, 10);

  const items = feed.articles.slice(0, 5).map((article) => ({
    articleId: article.articleId,
    title: article.title,
    summary: compactSummary(article.summary),
    category: article.category,
    source: article.source,
    url: article.url,
    publishedAt: article.publishedAt
  }));

  res.json({
    success: true,
    date: new Date().toISOString().slice(0, 10),
    language: req.user.language,
    voice: req.user.voicePreference,
    items
  });
}

module.exports = { todayBrief };
