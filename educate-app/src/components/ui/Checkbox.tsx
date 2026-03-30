'use client';

interface CheckboxProps {
  checked: boolean;
  partial?: boolean;
  color?: string;
  size?: 'sm' | 'md';
  onChange: () => void;
}

export function Checkbox({ checked, partial, color = '#6c63ff', size = 'md', onChange }: CheckboxProps) {
  const dim = size === 'sm' ? 'w-3.5 h-3.5' : 'w-[18px] h-[18px]';
  const radius = size === 'sm' ? 'rounded-sm' : 'rounded';

  return (
    <button
      type="button"
      onClick={onChange}
      className={`${dim} ${radius} border-2 flex items-center justify-center transition-all duration-150 flex-shrink-0`}
      style={{
        borderColor: checked ? color : partial ? `${color}99` : '#444',
        backgroundColor: checked ? color : 'transparent',
      }}
      aria-checked={checked ? 'true' : partial ? 'mixed' : 'false'}
      role="checkbox"
    >
      {checked && <span className="text-white text-[9px] font-bold leading-none">&#10003;</span>}
      {partial && !checked && <div className="w-2 h-0.5 rounded-sm" style={{ backgroundColor: color }} />}
    </button>
  );
}
