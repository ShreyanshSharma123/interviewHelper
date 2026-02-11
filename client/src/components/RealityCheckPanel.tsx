import { useState } from "react";
import type { JobLevel } from "../types/job";

function RealityCheckPanel() {
  const [roleLevel, setRoleLevel] = useState<JobLevel>("entry");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleCheck() {
    setLoading(true);
    setTimeout(() => {
      setResult(
        "Your profile aligns well with entry-level roles. Applying to mid-level roles may result in rejections due to experience expectations rather than skill gaps."
      );
      setLoading(false);
    }, 800);
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

      {result && (
        <div className="mt-8 rounded-xl border border-emerald-100 bg-emerald-50/50 p-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-emerald-800 leading-relaxed">
              {result}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RealityCheckPanel;
