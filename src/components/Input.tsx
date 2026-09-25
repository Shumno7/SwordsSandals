import { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || props.name;
  return (
    <div>
      {label && <label htmlFor={inputId} className="label-text">{label}</label>}
      <input id={inputId} className={`input-field ${error ? 'border-red-700/60' : ''} ${className}`} {...props} />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
