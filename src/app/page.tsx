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
            className="flex flex-col sm:flex-row bg-white dark:bg-[#181818] rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow"
          >
            <div className="flex-shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 w-full sm:w-48 h-40 sm:h-auto">
              <img
                src={article.image}
                alt={article.title}
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col p-6 gap-2 flex-1">
              <h2 className="text-2xl font-semibold mb-1">{article.title}</h2>
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
                className="self-start mt-auto text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                Read more
              </a>
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
