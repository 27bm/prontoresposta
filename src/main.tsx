
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import App from './App.tsx'
import './index.css'

// Set global variable to hide the badge directly
if (typeof window !== 'undefined') {
  window.__LOVABLE_CONFIG__ = {
    ...window.__LOVABLE_CONFIG__,
    hideBadge: true
  };
}

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="system">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
);
