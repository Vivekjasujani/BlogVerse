import React, { useId, useState } from "react";
import postService from "../api/postService";

const FALLBACK_ERROR = "Could not generate a summary right now.";

export default function SummaryPanel({ slug }) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | done | notice | error
  const [summary, setSummary] = useState("");
  const [message, setMessage] = useState("");

  const loadSummary = async () => {
    setStatus("loading");
    setMessage("");
    try {
      const data = await postService.getPostSummary(slug);
      setSummary(data.summary || "");
      setStatus("done");
    } catch (error) {
      setMessage(error.response?.data?.message || FALLBACK_ERROR);
      // 422 = post too short: an expected outcome, not a failure.
      setStatus(error.response?.status === 422 ? "notice" : "error");
    }
  };

  const toggle = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen && status === "idle") loadSummary();
  };

  const paragraphs = summary.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const loading = status === "loading";

  return (
    <section className="w-full mb-6 text-left">
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        aria-expanded={open}
        aria-controls={panelId}
        className="text-sm px-3 py-1.5 rounded-md bg-gray-800 text-gray-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {open ? "Hide summary" : "✨ Show AI summary"}
      </button>

      <div id={panelId} hidden={!open} className="mt-3 bg-gray-800 rounded-lg p-4 sm:p-5">
        <div aria-live="polite" aria-busy={loading}>
          {loading && (
            <div>
              <div className="space-y-2 animate-pulse" aria-hidden="true">
                <div className="h-3 rounded bg-gray-700 w-full" />
                <div className="h-3 rounded bg-gray-700 w-11/12" />
                <div className="h-3 rounded bg-gray-700 w-4/5" />
              </div>
              <p className="mt-3 text-sm text-gray-400">Generating summary...</p>
            </div>
          )}

          {status === "done" && (
            <>
              <div className="space-y-3 text-gray-300 leading-relaxed">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-500">AI-generated summary. May contain mistakes.</p>
            </>
          )}

          {status === "notice" && <p className="text-sm text-gray-300">{message}</p>}

          {status === "error" && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <p className="text-sm text-red-400">{message}</p>
              <button
                type="button"
                onClick={loadSummary}
                className="self-start text-sm px-3 py-1 rounded-md bg-gray-700 text-gray-200 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
