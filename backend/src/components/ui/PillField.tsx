import { type SelectHTMLAttributes, type InputHTMLAttributes } from 'react';

interface PillInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

interface PillSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

const pillClass =
  'w-full rounded-full bg-caiment-lime-soft px-4 py-2.5 text-sm text-caiment-ink placeholder:text-caiment-ink/50 focus:outline-none focus:ring-2 focus:ring-caiment-lime-deep/40';

export function PillInput({ label, className, ...rest }: PillInputProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-caiment-ink">{label}</span>
      <input className={`${pillClass} ${className ?? ''}`} {...rest} />
    </label>
  );
}

export function PillSelect({ label, options, className, ...rest }: PillSelectProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-caiment-ink">{label}</span>
      <select className={`${pillClass} ${className ?? ''}`} {...rest}>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
