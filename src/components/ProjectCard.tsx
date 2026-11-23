import { Link } from 'react-router';
import {useEffect,useRef} from 'react';
import {trackProject} from '../services/metrics.service';
import type { Project } from '../types/project';
import {safeList,statusClass,statusLabel} from '../lib/display';
import Icon from './Icon';

/** A real tombstone silhouette, not a rectangular card with an icon attached. */
export default function ProjectCard({project}:{project:Project}){
  const progress=Math.max(0,Math.min(100,project.completionPercentage));
  const stoneRef=useRef<HTMLAnchorElement>(null);
  useEffect(()=>{const target=stoneRef.current;if(!target||!('IntersectionObserver' in window))return;const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){void trackProject(project.id,'impression');observer.disconnect()}},{threshold:.4});observer.observe(target);return()=>observer.disconnect()},[project.id]);
  return <article className="grave-plot">
    <Link ref={stoneRef} onClick={()=>void trackProject(project.id,'click')} className="headstone" to={`/project/${project.id}`} aria-label={`Visit tombstone for ${project.title}`}>
      <span className="stone-inner-border" aria-hidden="true"/>
      <span className="stone-insignia" aria-hidden="true">✧</span>
      <span className="stone-rip">{project.locked?'SILVER +':'R.I.P.'}</span>
      <span className="stone-ornament" aria-hidden="true">◆ ─── ◆</span>
      <span className="stone-name">{project.title}</span>
      <span className="stone-epitaph">{project.category}</span>
      <span className="stone-rule"/>
      <span className="stone-progress">{progress}<small>%</small><em>BUILT BEFORE REST</em></span>
      <span className="stone-footer">{project.locked?'SEALED MEMORIAL':project.status==='REVIVED'?'BACK FROM THE DEAD':'GONE, NOT FORGOTTEN'}</span>
    </Link>
    <div className="grave-soil" aria-hidden="true"><span/><span/><span/></div>
    <div className="grave-plaque"><div className="grave-plaque-top"><span className={`status-pill ${statusClass[project.status]}`}><span className="status-dot"/>{statusLabel[project.status]}</span><Icon name="arrow-right" size={16}/></div><p>{project.description}</p><div className="grave-tech">{safeList(project.technologies).slice(0,3).map(t=><span key={t}>{t}</span>)}</div><Link to={`/project/${project.id}`} onClick={()=>void trackProject(project.id,'click')} className="grave-view">Read the epitaph <Icon name="arrow-right" size={15}/></Link></div>
  </article>;
}
