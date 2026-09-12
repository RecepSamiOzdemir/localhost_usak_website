import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initConsoleEasterEgg } from './utils/consoleEasterEgg';

// Konsol meraklıları için topluluk karşılama mesajı
initConsoleEasterEgg();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
