interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'count';
  className?: string;
}

const variants = {
  default: 'bg-linen text-olive',
  accent: 'bg-sage/40 text-ink',
  count: 'bg-olive text-cream min-w-[20px] h-5 text-[10px] rounded-full',
};

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs tracking-wider uppercase font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
