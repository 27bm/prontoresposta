
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Toaster } from '@/components/ui/sonner'
import Index from './pages/Index'
import SuspectsPage from './pages/SuspectsPage'
import DocumentsPage from './pages/DocumentsPage'
import SchedulePage from './pages/SchedulePage'
import ShortcutsPage from './pages/ShortcutsPage'
import TafPage from './pages/TafPage'
import ForumPage from './pages/ForumPage'
import NotFound from './pages/NotFound'
import { SuspectProvider } from './contexts/SuspectContext'
import { DocumentProvider } from './contexts/DocumentContext'
import { ScheduleProvider } from './contexts/ScheduleContext'
import { AppShortcutProvider } from './contexts/AppShortcutContext'

function App() {
  return (
    <>
      <SuspectProvider>
        <DocumentProvider>
          <ScheduleProvider>
            <AppShortcutProvider>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Index />} />
                  <Route path="suspects" element={<SuspectsPage />} />
                  <Route path="documents" element={<DocumentsPage />} />
                  <Route path="schedule" element={<SchedulePage />} />
                  <Route path="shortcuts" element={<ShortcutsPage />} />
                  <Route path="taf" element={<TafPage />} />
                  <Route path="forum" element={<ForumPage />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </AppShortcutProvider>
          </ScheduleProvider>
        </DocumentProvider>
      </SuspectProvider>
      <Toaster position="bottom-center" />
    </>
  )
}

export default App
