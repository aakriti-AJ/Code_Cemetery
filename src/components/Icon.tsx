import type { SVGProps } from 'react';

type IconName = 'grid'|'compass'|'plus'|'archive'|'spark'|'bookmark'|'bell'|'user'|'log-out'|'arrow'|'arrow-right'|'arrow-left'|'github'|'search'|'filter'|'code'|'layers'|'clock'|'check'|'x'|'menu'|'close'|'external'|'users'|'settings'|'heart'|'alert'|'chevron'|'inbox'|'send'|'terminal'|'activity'|'shield'|'message'|'book'|'branch'|'star'|'issue'|'calendar'|'refresh'|'trash'|'eye'|'edit'|'lock'|'mail'|'check-circle'|'info'|'arrow-up'|'list'|'rocket'|'globe'|'sun'|'moon'|'linkedin';
const paths: Record<IconName, React.ReactNode> = {
 grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
 compass: <><circle cx="12" cy="12" r="9"/><path d="m16.2 7.8-2.7 5.7-5.7 2.7 2.7-5.7z"/></>,
 plus: <path d="M12 5v14M5 12h14"/>, archive: <><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v12h14V8M10 12h4"/></>,
 spark: <><path d="m12 2 2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"/></>,
 bookmark:<path d="M5 4h14v17l-7-4-7 4z"/>, bell:<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
 user:<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>, 'log-out':<><path d="M10 4H5v16h5M14 8l4 4-4 4M8 12h10"/></>,
 arrow:<path d="M5 12h14m-7-7 7 7-7 7"/>, 'arrow-right':<path d="M5 12h14m-7-7 7 7-7 7"/>, 'arrow-left':<path d="M19 12H5m7-7-7 7 7 7"/>,
 github:<><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.7C18.1 15 21 13.8 21 9.2a6.3 6.3 0 0 0-1.7-4.3A5.7 5.7 0 0 0 19.2 1s-1.6-.3-4.2 2a14 14 0 0 0-7 0C5.4.7 3.8 1 3.8 1a5.7 5.7 0 0 0-.1 3.9A6.3 6.3 0 0 0 2 9.2c0 4.6 2.9 5.8 5.9 6.2A3.4 3.4 0 0 0 7 18v4"/></>,
 search:<><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></>,filter:<><path d="M3 5h18M7 12h10M10 19h4"/></>,
 code:<><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16"/></>, layers:<><path d="m12 2 10 5-10 5L2 7zm-10 10 10 5 10-5m-20 5 10 5 10-5"/></>,
 clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,check:<path d="m4 12 5 5L20 6"/>, x:<path d="M5 5 19 19M19 5 5 19"/>,
 menu:<path d="M4 6h16M4 12h16M4 18h16"/>,close:<path d="M5 5 19 19M19 5 5 19"/>, external:<><path d="M14 4h6v6M20 4l-9 9"/><path d="M19 14v6H4V5h6"/></>,
 users:<><circle cx="9" cy="8" r="3"/><path d="M2 21v-2a7 7 0 0 1 14 0v2M16 5a3 3 0 0 1 0 6m2 4a6 6 0 0 1 4 6"/></>,
 settings:<><circle cx="12" cy="12" r="3"/><path d="m10 2 1 2h2l1-2 3 2-.5 2 1.5 1.5 2-.5 2 3-2 1v2l2 1-2 3-2-.5-1.5 1.5.5 2-3 2-1-2h-2l-1 2-3-2 .5-2L6 17.5l-2 .5-2-3 2-1v-2l-2-1 2-3 2 .5L7.5 6l-.5-2z"/></>,
 heart:<path d="M20.8 8.3c0 5-8.8 11-8.8 11s-8.8-6-8.8-11A5 5 0 0 1 12 5.6a5 5 0 0 1 8.8 2.7z"/>,
 alert:<><path d="m12 3 10 18H2zM12 9v5m0 3v.2"/></>, chevron:<path d="m6 9 6 6 6-6"/>,
 inbox:<><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 13h5l2 3h4l2-3h5"/></>,send:<><path d="m22 2-7 20-4-9-9-4zM11 13 22 2"/></>,
 terminal:<><rect x="2" y="3" width="20" height="18" rx="2"/><path d="m6 8 4 4-4 4m7 0h5"/></>,
 activity:<path d="M2 12h5l3-8 4 16 3-8h5"/>,shield:<><path d="m12 2 9 4v6c0 6-4 9-9 10-5-1-9-4-9-10V6z"/><path d="m8 12 3 3 5-6"/></>,
 message:<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>,
 book:<><path d="M4 3h15v18H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM2 17a2 2 0 0 1 2-2h15"/></>,
 branch:<><circle cx="6" cy="4" r="2"/><circle cx="6" cy="20" r="2"/><circle cx="18" cy="7" r="2"/><path d="M6 6v12m0-7c0-4 4-4 10-4"/></>,
 star:<path d="m12 2 3 6.5 7 1-5 5 .9 7.5-5.9-3.5L6 22l1-7.5-5-5 7-1z"/>,
 issue:<><circle cx="12" cy="12" r="10"/><path d="M12 7v6m0 4v.3"/></>,calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18"/></>,
 refresh:<><path d="M20 11a8 8 0 0 0-14-5L3 9m0-6v6h6M4 13a8 8 0 0 0 14 5l3-3m0 6v-6h-6"/></>,
 trash:<><path d="M4 7h16M9 7V4h6v3m-9 0 1 14h10l1-14M10 11v7m4-7v7"/></>,
 eye:<><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12"/><circle cx="12" cy="12" r="3"/></>,
 edit:<><path d="m4 20 5-.8L20 8l-4-4L5 15zM13 7l4 4"/></>,lock:<><rect x="4" y="11" width="16" height="11" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,
 mail:<><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 8 10-8"/></>,
 'check-circle':<><circle cx="12" cy="12" r="10"/><path d="m7 12 3 3 7-7"/></>, info:<><circle cx="12" cy="12" r="10"/><path d="M12 11v6m0-10v.4"/></>,
 'arrow-up':<path d="M12 20V4m-7 7 7-7 7 7"/>, list:<path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/>,
 rocket:<><path d="M4 15c2-6 8-11 16-12 0 8-5 14-11 16l-5-4zM8 19l-3 3M7 12l-5 1 2 2M12 17l1 5 2-3"/><circle cx="15" cy="9" r="2"/></>,
 sun:<><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></>,
 moon:<path d="M20.5 14A8.8 8.8 0 0 1 10 3.5 9 9 0 1 0 20.5 14z"/>,
 linkedin:<><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M7 10v8m0-11v.1M11 18v-8m0 3a3 3 0 0 1 6 0v5"/></>,
 globe:<><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2c-6 5-6 15 0 20M12 2c6 5 6 15 0 20"/></>
};
export default function Icon({name,size=20,...props}: SVGProps<SVGSVGElement>&{name:IconName;size?:number}) {
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
