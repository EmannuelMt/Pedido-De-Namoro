import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RootLayout } from './components/RootLayout';
import { LoadingScreen } from './components/LoadingScreen';
import { Home } from './pages/Home';
import { Pedido } from './pages/Pedido';
import { Login } from './pages/Login';
import { Historia } from './pages/Historia';
import { Galeria } from './pages/Galeria';
import { Albuns } from './pages/Albuns';
import { Musicas } from './pages/Musicas';
import { Painel } from './pages/Painel';
import { Jogos } from './pages/Jogos';

export default function App() {
  const [showLoading, setShowLoading] = useState(true);

  if (showLoading) {
    return <LoadingScreen onFinished={() => setShowLoading(false)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="pedido" element={<Pedido />} />
          <Route path="login" element={<Login />} />
          <Route path="historia" element={<Historia />} />
          <Route path="galeria" element={<Galeria />} />
          <Route path="albuns" element={<Albuns />} />
          <Route path="musicas" element={<Musicas />} />
          <Route path="painel" element={<Painel />} />
          <Route path="jogos" element={<Jogos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
