import {useTheme} from '../context/useTheme';
import CemeteryScene from './CemeteryScene';
export default function PageBanner({eyebrow,title,description}:{eyebrow:string;title:string;description:string}){const {theme}=useTheme();return <div className="page-banner"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p><span className="banner-realm">✦ {theme==='dark'?'UNDER A MIDNIGHT SKY':'IN THE MORNING LIGHT'}</span></div><CemeteryScene compact/></div>}
