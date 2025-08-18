import React, { useEffect, useState } from "react";
import HomeNavbar from "../components/ui/HomeNavbar/HomeNavbar";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Logo from "../components/ui/Logo/Logo";
import axios from "axios";

const REPO_OWNER = "MichealAPI";
const REPO_NAME = "Payly";

export default function ChangelogPage() {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const controller = new AbortController();
    const fetchCommits = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=30`);

        if (res.status !== 200) throw new Error(`GitHub API error: ${res.status}`);
        setCommits(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Failed to load commits");
      } finally {
        setLoading(false);
      }
    };
    fetchCommits();
    return () => controller.abort();
  }, []);

  return (
    <>
      <div className="border-b border-secondary/10 bg-primary/60 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 cursor-pointer hover:opacity-80 rounded-md border-1 border-secondary/30 bg-primary/50 px-3 py-1.5 text-sm text-secondary/90 hover:bg-primary/70 transition"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>
      <main className="min-h-screen bg-primary text-secondary">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3">
          <Logo className="w-8" onClickHomepageNavigate={true} />
          <h1 className="text-2xl font-semibold">Changelog</h1>
        </div>
        <p className="mt-3 text-secondary/80">Latest changes pulled from GitHub commits.</p>

        <div className="mt-6 rounded-2xl border-1 border-secondary/10 bg-primary/40 p-4 shadow-inner shadow-white/5">
          {loading && <p className="text-sm text-secondary/70">Loading commits…</p>}
          {error && !loading && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          {!loading && !error && commits.length === 0 && (
            <p className="text-sm text-secondary/70">No commits found.</p>
          )}

          <ul className="divide-y divide-secondary/10">
            {commits.map((c) => {
              const sha = c.sha?.slice(0, 7);
              const msg = c.commit?.message?.split("\n")[0] || "Update";
              const author = c.commit?.author?.name || c.author?.login || "Unknown";
              const date = c.commit?.author?.date ? new Date(c.commit.author.date) : null;
              const url = c.html_url;
              return (
                <li key={c.sha} className="py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{msg}</p>
                      <p className="mt-0.5 text-xs text-secondary/70">
                        {author}{date ? ` • ${date.toLocaleString()}` : ""}
                      </p>
                    </div>
                    <a
                      className="text-xs text-secondary/80 underline hover:opacity-80"
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {sha}
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </main>
    </>
  );
}
