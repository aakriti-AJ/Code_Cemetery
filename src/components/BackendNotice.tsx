import {useEffect,useState} from 'react';
import {isPreviewMode} from '../lib/firebase';
import Icon from './Icon';
export default function BackendNotice(){
 const [online,setOnline]=useState<boolean|null>(null);
 useEffect(()=>{if(isPreviewMode)return;const controller=new AbortController();
  fetch('/api/health',{signal:controller.signal,headers:{Accept:'application/json'}})
   .then(async response=>{if(!response.ok||!response.headers.get('content-type')?.includes('application/json'))return false;const data=await response.json() as {ok?:boolean;service?:string};return data.ok===true&&data.service==='code-cemetery-api';})
   .then(ok=>{if(!controller.signal.aborted)setOnline(ok)})
   .catch(()=>{if(!controller.signal.aborted)setOnline(false)});
  return()=>controller.abort();
 },[]);
 if(isPreviewMode||online!==false)return null;
 return <div className="backend-warning" role="status"><Icon name="alert" size={16}/><div><strong>Backend API offline.</strong> Firebase is configured, but the Vercel functions are not running. Start <code>npx vercel dev</code> for GitHub importing, public project lists, moderation and intelligence.</div></div>;
}
