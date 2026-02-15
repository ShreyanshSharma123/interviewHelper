import { useState } from "react";
import type { RealityCheckResult } from "../types/analysis";

type JobLevel = "entry" | "mid" | "senior";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface Props {
  file: File;
}

function RealityCheckPanel({ file }: Props) {
  const [roleLevel, setRoleLevel] = useState<JobLevel>("entry");
  const [result, setResult] = useState<RealityCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheck() {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("analysisType", "reality");
      formData.append("targetLevel", roleLevel);

      const res = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error || "Analysis failed");
        return;
      }

      setResult(json.data as RealityCheckResult);
    } catch (err) {
      setError("Failed to connect to server. Make sure the backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Career Reality Check</h2>
      <p className="text-gray-500 mb-6 text-sm">
        Assess readiness and understand realistic next steps without false
        optimism.
      </p>

      <div className="space-y-3 max-w-lg">
        <select
          value={roleLevel}
          onChange={(e) => setRoleLevel(e.target.value as JobLevel)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white
                     focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400
                     transition-all text-gray-700"
        >
          <option value="entry">Entry Level</option>
          <option value="mid">Mid Level</option>
          <option value="senior">Senior Level</option>
        </select>

        <button
          onClick={handleCheck}
          disabled={loading}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Checking..." : "Check Reality"}
        </button>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-8 space-y-4">
          <div
            className={`rounded-xl border p-6 ${
              result.verdict === "Ready"
                ? "border-emerald-100 bg-emerald-50/50"
                : result.verdict === "Stretching"
                ? "border-amber-100 bg-amber-50/50"
                : "border-red-100 bg-red-50/50"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                  result.verdict === "Ready"
                    ? "bg-emerald-100 text-emerald-700"
                    : result.verdict === "Stretching"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {result.verdict}
              </span>
              <span className="text-xs text-gray-500">
                Inferred: {result.inferredLevel}
              </span>
            </div>

            <p
              className={`text-sm leading-relaxed ${
                result.verdict === "Ready"
                  ? "text-emerald-800"
                  : result.verdict === "Stretching"
                  ? "text-amber-800"
                  : "text-red-800"
              }`}
            >
              {result.explanation}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
            <h4 className="text-sm font-semibold text-gray-800">
              Realistic Next Steps
            </h4>
            <ul className="space-y-2">
              {result.nextSteps.map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default RealityCheckPanel;
