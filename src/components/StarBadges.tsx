import type { Stars } from '../lib/badges';
import OwnerInsignia from './OwnerInsignia';

const labels = {
  WHITE: 'White · New keeper',
  BLUE: 'Blue · Established',
  GREEN: 'Green · Veteran',
  RED: 'Red · Under moderation',
  NONE: '',
  BRONZE: 'Bronze · Ad-free',
  SILVER: 'Silver · 80%+ discovery',
  GOLD: 'Gold · Marketplace access',
  PURPLE_SILVER: 'Purple / Silver · Owner shield · 1–14 published projects',
  PURPLE_GOLD: 'Purple / Gold · Crowned owner · 15+ published projects',
} as const;

export default function StarBadges({ stars, compact = false }: { stars: Stars; compact?: boolean }) {
  const ownerRank = stars.owner;
  return (
    <div className={`badge-stars ${compact ? 'compact' : ''}`} aria-label="Developer status badges">
      <span className={`identity-star reputation-${stars.reputation.toLowerCase()}`} title={labels[stars.reputation]} aria-label={labels[stars.reputation]}>
        <span className="badge-simple-symbol" aria-hidden="true">★</span>
        <span>{compact ? stars.reputation : labels[stars.reputation]}</span>
      </span>
      {stars.subscription !== 'NONE' && (
        <span className={`identity-star subscription-${stars.subscription.toLowerCase()}`} title={labels[stars.subscription]} aria-label={labels[stars.subscription]}>
          <span className="badge-simple-symbol" aria-hidden="true">★</span>
          <span>{compact ? stars.subscription : labels[stars.subscription]}</span>
        </span>
      )}
      {ownerRank !== 'NONE' && (
        <span
          className={`identity-star owner-${ownerRank.toLowerCase()} owner-medal-badge`}
          title={labels[ownerRank]}
          aria-label={labels[ownerRank]}
        >
          <OwnerInsignia rank={ownerRank} size={compact ? 33 : 40} />
          <span className="owner-medal-copy">
            <strong>{ownerRank === 'PURPLE_GOLD' ? 'CROWNED OWNER' : 'OWNER SHIELD'}</strong>
            <small>{ownerRank === 'PURPLE_GOLD' ? '15+ published' : '1–14 published'}</small>
          </span>
        </span>
      )}
    </div>
  );
}
