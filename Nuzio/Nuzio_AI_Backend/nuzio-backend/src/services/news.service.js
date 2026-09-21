const mockNews = require("../data/mockNews");
const { articleIdFromUrl } = require("../utils/token");

function normalizeArticle(article, fallbackCategory = "general") {
  const url = article.url || "https://example.com";
  return {
    articleId: articleIdFromUrl(url),
    title: article.title || "Untitled",
    summary: article.description || article.content || "",
    category: fallbackCategory,
    source: article.source?.name || "Unknown source",
    url,
    publishedAt: article.publishedAt || new Date().toISOString()
  };
}

function filterMock({ q, category }) {
  let items = [...mockNews];

  if (category) {
    const value = category.toLowerCase();
    items = items.filter((x) => x.category.toLowerCase() === value);
  }

  if (q) {
    const terms = q
      .toLowerCase()
      .split(/\s+OR\s+|\s+/)
      .map((x) => x.trim())
      .filter(Boolean);

    items = items.filter((x) => {
      const haystack = `${x.title} ${x.summary} ${x.category}`.toLowerCase();
      return terms.some((term) => haystack.includes(term));
    });
  }

  return items.length ? items : mockNews;
}

async function fetchNews({ q = "", category = "", page = 1, pageSize = 20 } = {}) {
  const key = process.env.NEWS_API_KEY;
  const base = process.env.NEWS_API_BASE_URL || "https://newsapi.org/v2";

  if (!key) {
    return {
      provider: "demo",
      articles: filterMock({ q, category }).slice(0, pageSize)
    };
  }

  const params = new URLSearchParams({
    apiKey: key,
    page: String(page),
    pageSize: String(Math.min(pageSize, 50))
  });

  let endpoint;

  if (q) {
    endpoint = `${base}/everything`;
    params.set("q", q);
    params.set("sortBy", "publishedAt");
    params.set("language", "en");
  } else {
    endpoint = `${base}/top-headlines`;
    params.set("country", "us");
    if (category) params.set("category", category);
  }

  const response = await fetch(`${endpoint}?${params.toString()}`);

  if (!response.ok) {
    const body = await response.text();
    const error = new Error(
      `News provider returned ${response.status}: ${body.slice(0, 300)}`
    );
    error.status = 502;
    throw error;
  }

  const data = await response.json();

  return {
    provider: "newsapi",
    totalResults: data.totalResults || 0,
    articles: (data.articles || [])
      .filter((x) => x.url && x.title && x.title !== "[Removed]")
      .map((x) => normalizeArticle(x, category || "general"))
  };
}

function scoreForUser(article, user) {
  const text = `${article.title} ${article.summary} ${article.category}`.toLowerCase();
  let score = 0;

  for (const interest of user.interests || []) {
    const value = String(interest).toLowerCase();
    if (text.includes(value)) score += 4;

    for (const word of value.split(/\s+/)) {
      if (word.length > 2 && text.includes(word)) score += 1;
    }
  }

  if (user.profession && text.includes(String(user.profession).toLowerCase())) {
    score += 2;
  }

  return score;
}

async function personalizedFeed(user, limit = 20) {
  const interests = (user.interests || []).slice(0, 5);
  const q = interests.length ? interests.join(" OR ") : "";
  const result = await fetchNews({ q, pageSize: Math.max(limit, 20) });

  const ranked = result.articles
    .map((article) => ({
      ...article,
      relevanceScore: scoreForUser(article, user)
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);

  return {
    provider: result.provider,
    personalization: {
      profession: user.profession,
      interests: user.interests
    },
    articles: ranked
  };
}

module.exports = { fetchNews, personalizedFeed };
