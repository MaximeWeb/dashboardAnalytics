import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';


async function enableMocking() {
  if (import.meta.env.VITE_ENV === 'dev') {
    const { worker } = await import('../mocks/browser.js');
    await worker.start();
    console.log('[MSW] Mock API activée');
  } else {
    console.log('[MSW] Mode mock désactivé (prod ou autre)');
  }
}

export function getApiUrl(path) {
  const isDev = import.meta.env.VITE_ENV === 'dev';
  const base = isDev ? '' : 'http://localhost:3000';
  const prefix = isDev ? '/mock' : '';
  return `${base}${prefix}${path}`;
}

export async function fetchData(path) {
  const res = await fetch(getApiUrl(path));
  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des données");
  }
  const json = await res.json();
  return json.data || json; 
}


enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
