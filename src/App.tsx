
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SuspectProvider } from "@/contexts/SuspectContext";
import { MapProvider } from "@/contexts/MapContext";
import { DocumentProvider } from "@/contexts/DocumentContext";
import { ScheduleProvider } from "@/contexts/ScheduleContext";
import { AppShortcutProvider } from "@/contexts/AppShortcutContext";

import SuspectsPage from "@/pages/SuspectsPage";
import MapPage from "@/pages/MapPage";
import DocumentsPage from "@/pages/DocumentsPage";
import SchedulePage from "@/pages/SchedulePage";
import ShortcutsPage from "@/pages/ShortcutsPage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SuspectProvider>
        <MapProvider>
          <DocumentProvider>
            <ScheduleProvider>
              <AppShortcutProvider>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Index />} />
                    <Route path="/suspects" element={<SuspectsPage />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/documents" element={<DocumentsPage />} />
                    <Route path="/schedule" element={<SchedulePage />} />
                    <Route path="/shortcuts" element={<ShortcutsPage />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppShortcutProvider>
            </ScheduleProvider>
          </DocumentProvider>
        </MapProvider>
      </SuspectProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
