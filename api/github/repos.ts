import type {IncomingMessage,ServerResponse} from 'node:http';
import {ensureMethod,handleError,requireAuth,respond} from '../_lib/admin';
import {ownedRepositories} from '../_lib/github';
export default async function handler(req:IncomingMessage,res:ServerResponse){try{ensureMethod(req,'GET');const token=await requireAuth(req);const {github,repos}=await ownedRepositories(token);respond(res,200,{login:github.login,repos:repos.map(r=>({id:r.id,name:r.name,fullName:r.full_name,description:r.description,language:r.language,htmlUrl:r.html_url,archived:r.archived}))})}catch(e){handleError(res,e)}}
