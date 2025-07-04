import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import AtomList from './components/content/AtomList';
import ContentCreationPage from './pages/ContentCreationPage';
import KnowledgeComponentPage from './pages/KnowledgeComponentPage';
import LearnerProfilePage from './pages/LearnerProfilePage';
import GameSelectionPage from './pages/GameSelectionPage';
import GamePage from './pages/GamePage';
import CurriculumDemo from './components/curriculum/CurriculumDemo';
import GlobalCurriculumExplorer from './components/curriculum/GlobalCurriculumExplorer';

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Routes>
            <Route path="/" element={<ContentCreationPage />} />
            <Route path="/content" element={<ContentCreationPage />} />
            <Route path="/content/create" element={<ContentCreationPage />} />
            <Route path="/content/atoms" element={<AtomList />} />
            <Route path="/knowledge-components" element={<KnowledgeComponentPage />} />
            <Route path="/learner-profile" element={<LearnerProfilePage />} />
            <Route path="/games" element={<GameSelectionPage />} />
            <Route path="/games/:gameId" element={<GamePage />} />
            <Route path="/curriculum/demo" element={<CurriculumDemo />} />
            <Route path="/curriculum/global" element={<GlobalCurriculumExplorer />} />
          </Routes>
        </div>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
