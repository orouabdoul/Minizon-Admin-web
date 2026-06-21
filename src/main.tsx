import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './trips-page.css';
import './metrics-overrides.css';
import './modals.css';
import './dialogs.css';
import { Providers } from './app/Providers';
import { App } from './app/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
);
