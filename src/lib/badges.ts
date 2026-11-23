/** Badges are three independent dimensions, never a single composite rank. */
export type ReputationStar = 'WHITE'|'BLUE'|'GREEN'|'RED';
export type SubscriptionStar = 'NONE'|'BRONZE'|'SILVER'|'GOLD';
export type OwnerStar = 'NONE'|'PURPLE_SILVER'|'PURPLE_GOLD';
export interface Stars { reputation:ReputationStar; subscription:SubscriptionStar; owner:OwnerStar; projectCount:number; }
export function deriveStars(projectCount:number, subscription:SubscriptionStar='NONE', red=false):Stars {
 const count=Math.max(0,Math.floor(projectCount));
 return {reputation:red?'RED':count>=25?'GREEN':count>=5?'BLUE':'WHITE',subscription,owner:count===0?'NONE':count>=15?'PURPLE_GOLD':'PURPLE_SILVER',projectCount:count};
}
export function premiumCompletionFilter(tier:SubscriptionStar){return tier==='SILVER'||tier==='GOLD'}
export function canSeePurchasable(tier:SubscriptionStar){return tier==='GOLD'}
