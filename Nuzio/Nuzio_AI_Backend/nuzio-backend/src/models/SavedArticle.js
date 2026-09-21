const mongoose = require("mongoose");

const savedArticleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    articleId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    summary: { type: String, default: "" },
    category: { type: String, default: "" },
    source: { type: String, default: "" },
    url: { type: String, required: true },
    publishedAt: { type: Date }
  },
  { timestamps: true }
);

savedArticleSchema.index({ user: 1, articleId: 1 }, { unique: true });

module.exports = mongoose.model("SavedArticle", savedArticleSchema);
