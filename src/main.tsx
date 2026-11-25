import '@fontsource/mukta/latin-400.css';
import '@fontsource/mukta/latin-ext-400.css';
import '@fontsource/mukta/latin-500.css';
import '@fontsource/mukta/latin-600.css';
import '@fontsource/mukta/latin-700.css';
import '@fontsource/mukta/latin-800.css';
import '@fontsource/kalam/latin-400.css';
import './styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { ArtDefs } from './components/Art';
import { StoreProvider } from './state';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <ArtDefs />
      <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><App /></HashRouter>
    </StoreProvider>
  </StrictMode>,
);
