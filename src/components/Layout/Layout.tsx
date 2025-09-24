import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PageTransition from './PageTransition';
import AnimatedBackground from '../UI/AnimatedBackground';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary transition-colors flex flex-col relative isolate overflow-hidden">
      <AnimatedBackground />
      
      <Header />
      <main className="flex-1 z-10">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
