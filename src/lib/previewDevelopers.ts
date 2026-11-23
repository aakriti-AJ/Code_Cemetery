import {deriveStars} from './badges';
import type {PublicDeveloper} from '../services/community.service';
/** Design-only examples. These are never stored in Firestore. */
export const previewDevelopers:PublicDeveloper[]=[
 {uid:'preview_elmira',name:'El Mira',username:'nightshifter',bio:'Building beautiful tools and learning from failed experiments.',githubUsername:'',skills:['React','TypeScript','Design Systems'],followers:129,following:49,isFollowing:false,stars:deriveStars(3)},
 {uid:'preview_orion',name:'Orion Dev',username:'orioncodes',bio:'Open-source maintainer and relentless project reviver.',githubUsername:'',skills:['Python','AI','Firebase'],followers:1210,following:260,isFollowing:false,stars:deriveStars(31,'GOLD')},
 {uid:'preview_ana',name:'Ana Lin',username:'ana_builds',bio:'A collection of unfinished sparks and experiments.',githubUsername:'',skills:['Next.js','Go','Cloud'],followers:384,following:108,isFollowing:false,stars:deriveStars(17,'SILVER')},
];
