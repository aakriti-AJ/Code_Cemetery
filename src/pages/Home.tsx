import {useEffect,useState} from 'react';
import {Link} from 'react-router';
import {useTheme} from '../context/useTheme';
import {getPublicProjects} from '../services/project.service';
import {isPreviewMode} from '../lib/firebase';
import type {Project} from '../types/project';
import ProjectCard from '../components/ProjectCard';
import CemeteryScene from '../components/CemeteryScene';
import EmptyGrave from '../components/EmptyGrave';
import Icon from '../components/Icon';

const chapters=[
 {number:'01',icon:'archive' as const,title:'Give it a resting place',text:'Create a real tombstone for unfinished software. Share the technical story, the progress and why it stopped.'},
 {number:'02',icon:'github' as const,title:'Bring your GitHub projects',text:'Connect a verified GitHub account and select public repositories to import as private drafts.'},
 {number:'03',icon:'spark' as const,title:'Find the next chapter',text:'Explore revival opportunities, meet developers, and uncover abandoned code worth another look.'},
];
export default function Home(){
 const [projects,setProjects]=useState<Project[]>([]);
 const [loading,setLoading]=useState(true);
 const {theme}=useTheme();
 useEffect(()=>{let alive=true;getPublicProjects({status:'ALL',category:''}).then(r=>{if(alive)setProjects(r.projects.slice(0,3))}).catch(()=>{}).finally(()=>{if(alive)setLoading(false)});return()=>{alive=false}},[]);
 return <div className="home-page home-r3">
  <section className="hero-graveyard" aria-labelledby="hero-heading">
   <div className="hero-micro"><span className="pulse-point"/> DIGITAL MEMORIAL GROUNDS <span className="hero-micro-line"/> AN OPEN AFTERLIFE FOR UNFINISHED SOFTWARE <span className="hero-release">PRE-ALPHA · R5</span></div>
   <div className="hero-grid"><div className="hero-content">
    <span className="hero-overline"><span className="hero-asterisk">✦</span> THE CODE CEMETERY PROJECT</span>
    <h1 id="hero-heading">Not all code<br/>is meant to <span>die.</span></h1>
    <p>For the ideas left half-built, the repositories gathering dust, and the software that deserves a second chapter. Welcome to the afterlife of code.</p>
    <div className="hero-ctas"><Link to="/explore" className="btn btn-primary">Enter the graveyard <Icon name="arrow-right" size={17}/></Link><Link to="/github" className="btn btn-ghost"><Icon name="github" size={18}/> Explore GitHub</Link></div>
    <div className="hero-small-detail"><span className="hero-line"/><span>REMEMBER THE IDEA. REVIVE THE CODE.</span></div>
   </div><div className="hero-visual"><CemeteryScene/><div className="scene-sticker"><span>THE GATES ARE</span><strong>OPEN</strong><small>COME AS YOU ARE</small></div><div className="hero-scene-caption"><span className="hero-scene-caption-dot"/> {theme==='dark'?'MIDNIGHT / HELL MODE':'SUNRISE / HEAVEN MODE'} <span>EST. MMXXVI</span></div></div></div>
   <div className="hero-bottom"><span><Icon name="shield" size={14}/> BUILT FOR DEVELOPERS, BY DEVELOPERS</span><span><Icon name={theme==='dark'?'moon':'sun'} size={14}/> YOU ARE IN {theme==='dark'?'HELL':'HEAVEN'} MODE</span><Link to="/stars">MEET THE CONSTELLATIONS <Icon name="arrow-right" size={14}/></Link></div>
  </section>
  {isPreviewMode&&<div className="preview-notice"><Icon name="info" size={19}/><div><strong>Showcase mode.</strong> The tombstones shown below are sample records. Google/GitHub login and publishing require your Firebase configuration. <Link to="/github">The public GitHub explorer works now</Link>, without Firebase.</div></div>}
  <section className="r3-quicklinks" aria-label="Explore Code Cemetery">
   <Link to="/explore" className="r3-quicklink"><span className="r3-quicklink-icon"><Icon name="compass" size={22}/></span><span><small>01 / DISCOVER</small><strong>The graveyard</strong><em>Browse resting places</em></span><Icon name="arrow-right" size={18}/></Link>
   <Link to="/github" className="r3-quicklink"><span className="r3-quicklink-icon"><Icon name="github" size={22}/></span><span><small>02 / SOURCE</small><strong>GitHub archives</strong><em>Live public repositories</em></span><Icon name="arrow-right" size={18}/></Link>
   <Link to="/stars" className="r3-quicklink"><span className="r3-quicklink-icon"><Icon name="star" size={22}/></span><span><small>03 / IDENTITY</small><strong>The star atlas</strong><em>Know every badge</em></span><Icon name="arrow-right" size={18}/></Link>
  </section>
  <section id="resting-places" className="section-graves"><div className="section-heading"><div><div className="eyebrow section-overline">✦ &nbsp; FROM THE PUBLIC GROUNDS</div><h2>Recently <em>laid to rest.</em></h2><p>Each headstone is a project. Each project has a reason. Each reason could be a new beginning.</p></div><Link className="section-view-all" to="/explore">View all tombstones <Icon name="arrow-right" size={17}/></Link></div>
   {loading?<div className="grave-grid">{[1,2,3].map(i=><div key={i} className="grave-loading"><div className="skeleton"/><div className="skeleton"/></div>)}</div>:projects.length?<div className="grave-grid">{projects.map(p=><ProjectCard project={p} key={p.id}/>)}</div>:<EmptyGrave/>}
  </section>
  <section className="r3-quote"><div className="r3-quote-symbol">“</div><div><span className="eyebrow">THE CEMETERY PHILOSOPHY</span><h2>An abandoned project is not a failed story. <em>It is an unfinished one.</em></h2></div><Link to="/community" className="btn btn-outline">Meet the builders <Icon name="arrow-right" size={17}/></Link></section>
  <section className="how-section r3-process"><div className="section-heading"><div><div className="eyebrow section-overline">THE JOURNEY / HOW IT WORKS</div><h2>From archive <em>to afterlife.</em></h2><p>Designed for the people, history and possibility behind every unfinished build.</p></div></div><div className="r3-process-grid">{chapters.map(c=><article className="r3-process-card" key={c.number}><div className="r3-process-top"><span>{c.number} /</span><Icon name={c.icon} size={24}/></div><h3>{c.title}</h3><p>{c.text}</p></article>)}</div></section>
  <section className="r3-final-cta"><div className="r3-final-text"><span className="eyebrow">YOUR STORY ISN'T OVER YET</span><h2>Let your code<br/><em>live beyond you.</em></h2><p>Share your unfinished projects, discover another developer's idea, and give forgotten builds a place in the world.</p><div className="r3-final-actions"><Link to="/bury" className="btn btn-primary">Create a tombstone <Icon name="arrow-right" size={17}/></Link><Link to="/newsletters" className="btn btn-outline">Read the journal</Link></div></div><div className="r3-final-icon" aria-hidden="true">✧</div></section>
 </div>;
}
