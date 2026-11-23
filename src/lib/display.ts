import type { ProjectStatus, Project } from '../types/project';
export const statusLabel:Record<ProjectStatus,string>={DRAFT:'Draft',BURIED:'In the cemetery',LOOKING_FOR_REVIVAL:'Seeking revival',UNDER_REVIVAL:'In revival',REVIVED:'Revived'};
export const statusClass:Record<ProjectStatus,string>={DRAFT:'neutral',BURIED:'slate',LOOKING_FOR_REVIVAL:'orange',UNDER_REVIVAL:'blue',REVIVED:'green'};
export const categories=['Web Application','Mobile Application','Artificial Intelligence','Machine Learning','Data Science','Developer Tool','Game Development','Automation','Other'];
export function readableDate(timestamp: {toDate?:()=>Date;seconds?:number;_seconds?:number}|null|undefined) {if(!timestamp)return 'Recently';const date=timestamp.toDate?.()||new Date((timestamp.seconds??timestamp._seconds??0)*1000);return Number.isNaN(date.getTime())?'Recently':date.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});}
export function safeList(input:unknown):string[]{return Array.isArray(input)?input.filter((x):x is string=>typeof x==='string'):[];}
export function projectIcon(project:Pick<Project,'category'>):string {const icons:Record<string,string>={'Web Application':'◈','Mobile Application':'▣','Artificial Intelligence':'✳','Machine Learning':'◇','Data Science':'▤','Developer Tool':'⌘','Game Development':'✦','Automation':'↗'};return icons[project.category]||'◉';}
export function errorMessage(error:unknown){return error instanceof Error?error.message:'Something went wrong. Please try again.';}
