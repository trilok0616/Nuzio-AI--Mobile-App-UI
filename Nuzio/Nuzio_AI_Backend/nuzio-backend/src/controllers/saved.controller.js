const SavedArticle = require("../models/SavedArticle");

async function listSaved(req, res) {
  const items = await SavedArticle.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, items });
}

async function saveArticle(req, res) {
  const input = req.body;

  const item = await SavedArticle.findOneAndUpdate(
    { user: req.user._id, articleId: input.articleId },
    {
      $set: {
        title: input.title,
        summary: input.summary,
        category: input.category,
        source: input.source,
        url: input.url,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : undefined
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({ success: true, item });
}

async function removeSaved(req, res) {
  await SavedArticle.deleteOne({
    user: req.user._id,
    articleId: req.params.articleId
  });

  res.json({ success: true, message: "Article removed from saved items" });
}

module.exports = { listSaved, saveArticle, removeSaved };
