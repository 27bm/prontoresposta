
import React from 'react';
import { Header } from './Header';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

export function Layout() {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className={`flex-1 p-4 ${isMobile ? 'pb-24' : 'pb-20'} max-w-screen-lg mx-auto w-full`}>
        <Outlet />
      </main>
      <Navbar />
    </div>
  );
}
