export function Badge({ children, color, className = '' }: { children: React.ReactNode; color?: string; className?: string }) {
  return (
    <span
      className={`text-xs px-2.5 py-0.5 rounded-lg font-medium ${className}`}
      style={color ? { backgroundColor: `${color}22`, color } : undefined}
    >
      {children}
    </span>
  );
}
