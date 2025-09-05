// frontend/src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import UserHome from './pages/UserHome';
import Loja from './pages/Loja';
import Configuracoes from './pages/Configuracoes';
import DadosPessoais from './pages/DadosPessoais';
import NoticiaDetalhe from './pages/NoticiaDetalhe';
import Homepage from './pages/Homepage'; 
import UserProfile from './pages/UserProfile';
import RecoverPassword from './pages/RecoverPassword';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import PaymentMethods from './pages/PaymentMethods';
import AccountSettings from './pages/AccountSettings';
import Contatos from './pages/Contatos';
import Sobre from './pages/Sobre';
import Noticias from './pages/Noticias';
import Carrinho from './pages/Carrinho';
import Checkout from './pages/Checkout';

const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect based on authentication status */}
        <Route path="/" element={user ? <Navigate to="/user-home" replace /> : <Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/user-home" replace />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/user-home" replace />} />
        <Route path="/recover-password" element={!user ? <RecoverPassword /> : <Navigate to="/user-home" replace />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Protected Routes */}
        <Route path="/user-home" element={<AuthGuard><UserHome /></AuthGuard>} />
        <Route path="/loja" element={<AuthGuard><Loja /></AuthGuard>} />
        <Route path="/carrinho" element={<AuthGuard><Carrinho /></AuthGuard>} />
        <Route path="/checkout" element={<AuthGuard><Checkout /></AuthGuard>} />
        <Route path="/noticias" element={<AuthGuard><Noticias /></AuthGuard>} />
        <Route path="/noticia/:id" element={<AuthGuard><NoticiaDetalhe /></AuthGuard>} />
        <Route path="/contatos" element={<AuthGuard><Contatos /></AuthGuard>} />
        <Route path="/sobre" element={<AuthGuard><Sobre /></AuthGuard>} />
        <Route path="/configuracoes" element={<AuthGuard><Configuracoes /></AuthGuard>} />
        <Route path="/dados-pessoais" element={<AuthGuard><DadosPessoais /></AuthGuard>} />
        <Route path="/payment-methods" element={<AuthGuard><PaymentMethods /></AuthGuard>} />
        <Route path="/account-settings" element={<AuthGuard><AccountSettings /></AuthGuard>} />
        <Route path="/usuario/:username" element={<AuthGuard><UserProfile /></AuthGuard>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;