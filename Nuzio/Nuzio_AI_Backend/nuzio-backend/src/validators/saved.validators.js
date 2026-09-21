const { z } = require("zod");

const saveArticleSchema = z.object({
  articleId: z.string().min(1).max(100),
  title: z.string().trim().min(1).max(500),
  summary: z.string().max(5000).optional().default(""),
  category: z.string().max(100).optional().default(""),
  source: z.string().max(200).optional().default(""),
  url: z.string().url(),
  publishedAt: z.string().datetime().optional()
});

module.exports = { saveArticleSchema };
