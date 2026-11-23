import ThemedSelect from '../components/ThemedSelect';
import {useEffect,useRef,useState} from 'react';
import {Link,useSearchParams} from 'react-router';
import {categories,errorMessage,safeList} from '../lib/display';
import {getPublicProjects} from '../services/project.service';
import type {ProjectCursor,PublicStatusFilter} from '../services/project.service';
import type {Project} from '../types/project';
import ProjectCard from '../components/ProjectCard';
import EmptyGrave from '../components/EmptyGrave';
import Icon from '../components/Icon';
import {useAuth} from '../context/useAuth';
import {myTier} from '../services/community.service';
import {premiumCompletionFilter} from '../lib/badges';
import type {SubscriptionStar} from '../lib/badges';

export default function Explore(){
  const {currentUser}=useAuth();const [tier,setTier]=useState<SubscriptionStar>('NONE');
  useEffect(()=>{let live=true;if(!currentUser){return}myTier().then(t=>{if(live&&['NONE','BRONZE','SILVER','GOLD'].includes(t))setTier(t as SubscriptionStar)}).catch(()=>{});return()=>{live=false}},[currentUser]);
  const [params,setParams]=useSearchParams();
  const rawStatus=params.get('status')||'ALL';
  const status=(['ALL','BURIED','LOOKING_FOR_REVIVAL','UNDER_REVIVAL','REVIVED'].includes(rawStatus)?rawStatus:'ALL') as PublicStatusFilter;
  const category=params.get('category')||'';
  const queryText=params.get('q')||'';
  const [searchDraft,setSearchDraft]=useState({source:queryText,value:queryText});
  const search=searchDraft.source===queryText?searchDraft.value:queryText;
  const setSearch=(value:string)=>setSearchDraft({source:queryText,value});
  const [technology,setTechnology]=useState('');
  const [minCompletion,setMinCompletion]=useState('0');
  const [projects,setProjects]=useState<Project[]>([]);
  const [cursor,setCursor]=useState<ProjectCursor|null>(null);
  const [hasMore,setHasMore]=useState(false);
  const [loading,setLoading]=useState(true);
  const [moreLoading,setMoreLoading]=useState(false);
  const [error,setError]=useState('');
  const sequence=useRef(0);
  useEffect(()=>{const id=++sequence.current;let alive=true;getPublicProjects({status,category,minCompletion:Number(minCompletion)}).then(page=>{if(!alive||id!==sequence.current)return;setProjects(page.projects);setCursor(page.nextCursor);setHasMore(page.hasMore);setError('')}).catch(e=>{if(alive&&id===sequence.current){setError(errorMessage(e));setProjects([])}}).finally(()=>{if(alive&&id===sequence.current)setLoading(false)});return()=>{alive=false}},[status,category,minCompletion]);
  async function loadMore(){if(!cursor||moreLoading)return;setMoreLoading(true);try{const page=await getPublicProjects({status,category,minCompletion:Number(minCompletion),cursor});setProjects(old=>[...old,...page.projects]);setHasMore(page.hasMore);setCursor(page.nextCursor)}catch(e){setError(errorMessage(e))}finally{setMoreLoading(false)}}
  function changeFilter(key:string,value:string){setLoading(true);setParams(old=>{const next=new URLSearchParams(old);if(!value||value==='ALL')next.delete(key);else next.set(key,value);return next})}
  const technologies=Array.from(new Set(projects.flatMap(p=>safeList(p.technologies)))).sort();
  const visible=projects.filter(p=>(p.title+' '+p.description+' '+safeList(p.technologies).join(' ')).toLowerCase().includes(search.toLowerCase())&&(!technology||safeList(p.technologies).includes(technology)));
  return <div className="explore-page"><div className="page-heading-decor">✦ &nbsp; THE PUBLIC GROUNDS &nbsp; / &nbsp; EST. 2026</div><div className="explore-header"><div><h1 className="page-title">The <em>graveyard.</em></h1><p>Walk among the unfinished. Find something worth bringing back.</p></div><div className="explore-actions"><Link to="/github" className="btn btn-outline"><Icon name="github" size={16}/> Live GitHub</Link><Link to="/bury" className="btn btn-primary"><Icon name="plus" size={17}/> Add a tombstone</Link></div></div>
    <div className="explore-band"><span>✝</span><span>HERE LIE GREAT IDEAS. SOME JUST NEED A SECOND CHANCE.</span><span>✝</span></div>
    <section className="filter-house" aria-label="Filter resting places"><div className="filter-heading"><span><Icon name="filter" size={16}/> THE GRAVEKEEPER'S FILTERS</span><small>SEARCH & DISCOVER</small></div><div className="filter-grid"><div className="field field-search"><Icon name="search" size={18}/><input aria-label="Search loaded projects" placeholder="Search names, ideas, stacks..." value={search} onChange={e=>setSearch(e.target.value)}/></div><div className="field"><ThemedSelect ariaLabel="Filter by project status" value={status} onValueChange={v=>changeFilter('status',v)} options={[{value:'ALL',label:'All souls'},{value:'LOOKING_FOR_REVIVAL',label:'Awaiting revival'},{value:'BURIED',label:'At rest'},{value:'UNDER_REVIVAL',label:'Being revived'},{value:'REVIVED',label:'Resurrected'}]}/></div><div className="field"><ThemedSelect ariaLabel="Filter by category" value={category} onValueChange={v=>changeFilter('category',v)} options={[{value:'',label:'Every category'},...categories.map(c=>({value:c,label:c}))]}/></div><div className="field"><ThemedSelect ariaLabel="Filter loaded projects by technology" value={technology} onValueChange={setTechnology} options={[{value:'',label:'All technologies'},...technologies.map(t=>({value:t,label:t}))]}/></div><div className="field"><ThemedSelect ariaLabel="Minimum completion" value={minCompletion} onValueChange={setMinCompletion} options={[...[0,25,50,75].map(x=>({value:String(x),label:x===0?'Any progress':`${x}% or more`})),...(premiumCompletionFilter(tier)?[{value:'80',label:`80% or more · ${tier}`}]:[])]}/></div></div></section>
    {!premiumCompletionFilter(tier)&&<p className="filter-note">The 80%+ precision filter is available to Silver and Gold members. Advanced tombstones remain sealed to free visitors.</p>}<div className="graveyard-toolbar"><div><span className="graveyard-count">{loading?'...':String(visible.length).padStart(2,'0')}</span><span> {loading?'SEARCHING THE GROUNDS':'RESTING PLACES FOUND'}</span></div><button className="clear-filters" type="button" onClick={()=>{setSearch('');setTechnology('');setMinCompletion('0');setParams({})}}>Clear filters <Icon name="refresh" size={14}/></button></div>
    <p className="graveyard-browse-hint">Scroll through the grounds · Select a tombstone to open its complete project memorial.</p>
    {error&&<div className="alert-box mb-5" role="alert"><Icon name="alert" size={18}/>{error}. Ensure Firestore indexes and access rules are deployed.</div>}
    {loading?<div className="grave-grid">{[1,2,3].map(i=><div className="grave-loading" key={i}><div className="skeleton"/><div className="skeleton"/></div>)}</div>:visible.length?<div className="grave-grid">{visible.map(p=><ProjectCard project={p} key={p.id}/>)}</div>:<EmptyGrave title="No souls found on these grounds" description="These filters turned up no resting places. Try a different search, or add your own tombstone." action={false}/>}
    {hasMore&&!loading&&<div className="load-more"><button className="btn btn-outline" disabled={moreLoading} onClick={loadMore}>{moreLoading?'Walking farther...':'Venture deeper'} <Icon name="arrow-right" size={17}/></button></div>}
    <p className="filter-note">Text and technology search apply to loaded pages. Status, category, and minimum completion are filtered server-side; use “Venture deeper” to browse further.</p>
  </div>;
}
