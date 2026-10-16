import React from 'react';

export interface LetterAvatarProps {
  name?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'rounded' | 'circle' | 'square';
  className?: string;
  seed?: string;
  title?: string;
}

// Curated academic palette for high visual clarity, contrast, and elegance
const COLOR_VARIANTS = [
  { bg: 'bg-indigo-600', text: 'text-white' },
  { bg: 'bg-emerald-600', text: 'text-white' },
  { bg: 'bg-blue-600', text: 'text-white' },
  { bg: 'bg-violet-600', text: 'text-white' },
  { bg: 'bg-teal-600', text: 'text-white' },
  { bg: 'bg-rose-600', text: 'text-white' },
  { bg: 'bg-sky-600', text: 'text-white' },
  { bg: 'bg-amber-600', text: 'text-white' },
  { bg: 'bg-cyan-600', text: 'text-white' },
  { bg: 'bg-purple-600', text: 'text-white' },
  { bg: 'bg-slate-700', text: 'text-white' }
];

export function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return 'CN';

  // Strip academic titles / honorifics
  const cleanName = name
    .trim()
    .replace(/^(dr\.|prof\.|mr\.|ms\.|mrs\.|er\.|shri|smt)\s+/i, '')
    .trim();

  const parts = cleanName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'CN';
  if (parts.length === 1) {
    const single = parts[0];
    return single.length >= 2 ? single.slice(0, 2).toUpperCase() : single.toUpperCase();
  }

  const first = parts[0][0];
  const last = parts[parts.length - 1][0];
  return (first + last).toUpperCase();
}

export function getDeterministicColor(str?: string | null): { bg: string; text: string } {
  if (!str) return COLOR_VARIANTS[0];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_VARIANTS.length;
  return COLOR_VARIANTS[index];
}

const SIZE_STYLES: Record<string, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm font-semibold',
  lg: 'w-12 h-12 text-base font-bold',
  xl: 'w-16 h-16 text-xl font-bold',
  '2xl': 'w-20 h-20 text-2xl font-bold'
};

const SHAPE_STYLES: Record<string, string> = {
  circle: 'rounded-full',
  rounded: 'rounded-2xl',
  square: 'rounded-lg'
};

export const LetterAvatar: React.FC<LetterAvatarProps> = ({
  name,
  size = 'md',
  shape = 'rounded',
  className = '',
  seed,
  title
}) => {
  const displayName = name || 'CampusNet User';
  const initials = getInitials(displayName);
  const color = getDeterministicColor(seed || displayName);

  // If className already specifies size or rounded, let caller override cleanly
  const hasCustomSize = /\b[wh]-\d+/.test(className);
  const hasCustomShape = /\brounded-[a-z0-9]+/.test(className);

  const baseSize = hasCustomSize ? '' : (SIZE_STYLES[size] || SIZE_STYLES.md);
  const baseShape = hasCustomShape ? '' : (SHAPE_STYLES[shape] || SHAPE_STYLES.rounded);

  return (
    <div
      title={title || displayName}
      className={`inline-flex items-center justify-center select-none shrink-0 tracking-wider font-semibold shadow-xs ${color.bg} ${color.text} ${baseSize} ${baseShape} ${className}`}
      aria-label={displayName}
      role="img"
    >
      <span>{initials}</span>
    </div>
  );
};

export default LetterAvatar;
