
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

// Global error handler for startup issues
window.addEventListener('error', (event) => {
  const errorMsg = document.createElement('div');
  errorMsg.style.position = 'fixed';
  errorMsg.style.top = '0';
  errorMsg.style.left = '0';
  errorMsg.style.width = '100%';
  errorMsg.style.backgroundColor = '#f8d7da';
  errorMsg.style.color = '#721c24';
  errorMsg.style.padding = '20px';
  errorMsg.style.zIndex = '9999';
  errorMsg.style.fontFamily = 'monospace';
  errorMsg.style.whiteSpace = 'pre-wrap';
  errorMsg.innerHTML = `<strong>Erreur Critique au Démarrage:</strong><br>${event.message}<br><small>${event.filename}:${event.lineno}</small>`;
  document.body.appendChild(errorMsg);
});

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (e) {
  console.error("React render error:", e);
  document.body.innerHTML = `<div style="color:red;padding:20px;"><h1>Erreur de Rendu React</h1><pre>${e instanceof Error ? e.message : JSON.stringify(e)}</pre></div>`;
}
