import { useState } from 'react';
import Header from './components/Header';
import NavBar from './components/NavBar';
import CurrentListView from './components/views/CurrentListView';
import HistorySearchView from './components/views/HistorySearchView';
import { isApiKeyConfigured } from './services/api';
import type { AppView } from './types/nyt';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('current');

  const apiKeyMissing = !isApiKeyConfigured();

  const renderView = () => {
    switch (currentView) {
      case 'history-search':
        return <HistorySearchView />;
      default:
        return <CurrentListView />;
    }
  };

  return (
    <>
      <Header />
      <main id="content">
        {apiKeyMissing ? (
          <div className="error-msg">
            <strong>¡Error Crítico!</strong><br /><br />
            No se pudo cargar la API_KEY desde las variables de entorno. 
            Asegúrate de tener un archivo .env con VITE_API_KEY configurado.
          </div>
        ) : (
          <>
            <NavBar currentView={currentView} onNavigate={setCurrentView} />
            <div style={{ marginTop: '2rem' }}>
              {renderView()}
            </div>
          </>
        )}
      </main>
    </>
  );
}