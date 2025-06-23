import React, { useRef } from 'react';
import URLForm from '../components/URLForm';
import URLList from '../components/URLList';

function App() {
  const listRef = useRef();

  const handleShorten = (shortUrl) => {
    if (listRef.current?.refresh) {
      listRef.current.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <URLForm onShorten={handleShorten} />
        <URLList ref={listRef} />
      </div>
    </div>
  );
}

export default App;
