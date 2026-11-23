import {Link} from 'react-router';
import Icon from './Icon';
export default function EmptyGrave({title='A peaceful resting place',description='No projects have been laid to rest here yet. Be the first to write an epitaph.',action=true}:{title?:string;description?:string;action?:boolean}){
  return <div className="grave-empty"><div className="grave-empty-stone"><span>?</span><small>RESTING PLACE</small></div><div><span className="eyebrow">NO HEADSTONES FOUND</span><h3>{title}</h3><p>{description}</p>{action&&<Link className="btn btn-primary" to="/bury">Bury a project <Icon name="arrow-right" size={16}/></Link>}</div></div>;
}
