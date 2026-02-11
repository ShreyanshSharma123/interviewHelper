import type { AnalysisMode } from "../App";

interface ModeSelectorProps {
  onSelect: (mode: AnalysisMode) => void;
}

const modes = [
  {
    key: "ats" as const,
    title: "ATS vs Human",
    description: "Compare how machines and recruiters read your resume.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    key: "interview" as const,
    title: "Interview Analysis",
    description: "Identify likely reasons behind interview rejection.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    key: "reality" as const,
    title: "Reality Check",
    description: "Assess readiness for roles and realistic next steps.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

function ModeSelector({ onSelect }: ModeSelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {modes.map((m) => (
        <button
          key={m.key}
          onClick={() => onSelect(m.key)}
          className="group flex flex-col items-start gap-3 rounded-xl border border-gray-200 bg-white p-6
                     hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100
                     transition-all duration-200 text-left cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
            {m.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{m.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {m.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

export default ModeSelector;
