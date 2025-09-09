import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ShoppingCart, User, Settings, UserCircle, LogOut, Menu, X, CreditCard } from 'lucide-react';
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
  const { user, profile, signOut } = useAuth();

  const navItems = [
    { label: 'Início', href: '/user-home' },
    { label: 'Loja', href: '/loja' },
    { label: 'Sobre Nós', href: '/sobre' },
    { label: 'Contatos', href: '/contatos' },
  ];

  // FUNÇÃO CORRIGIDA PARA USAR O SUPABASE
  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/user-home')}>
            <img 
              src="/uploads/mamute1.png" 
              alt="Capital Daark Logo" 
              className="w-10 h-10"
            />
            <span className="text-2xl font-orbitron font-bold text-neon-cyan">
              Capital<span className="text-neon-purple">Daark</span>
            </span>
          </div>

          {/* Navegação na área de trabalho */}
          {!hideNav && (
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="px-4 py-2 rounded-lg bg-card/50 backdrop-blur-sm border border-border/30 text-foreground hover:border-neon-cyan/50 hover:bg-neon-cyan/10 hover:text-neon-cyan transition-all duration-300 font-medium shadow-sm"
                  onClick={() => navigate(item.href)}
                >
                  {item.label}
                </Button>
              ))}
            </nav>
          )}

          {/* Ações na área de trabalho */}
          {!hideNav && (
            <div className="hidden lg:flex items-center space-x-4">
              {/* Botão do carrinho */}
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

              {/* Informações e perfil do usuário */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-foreground font-medium">
                    Olá, {profile?.first_name || user.email?.split('@')[0]}!
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-neon-purple/30 hover:border-neon-purple hover:bg-neon-purple/10"
                      >
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground text-xs font-medium">
                            {profile?.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                          </span>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-card border-border/20">
                      <DropdownMenuItem
                        onClick={() => navigate('/dados-pessoais')}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <UserCircle className="mr-2 h-4 w-4 text-neon-purple" />
                        Dados Pessoais
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate('/configuracoes-unificadas')}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <Settings className="mr-2 h-4 w-4 text-neon-cyan" />
                        Configurações
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={signOut}
                        className="cursor-pointer hover:bg-muted/50 text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="border-primary/30 hover:border-primary"
                  >
                    Entrar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate('/register')}
                    className="bg-secondary text-secondary-foreground"
                  >
                    Cadastrar
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Ações para dispositivos móveis/tablets */}
          {!hideNav && (
            <div className="hidden md:flex lg:hidden items-center space-x-4">
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
            </div>
          )}

          {/* Botão de menu móvel */}
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

        {/* Navegação móvel */}
        {!hideNav && isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/20">
            <nav className="flex flex-col space-y-2 pt-4">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="justify-start px-4 py-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border/30 text-foreground hover:border-neon-cyan/50 hover:bg-neon-cyan/10 hover:text-neon-cyan transition-all duration-300 font-medium"
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
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/dados-pessoais');
                  }}
                >
                  <User className="h-4 w-4 mr-2 text-neon-purple" />
                  Perfil
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-neon-cyan/30 hover:border-neon-cyan"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/configuracoes-unificadas');
                  }}
                >
                  <Settings className="h-4 w-4 mr-2 text-neon-cyan" />
                  Configurações
                </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-destructive/30 hover:border-destructive"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
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