import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any;
  loading: boolean;
  unreadMessagesCount: number;
  setUnreadMessagesCount: React.Dispatch<React.SetStateAction<number>>;
  refreshUnreadCount: () => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const refreshUnreadCount = async () => {
    if (!user) return;
    
    // 1. Fetch muted targets
    const { data: mutedData } = await supabase
      .from('muted_conversations')
      .select('target_user_id')
      .eq('user_id', user.id);
    const mutedTargets = mutedData ? mutedData.map(m => m.target_user_id) : [];

    // 2. Fetch deleted targets
    const { data: deletedData } = await supabase
      .from('deleted_conversations')
      .select('target_user_id')
      .eq('user_id', user.id);
    const deletedTargets = deletedData ? deletedData.map(d => d.target_user_id) : [];

    // Ignorar se estiver silenciado OU deletado
    const ignoreTargets = [...new Set([...mutedTargets, ...deletedTargets])];

    // 3. Fetch unread messages
    let query = supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', user.id)
      .is('read_at', null);

    if (ignoreTargets.length > 0) {
      query = query.not('sender_id', 'in', `(${ignoreTargets.join(',')})`);
    }

    const { count } = await query;
    setUnreadMessagesCount(count || 0);
  };

  useEffect(() => {
    if (!user) {
      setUnreadMessagesCount(0);
      return;
    }

    let msgChannel: any;

    const setupRealtimeCounter = async () => {
      // Faz o fetch inicial
      await refreshUnreadCount();

      // Precisa dos silenciados para o realtime não pipocar (porém, um chat recém apagado não emitirá update porque read_at é null, mas um INSERT sim. 
      // Por segurança, o realtime só filtra `mutedTargets`, se deletar precisamos esconder a conversa na UI de qualquer jeito. 
      // Aqui refazemos a busca pra deixar a callback limpa.
      const { data: mutedData } = await supabase.from('muted_conversations').select('target_user_id').eq('user_id', user.id);
      const mutedTargets = mutedData ? mutedData.map(m => m.target_user_id) : [];

      // 3. Listen to realtime changes
      msgChannel = supabase.channel('global_unread_msgs')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` }, 
        (payload) => {
          if (!mutedTargets.includes(payload.new.sender_id)) {
            setUnreadMessagesCount(prev => prev + 1);
          }
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` }, 
        (payload) => {
          if (!mutedTargets.includes(payload.new.sender_id)) {
             // Como o replica identity não traz o old.read_at nativamente,
             // chamamos refreshUnreadCount se houver nova marcação de lido (qualquer update na tabela)
             if (payload.new.read_at) refreshUnreadCount();
          }
        })
        .subscribe();
    };

    setupRealtimeCounter();

    return () => {
      if (msgChannel) supabase.removeChannel(msgChannel);
    };
  }, [user]);

  useEffect(() => {
    // Configurar o ouvinte de estado de autenticação PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Obter perfil de usuário usando setTimeout para evitar deadlock
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              setProfile(profile);
            } catch (error) {
              console.error('Error fetching profile:', error);
              setProfile(null);
            }
          }, 0);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // ENTÃO verifique se há uma sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Também busque o perfil para a sessão inicial
        setTimeout(async () => {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            setProfile(profile);
          } catch (error) {
            console.error('Error fetching profile:', error);
            setProfile(null);
          }
          setLoading(false);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
    return { error };
  };

  const verifyOtp = async (email: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup'
    });
    return { error };
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password
    });
    return { error };
  };

  const value = {
    user,
    session,
    profile,
    loading,
    unreadMessagesCount,
    setUnreadMessagesCount,
    refreshUnreadCount,
    signUp,
    signIn,
    signOut,
    resetPassword,
    verifyOtp,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}