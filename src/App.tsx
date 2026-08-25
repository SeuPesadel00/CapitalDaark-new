// frontend/src/App.tsx

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Usando React.lazy para code splitting e carregamento mais rápido inicial
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const UserHome = lazy(() => import('./pages/UserHome'));
const Loja = lazy(() => import('./pages/Loja'));
const ConfiguracoesUnificadas = lazy(() => import('./pages/ConfiguracoesUnificadas'));
const DadosPessoais = lazy(() => import('./pages/DadosPessoais'));
const NoticiaDetalhe = lazy(() => import('./pages/NoticiaDetalhe'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const RecoverPassword = lazy(() => import('./pages/RecoverPassword'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const PaymentMethods = lazy(() => import('./pages/PaymentMethods'));
const AccountSettings = lazy(() => import('./pages/AccountSettings'));
const Contatos = lazy(() => import('./pages/Contatos'));
const Sobre = lazy(() => import('./pages/Sobre'));
const Noticias = lazy(() => import('./pages/Noticias'));
const Carrinho = lazy(() => import('./pages/Carrinho'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Notifications = lazy(() => import('./pages/Notifications'));

// Componente de Loading unificado
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="animate-pulse">
      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  </div>
);

const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Redirect based on authentication status */}
          <Route path="/" element={user ? <Navigate to="/user-home" replace /> : <Navigate to="/login" replace />} />

          {/* Public Routes */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/user-home" replace />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/user-home" replace />} />
          <Route path="/recover-password" element={!user ? <RecoverPassword /> : <Navigate to="/user-home" replace />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/noticias" element={<Noticias />} />

          {/* Protected Routes */}
          <Route path="/user-home" element={<AuthGuard><UserHome /></AuthGuard>} />
          <Route path="/loja" element={<AuthGuard><Loja /></AuthGuard>} />
          <Route path="/carrinho" element={<AuthGuard><Carrinho /></AuthGuard>} />
          <Route path="/checkout" element={<AuthGuard><Checkout /></AuthGuard>} />
          <Route path="/noticia/:id" element={<AuthGuard><NoticiaDetalhe /></AuthGuard>} />
          <Route path="/contatos" element={<AuthGuard><Contatos /></AuthGuard>} />
          <Route path="/sobre" element={<AuthGuard><Sobre /></AuthGuard>} />
          <Route path="/configuracoes-unificadas" element={<AuthGuard><ConfiguracoesUnificadas /></AuthGuard>} />
          <Route path="/dados-pessoais" element={<AuthGuard><DadosPessoais /></AuthGuard>} />
          <Route path="/payment-methods" element={<AuthGuard><PaymentMethods /></AuthGuard>} />
          <Route path="/account-settings" element={<AuthGuard><AccountSettings /></AuthGuard>} />
          <Route path="/usuario/:username" element={<AuthGuard><UserProfile /></AuthGuard>} />
          <Route path="/notificacoes" element={<AuthGuard><Notifications /></AuthGuard>} />
          
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;