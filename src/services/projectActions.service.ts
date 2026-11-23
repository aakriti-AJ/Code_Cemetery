import {requestApi} from './api.service';
export async function deleteProject(projectId:string){return requestApi<{success:boolean}>('/api/projects/remove',{projectId})}
