// frontend/src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserHome from './pages/UserHome';
import Loja from './pages/Loja';
import Configuracoes from './pages/Configuracoes';
import DadosPessoais from './pages/DadosPessoais';
import Noticias from './pages/NoticiaDetalhe';
import Homepage from './pages/Homepage'; 
import UserProfile from './pages/UserProfile';
import NoticiaDetalhe from './pages/NoticiaDetalhe';
import RecoverPassword from './pages/RecoverPassword'; // Adicione esta linha

const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Adicionado um redirecionamento da rota raiz para a página de login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recover-password" element={<RecoverPassword />} /> {/* Adicione esta linha */}

        {/* Rotas Protegidas por Autenticação */}
        <Route path="/user-home" element={<AuthGuard><UserHome /></AuthGuard>} />
        <Route path="/loja" element={<AuthGuard><Loja /></AuthGuard>} />
        <Route path="/noticias" element={<AuthGuard><Noticias /></AuthGuard>} />
        <Route path="/noticia/:id" element={<AuthGuard><NoticiaDetalhe /></AuthGuard>} />
        <Route path="/configuracoes" element={<AuthGuard><Configuracoes /></AuthGuard>} />
        <Route path="/dados-pessoais" element={<AuthGuard><DadosPessoais /></AuthGuard>} />
        <Route path="/usuario/:username" element={<AuthGuard><UserProfile /></AuthGuard>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;