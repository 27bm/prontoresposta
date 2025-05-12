
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Toaster } from '@/components/ui/sonner'
import Index from './pages/Index'
import SuspectsPage from './pages/SuspectsPage'
import DocumentsPage from './pages/DocumentsPage'
import SchedulePage from './pages/SchedulePage'
import ReleasePage from './pages/ReleasePage'
import ShortcutsPage from './pages/ShortcutsPage'
import ForumPage from './pages/ForumPage'
import NotFound from './pages/NotFound'
import { SuspectProvider } from './contexts/SuspectContext'
import { DocumentProvider } from './contexts/DocumentContext'
import { ScheduleProvider } from './contexts/ScheduleContext'
import { AppShortcutProvider } from './contexts/AppShortcutContext'
import { ReleaseProvider } from './contexts/ReleaseContext'

function App() {
  return (
    <>
      <SuspectProvider>
        <DocumentProvider>
          <ScheduleProvider>
            <AppShortcutProvider>
              <ReleaseProvider>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Index />} />
                    <Route path="suspects" element={<SuspectsPage />} />
                    <Route path="documents" element={<DocumentsPage />} />
                    <Route path="schedule" element={<SchedulePage />} />
                    <Route path="release" element={<ReleasePage />} />
                    <Route path="shortcuts" element={<ShortcutsPage />} />
                    <Route path="forum" element={<ForumPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </ReleaseProvider>
            </AppShortcutProvider>
          </ScheduleProvider>
        </DocumentProvider>
      </SuspectProvider>
      <Toaster position="bottom-center" />
    </>
  )
}

export default App
