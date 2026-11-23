import {cert,getApps,initializeApp} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {FieldValue,getFirestore} from 'firebase-admin/firestore';
import type {IncomingMessage,ServerResponse} from 'node:http';
export {FieldValue};
function app(){if(getApps().length)return getApps()[0];const projectId=process.env.FIREBASE_PROJECT_ID;const clientEmail=process.env.FIREBASE_CLIENT_EMAIL;const privateKey=process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g,'\n');if(!projectId||!clientEmail||!privateKey)throw new Error('Server Firebase credentials are missing. Configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.');return initializeApp({credential:cert({projectId,clientEmail,privateKey})})}
export function store(){app();return getFirestore()}
export async function requireAuth(request:IncomingMessage){app();const match=/^Bearer (.+)$/.exec(request.headers.authorization||'');if(!match)throw new HttpError(401,'Please sign in.');try{return await getAuth().verifyIdToken(match[1],true)}catch{throw new HttpError(401,'Your session has expired. Sign in again.')}}
export class HttpError extends Error{status:number;constructor(status:number,message:string){super(message);this.status=status}}
export function allowCors(response:ServerResponse){response.setHeader('Content-Type','application/json; charset=utf-8');response.setHeader('Cache-Control','no-store')}
export function respond(response:ServerResponse,status:number,body:unknown){allowCors(response);response.statusCode=status;response.end(JSON.stringify(body))}
export function handleError(response:ServerResponse,error:unknown){if(error instanceof HttpError){respond(response,error.status,{error:error.message});return}console.error('API error',error);respond(response,500,{error:'Server request failed. Check the server configuration or try again.'})}
export function readBody(request:IncomingMessage):Promise<unknown>{return new Promise((resolve,reject)=>{let raw='';request.on('data',(chunk:Buffer|string)=>{raw+=String(chunk);if(raw.length>25000){reject(new HttpError(413,'Request body is too large.'));request.destroy()}});request.on('end',()=>{try{resolve(raw?JSON.parse(raw):{})}catch{reject(new HttpError(400,'Invalid JSON request body.'))}});request.on('error',reject)})}
export function ensureMethod(request:IncomingMessage,method:string){if(request.method!==method)throw new HttpError(405,`Use ${method}.`)}
