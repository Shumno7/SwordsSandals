import { type SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
}

export default function Select({ label, error, options, className = '', id, ...props }: SelectProps) {
  const selectId = id || props.name;
  return (
    <div>
      {label && <label htmlFor={selectId} className="label-text">{label}</label>}
      <select id={selectId} className={`select-field ${error ? 'border-red-700/60' : ''} ${className}`} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-forge-graphite text-gray-200">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
