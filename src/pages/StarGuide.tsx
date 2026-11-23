import ThemedSelect from '../components/ThemedSelect';
import { Link } from 'react-router';
import { useState } from 'react';
import Icon from '../components/Icon';
import { deriveStars } from '../lib/badges';
import type { SubscriptionStar } from '../lib/badges';
import StarBadges from '../components/StarBadges';
import OwnerInsignia from '../components/OwnerInsignia';

type Tone = 'white' | 'blue' | 'green' | 'red' | 'bronze' | 'silver' | 'gold' | 'purple-silver' | 'purple-gold';
type Tier = { name:string; tone:Tone; range:string; description:string; detail:string };
const reputation:Tier[] = [
  { name:'White Star',tone:'white',range:'0–4 published projects',description:'New soul',detail:'A fresh profile and fewer than five eligible published projects. This is a starting point, not a negative rating.' },
  { name:'Blue Star',tone:'blue',range:'5–24 published projects',description:'Established builder',detail:'At least five published projects attributed to the owner.' },
  { name:'Green Star',tone:'green',range:'25+ published projects',description:'Veteran builder',detail:'A substantial catalogue of at least 25 published projects.' },
  { name:'Red Star',tone:'red',range:'Moderation decision',description:'Account under moderation',detail:'An administrator may apply this status after reviewing credible reports. Reports alone never trigger a red star.' },
];
const premium:Tier[] = [
  { name:'Bronze Star',tone:'bronze',range:'Paid membership',description:'An uninterrupted visit',detail:'Ad-free experience on Code Cemetery. Ordinary public discovery remains available.' },
  { name:'Silver Star',tone:'silver',range:'Paid membership',description:'See the nearly finished',detail:'All Bronze benefits, plus the 80%+ completion filter and access to qualifying restricted project records.' },
  { name:'Gold Star',tone:'gold',range:'Paid membership',description:'Discover projects for sale',detail:'All Silver benefits, plus discovery of projects marked available for purchase. The actual payment and transfer workflow is not available in Pre-Alpha.' },
];
const ownership:Tier[] = [
  { name:'Purple / Silver',tone:'purple-silver',range:'1–14 published projects',description:'The silver shield',detail:'A purple five-point star set inside a faceted silver shield. Earned upon publishing your first eligible project.' },
  { name:'Purple / Gold',tone:'purple-gold',range:'15+ published projects',description:'The gold crown',detail:'A purple eight-point star in a gold crowned medallion. Earned at fifteen eligible published projects.' },
];
function Star({ tone }: {tone:Tone}) {
 const owner = tone === 'purple-silver' ? 'PURPLE_SILVER' : tone === 'purple-gold' ? 'PURPLE_GOLD' : null;
 return <span className={`guide-star guide-star-${tone}`} aria-hidden="true">
  {owner ? <OwnerInsignia rank={owner} size={60}/> : <Icon name="star" size={29} fill="currentColor" />}
 </span>;
}
function StarGroup({ label, number, description, items }: {label:string;number:string;description:string;items:Tier[]}) {
 return <section className="star-guide-section" aria-label={label}>
   <div className="star-group-heading"><span className="chapter-number">{number} / THE CONSTELLATION</span><div><h2>{label}</h2><p>{description}</p></div></div>
   <div className="star-tier-grid">{items.map(tier=><article className="star-tier" key={tier.name}><div className="star-tier-top"><Star tone={tier.tone}/><span className="star-tier-range">{tier.range}</span></div><h3>{tier.name}</h3><strong>{tier.description}</strong><p>{tier.detail}</p></article>)}</div>
 </section>;
}
export default function StarGuide(){
 const [count,setCount]=useState(7);
 const [tier,setTier]=useState<SubscriptionStar>('SILVER');
 const stars=deriveStars(count,tier);
 return <div className="star-guide-page">
  <header className="atlas-hero"><span className="eyebrow atlas-overline">THE STAR ATLAS / AN OFFICIAL FIELD GUIDE</span><div className="atlas-hero-row"><div><h1>Every star<br/>tells a <em>story.</em></h1><p>Three separate constellations. One developer identity. Understand how experience, membership and ownership appear throughout the cemetery.</p><div className="atlas-actions"><Link className="btn btn-primary" to="/community">Meet the gravekeepers <Icon name="arrow-right" size={16}/></Link><Link className="btn btn-ghost" to="/explore">Explore tombstones</Link></div></div><div className="atlas-constellation" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span><span>✳</span><span>✧</span><div className="atlas-moon">★</div></div></div></header>
  <div className="atlas-intro"><div><span className="eyebrow">HOW TO READ A PROFILE</span><h2>Three systems. <em>No confusion.</em></h2></div><p>Reputation measures qualifying published work, membership represents access privileges, and the owner star highlights publishing experience. A user can display stars from all three systems at once.</p></div>
  <StarGroup label="Reputation stars" number="01" description="Every account has one reputation star. The red star is a moderation override, not a project-count tier." items={reputation}/>
  <StarGroup label="Membership stars" number="02" description="These are premium membership tiers. Free accounts do not have a paid membership star." items={premium}/>
  <StarGroup label="Owner stars" number="03" description="Two unmistakable owner ranks: a silver shield for 1–14 eligible projects and a gold crowned medallion for 15 or more." items={ownership}/>
  <section className="owner-comparison" aria-label="Compare project owner star designs">
    <div className="owner-comparison-heading">
      <span className="eyebrow">THE OWNER DISTINCTION</span>
      <h2>Two ranks. Two silhouettes.</h2>
      <p>The silver rank has a shield and five-point star. The gold rank has a crown, circular medallion, and eight-point star. Their shape, label and threshold all differ, even if colors cannot be seen.</p>
    </div>
    <div className="owner-comparison-grid">
      <div className="owner-comparison-item owner-comparison-silver">
        <OwnerInsignia rank="PURPLE_SILVER" size={100} />
        <div><span className="owner-comparison-kicker">SILVER SHIELD / RANK I</span><h3>Project owner</h3><strong>1–14 published projects</strong><p>Faceted shield · five-point purple star</p></div>
      </div>
      <div className="owner-comparison-item owner-comparison-gold">
        <OwnerInsignia rank="PURPLE_GOLD" size={100} />
        <div><span className="owner-comparison-kicker">GOLD CROWN / RANK II</span><h3>Senior project owner</h3><strong>15+ published projects</strong><p>Crowned medallion · eight-point purple star</p></div>
      </div>
    </div>
  </section>
  <section className="star-lab"><div className="star-lab-copy"><span className="eyebrow">INTERACTIVE STAR LAB</span><h2>See your future stars.</h2><p>Change the published project count and membership to see the exact badges. This simulator does not change an account.</p><div className="star-lab-controls"><label htmlFor="lab-count">Published projects <strong>{count}</strong></label><input id="lab-count" type="range" min="0" max="40" value={count} onChange={e=>setCount(Number(e.target.value))}/><label htmlFor="lab-tier">Membership</label><ThemedSelect id="lab-tier" value={tier} onValueChange={v=>setTier(v as SubscriptionStar)} options={[{value:'NONE',label:'Free'},{value:'BRONZE',label:'Bronze'},{value:'SILVER',label:'Silver'},{value:'GOLD',label:'Gold'}]}/></div></div><div className="star-lab-result"><span className="eyebrow">YOUR BADGE CONSTELLATION</span><StarBadges stars={stars}/><p>Project counts at the boundaries: <strong>5</strong> begins Blue, <strong>15</strong> begins Purple / Gold, and <strong>25</strong> begins Green. Badges can change as eligible projects are published or removed.</p></div></section>
  <p className="atlas-disclaimer"><Icon name="info" size={17}/> In Pre-Alpha, premium entitlements are managed by administrators for testing. Subscription checkout and verified purchases are not live. Project counts are based on eligible published projects, not private GitHub-import drafts.</p>
 </div>
}
