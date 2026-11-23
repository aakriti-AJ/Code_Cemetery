/**
 * The two owner ranks deliberately have different SILHOUETTES, not just colors:
 *   PURPLE_SILVER — a purple five-point star inside a silver SHIELD.
 *   PURPLE_GOLD   — a purple eight-point star inside a gold CROWNED MEDALLION.
 * Both are decorative SVGs; adjacent visible text states the rank and threshold.
 */
import type { OwnerStar } from '../lib/badges';

type OwnerInsigniaProps = {
  rank: Exclude<OwnerStar, 'NONE'>;
  size?: number;
  className?: string;
};

export default function OwnerInsignia({ rank, size = 42, className = '' }: OwnerInsigniaProps) {
  const senior = rank === 'PURPLE_GOLD';
  return (
    <svg
      className={`owner-insignia ${senior ? 'owner-insignia--gold' : 'owner-insignia--silver'} ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {senior ? (
        <>
          {/* Circular, gilded medallion: unmistakable even without color. */}
          <circle cx="48" cy="52" r="34" className="owner-medal-shadow" />
          <circle cx="48" cy="50" r="34" className="owner-medal-gold-outer" />
          <circle cx="48" cy="50" r="28.5" className="owner-medal-gold-inner" />
          <circle cx="48" cy="50" r="24" className="owner-medal-gold-core" />
          <path d="M25 22 21 8 36 15 48 3 60 15 75 8 71 22 Z" className="owner-medal-crown" />
          <path d="M28 17 H68" className="owner-medal-crown-rim" />
          <circle cx="48" cy="12" r="3" className="owner-medal-crown-jewel" />
          <path
            d="M48 29 54.6 39.1 66.8 35.6 62.1 47.2 73 53.3 60.8 56.4 61.5 69 50.2 62.4 40.8 70.9 39.4 58.2 27 55.5 36.9 47.4 31 35.9 43.2 39.5 Z"
            className="owner-medal-gold-star"
          />
          <path d="M37 79 L48 85 59 79" className="owner-medal-gold-chevron" />
        </>
      ) : (
        <>
          {/* Faceted heraldic shield, silver rim and a traditional 5-point star. */}
          <path d="M48 4 78 15 V47 C78 66 65 81 48 91 31 81 18 66 18 47 V15 Z" className="owner-medal-silver-outer" />
          <path d="M48 11 71 19 V47 C71 62 61 75 48 83 35 75 25 62 25 47 V19 Z" className="owner-medal-silver-inner" />
          <path d="M48 18 65 23 V47 C65 58 57 69 48 75 39 69 31 58 31 47 V23 Z" className="owner-medal-silver-core" />
          <path
            d="M48 27 54.6 40.5 69.5 42.7 58.7 53.2 61.2 68.1 48 61.1 34.8 68.1 37.3 53.2 26.5 42.7 41.4 40.5 Z"
            className="owner-medal-silver-star"
          />
          <path d="M43 76 48 79 53 76" className="owner-medal-silver-chevron" />
        </>
      )}
    </svg>
  );
}
