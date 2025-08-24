import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ShoppingCart, User, Settings, UserCircle, LogOut, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  hideNav?: boolean;
}

const Header = ({ hideNav = false }: HeaderProps) => {
  const { produtos } = useCart();
  const totalItensCarrinho = produtos.reduce((acc, p) => acc + p.quantidade, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Início', href: '/' },
    { label: 'Loja', href: '/loja' },
    { label: 'Notícias', href: '/noticias' },
    { label: 'Sobre Nós', href: '/sobre' },
    { label: 'Contatos', href: '/contatos' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-2xl font-orbitron font-bold text-primary-foreground">C</span>
            </div>
            <span className="text-2xl font-orbitron font-bold text-neon-cyan">
              Capital<span className="text-neon-purple">Dark</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          {!hideNav && (
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="text-foreground hover:text-neon-cyan transition-colors font-medium"
                  onClick={() => navigate(item.href)}
                >
                  {item.label}
                </Button>
              ))}
            </nav>
          )}

          {/* Desktop Actions */}
          {!hideNav && (
            <div className="hidden md:flex items-center space-x-4">
              {/* Cart Button */}
              <Button
                variant="outline"
                size="icon"
                className="relative border-neon-cyan/30 hover:border-neon-cyan hover:bg-neon-cyan/10"
                onClick={() => navigate('/carrinho')}
              >
                <ShoppingCart className="h-5 w-5 text-neon-cyan" />
                {totalItensCarrinho > 0 && (
                  <span className="absolute -top-2 -right-2 bg-neon-green text-xs rounded-full w-5 h-5 flex items-center justify-center text-white font-bold">
                    {totalItensCarrinho}
                  </span>
                )}
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-neon-purple/30 hover:border-neon-purple hover:bg-neon-purple/10"
                  >
                    <User className="h-5 w-5 text-neon-purple" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-border/20">
                  <DropdownMenuItem
                    onClick={() => navigate('/configuracoes')}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <Settings className="mr-2 h-4 w-4 text-neon-cyan" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/dados-pessoais')}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <UserCircle className="mr-2 h-4 w-4 text-neon-green" />
                    Dados Pessoais
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/login')}
                    className="cursor-pointer hover:bg-muted/50 text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Mobile Menu Button */}
          {!hideNav && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-neon-cyan" />
              ) : (
                <Menu className="h-6 w-6 text-neon-cyan" />
              )}
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        {!hideNav && isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/20">
            <nav className="flex flex-col space-y-2 pt-4">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="justify-start text-foreground hover:text-neon-cyan transition-colors"
                  onClick={() => {
                    navigate(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <div className="flex items-center space-x-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-neon-cyan/30 hover:border-neon-cyan"
                  onClick={() => navigate('/carrinho')}
                >
                  <ShoppingCart className="h-4 w-4 mr-2 text-neon-cyan" />
                  Carrinho ({totalItensCarrinho})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-neon-purple/30 hover:border-neon-purple"
                  onClick={() => navigate('/configuracoes')}
                >
                  <User className="h-4 w-4 mr-2 text-neon-purple" />
                  Perfil
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-destructive/30 hover:border-destructive"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/login');
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2 text-destructive" />
                  Sair
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;