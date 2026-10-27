import React, { useState } from "react";
import { HiOutlineSparkles } from "react-icons/hi2";
import postService from "../api/postService";
import Button from "./Button/Button";
import MiniLoader from "./MiniLoader";

export default function PostSummary({ slug }) {
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadSummary = async () => {
    setLoading(true);
    setError("");
    try {
      setSummary(await postService.getSummary(slug));
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate a summary right now.");
    } finally {
      setLoading(false);
    }
  };

  if (summary) {
    return (
      <section className="w-full mb-6 rounded-lg border border-gray-700 bg-gray-800/60 p-4 text-left">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
          <HiOutlineSparkles /> AI Summary
        </h2>
        <p className="text-gray-300 leading-relaxed whitespace-pre-line">{summary}</p>
      </section>
    );
  }

  return (
    <div className="w-full mb-6 flex flex-col items-start gap-2">
      <Button
        className="flex items-center gap-2 text-sm px-3 py-1 lg:py-1 rounded-md bg-gray-800 text-gray-300 hover:text-white disabled:opacity-60"
        onClick={loadSummary}
        disabled={loading}
      >
        {loading ? <MiniLoader /> : <HiOutlineSparkles />}
        {loading ? "Summarizing..." : "Summarize with AI"}
      </Button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
