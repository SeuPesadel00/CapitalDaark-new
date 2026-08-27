import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bell, Heart, MessageSquare, User, UserPlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface NotificationsSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnreadCountChange: (count: number) => void;
}

export function NotificationsSidebar({ open, onOpenChange, onUnreadCountChange }: NotificationsSidebarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();

    const channel = supabase.channel('realtime_notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `recipient_id=eq.${user.id}` }, 
      () => {
        fetchNotifications();
      }).subscribe();
      
    return () => { supabase.removeChannel(channel); }
  }, [user]);

  useEffect(() => {
    if (open && user) {
      markAllAsRead();
    }
  }, [open, user]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          sender:profiles!notifications_sender_id_fkey(first_name, last_name, avatar_url)
        `)
        .eq('recipient_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(30);
        
      if (error) throw error;
      setNotifications(data || []);
      
      const unread = data?.filter(n => !n.read).length || 0;
      onUnreadCountChange(unread);
    } catch (error) {
      console.error("Erro ao carregar notificações", error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      const unreadCount = notifications.filter(n => !n.read).length;
      if (unreadCount === 0) return;

      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('recipient_id', user.id)
        .eq('read', false);
        
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      onUnreadCountChange(0);
    } catch (error) {
      console.error("Erro ao marcar lido", error);
    }
  };

  const handleNotificationClick = (notif: any) => {
    onOpenChange(false);
    navigate('/user-home');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[85vw] sm:max-w-sm border-r border-border/30 bg-card p-0 flex flex-col h-full z-[120]">
        <SheetHeader className="p-4 border-b border-border/20">
          <SheetTitle className="flex items-center gap-2 text-xl font-orbitron text-white">
            <Bell className="w-5 h-5 text-primary" />
            Notificações
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto no-scrollbar p-2">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center p-8 mt-10">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground text-sm">O silêncio absoluto. Ninguém contatou você ainda.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-3 rounded-lg flex gap-3 items-start transition-colors cursor-pointer hover:bg-white/5 ${!notif.read ? 'bg-primary/10' : 'bg-transparent'}`} 
                  onClick={() => handleNotificationClick(notif)}
                >
                  <div className="relative shrink-0">
                    <Avatar className="w-10 h-10 border border-border/50">
                      <AvatarImage src={notif.sender?.avatar_url} />
                      <AvatarFallback><User className="w-4 h-4"/></AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center bg-card">
                      {notif.type === 'like_post' ? (
                        <Heart className="w-3 h-3 text-orange-500 fill-orange-500" />
                      ) : notif.type === 'follow_user' ? (
                        <UserPlus className="w-3 h-3 text-blue-500" />
                      ) : (
                        <MessageSquare className="w-3 h-3 text-neon-purple fill-neon-purple" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200">
                      <span className="font-bold text-white mr-1">{notif.sender?.first_name || 'Alguém'}</span>
                      {notif.type === 'like_post' 
                        ? 'apoiou a sua publicação.'
                        : notif.type === 'follow_user'
                        ? 'começou a seguir você.'
                        : 'comentou na sua publicação.'}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                  
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
