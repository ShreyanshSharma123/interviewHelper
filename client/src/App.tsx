import { useState } from "react";
import Navbar from "./components/Navbar";
import ResumeUpload from "./components/ResumeUpload";
import ModeSelector from "./components/ModeSelector";
import AtsVsHumanPanel from "./components/AtsVsHumanPanel";
import InterviewAnalysisPanel from "./components/InterviewAnalysisPanel";
import RealityCheckPanel from "./components/RealityCheckPanel";

export type AnalysisMode = "ats" | "interview" | "reality" | null;

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<AnalysisMode>(null);

  function handleReset() {
    setFile(null);
    setMode(null);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onReset={handleReset} />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-10">
        {/* Step 1: Upload resume */}
        {!file && (
          <section className="mt-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold tracking-tight mb-3">
                Candidate Reality Engine
              </h1>
              <p className="text-lg text-gray-500 max-w-xl mx-auto">
                Honest, explainable insights into why candidates get rejected
                — and what to realistically improve next.
              </p>
            </div>
            <ResumeUpload onFileSelect={setFile} />
          </section>
        )}

        {/* Step 2: Choose mode */}
        {file && !mode && (
          <section>
            <UploadedBadge fileName={file.name} onRemove={handleReset} />
            <h2 className="text-2xl font-bold mb-6 text-center">
              What would you like to do?
            </h2>
            <ModeSelector onSelect={setMode} />
          </section>
        )}

        {/* Step 3: Show selected panel */}
        {file && mode && (
          <section>
            <UploadedBadge fileName={file.name} onRemove={handleReset} />
            <button
              onClick={() => setMode(null)}
              className="text-sm text-indigo-600 hover:text-indigo-800 mb-6 inline-flex items-center gap-1 cursor-pointer"
            >
              ← Back to options
            </button>
            {mode === "ats" && <AtsVsHumanPanel file={file} />}
            {mode === "interview" && <InterviewAnalysisPanel file={file} />}
            {mode === "reality" && <RealityCheckPanel file={file} />}
          </section>
        )}
      </main>

      <footer className="text-center text-xs text-gray-400 py-6 border-t border-gray-100">
        CandidateLens — Built for honest career feedback
      </footer>
    </div>
  );
}

function UploadedBadge({
  fileName,
  onRemove,
}: {
  fileName: string;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3 mb-6 bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3">
      <svg
        className="w-5 h-5 text-indigo-500 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <span className="text-sm font-medium text-indigo-700 truncate flex-1">
        {fileName}
      </span>
      <button
        onClick={onRemove}
        className="text-xs text-indigo-400 hover:text-indigo-600 cursor-pointer"
      >
        Remove
      </button>
    </div>
  );
}

export default App;