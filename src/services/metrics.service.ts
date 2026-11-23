import {isPreviewMode} from '../lib/firebase';
export type MetricKind='impression'|'click';
function visitorId(){try{let id=sessionStorage.getItem('cc-anonymous-visit');if(!id){id=crypto.randomUUID();sessionStorage.setItem('cc-anonymous-visit',id)}return id}catch{return crypto.randomUUID()}}
export async function trackProject(projectId:string,type:MetricKind){if(isPreviewMode||!projectId||projectId.startsWith('preview'))return;try{await fetch('/api/metrics/event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({projectId,type,visitor:visitorId()}),keepalive:true})}catch{/* analytics must never break navigation */}}
