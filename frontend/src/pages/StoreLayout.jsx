import { Outlet } from 'react-router-dom';
import TopMarquee from '../components/TopMarquee';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

const StoreLayout = () => (
  <div className="app">
    <ScrollToTop />
    <TopMarquee />
    <Navbar />
    <div className="page-content">
      <Outlet />
    </div>
    <Footer />
  </div>
);

export default StoreLayout;
