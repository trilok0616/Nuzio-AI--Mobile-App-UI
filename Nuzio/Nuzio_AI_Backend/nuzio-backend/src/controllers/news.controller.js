const { fetchNews, personalizedFeed } = require("../services/news.service");

async function listNews(req, res) {
  const page = Math.max(Number(req.query.page || 1), 1);
  const pageSize = Math.min(Math.max(Number(req.query.pageSize || 20), 1), 50);

  const data = await fetchNews({
    q: String(req.query.q || ""),
    category: String(req.query.category || ""),
    page,
    pageSize
  });

  res.json({ success: true, ...data });
}

async function feed(req, res) {
  const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 50);
  const data = await personalizedFeed(req.user, limit);
  res.json({ success: true, ...data });
}

module.exports = { listNews, feed };
