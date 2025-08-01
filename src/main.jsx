import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { I18nextProvider } from 'react-i18next';
import i18n from './locales/i18n';


const consoleError = console.error;
console.error = (...args) => {
  if (!args[0].includes('defaultProps')) {
    consoleError(...args);
  }
};
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </StrictMode>
);