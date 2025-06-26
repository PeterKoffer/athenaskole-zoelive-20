
// src/pages/AdaptivePracticeTestPage.tsx
import React, { useEffect } from 'react';

const AdaptivePracticeTestPage: React.FC = () => {
  useEffect(() => {
    console.log("AdaptivePracticeTestPage: MOUNTED AND LOGGING");
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: 'lightgreen', minHeight: '100vh' }}>
      <h1>Adaptive Practice Test Page - BASIC RENDER SUCCESS</h1>
      <p>If you see this, the test page itself is rendering correctly.</p>
    </div>
  );
};

export default AdaptivePracticeTestPage;
