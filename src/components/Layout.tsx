// frontend/src/components/Layout.tsx

import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean; // Adicionamos esta propriedade
  // Você também pode adicionar um footer ou outros elementos aqui
}

const Layout = ({ children, showHeader = true }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && ( // O cabeçalho só será renderizado se showHeader for true
        <header className="bg-gray-900 bg-opacity-70 backdrop-blur-sm p-4 md:p-6 shadow-lg fixed w-full z-10">
          <nav className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">
              <span className="neon-text">Capital</span> <span className="text-purple-500">Daark</span>
            </div>
          </nav>
        </header>
      )}

      {children}

      <footer className="p-6 text-center">
        <p>&copy; 2025 Capital Daark. Todos os direitos reservados.</p>
        <p className="text-sm mt-2">Construindo o futuro, hoje.</p>
      </footer>
    </div>
  );
};

export default Layout;