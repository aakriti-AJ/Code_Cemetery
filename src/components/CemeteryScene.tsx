/** Original, resolution-independent graveyard artwork. The CSS variables alter every layer between Heaven and Hell. */
export default function CemeteryScene({ compact = false }: { compact?: boolean }) {
  return <div className={`cemetery-scene ${compact ? 'cemetery-scene--compact' : ''}`} aria-hidden="true">
    <svg viewBox="0 0 920 510" role="presentation" focusable="false" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="sky-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--sky-top)"/><stop offset="1" stopColor="var(--sky-bottom)"/></linearGradient>
        <linearGradient id="hill-gradient" x1="0" y1="0" x2="0" y2="1"><stop stopColor="var(--hill-top)"/><stop offset="1" stopColor="var(--hill-bottom)"/></linearGradient>
        <linearGradient id="stone-gradient" x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--stone-highlight)"/><stop offset=".64" stopColor="var(--stone-face)"/><stop offset="1" stopColor="var(--stone-shadow)"/></linearGradient>
        <radialGradient id="orb-glow"><stop stopColor="var(--orb-glow)" stopOpacity=".45"/><stop offset="1" stopColor="var(--orb-glow)" stopOpacity="0"/></radialGradient>
        <linearGradient id="fog-gradient"><stop stopColor="var(--fog)" stopOpacity="0"/><stop offset=".5" stopColor="var(--fog)" stopOpacity=".29"/><stop offset="1" stopColor="var(--fog)" stopOpacity="0"/></linearGradient>
      </defs>
      <rect width="920" height="510" fill="url(#sky-gradient)"/>
      <g className="scene-stars" fill="var(--stars)">{[[38,62],[130,100],[240,48],[325,85],[391,30],[512,100],[577,55],[700,97],[780,53],[845,130],[190,172],[474,18],[887,36],[60,203],[631,174]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i%4===0?2.2:1.2} opacity={.36+(i%3)*.2}/>)}</g>
      <circle cx="638" cy="154" r="115" fill="url(#orb-glow)" className="scene-orb-glow"/>
      <circle cx="638" cy="154" r="66" fill="var(--orb)" className="scene-orb"/>
      <g className="scene-clouds" fill="var(--cloud)" opacity=".65"><ellipse cx="220" cy="141" rx="115" ry="18"/><ellipse cx="264" cy="128" rx="49" ry="20"/><ellipse cx="731" cy="231" rx="129" ry="20"/><ellipse cx="778" cy="216" rx="45" ry="16"/></g>
      <g className="scene-bats" fill="var(--bat)"><path className="scene-bat bat-one" d="M283 108q-18-16-32 4q17-4 25 18q8-17 17-6q9-12 30-4q-17-22-34-9z"/><path className="scene-bat bat-two" d="M724 81q-12-12-23 3q12-3 18 12q6-11 12-4q7-9 21-3q-12-16-24-7z"/><path className="scene-bat bat-three" d="M475 146q-13-12-24 4q12-3 18 11q7-11 13-4q7-8 22-3q-13-17-25-9z"/></g>
      <path d="M0 300Q140 244 264 295T546 287T920 300V510H0Z" fill="var(--hill-far)"/>
      <path d="M0 356Q182 277 334 350T638 322T920 353V510H0Z" fill="url(#hill-gradient)"/>
      <g fill="var(--tree)" className="scene-trees">
        <path d="M80 365V190l-11-35 13 13 8-59 10 70 24-29-17 50 24 26-29-12-10 42 3 109z"/>
        <path d="M75 234 35 202l-19-49 28 31 40 23M100 238l37-36 23-50-17 61-34 48" stroke="var(--tree)" strokeWidth="9" fill="none" strokeLinecap="round"/>
        <path d="M842 371V181l-14-44 18 20 8-55 11 82 23-21-16 46 27 28-32-16-7 51 2 99z"/>
        <path d="M843 239l-40-34-18-40 29 27 35 15m12 35 36-37 20-45-15 49-33 53" stroke="var(--tree)" strokeWidth="8" fill="none" strokeLinecap="round"/>
      </g>
      <g fill="var(--stone-shadow)" opacity=".7"><path d="M120 351v-74a26 26 0 0 1 52 0v74z"/><path d="M742 350v-96a25 25 0 0 1 50 0v96z"/><path d="M591 359v-56a21 21 0 0 1 42 0v56z"/></g>
      <g className="scene-central-stone"><path d="M302 431V258c0-64 43-108 104-108s104 44 104 108v173z" fill="var(--stone-shadow)" transform="translate(12 9)" opacity=".65"/><path d="M302 431V258c0-64 43-108 104-108s104 44 104 108v173z" fill="url(#stone-gradient)" stroke="var(--stone-edge)" strokeWidth="5"/><path d="M323 408V258c0-50 34-87 83-87s83 37 83 87v150" fill="none" stroke="var(--stone-line)" strokeWidth="2" opacity=".6"/><path d="M406 210v33m-17-16h34" stroke="var(--inscription)" strokeWidth="4" strokeLinecap="round" opacity=".7"/><text x="406" y="297" textAnchor="middle" fontFamily="Georgia, serif" fontSize="35" fontWeight="bold" letterSpacing="5" fill="var(--inscription)">R.I.P.</text><path d="M345 320h122" stroke="var(--inscription)" strokeWidth="1" opacity=".42"/><text x="406" y="349" textAnchor="middle" fontFamily="monospace" fontSize="16" letterSpacing="2" fill="var(--inscription)">UNFINISHED</text><text x="406" y="370" textAnchor="middle" fontFamily="monospace" fontSize="16" letterSpacing="2" fill="var(--inscription)">IDEAS</text></g>
      <path d="M0 416Q150 372 294 424T600 419T920 394V510H0Z" fill="var(--grass)"/>
      <g className="scene-foreground" stroke="var(--foliage)" strokeWidth="4" strokeLinecap="round" fill="none"><path d="M60 465q-20-23-20-44m20 44q7-39 18-44M194 480q-20-22-19-41m19 41q11-30 22-39M546 456q-15-27-14-45m14 45q9-32 21-42M704 466q-23-22-24-43m24 43q12-32 20-39M878 462q-15-20-17-37m17 37q8-23 20-32"/></g>
      <ellipse cx="476" cy="463" rx="415" ry="25" fill="url(#fog-gradient)" className="scene-mist"/>
    </svg>
    <div className="scene-floating-note">EST. IN THE AFTERLIFE <span>✦</span> 2026</div>
  </div>;
}
