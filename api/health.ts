import type {IncomingMessage,ServerResponse} from 'node:http';
/** Non-sensitive liveness probe for the Vercel API layer. Does not disclose credentials. */
export default function handler(req:IncomingMessage,res:ServerResponse){
 if(req.method!=='GET'){res.writeHead(405,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Use GET.'}));return;}
 res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});
 res.end(JSON.stringify({ok:true,service:'code-cemetery-api',release:'pre-alpha-r3'}));
}
