import { useState } from "react";
import type { AtsHumanAnalysis } from "../types/analysis";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface Props {
  file: File;
}

function AtsVsHumanPanel({ file }: Props) {
  const [analysis, setAnalysis] = useState<AtsHumanAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("analysisType", "ats");

      const res = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error || "Analysis failed");
        return;
      }

      setAnalysis(json.data as AtsHumanAnalysis);
    } catch (err) {
      setError("Failed to connect to server. Make sure the backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">ATS vs Human Recruiter</h2>
      <p className="text-gray-500 mb-6 text-sm">
        Compare how machines and recruiters read your resume.
      </p>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {error && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {analysis && (
        <div className="mt-8 space-y-6">
          {/* Overall Scores */}
          <div className="grid gap-4 sm:grid-cols-2">
            <ScoreCard
              title="ATS Overall"
              score={analysis.ats.overall.score}
              explanation={analysis.ats.overall.explanation}
              details={[
                { label: "Keywords", score: analysis.ats.keywordMatch.score },
                { label: "Relevance", score: analysis.ats.relevance.score },
                { label: "Formatting", score: analysis.ats.formatting.score },
              ]}
              color="emerald"
            />
            <ScoreCard
              title="Human Readability"
              score={analysis.human.overall.score}
              explanation={analysis.human.overall.explanation}
              details={[
                { label: "Clarity", score: analysis.human.clarity.score },
                { label: "Impact", score: analysis.human.impact.score },
                { label: "Layout", score: analysis.human.layout.score },
              ]}
              color="amber"
            />
          </div>

          {/* Suggestions */}
          <div className="grid gap-4 sm:grid-cols-2">
            <SuggestionList title="ATS Suggestions" items={analysis.ats.suggestions} color="emerald" />
            <SuggestionList title="Recruiter Suggestions" items={analysis.human.suggestions} color="amber" />
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreCard({
  title,
  score,
  explanation,
  details,
  color,
}: {
  title: string;
  score: number;
  explanation: string;
  details: { label: string; score: number }[];
  color: "emerald" | "amber";
}) {
  const bg = color === "emerald" ? "bg-emerald-50/50" : "bg-amber-50/50";
  const border = color === "emerald" ? "border-emerald-100" : "border-amber-100";
  const badge =
    color === "emerald"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700";
  const barBg = color === "emerald" ? "bg-emerald-200" : "bg-amber-200";
  const barFill = color === "emerald" ? "bg-emerald-500" : "bg-amber-500";
  const textColor = color === "emerald" ? "text-emerald-700" : "text-amber-700";

  return (
    <div className={`rounded-xl border ${border} ${bg} p-5`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <span className={`text-lg font-bold px-2.5 py-0.5 rounded-full ${badge}`}>
          {score}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-4">{explanation}</p>
      <div className="space-y-2">
        {details.map((d) => (
          <div key={d.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className={textColor}>{d.label}</span>
              <span className={textColor}>{d.score}</span>
            </div>
            <div className={`h-1.5 rounded-full ${barBg}`}>
              <div
                className={`h-1.5 rounded-full ${barFill} transition-all`}
                style={{ width: `${d.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SuggestionList({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: "emerald" | "amber";
}) {
  const bg = color === "emerald" ? "bg-emerald-50/50" : "bg-amber-50/50";
  const border = color === "emerald" ? "border-emerald-100" : "border-amber-100";
  const dot = color === "emerald" ? "bg-emerald-400" : "bg-amber-400";
  const textColor = color === "emerald" ? "text-emerald-700" : "text-amber-700";
  const heading = color === "emerald" ? "text-emerald-800" : "text-amber-800";

  return (
    <div className={`rounded-xl border ${border} ${bg} p-5`}>
      <h3 className={`font-semibold ${heading} mb-3`}>{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className={`flex items-start gap-2 text-sm ${textColor}`}>
            <span className={`mt-1 w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AtsVsHumanPanel;
