import type {IncomingMessage,ServerResponse} from 'node:http';
import {ensureMethod,handleError,readBody,requireAuth,respond,store,FieldValue,HttpError} from '../_lib/admin.js';
import type {DecodedIdToken} from 'firebase-admin/auth';
function isAdmin(t:DecodedIdToken){return t.admin===true||(process.env.ADMIN_UIDS||'').split(',').map(x=>x.trim()).filter(Boolean).includes(t.uid)}
async function requireAdmin(req:IncomingMessage){const token=await requireAuth(req);if(!isAdmin(token))throw new HttpError(403,'This area is for administrators only.');return token}
export default async function handler(req:IncomingMessage,res:ServerResponse){try{const admin=await requireAdmin(req);const db=store();if(req.method==='GET'){
 const [submissions,reports]=await Promise.all([db.collection('newsletterSubmissions').where('status','==','PENDING').limit(60).get(),db.collection('reports').limit(60).get()]);respond(res,200,{submissions:submissions.docs.map(d=>({id:d.id,...d.data(),createdAt:null})),reports:reports.docs.map(d=>({id:d.id,...d.data(),createdAt:null}))});return}
 ensureMethod(req,'POST');const body=await readBody(req) as Record<string,unknown>;const action=body.action;const uid=typeof body.uid==='string'?body.uid:'';
 if(action==='approveNewsletter'||action==='rejectNewsletter'){
  const id=String(body.id||'');if(!/^[A-Za-z0-9]{10,40}$/.test(id))throw new HttpError(400,'Invalid submission ID.');const ref=db.doc(`newsletterSubmissions/${id}`);const snap=await ref.get();if(!snap.exists||snap.data()?.status!=='PENDING')throw new HttpError(409,'Submission is no longer pending.');const d=snap.data()!;const approved=action==='approveNewsletter';const batch=db.batch();batch.update(ref,{status:approved?'APPROVED':'REJECTED',reviewedBy:admin.uid,reviewedAt:FieldValue.serverTimestamp()});if(approved)batch.set(db.doc(`newsletters/${id}`),{title:d.title,summary:d.summary,body:d.body,authorId:d.authorId,authorName:String((await db.doc(`publicProfiles/${d.authorId}`).get()).data()?.name||'Developer'),publishedAt:FieldValue.serverTimestamp()});await batch.commit();respond(res,200,{ok:true});return;
 }
 if(!/^[A-Za-z0-9_-]{8,128}$/.test(uid))throw new HttpError(400,'Invalid user ID.');if(uid===admin.uid)throw new HttpError(403,'You cannot modify your own administrative status here.');
 if(action==='setTier'){
  const tier=String(body.tier);if(!['NONE','BRONZE','SILVER','GOLD'].includes(tier))throw new HttpError(400,'Invalid subscription tier.');if(tier==='NONE')await db.doc(`entitlements/${uid}`).delete();else await db.doc(`entitlements/${uid}`).set({tier,assignedBy:admin.uid,assignedAt:FieldValue.serverTimestamp(),source:'ADMIN_TEST_ONLY'});respond(res,200,{ok:true});return;
 }
 if(action==='setRed'){
  if(typeof body.red!=='boolean')throw new HttpError(400,'Invalid flag.');await db.doc(`moderation/${uid}`).set({red:body.red,moderatedBy:admin.uid,moderatedAt:FieldValue.serverTimestamp(),reason:String(body.reason||'Manual moderation review').slice(0,400)});respond(res,200,{ok:true});return;
 }
 throw new HttpError(400,'Unsupported admin operation.');
 }catch(e){handleError(res,e)}}
