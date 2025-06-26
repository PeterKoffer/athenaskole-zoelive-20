
import React, { useEffect } from 'react';
import AdaptivePracticeHeader from './components/AdaptivePracticeHeader';
import AdaptivePracticeContent from './components/AdaptivePracticeContent';

const AdaptivePracticeModule: React.FC = () => {
  useEffect(() => {
    console.log("AdaptivePracticeModule: MOUNTED AND RUNNING SIMPLE LOG FROM CORRECT LOCATION");
  }, []);

  return (
    <div>
      <AdaptivePracticeHeader />
      <AdaptivePracticeContent />
    </div>
  );
};

export default AdaptivePracticeModule;
