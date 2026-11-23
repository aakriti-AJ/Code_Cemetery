/** Public GitHub REST API. Does not require Firebase and never writes to Code Cemetery. */
export interface GithubPublicRepo {
 id:number;name:string;full_name:string;description:string|null;html_url:string;homepage:string|null;
 language:string|null;stargazers_count:number;forks_count:number;archived:boolean;fork:boolean;private:boolean;
 updated_at:string;topics:string[];owner:{login:string};
}
export function validGithubLogin(value:string){return /^(?!-)(?!.*--)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(value.trim());}
export async function listGithubPublicRepos(login:string,signal?:AbortSignal):Promise<GithubPublicRepo[]>{
 const username=login.trim();
 if(!validGithubLogin(username))throw new Error('Enter a valid GitHub username (letters, digits, and single hyphens).');
 const response=await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&type=owner&sort=updated`,{
  headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},signal
 });
 if(response.status===404)throw new Error('GitHub account not found. Check the username.');
 if(response.status===403||response.status===429)throw new Error('GitHub rate limit reached. Try again later or configure server-side GitHub access.');
 if(!response.ok)throw new Error(`GitHub could not load repositories (HTTP ${response.status}).`);
 const data:unknown=await response.json();if(!Array.isArray(data))throw new Error('Unexpected GitHub response.');
 return (data as GithubPublicRepo[]).filter(repo=>repo&&!repo.private&&!repo.fork&&repo.owner?.login?.toLowerCase()===username.toLowerCase());
}
