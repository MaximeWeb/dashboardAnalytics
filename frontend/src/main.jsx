import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';




async function enableMocking() {
  if (import.meta.env.VITE_ENV === 'dev') {
    const { worker } = await import('../mocks/browser.js');      // Ici on va indiqué que le mock sera bien présant en dev sur mon env 
   
    await worker.start();
    console.log('[MSW] Mock API activée');
  } else {
    console.log('[MSW] Mode mock désactivé (prod ou autre)');
  }
}

export function getApiUrl(path) {
  const isDev = import.meta.env.VITE_ENV === 'dev';       // ici on va faire en sorte de bien modifier l'url si on est dans l'env mock , on retourn la base prefix et le path final
  const base = isDev ? '' : 'http://localhost:3000';
  const prefix = isDev ? '/mock' : '';
  return `${base}${prefix}${path}`;
}

export async function fetchData(path) {  // ici on va chercher a factoriser un peu le code avec une fonction commune d'apel fetch
  const res = await fetch(getApiUrl(path));
  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des données");
  }

  const json = await res.json();

  if (json.kind && json.data) {      // ici on gere le cas ou la key d'une data serai au nom de data pour ne pas faire d'erreur dans les call de l'api qui resort deja avec le nom Data 
    return {
      kind: json.kind,
      data: json.data,
    };
  }

  if (json.data) {
    return json.data;
  }

  return json;
}



enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
