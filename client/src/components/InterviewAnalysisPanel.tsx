import { useState } from "react";
import type { InterviewAnalysisResult } from "../types/analysis";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface Props {
  file: File;
}

function InterviewAnalysisPanel({ file }: Props) {
  const [jobRole, setJobRole] = useState("");
  const [feedback, setFeedback] = useState("");
  const [result, setResult] = useState<InterviewAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("analysisType", "interview");
      if (jobRole.trim()) formData.append("jobRole", jobRole.trim());
      if (feedback.trim()) formData.append("feedback", feedback.trim());

      const res = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error || "Analysis failed");
        return;
      }

      setResult(json.data as InterviewAnalysisResult);
    } catch (err) {
      setError("Failed to connect to server. Make sure the backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
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

      {error && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-8 space-y-4">
          {(["screening", "technical", "behavioral"] as const).map((stage) => (
            <div
              key={stage}
              className="rounded-xl border border-gray-200 bg-white p-6 space-y-3"
            >
              <h3 className="text-sm font-semibold text-gray-800 capitalize">
                {stage} Stage
              </h3>
              <ul className="space-y-3">
                {result[stage].map((point, i) => (
                  <li key={i} className="space-y-1">
                    <p className="text-sm font-medium text-red-700 flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                      {point.reason}
                    </p>
                    <p className="text-sm text-gray-600 ml-3.5">
                      {point.advice}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InterviewAnalysisPanel;
