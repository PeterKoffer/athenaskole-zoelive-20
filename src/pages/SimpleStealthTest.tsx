import React from 'react';

const SimpleStealthTest: React.FC = () => {
  return (
    <div className="p-4 text-white"> {/* Added text-white for visibility on dark background */}
      <h1 className="text-2xl font-bold">Simple Stealth Test Page</h1>
      <p>This is a placeholder page for a route imported from the main branch.</p>
      <p>Its primary purpose here is to resolve a build error in App.tsx.</p>
    </div>
  );
};

export default SimpleStealthTest;
