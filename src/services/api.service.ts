import {auth} from '../lib/firebase';
export async function requestApi<T>(path:string, data:unknown, method:'POST'|'GET'='POST'):Promise<T>{
 const token=await auth.currentUser?.getIdToken();
 const response=await fetch(path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},...(method!=='GET'?{body:JSON.stringify(data)}:{})});
 const type=response.headers.get('content-type')||'';if(!type.includes('application/json'))throw new Error('The Vercel API is not running. Use `npx vercel dev` for live Firebase mode (plain `npm run dev` is UI-only).');
 const payload:unknown=await response.json().catch(()=>null);
 if(payload===null)throw new Error('API returned no valid JSON response. Check your server logs.');
 if(!response.ok){const message=typeof payload==='object'&&payload!==null&&'error' in payload?String(payload.error):`Request failed (${response.status})`;throw new Error(message)}
 return payload as T;
}
