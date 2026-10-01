interface TickSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  ticks?: number;
  onChange: (value: number) => void;
}

export function TickSlider({ label, value, min, max, ticks = 5, onChange }: TickSliderProps) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <p className="text-xs font-medium text-caiment-ink-soft">{label}</p>
      <div className="relative mt-3 h-5">
        {/* trilho */}
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-caiment-purple-200" />
        {/* marcas */}
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between">
          {Array.from({ length: ticks }).map((_, i) => (
            <span key={i} className="h-2.5 w-px bg-caiment-purple-300" />
          ))}
        </div>
        {/* handle */}
        <div
          className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-caiment-purple-600"
          style={{ left: `${percent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
          aria-label={label}
        />
      </div>
    </div>
  );
}
