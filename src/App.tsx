
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import HomePage from './pages/HomePage';
import CurriculumDemo from './components/curriculum/CurriculumDemo';
import GlobalCurriculumExplorer from './components/curriculum/GlobalCurriculumExplorer';
import AdaptiveLearningDemo from './pages/AdaptiveLearningDemo';

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/curriculum/demo" element={<CurriculumDemo />} />
            <Route path="/curriculum/global" element={<GlobalCurriculumExplorer />} />
            <Route path="/adaptive-learning-demo" element={<AdaptiveLearningDemo />} />
          </Routes>
        </div>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
