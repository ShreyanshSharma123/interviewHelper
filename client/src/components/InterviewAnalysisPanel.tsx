import { useState } from "react";
import type { InterviewAnalysisResult } from "../types/analysis";

function InterviewAnalysisPanel() {
  const [jobRole, setJobRole] = useState("");
  const [feedback, setFeedback] = useState("");
  const [result, setResult] = useState<InterviewAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  function handleAnalyze() {
    setLoading(true);
    setTimeout(() => {
      setResult({
        likelyFailure: "level_mismatch",
        explanation:
          "The job role appears to expect deeper experience than reflected in the resume. This suggests a role-level mismatch rather than lack of ability.",
        suggestions: [
          "Target entry or junior roles with similar tech stack",
          "Strengthen depth in one core skill instead of listing many tools",
          "Gain hands-on experience through complex projects",
        ],
      });
      setLoading(false);
    }, 800);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Interview Failure Analysis</h2>
      <p className="text-gray-500 mb-6 text-sm">
        Identify likely reasons for interview rejection using resume, role
        expectations, and feedback signals.
      </p>

      <div className="space-y-3 max-w-lg">
        <input
          type="text"
          placeholder="Job Role (e.g. Backend Developer)"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400
                     transition-all placeholder:text-gray-400"
        />

        <textarea
          placeholder="Interview feedback (optional)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm h-28 resize-none
                     focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400
                     transition-all placeholder:text-gray-400"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Analyzing..." : "Analyze Interview"}
        </button>
      </div>

      {result && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold uppercase tracking-wide">
              {result.likelyFailure.replace("_", " ")}
            </span>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">
            {result.explanation}
          </p>

          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              Suggestions
            </h4>
            <ul className="space-y-2">
              {result.suggestions.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default InterviewAnalysisPanel;
