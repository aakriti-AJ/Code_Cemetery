import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackendNotice from '../components/BackendNotice';
export default function MainLayout(){return <div className="app-shell"><Navbar/><div className="main-column"><BackendNotice/><main className="content"><Outlet/></main><Footer/></div></div>}
