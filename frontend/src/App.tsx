import { useState } from 'react';
import { UrlSubmissionForm } from './components/UrlSubmissionForm';
import { UrlList } from './components/UrlList';
import { ContentModal } from './components/ContentModal';

function App() {
  const [selectedUrlId, setSelectedUrlId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="app-container">
      <header>
        <h1>URL Fetcher Gateway</h1>
        <p>Submit URLs and view their fetched content.</p>
      </header>

      <main>
        <section className="card">
          <h2>Submit URLs</h2>
          <UrlSubmissionForm onSuccess={handleSuccess} />
        </section>

        <section className="card">
          <h2>Submitted URLs</h2>
          <UrlList
            onViewContent={(id) => setSelectedUrlId(id)}
            refreshTrigger={refreshTrigger}
          />
        </section>
      </main>

      <ContentModal
        urlId={selectedUrlId}
        onClose={() => setSelectedUrlId(null)}
      />
    </div>
  );
}

export default App;
