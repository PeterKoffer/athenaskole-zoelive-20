
import React from 'react';
import AdaptivePracticeModule from '@/components/adaptive-learning/AdaptivePracticeModule';

const AdaptivePracticeTestPage: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Adaptive Practice Module Test Page</h1>
      <p>This page is for testing the end-to-end flow of the adaptive practice module.</p>
      <hr style={{ margin: '20px 0' }} />
      <AdaptivePracticeModule />
    </div>
  );
};

export default AdaptivePracticeTestPage;
