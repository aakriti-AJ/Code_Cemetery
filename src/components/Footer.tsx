import { Link } from 'react-router';
import TombstoneMark from './TombstoneMark';
export default function Footer(){return <footer className="site-footer"><div className="footer-left"><TombstoneMark size={28}/><div><strong>CODE CEMETERY</strong><span>Some endings are just beginnings in disguise.</span></div></div><div className="footer-right"><Link to="/explore">Graveyard</Link><Link to="/github">GitHub</Link><Link to="/stars">Stars explained</Link><Link to="/bury">Bury a project</Link><span>PRE-ALPHA R3 · {new Date().getFullYear()}</span></div></footer>}
