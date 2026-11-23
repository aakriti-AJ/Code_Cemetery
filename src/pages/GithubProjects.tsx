import ThemedSelect from '../components/ThemedSelect';
import {useEffect,useMemo,useState} from 'react';
import type {FormEvent} from 'react';
import {Link,useSearchParams} from 'react-router';
import {listGithubPublicRepos,validGithubLogin} from '../services/github-public.service';
import type {GithubPublicRepo} from '../services/github-public.service';
import {useAuth} from '../context/useAuth';
import Icon from '../components/Icon';

function when(value:string){const date=new Date(value);return Number.isNaN(date.getTime())?'Unknown':date.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});}
export default function GithubProjects(){
 const {currentUser}=useAuth();
 const [params,setParams]=useSearchParams();
 const username=params.get('user')||'';
 const [input,setInput]=useState(username);
 const [repos,setRepos]=useState<GithubPublicRepo[]>([]);
 const [loading,setLoading]=useState(false);
 const [loaded,setLoaded]=useState(false);
 const [error,setError]=useState('');
 const [filter,setFilter]=useState('');
 const [sort,setSort]=useState<'updated'|'stars'>('updated');
 useEffect(()=>{
  const ctrl=new AbortController();
  // Schedule state synchronization outside the synchronous effect body.
  // Abort prevents results from stale usernames overwriting newer searches.
  void Promise.resolve().then(async()=>{
   if(ctrl.signal.aborted)return;
   setInput(username);
   setError('');
   setLoaded(false);
   if(!username){setRepos([]);setLoading(false);return;}
   setLoading(true);
   try{
    const data=await listGithubPublicRepos(username,ctrl.signal);
    if(!ctrl.signal.aborted){setRepos(data);setLoaded(true);}
   }catch(err){
    if(!ctrl.signal.aborted){setError(err instanceof Error?err.message:'Unable to read GitHub repositories.');setRepos([]);}
   }finally{if(!ctrl.signal.aborted)setLoading(false);}
  });
  return()=>ctrl.abort();
 },[username]);
 const visible=useMemo(()=>repos.filter(r=>`${r.name} ${r.description||''} ${r.language||''} ${r.topics?.join(' ')||''}`.toLowerCase().includes(filter.toLowerCase())).sort((a,b)=>sort==='stars'?b.stargazers_count-a.stargazers_count:new Date(b.updated_at).getTime()-new Date(a.updated_at).getTime()),[repos,filter,sort]);
 function submit(e:FormEvent){e.preventDefault();const name=input.trim();if(!validGithubLogin(name)){setError('Enter a valid GitHub username.');return;}setParams({user:name});}
 return <div className="github-discovery-page">
  <header className="github-hero"><div className="github-hero-copy"><span className="eyebrow">LIVE GITHUB · PUBLIC REPOSITORY EXPLORER</span><h1>Find the code.<br/><em>Write its afterlife.</em></h1><p>Explore real public GitHub repositories. When you sign in and link GitHub, you can import repositories you own as private drafts in your crypt.</p><div className="github-hero-actions"><Link to={currentUser?'/github-import':'/login'} className="btn btn-primary"><Icon name="github" size={17}/>{currentUser?'Import my repositories':'Sign in to import'}</Link><Link to="/stars" className="btn btn-outline">Explore member stars <Icon name="arrow-right" size={16}/></Link></div></div><div className="github-hero-art" aria-hidden="true"><div className="terminal-heading"><span/><span/><span/> &nbsp; /cemetery/git</div><div className="terminal-line"><b>$</b> git clone your-potential</div><div className="terminal-line dim">→ reading the living archives</div><div className="terminal-line green">✓ public repository metadata</div><div className="terminal-line dim">→ drafts are private by default</div><div className="terminal-cursor">_</div></div></header>
  <section className="github-search-panel" aria-label="Find public GitHub repositories"><div><span className="eyebrow">THE REPOSITORY INDEX</span><h2>Search a GitHub creator</h2><p>Search by GitHub username. No Firebase setup or sign-in is required to view public repositories.</p></div><form onSubmit={submit} className="github-search-form"><Icon name="search" size={19}/><input aria-label="GitHub username" autoComplete="off" placeholder="Enter GitHub username" value={input} onChange={e=>setInput(e.target.value)} maxLength={39}/><button type="submit" className="btn btn-primary" disabled={loading}>{loading?'Searching…':'Explore'}</button></form></section>
  {error&&<div role="alert" className="alert-box">{error}</div>}
  {loaded&&<div className="github-results-heading"><div><span className="eyebrow">LIVE RESULTS / @{username}</span><h2>{repos.length} public repositories</h2><p>Only publicly owned, non-fork repositories. Limited to the 100 most recently updated repositories.</p></div><div className="github-result-filters"><label><span>Filter</span><input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Name, language, topic"/></label><label><span>Sort</span><ThemedSelect ariaLabel="Sort GitHub projects" value={sort} onValueChange={v=>setSort(v as 'updated'|'stars')} options={[{value:'updated',label:'Recently updated'},{value:'stars',label:'Most starred'}]}/></label></div></div>}
  {loading?<div className="github-loading" role="status"><span className="skeleton"/>Reading repositories from GitHub…</div>:loaded&&!repos.length?<div className="github-empty">No public non-fork repositories found for @{username}.</div>:loaded&&!visible.length?<div className="github-empty">No repositories match that filter.</div>:loaded?<div className="github-repo-grid">{visible.map(r=><article className="github-repo-card" key={r.id}><div className="github-repo-top"><span className="github-repo-icon"><Icon name="github" size={19}/></span><span className={`github-repo-state ${r.archived?'archived':''}`}>{r.archived?'Archived':'Public repository'}</span></div><h3>{r.name}</h3><p>{r.description||'The author has not added a description.'}</p><div className="github-repo-tags">{r.language&&<span>{r.language}</span>}{(r.topics||[]).slice(0,2).map(t=><span key={t}>{t}</span>)}</div><div className="github-repo-foot"><span><Icon name="star" size={14}/> {r.stargazers_count}</span><span>Updated {when(r.updated_at)}</span><a href={r.html_url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${r.full_name} on GitHub`}><Icon name="external" size={16}/></a></div></article>)}</div>:<div className="github-onboarding"><div className="github-onboarding-symbol"><Icon name="github" size={44}/></div><h2>The living archives are waiting.</h2><p>Enter a GitHub username above to see actual public repositories. Importing projects into Code Cemetery requires signing in, linking the owner’s GitHub account, and running the Vercel API.</p></div>}
  <div className="github-privacy-note"><Icon name="shield" size={19}/><span>Browsing public GitHub repositories does not add them to Code Cemetery. Imports are private drafts, require verified ownership, and can be published only by their owner.</span></div>
 </div>;
}
