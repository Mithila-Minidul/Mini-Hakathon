// src/layouts/MainLayout.jsx
// Wraps pages with a common Navbar + Footer shell

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__main">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
