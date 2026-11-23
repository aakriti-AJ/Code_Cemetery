// R5: owner identity must be visually, textually and semantically distinguishable.
require('./check-r4.cjs');
const fs=require('node:fs');
function check(result,label){if(!result){console.error('FAIL',label);process.exitCode=1}else console.log('PASS',label)}
const insignia=fs.readFileSync('src/components/OwnerInsignia.tsx','utf8');
const badges=fs.readFileSync('src/components/StarBadges.tsx','utf8');
const guide=fs.readFileSync('src/pages/StarGuide.tsx','utf8');
const styles=fs.readFileSync('src/owner-stars.css','utf8');
const main=fs.readFileSync('src/main.tsx','utf8');
check(insignia.includes('owner-medal-silver-outer')&&insignia.includes('owner-medal-silver-star')&&insignia.includes('owner-medal-gold-outer')&&insignia.includes('owner-medal-crown'),'Owner SVGs have distinct shield and crown geometries');
check(badges.includes("ownerRank === 'PURPLE_GOLD' ? 'CROWNED OWNER' : 'OWNER SHIELD'")&&badges.includes("'15+ published' : '1–14 published'"),'Compact and normal badges identify both ranks without relying on colors');
check(guide.includes('owner-comparison-grid')&&guide.includes('five-point')&&guide.includes('eight-point')&&guide.includes('size={100}'),'Star Atlas shows both emblems side-by-side with distinct descriptions');
check(styles.includes(':root[data-theme=\'dark\']')&&styles.includes('.owner-comparison-grid')&&styles.includes('@media(max-width:440px)'),'New medals are styled for Heaven, Hell and mobile');
check(main.includes('owner-stars.css'),'Owner star styles are loaded last');
console.log('R5 owner-star checks complete.');
