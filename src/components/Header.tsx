import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ShoppingCart, User, Settings, UserCircle, LogOut, Home, Compass, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  hideNav?: boolean;
}

const Header = ({ hideNav = false }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  
  const [unreadCount, setUnreadCount] = useState(0);

  // Busca inicial das notificações não lidas
  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .eq('read', false);
      if (count !== null) setUnreadCount(count);
    };
    fetchUnread();

    // Escutar por novas notificações em tempo real
    const channel = supabase.channel('realtime_notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `recipient_id=eq.${user.id}` }, 
      (payload) => {
        setUnreadCount(prev => prev + 1);
      }).subscribe();
      
    return () => { supabase.removeChannel(channel); }
  }, [user]);

  // Detecção se o teclado está aberto (para esconder a bottom bar no Android)
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      // Um pequeno truque para esconder a barra inferior se o teclado virtual abrir
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
    { label: 'Início', href: '/user-home' },
    { label: 'Loja', href: '/loja' },
    { label: 'Suporte VIP', href: 'https://wa.me/5561982201177?text=Olá, preciso de suporte na plataforma Capital Daark.' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* HEADER TOP (Desktop & Mobile Minimalista) */}
      <header className="sticky top-0 z-40 bg-background border-b border-border/50 shadow-md">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/user-home')}>
              <img src="/uploads/mamute1.png" alt="Capital Daark" className="w-8 h-8 md:w-10 md:h-10" />
              <span className="text-xl md:text-2xl font-orbitron font-bold text-neon-cyan tracking-wide">
                Capital<span className="text-neon-purple">Daark</span>
              </span>
            </div>

            {/* Navegação e Ações na Área de Trabalho (Escondida no Mobile) */}
            {!hideNav && (
              <div className="hidden md:flex items-center space-x-8">
                <nav className="flex space-x-2">
                  {navItems.map((item) => (
                    <Button
                      key={item.label}
                      variant="ghost"
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        isActive(item.href) 
                        ? 'bg-neon-cyan/10 text-neon-cyan border-b-2 border-neon-cyan rounded-b-none' 
                        : 'text-foreground hover:bg-card/80 hover:text-neon-cyan'
                      }`}
                      onClick={() => item.href.startsWith('http') ? window.open(item.href, '_blank') : navigate(item.href)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </nav>

                <div className="flex items-center space-x-4 border-l border-border/30 pl-4">
                  <Button variant="outline" size="icon" className="relative border-neon-purple/30 hover:border-neon-purple rounded-full" onClick={() => navigate('/notificacoes')}>
                    <Bell className="h-5 w-5 text-neon-purple" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-neon-cyan text-black text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold animate-pulse shadow-[0_0_10px_rgba(0,255,255,0.8)]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Button>

                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="border-neon-purple/30 hover:border-neon-purple rounded-full overflow-hidden p-0">
                          {profile?.avatar_url ? (
                            <img src={profile.avatar_url} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                              {profile?.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                            </div>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-border/20 shadow-2xl shadow-neon-purple/10">
                        <div className="px-2 py-2 border-b border-border/20 mb-2">
                          <p className="font-semibold text-sm truncate">Olá, {profile?.first_name || 'Anarquista'}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <DropdownMenuItem onClick={() => navigate('/dados-pessoais')} className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors">
                          <UserCircle className="mr-2 h-4 w-4" /> Meu Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/configuracoes-unificadas')} className="cursor-pointer hover:bg-neon-cyan/20 hover:text-neon-cyan transition-colors">
                          <Settings className="mr-2 h-4 w-4" /> Configurações
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-destructive/20 text-destructive mt-2 transition-colors">
                          <LogOut className="mr-2 h-4 w-4" /> Sair da Rede
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => navigate('/login')} className="hover:text-primary">Entrar</Button>
                      <Button onClick={() => navigate('/register')} className="bg-primary text-black font-semibold shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all rounded-full">
                        Juntar-se
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Ações Mobile Topo (Avatar c/ Dropdown ou Entrar) */}
            {!hideNav && (
              <div className="flex md:hidden items-center">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="border-neon-cyan/30 hover:border-neon-cyan rounded-full overflow-hidden p-0 w-9 h-9">
                        {profile?.avatar_url ? (
                          <img src={profile.avatar_url} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                            {profile?.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                          </div>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-border/20 shadow-2xl shadow-neon-purple/10 mt-2">
                      <div className="px-2 py-2 border-b border-border/20 mb-2">
                        <p className="font-semibold text-sm truncate">Olá, {profile?.first_name || 'Anarquista'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <DropdownMenuItem onClick={() => navigate('/dados-pessoais')} className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors py-3">
                        <UserCircle className="mr-2 h-5 w-5" /> Meu Perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/configuracoes-unificadas')} className="cursor-pointer hover:bg-neon-cyan/20 hover:text-neon-cyan transition-colors py-3">
                        <Settings className="mr-2 h-5 w-5" /> Configurações
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-destructive/20 text-destructive mt-2 transition-colors py-3">
                        <LogOut className="mr-2 h-5 w-5" /> Sair da Rede
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
        </div>
      </header>

      {/* BOTTOM NAVIGATION BAR (Apenas Mobile e quando logado e teclado fechado) */}
      {!hideNav && user && !isKeyboardOpen && (
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-card/95 backdrop-blur-xl border-t border-border/30 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] z-50 pb-safe">
          <div className="flex justify-around items-center h-16 px-2">
            
            <button 
              onClick={() => navigate('/user-home')} 
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive('/user-home') ? 'text-neon-cyan' : 'text-muted-foreground hover:text-gray-300'}`}
            >
              <Home className={`w-6 h-6 ${isActive('/user-home') ? 'fill-neon-cyan/20' : ''}`} strokeWidth={isActive('/user-home') ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Home</span>
            </button>

            <button 
              onClick={() => navigate('/loja')} 
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive('/loja') ? 'text-neon-purple' : 'text-muted-foreground hover:text-gray-300'}`}
            >
              <Compass className="w-6 h-6" strokeWidth={isActive('/loja') ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Loja</span>
            </button>
            
            <button 
              onClick={() => navigate('/notificacoes')} 
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative ${isActive('/notificacoes') ? 'text-neon-purple' : 'text-muted-foreground hover:text-gray-300'}`}
            >
              <Bell className="w-6 h-6" strokeWidth={isActive('/notificacoes') ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Alertas</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 sm:right-3 bg-neon-cyan text-black text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold animate-pulse shadow-[0_0_10px_rgba(0,255,255,0.8)]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => navigate('/dados-pessoais')} 
              className="flex flex-col items-center justify-center w-full h-full space-y-1"
            >
              <div className={`w-7 h-7 rounded-full border-2 overflow-hidden flex items-center justify-center bg-background ${isActive('/dados-pessoais') || isActive('/configuracoes-unificadas') ? 'border-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.4)]' : 'border-muted-foreground/30'}`}>
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive('/dados-pessoais') ? 'text-neon-cyan' : 'text-muted-foreground'}`}>Perfil</span>
            </button>

          </div>
        </nav>
      )}
    </>
  );
};

export default Header;