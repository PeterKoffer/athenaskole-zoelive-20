import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="p-4 text-white"> {/* Added text-white for visibility on dark background */}
      <h1 className="text-2xl font-bold">Minimal Test Page</h1>
      <p>If you see this, basic rendering and routing to /test are working.</p>
      <button
        onClick={() => console.log('TestPage button clicked!')}
        className="mt-4 p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
      >
        Click Me for Console Log
      </button>
    </div>
  );
};

export default TestPage;
