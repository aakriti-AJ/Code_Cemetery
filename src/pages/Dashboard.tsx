import {useEffect,useState} from 'react';
import {Link} from 'react-router';
import {useAuth} from '../context/useAuth';
import {getMyProjects} from '../services/project.service';
import {getReceivedProposals,getSentProposals} from '../services/revival.service';
import type {Project} from '../types/project';
import type {RevivalProposal} from '../types/revival';
import {errorMessage,readableDate,statusClass,statusLabel} from '../lib/display';
import Icon from '../components/Icon';
import PageBanner from '../components/PageBanner';
import EmptyGrave from '../components/EmptyGrave';

export default function Dashboard(){
  const {userProfile,currentUser}=useAuth();
  const [projects,setProjects]=useState<Project[]>([]);
  const [received,setReceived]=useState<RevivalProposal[]>([]);
  const [sent,setSent]=useState<RevivalProposal[]>([]);
  const [loading,setLoading]=useState(true);const [error,setError]=useState('');
  useEffect(()=>{let alive=true;Promise.all([getMyProjects(),getReceivedProposals(),getSentProposals()]).then(([p,r,s])=>{if(alive){setProjects(p);setReceived(r);setSent(s)}}).catch(e=>{if(alive)setError(errorMessage(e))}).finally(()=>{if(alive)setLoading(false)});return()=>{alive=false}},[]);
  const pending=received.filter(r=>r.status==='PENDING').length;
  const stats=[{label:'RESTING PLACES',value:projects.length,icon:'archive' as const},{label:'AWAITING REVIVAL',value:projects.filter(p=>p.status==='LOOKING_FOR_REVIVAL').length,icon:'spark' as const},{label:'NEW REQUESTS',value:pending,icon:'inbox' as const},{label:'YOUR PROPOSALS',value:sent.length,icon:'send' as const}];
  return <div className="dashboard-page"><PageBanner eyebrow="YOUR PRIVATE GROUNDS / THE CRYPT" title={`Welcome back, ${(userProfile?.name||currentUser?.displayName||'Gravekeeper').split(' ')[0]}.`} description="Every forgotten idea has a place here. Here's what's happening in yours."/>
    <div className="r3-dashboard-tools"><Link to="/github-import"><Icon name="github" size={18}/> Import my GitHub repositories <Icon name="arrow-right" size={16}/></Link><Link to="/stars"><Icon name="star" size={18}/> Understand my stars <Icon name="arrow-right" size={16}/></Link><Link to="/community"><Icon name="users" size={18}/> Follow developers <Icon name="arrow-right" size={16}/></Link></div>
    <div className="dash-actions"><div><span className="eyebrow">THE KEEPER'S OVERVIEW</span><h2>Your afterlife, at a glance.</h2></div><Link to="/bury" className="btn btn-primary"><Icon name="plus" size={16}/> Bury new project</Link></div>
    {error&&<div className="alert-box mb-5">{error}</div>}
    <div className="crypt-stat-grid">{stats.map(s=><div className="crypt-stat" key={s.label}><span className="crypt-stat-icon"><Icon name={s.icon} size={19}/></span><strong>{loading?'—':String(s.value).padStart(2,'0')}</strong><span>{s.label}</span></div>)}</div>
    <div className="crypt-columns"><section className="crypt-panel"><div className="crypt-panel-heading"><div><span className="eyebrow">OWNED BY YOU</span><h3>Your resting places</h3></div><Link className="small-link" to="/bury">New <Icon name="plus" size={15}/></Link></div>{loading?<div className="skeleton"/>:projects.length?projects.map(p=><div className="crypt-project" key={p.id}><div className="crypt-mini-stone">✝</div><div><Link to={`/project/${p.id}`}>{p.title}</Link><small>{p.category} · {p.completionPercentage}% complete · {readableDate(p.createdAt)}</small></div><span className={`status-pill ${statusClass[p.status]}`}>{statusLabel[p.status]}</span><Link className="icon-button" to={['DRAFT','BURIED','LOOKING_FOR_REVIVAL'].includes(p.status)?`/projects/${p.id}/edit`:`/project/${p.id}`} aria-label={`View ${p.title}`}><Icon name="arrow-right" size={15}/></Link></div>):<EmptyGrave title="Your crypt is still empty" description="No projects buried yet. Create the first tombstone in your collection."/>}</section><div className="crypt-side"><section className="crypt-side-panel"><span className="eyebrow">THE REVIVAL BELL</span><div className="crypt-inbox-number">{String(pending).padStart(2,'0')} <span>pending<br/>requests</span></div><h3>Someone may be knocking.</h3><p>Review developers who want to resurrect your abandoned creations.</p><Link to="/proposals" className="btn btn-dark w-full">Open revival inbox <Icon name="arrow-right" size={16}/></Link></section><section className="crypt-side-panel muted-panel"><span className="eyebrow">BEYOND YOUR GROUNDS</span><h3>Find your next resurrection.</h3><p>Thousands of ideas begin with a single curious developer. Find yours in the cemetery.</p><Link className="text-link" to="/explore">Wander the graveyard <Icon name="arrow-right" size={15}/></Link></section></div></div>
  </div>;
}
