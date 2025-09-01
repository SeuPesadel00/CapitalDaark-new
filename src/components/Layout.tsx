// frontend/src/components/Layout.tsx

import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

const Layout = ({ children, hideNav = false }: LayoutProps) => {
  const navigate = useNavigate();

  if (hideNav) {
    // Layout especial para páginas de autenticação - sem rolagem
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-4 md:p-6 shadow-lg fixed w-full z-10">
        <nav className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Logo agora com a fonte correta e clicável */}
          <div 
            className="text-2xl md:text-3xl font-orbitron font-bold text-white mb-4 md:mb-0 cursor-pointer"
            onClick={() => navigate('/')} 
          >
            <span className="neon-text">Capital</span> <span className="text-purple-500">Daark</span>
          </div>
        </nav>
      </header>
      
      <main className="flex-grow pt-24 pb-12 flex items-center justify-center">
        {children}
      </main>

      <footer className="p-6 text-center">
        <p>&copy; 2025 Capital Daark. Todos os direitos reservados.</p>
        <p className="text-sm mt-2">Construindo o futuro, hoje.</p>
      </footer>
    </div>
  );
};

export default Layout;