import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { User, Settings, UserCircle, LogOut, Home, Compass, Bell, ShoppingBag, HelpCircle, UserPlus, LogIn, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificationsSidebar } from './NotificationsSidebar';

interface HeaderProps {
  hideNav?: boolean;
  hideBottomNav?: boolean;
}

const Header = ({ hideNav = false, hideBottomNav = false }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut, unreadMessagesCount, unreadNotificationsCount } = useAuth();
  
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerHeight < 500) setIsKeyboardOpen(true);
      else setIsKeyboardOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { label: 'Página Inicial', href: '/user-home', icon: Home },
    { label: 'Vitrine/Loja', href: '/loja', icon: ShoppingBag },
    { label: 'Mensagens', href: '/mensagens', icon: MessageSquare, badge: unreadMessagesCount },
    { label: 'Notificações', href: '#notificacoes', icon: Bell, badge: unreadNotificationsCount, action: () => setNotificationsOpen(true) },
    { label: 'Suporte VIP', href: 'https://wa.me/5561982201177?text=Olá, preciso de suporte na plataforma Capital Daark.', icon: HelpCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* ---------------- MOBILE TOP HEADER ---------------- */}
      <header className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/user-home')}>
            <img src="/uploads/mamute1.png" alt="Logo" className="w-8 h-8 rounded-md" />
            <span className="text-xl font-orbitron font-bold text-primary tracking-wide">
              CapitalDaark
            </span>
          </div>

          {!hideNav && (
            <div className="flex items-center">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="border-primary/30 rounded-full overflow-hidden p-0 w-9 h-9">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                          {profile?.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                    <DropdownMenuItem onClick={() => navigate(`/usuario/${profile?.username || user?.id}`)} className="cursor-pointer py-3">
                      <UserCircle className="mr-2 h-5 w-5" /> Meu Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/configuracoes-unificadas')} className="cursor-pointer py-3">
                      <Settings className="mr-2 h-5 w-5" /> Configurações
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive py-3">
                      <LogOut className="mr-2 h-5 w-5" /> Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button size="sm" onClick={() => navigate('/login')} className="bg-primary/20 text-primary border border-primary/50 rounded-full h-8 px-4">
                  Entrar
                </Button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ---------------- DESKTOP SIDEBAR (Instagram Style) ---------------- */}
      {!hideNav && (
        <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-16 hover:w-64 bg-background z-50 transition-all duration-300 ease-in-out group overflow-hidden">
          {/* Logo */}
          <div className="flex items-center h-20 w-full px-4 shrink-0 cursor-pointer mt-2" onClick={() => navigate('/user-home')}>
            <img src="/uploads/mamute1.png" alt="Logo" className="w-8 h-8 shrink-0 rounded-md" />
            <span className="ml-4 text-lg font-orbitron font-bold text-primary tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              CapitalDaark
            </span>
          </div>

          {/* Nav Items */}
          <div className="flex flex-col gap-2 p-3 mt-4 flex-1">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className={`justify-start px-2 py-6 rounded-xl w-full transition-colors relative ${
                  isActive(item.href) && !item.action ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-card hover:text-foreground'
                }`}
                onClick={() => {
                  if (item.action) item.action();
                  else if (item.href.startsWith('http')) window.open(item.href, '_blank');
                  else navigate(item.href);
                }}
              >
                <div className="flex items-center w-full">
                  <div className="relative">
                    <item.icon className="w-7 h-7 shrink-0" strokeWidth={isActive(item.href) ? 2.5 : 2} />
                    {item.badge && item.badge > 0 ? (
                       <span className="absolute -top-1 -right-1 bg-destructive text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-sm">
                         {item.badge > 9 ? '9+' : item.badge}
                       </span>
                    ) : null}
                  </div>
                  <span className="ml-4 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              </Button>
            ))}
          </div>

          {/* User Profile / Auth Actions Bottom */}
          <div className="p-3 mb-4 flex flex-col gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="justify-start px-2 py-6 rounded-xl w-full text-muted-foreground hover:bg-card hover:text-foreground">
                    <div className="flex items-center w-full">
                      <div className="w-7 h-7 shrink-0 rounded-full overflow-hidden border border-border">
                        {profile?.avatar_url ? (
                          <img src={profile.avatar_url} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                            {profile?.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="ml-4 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap truncate">
                        Perfil
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="right" className="w-56 bg-card border-border ml-2 shadow-xl">
                  <div className="px-2 py-2 border-b border-border/20 mb-2">
                    <p className="font-semibold text-sm truncate">{profile?.first_name || 'Usuário'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate(`/usuario/${profile?.username || user?.id}`)} className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" /> Meu Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/configuracoes-unificadas')} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" /> Configurações
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive mt-2">
                    <LogOut className="mr-2 h-4 w-4" /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" onClick={() => navigate('/login')} className="justify-start px-2 py-6 rounded-xl w-full text-muted-foreground hover:bg-card">
                <div className="flex items-center w-full">
                  <LogIn className="w-7 h-7 shrink-0" />
                  <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Entrar</span>
                </div>
              </Button>
            )}
          </div>
        </aside>
      )}

      {/* ---------------- BOTTOM NAVIGATION BAR (Mobile Only) ---------------- */}
      {!hideNav && !hideBottomNav && user && !isKeyboardOpen && (
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-card/95 backdrop-blur-md border-t border-border shadow-[0_-5px_20px_rgba(0,0,0,0.5)] z-50 pb-safe">
          <div className="flex justify-around items-center h-16 px-2">
            
            <button 
              onClick={() => navigate('/user-home')} 
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive('/user-home') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Home className={`w-6 h-6 ${isActive('/user-home') ? 'fill-primary/20' : ''}`} strokeWidth={isActive('/user-home') ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Home</span>
            </button>

            <button 
              onClick={() => navigate('/mensagens')} 
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative ${isActive('/mensagens') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <MessageSquare className="w-6 h-6" strokeWidth={isActive('/mensagens') ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Chat</span>
              {unreadMessagesCount > 0 && (
                <span className="absolute top-1 right-1 sm:right-3 bg-destructive text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => navigate('/loja')} 
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive('/loja') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <ShoppingBag className="w-6 h-6" strokeWidth={isActive('/loja') ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Loja</span>
            </button>
            
            <button 
              onClick={() => setNotificationsOpen(true)} 
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative ${notificationsOpen ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Bell className="w-6 h-6" strokeWidth={isActive('/notificacoes') ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Alertas</span>
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 sm:right-3 bg-destructive text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </button>

          </div>
        </nav>
      )}

      {/* ---------------- NOTIFICATIONS SIDEBAR ---------------- */}
      <NotificationsSidebar 
        open={notificationsOpen} 
        onOpenChange={setNotificationsOpen} 
      />
    </>
  );
};

export default Header;