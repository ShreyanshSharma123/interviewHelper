interface NavbarProps {
  onReset: () => void;
}

function Navbar({ onReset }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur sticky top-0 z-10">
      <button
        onClick={onReset}
        className="font-bold text-lg tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
      >
        CandidateLens
      </button>
      <span className="text-xs text-gray-400 hidden sm:block">
        Resume Analysis Suite
      </span>
    </nav>
  );
}

export default Navbar;