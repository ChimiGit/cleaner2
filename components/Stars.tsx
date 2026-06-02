import { Icon } from './Icon';

export function Stars({ n = 5, size = 14 }: { n?: number; size?: number }) {
  return (
    <span className="stars" style={{ display: 'inline-flex', gap: 1 }} aria-label={n + ' star'}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" size={size} style={{ opacity: i < n ? 1 : 0.25 }} />
      ))}
    </span>
  );
}
