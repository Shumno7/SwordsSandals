import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'gold' | 'outline' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export default function Button({ variant = 'gold', className = '', children, ...props }: ButtonProps) {
  const variants: Record<Variant, string> = {
    gold: 'btn-gold',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  };

  return (
    <button className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
