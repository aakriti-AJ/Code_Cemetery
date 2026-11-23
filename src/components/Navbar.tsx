import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../context/useAuth';
import { useTheme } from '../context/useTheme';
import { logoutUser } from '../services/auth.service';
import TombstoneMark from './TombstoneMark';
import Icon from './Icon';

const publicLinks = [
  { name: 'Graveyard', to: '/explore' },
  { name: 'GitHub', to: '/github' },
  { name: 'Developers', to: '/community' },
  { name: 'Journal', to: '/newsletters' },
  { name: 'Star atlas', to: '/stars' },
] as const;
const privateLinks = [
  { name: 'My crypt', to: '/dashboard', icon: 'layers' as const },
  { name: 'My GitHub imports', to: '/github-import', icon: 'github' as const },
  { name: 'Revival intelligence', to: '/intelligence', icon: 'activity' as const },
  { name: 'Gold marketplace', to: '/marketplace', icon: 'star' as const },
  { name: 'Admin studio', to: '/admin', icon: 'shield' as const },
  { name: 'Bury a project', to: '/bury', icon: 'plus' as const },
  { name: 'Revival requests', to: '/proposals', icon: 'inbox' as const },
  { name: 'Saved souls', to: '/bookmarks', icon: 'bookmark' as const },
  { name: 'Notifications', to: '/notifications', icon: 'bell' as const },
  { name: 'My identity', to: '/profile', icon: 'user' as const },
];
export default function Navbar(){
  const {currentUser, userProfile, loading} = useAuth();
  const {theme,toggleTheme} = useTheme();
  const navigate = useNavigate();
  const [open,setOpen]=useState(false);
  const [search,setSearch]=useState('');
  const [signingOut,setSigningOut]=useState(false);
  useEffect(()=>{
    if(!open)return;
    const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};
    window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close);
  },[open]);
  function searchSubmit(e:FormEvent){e.preventDefault();navigate(search.trim()?`/explore?q=${encodeURIComponent(search.trim())}`:'/explore');setOpen(false)}
  async function logout(){setSigningOut(true);try{await logoutUser();navigate('/')}catch(e){window.alert(e instanceof Error?e.message:'Could not sign out.')}finally{setSigningOut(false);setOpen(false)}}
  const signedIn = !loading && !!currentUser;
  return <>
    <div className="site-header-wrap"><header className="site-header">
      <div className="header-brand-wrap">
        <button type="button" className="header-menu icon-button" aria-expanded={open} aria-controls="cemetery-drawer" aria-label={open?'Close navigation':'Open navigation'} onClick={()=>setOpen(x=>!x)}><Icon name={open?'close':'menu'} size={21}/></button>
        <Link className="brand" to="/" aria-label="Code Cemetery home"><span className="brand-icon"><TombstoneMark size={29}/></span><span className="brand-title">CODE<span>CEMETERY</span><small>WHERE IDEAS REST · PRE-ALPHA R5</small></span></Link>
      </div>
      <nav className="header-nav" aria-label="Main pages">{publicLinks.map(link=><NavLink key={link.to} className={({isActive})=>`header-link ${isActive?'active':''}`} to={link.to}>{link.name}</NavLink>)}{signedIn&&<NavLink to="/dashboard" className={({isActive})=>`header-link ${isActive?'active':''}`}>My crypt</NavLink>}</nav>
      <div className="header-actions">
        <form className="header-search" onSubmit={searchSubmit} role="search"><Icon name="search" size={16}/><input aria-label="Search project graveyard" placeholder="Search the dead..." value={search} onChange={e=>setSearch(e.target.value)} maxLength={120}/><kbd>↵</kbd></form>
        <div className="realm-switch" role="group" aria-label="Choose atmosphere"><button aria-pressed={theme==='light'} onClick={()=>theme==='dark'&&toggleTheme()} type="button" className={theme==='light'?'selected':''} title="Heaven Mode"><Icon name="sun" size={16}/><span>Heaven Mode</span></button><button aria-pressed={theme==='dark'} onClick={()=>theme==='light'&&toggleTheme()} type="button" className={theme==='dark'?'selected':''} title="Hell Mode"><Icon name="moon" size={16}/><span>Hell Mode</span></button></div>
        {signedIn?<Link to="/profile" className="header-avatar" aria-label="Your profile">{(userProfile?.name||currentUser?.displayName||'D').slice(0,1).toUpperCase()}</Link>:!loading?<div className="header-auth-links"><Link className="header-login" to="/login">Sign in</Link><Link className="header-register" to="/register">Join <Icon name="arrow-right" size={14}/></Link></div>:null}
      </div>
    </header></div>
    {open&&<button type="button" className="drawer-overlay" aria-label="Dismiss menu" onClick={()=>setOpen(false)}/>}
    <aside className={`cemetery-drawer ${open?'open':''}`} id="cemetery-drawer" aria-label="Cemetery directory" aria-hidden={!open}>
      <div className="drawer-heading"><div><span className="eyebrow">THE DIRECTORY</span><h2>Find your way.</h2></div><button className="icon-button" onClick={()=>setOpen(false)} type="button" aria-label="Close directory"><Icon name="close" size={18}/></button></div>
      <form className="drawer-search" onSubmit={searchSubmit}><Icon name="search" size={17}/><input placeholder="Search for a resting place" value={search} onChange={e=>setSearch(e.target.value)}/><button type="submit" aria-label="Search"><Icon name="arrow-right" size={17}/></button></form>
      <div className="drawer-nav"><div className="drawer-caption">PUBLIC GROUNDS</div>{publicLinks.map(l=><NavLink tabIndex={open?0:-1} key={l.to} to={l.to} onClick={()=>setOpen(false)}><Icon name={l.to==='/github'?'github':l.to==='/stars'?'star':l.to==='/newsletters'?'book':'compass'} size={17}/>{l.name}<Icon name="arrow-right" size={14}/></NavLink>)}
        {signedIn&&<><div className="drawer-caption mt-7">YOUR AFTERLIFE</div>{privateLinks.map(l=><NavLink tabIndex={open?0:-1} key={l.to} to={l.to} onClick={()=>setOpen(false)}><Icon name={l.icon} size={17}/>{l.name}<Icon name="arrow-right" size={14}/></NavLink>)}</>}
      </div>
      <div className="drawer-bottom">{signedIn?<><div className="drawer-user">{userProfile?.name||currentUser?.email||'Developer'}</div><button type="button" disabled={signingOut} onClick={logout} className="drawer-signout"><Icon name="log-out" size={17}/> {signingOut?'Signing out...':'Sign out'}</button></>:<><p>Every project has a story. Yours starts here.</p><Link to="/register" onClick={()=>setOpen(false)} className="btn btn-primary w-full">Enter the cemetery <Icon name="arrow-right" size={16}/></Link></>}</div>
    </aside>
  </>;
}
