import { useState } from "react";
import type { AtsHumanAnalysis } from "../types/analysis";

function AtsVsHumanPanel() {
  const [analysis, setAnalysis] = useState<AtsHumanAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  function handleAnalyze() {
    setLoading(true);
    setTimeout(() => {
      setAnalysis({
        atsScore: {
          score: 78,
          reasons: [
            "Relevant keywords found",
            "Standard section headings detected",
          ],
        },
        humanScore: {
          score: 65,
          reasons: [
            "Bullets are too long",
            "Limited quantified impact",
          ],
        },
        conflicts: [
          "Keyword-heavy skills section hurts readability",
          "Dense formatting is ATS-friendly but hard to scan",
        ],
      });
      setLoading(false);
    }, 800);
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

      {analysis && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <ScoreCard
            title="ATS Score"
            score={analysis.atsScore.score}
            reasons={analysis.atsScore.reasons}
            color="emerald"
          />
          <ScoreCard
            title="Human Readability"
            score={analysis.humanScore.score}
            reasons={analysis.humanScore.reasons}
            color="amber"
          />
          <div className="sm:col-span-2 rounded-xl border border-red-100 bg-red-50/50 p-5">
            <h3 className="font-semibold text-red-800 mb-3">
              Optimization Conflicts
            </h3>
            <ul className="space-y-2">
              {analysis.conflicts.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreCard({
  title,
  score,
  reasons,
  color,
}: {
  title: string;
  score: number;
  reasons: string[];
  color: "emerald" | "amber";
}) {
  const bg = color === "emerald" ? "bg-emerald-50/50" : "bg-amber-50/50";
  const border = color === "emerald" ? "border-emerald-100" : "border-amber-100";
  const badge =
    color === "emerald"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700";
  const dot = color === "emerald" ? "bg-emerald-400" : "bg-amber-400";
  const textColor = color === "emerald" ? "text-emerald-700" : "text-amber-700";

  return (
    <div className={`rounded-xl border ${border} ${bg} p-5`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <span className={`text-lg font-bold px-2.5 py-0.5 rounded-full ${badge}`}>
          {score}
        </span>
      </div>
      <ul className="space-y-2">
        {reasons.map((r, i) => (
          <li key={i} className={`flex items-start gap-2 text-sm ${textColor}`}>
            <span className={`mt-1 w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AtsVsHumanPanel;
