import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout';
import Home from '../pages/home';
import Error from '../pages/error';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path='*' element={<Error />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}