import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout';
import Home from '../pages/home';
import Error from '../pages/error';

export default function App() { // comme il n'y a pas de page connexion , on va changer les profil via l'url , on declare ici vouloir afficher les data du l'utilisateur id:18 directement en premier affichage
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/user/18" replace />} />  
          <Route path="/user/:id" element={<Home />} />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}