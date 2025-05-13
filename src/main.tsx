
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import App from './App.tsx'
import './index.css'

// Create a custom BrowserRouter that includes the forceHideBadge parameter
const CustomBrowserRouter = ({ children }: { children: React.ReactNode }) => {
  // Check if the URL already has the parameter
  const url = new URL(window.location.href);
  
  if (!url.searchParams.has('forceHideBadge')) {
    // Add the parameter to hide the badge
    url.searchParams.set('forceHideBadge', 'true');
    
    // If we're on the homepage or any other page, preserve the current path
    const currentPath = window.location.pathname + url.search;
    
    return <Navigate to={currentPath} replace />;
  }
  
  return <>{children}</>;
};

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="system">
    <BrowserRouter>
      <CustomBrowserRouter>
        <App />
      </CustomBrowserRouter>
    </BrowserRouter>
  </ThemeProvider>
);
