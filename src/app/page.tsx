"use client";

import { useEffect, useState } from "react";

const DEFAULT_IMAGE = "/globe.svg";

type Article = {
  id: number;
  title: string;
  source: string;
  date: string;
  summary: string;
  image: string;
  url: string;
};

type NewsApiArticle = {
  title: string;
  source?: { name?: string };
  publishedAt?: string;
  description?: string;
  urlToImage?: string;
  url?: string;
};

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [neutralSummaries, setNeutralSummaries] = useState<
    Record<number, string>
  >({});
  const [rewriteLoading, setRewriteLoading] = useState<Record<number, boolean>>(
    {}
  );
  const [rewriteError, setRewriteError] = useState<Record<number, string>>({});

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        if (data.articles) {
          setArticles(
            data.articles.map((a: NewsApiArticle, idx: number) => ({
              id: idx,
              title: a.title,
              source: a.source?.name || "Unknown",
              date: a.publishedAt || new Date().toISOString(),
              summary: a.description || "No summary available.",
              image: a.urlToImage || DEFAULT_IMAGE,
              url: a.url || "#",
            }))
          );
        } else {
          setError(data.error || "Failed to load news");
        }
      } catch {
        setError("Failed to load news");
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const handleRewrite = async (articleId: number, articleText: string) => {
    setRewriteLoading((prev) => ({ ...prev, [articleId]: true }));
    setRewriteError((prev) => ({ ...prev, [articleId]: "" }));
    setNeutralSummaries((prev) => ({ ...prev, [articleId]: "" }));
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article: articleText }),
      });
      const data = await res.json();
      if (res.ok && data.neutralSummary) {
        setNeutralSummaries((prev) => ({
          ...prev,
          [articleId]: data.neutralSummary,
        }));
      } else {
        setRewriteError((prev) => ({
          ...prev,
          [articleId]: data.error || "Failed to rewrite article",
        }));
      }
    } catch {
      setRewriteError((prev) => ({
        ...prev,
        [articleId]: "Failed to rewrite article",
      }));
    } finally {
      setRewriteLoading((prev) => ({ ...prev, [articleId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 font-sans">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2 tracking-tight">Neutral News</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Balanced, up-to-date news summaries from across the spectrum
        </p>
      </header>
      <main className="max-w-3xl mx-auto grid gap-8">
        {loading && (
          <div className="text-center text-gray-500">Loading news...</div>
        )}
        {error && <div className="text-center text-red-500">{error}</div>}
        {!loading && !error && articles.length === 0 && (
          <div className="text-center text-gray-500">No news found.</div>
        )}
        {articles.map((article) => (
          <article
            key={article.id}
            className="group flex flex-col sm:flex-row bg-white dark:bg-[#181818] rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow cursor-pointer relative"
          >
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-10"
              tabIndex={-1}
              aria-label={`Go to article: ${article.title}`}
            />
            <div className="flex-shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 w-full sm:w-48 h-40 z-20">
              <img
                src={article.image}
                alt={article.title}
                className="object-contain w-full h-full"
              />
            </div>
            <div className="flex flex-col p-6 gap-2 flex-1 z-20">
              <h2 className="text-2xl font-semibold mb-1 group-hover:underline">
                {article.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span>{article.source}</span>
                <span>•</span>
                <span>{new Date(article.date).toLocaleDateString()}</span>
              </div>
              <p className="text-base text-gray-700 dark:text-gray-300 mb-2">
                {article.summary}
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start mt-auto text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium z-30"
                onClick={(e) => e.stopPropagation()}
              >
                Read more
              </a>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed z-30"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRewrite(article.id, article.summary);
                }}
                disabled={rewriteLoading[article.id]}
              >
                {rewriteLoading[article.id]
                  ? "Rewriting..."
                  : "Rewrite Neutrally"}
              </button>
              {rewriteError[article.id] && (
                <div className="mt-2 text-red-500 text-sm">
                  {rewriteError[article.id]}
                </div>
              )}
              {neutralSummaries[article.id] && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                  <strong>Neutral Rewrite:</strong>
                  <div className="mt-2 whitespace-pre-line">
                    {neutralSummaries[article.id]}
                  </div>
                </div>
              )}
            </div>
          </article>
        ))}
      </main>
      <footer className="mt-16 text-center text-xs text-gray-400 space-y-2">
        <div>
          &copy; {new Date().getFullYear()} Neutral News. All rights reserved.
        </div>
        <div className="mt-4">
          <span className="font-semibold pr-2">Participants:</span>
          Pete Allport, Jishnu Anandh, Aishwarya Raja, Timothy Tan, Rosetta Wang
        </div>
      </footer>
    </div>
  );
}
