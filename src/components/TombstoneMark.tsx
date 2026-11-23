export default function TombstoneMark({size=30}:{size?:number}){
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 48 52" fill="none"><path d="M8 43V22C8 11 15 5 24 5s16 6 16 17v21H8Z" fill="currentColor" opacity=".95"/><path d="M16 44V24c0-6 3-11 8-11s8 5 8 11v20" stroke="var(--brand-cut, #281d2a)" strokeWidth="1.5" opacity=".6"/><path d="M24 20v13M18 26.5h12" stroke="var(--brand-cut, #281d2a)" strokeWidth="3" strokeLinecap="round"/><path d="M4 45h40" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/></svg>
}
