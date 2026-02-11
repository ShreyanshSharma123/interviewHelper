import { useState, useRef } from "react";

interface ResumeUploadProps {
  onFileSelect: (file: File) => void;
}

function ResumeUpload({ onFileSelect }: ResumeUploadProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    onFileSelect(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
        transition-all duration-200
        ${
          dragging
            ? "border-indigo-400 bg-indigo-50 scale-[1.01]"
            : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50"
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleChange}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-indigo-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        <div>
          <p className="text-base font-semibold text-gray-700">
            Drop your resume here, or{" "}
            <span className="text-indigo-600">browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PDF or DOCX — max 2 MB
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResumeUpload;