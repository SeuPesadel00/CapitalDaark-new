import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  hideNav?: boolean; 
}

const Layout = ({ children, hideNav = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header hideNav={hideNav} />
      <main className="flex-grow pt-8 pb-12 flex items-center justify-center">
        {children}
      </main>
      <footer className="p-6 text-center border-t border-border/20 bg-card/80">
        <p>&copy; 2025 Capital Daark. Todos os direitos reservados.</p>
        <p className="text-sm mt-2">Construindo o futuro, hoje.</p>
      </footer>
    </div>
  );
};

export default Layout;