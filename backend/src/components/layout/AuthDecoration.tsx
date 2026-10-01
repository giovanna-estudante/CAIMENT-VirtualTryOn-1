export function AuthDecoration() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-24 -top-16 h-72 w-72 rounded-full bg-caiment-purple-100/60 blur-3xl" />

      <svg
        className="absolute -right-10 top-10 h-64 w-64 opacity-70"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M170 10c30 40-10 60-30 90s10 60 40 40"
          stroke="#A98EE8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M175 15c26 38-8 56-26 84s12 54 36 36"
          stroke="#C6F24E"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <svg
        className="absolute -left-6 bottom-0 h-56 w-56 opacity-60"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M0 140c40 50 90 10 60-30S30 60 60 30"
          stroke="#A98EE8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M0 150c36 44 80 8 54-28S34 68 60 40"
          stroke="#C6F24E"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* sparkles */}
      <Sparkle className="left-[8%] top-[46%]" size={14} />
      <Sparkle className="right-[14%] top-[52%]" size={10} />
      <Sparkle className="right-[8%] bottom-[10%]" size={16} />
    </div>
  );
}

function Sparkle({ className, size = 12 }: { className?: string; size?: number }) {
  return (
    <svg
      className={`absolute text-caiment-ink ${className ?? ''}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0c0 6.6 5.4 12 12 12-6.6 0-12 5.4-12 12 0-6.6-5.4-12-12-12C6.6 12 12 6.6 12 0z" />
    </svg>
  );
}
