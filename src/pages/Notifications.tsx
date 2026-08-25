import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bell, Heart, MessageSquare, Check, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      markAllAsRead();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          sender:profiles!notifications_sender_id_fkey(first_name, last_name, avatar_url)
        `)
        .eq('recipient_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Erro ao carregar notificações", error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('recipient_id', user.id)
        .eq('read', false);
    } catch (error) {
      console.error("Erro ao marcar lido", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-neon-cyan/10 rounded-full text-neon-cyan shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <Bell className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-orbitron font-bold text-white">Centro de Alertas</h1>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-12 border border-dashed border-border/50 rounded-xl bg-card/30">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">O silêncio absoluto. Ninguém contatou você ainda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <Card key={notif.id} className={`border-border/20 transition-all cursor-pointer hover:border-primary/50 ${!notif.read ? 'bg-primary/5' : 'bg-card/60'}`} onClick={() => navigate('/user-home')}>
                <CardContent className="p-4 flex gap-4 items-center">
                  
                  {/* Ícone do tipo */}
                  <div className="relative">
                    <Avatar className="w-12 h-12 border border-border/50">
                      <AvatarImage src={notif.sender?.avatar_url} />
                      <AvatarFallback><User className="w-5 h-5"/></AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-background bg-card">
                      {notif.type === 'like_post' ? (
                        <Heart className="w-3 h-3 text-neon-cyan fill-neon-cyan" />
                      ) : (
                        <MessageSquare className="w-3 h-3 text-neon-purple" />
                      )}
                    </div>
                  </div>

                  {/* Texto */}
                  <div className="flex-1">
                    <p className="text-sm text-gray-200">
                      <span className="font-bold text-white">{notif.sender?.first_name || 'Alguém'}</span>
                      {notif.type === 'like_post' 
                        ? ' apoiou a sua mensagem com uma Chama.'
                        : ' comentou na sua transmissão.'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>

                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_8px_rgba(0,255,255,0.8)]"></div>
                  )}

                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Notifications;
