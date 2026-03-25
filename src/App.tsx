import { useState } from 'react';
import Header from './components/Header';
import HistorySearchView from './components/views/HistorySearchView';
import { isApiKeyConfigured } from './services/api';
import type { AppView } from './types/nyt';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('current');

  const apiKeyMissing = !isApiKeyConfigured();

  const renderView = () => {
    switch (currentView) {
      default:
        return <HistorySearchView />;
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
            Asegúrate de tener un archivo .env con VITE_NYT_API_KEY configurado.
          </div>
        ) : (
          <>
            {/* Navegación interna minimalista */}
            <nav className="inline-nav" style={{ 
              display: 'flex', 
              gap: '1.5rem', 
              justifyContent: 'center', 
              marginBottom: '2rem',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '1rem'
            }}>
              <button 
                onClick={() => setCurrentView('current')}
                className={`nav-link-btn ${currentView === 'current' ? 'active' : ''}`}
                style={{
                  background: 'none',
                  border: 'none',
                  color: currentView === 'current' ? 'var(--accent-color)' : 'var(--meta-text)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: currentView === 'current' ? 'bold' : 'normal',
                  fontFamily: 'inherit'
                }}
              >
                Best Sellers
              </button>
              <button 
                onClick={() => setCurrentView('history-search')}
                className={`nav-link-btn ${currentView === 'history-search' ? 'active' : ''}`}
                style={{
                  background: 'none',
                  border: 'none',
                  color: currentView === 'history-search' ? 'var(--accent-color)' : 'var(--meta-text)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: currentView === 'history-search' ? 'bold' : 'normal',
                  fontFamily: 'inherit'
                }}
              >
                Buscador
              </button>
            </nav>

            <div className="view-transition-wrapper">
              {renderView()}
            </div>
          </>
        )}
      </main>
    </>
  );
}