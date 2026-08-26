import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { encryptMessage, decryptMessage, importPublicKey, importPrivateKey } from '@/lib/cryptoUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Lock } from 'lucide-react';
import { format } from 'date-fns';

export default function Messages() {
  const { id: targetUserId } = useParams(); // If present, we are in a direct chat
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [targetUser, setTargetUser] = useState<any>(null);
  
  const [localPrivateKey, setLocalPrivateKey] = useState<CryptoKey | null>(null);
  const [targetPublicKey, setTargetPublicKey] = useState<CryptoKey | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Carregar Chave Privada Local
  useEffect(() => {
    if (!user) return;
    const loadKeys = async () => {
      const privateJwk = localStorage.getItem(`private_key_${user.id}`);
      if (privateJwk) {
        const key = await importPrivateKey(privateJwk);
        setLocalPrivateKey(key);
      } else {
        console.error("Chave privada não encontrada neste dispositivo.");
      }
    };
    loadKeys();
  }, [user]);

  // 2. Carregar Lista de Conversas
  useEffect(() => {
    if (!user || targetUserId) return;
    const fetchConversations = async () => {
      // Pega todas as mensagens onde o usuário é remetente ou destinatário
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id, sender_id, receiver_id, created_at,
          sender:profiles!messages_sender_id_fkey(id, username, first_name, avatar_url),
          receiver:profiles!messages_receiver_id_fkey(id, username, first_name, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error || !data) return;

      // Agrupa por usuário
      const contactsMap = new Map();
      data.forEach(msg => {
        const otherUser = msg.sender_id === user.id ? msg.receiver : msg.sender;
        if (!contactsMap.has(otherUser.id)) {
          contactsMap.set(otherUser.id, {
            ...otherUser,
            lastMessageDate: msg.created_at
          });
        }
      });
      setConversations(Array.from(contactsMap.values()));
    };
    fetchConversations();
  }, [user, targetUserId]);

  // 3. Carregar Chat Específico e Chave Pública do Alvo
  useEffect(() => {
    if (!user || !targetUserId || !localPrivateKey) return;

    const loadChat = async () => {
      // Busca perfil do alvo
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', targetUserId).single();
      if (profile) {
        setTargetUser(profile);
        if (profile.public_key) {
          const pubKey = await importPublicKey(profile.public_key);
          setTargetPublicKey(pubKey);
        }
      }

      // Busca mensagens
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (msgs) {
        // Descriptografar mensagens (Só decifra as recebidas; as enviadas nós não conseguimos decifrar a não ser que armazenássemos uma cópia criptografada com NOSSA chave. Num E2EE simples de chat, normalmente salvamos 2 cópias ou não exibimos histórico de enviadas em outro device).
        // Para simplificar, mensagens recebidas serão decifradas. As enviadas não poderão ser lidas se não tivermos a cópia, mas para PoC vamos tentar decifrar tudo. 
        // ATENÇÃO: Na verdade a chave pública criptografa APENAS para o receiver. Então o sender NÃO CONSEGUE LER o que ele mesmo enviou do banco depois (a menos que tenhamos salvo uma "cópia enviada" cifrada para a chave pública do sender).
        // Vamos mostrar "Mensagem enviada criptografada" para as enviadas.
        const decryptedMsgs = await Promise.all(msgs.map(async (m) => {
          if (m.receiver_id === user.id) {
            // Fui eu que recebi, eu tenho a chave privada para ler!
            const plaintext = await decryptMessage(m.encrypted_content, localPrivateKey);
            return { ...m, decrypted_content: plaintext };
          } else {
            // Fui eu que enviei. Eu criptografei com a chave do OUTRO. Não tenho como ler.
            // Em apps reais, você criptografa a mensagem pra sua própria chave pública também e salva.
            return { ...m, decrypted_content: "[Sua Mensagem Criptografada]" };
          }
        }));
        setMessages(decryptedMsgs);
      }
    };
    
    loadChat();

    // Inscrever para novas mensagens
    const channel = supabase.channel(`chat_${user.id}_${targetUserId}`)
      .on('postgres_changes', { 
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `receiver_id=eq.${user.id}`
      }, async (payload) => {
        if (payload.new.sender_id === targetUserId) {
          const plaintext = await decryptMessage(payload.new.encrypted_content, localPrivateKey);
          setMessages(prev => [...prev, { ...payload.new, decrypted_content: plaintext }]);
        }
      }).subscribe();

    return () => { supabase.removeChannel(channel); }
  }, [user, targetUserId, localPrivateKey]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user || !targetUserId || !targetPublicKey) return;

    // Criptografa a mensagem com a chave PÚBLICA DO ALVO
    const encrypted = await encryptMessage(newMessage, targetPublicKey);

    // Salva no banco
    const { data, error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: targetUserId,
      encrypted_content: encrypted
    }).select().single();

    if (!error && data) {
      // Adiciona na tela localmente como texto puro para o sender ver imediatamente
      setMessages(prev => [...prev, { ...data, decrypted_content: newMessage }]);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <Header />
      
      {/* Container Principal */}
      <main className="flex-1 flex overflow-hidden pt-16 md:pt-0" style={{ height: '100vh' }}>
        
        {/* Lista de Conversas (Esconde no mobile se estiver num chat) */}
        <div className={`w-full md:w-80 border-r border-border bg-card flex flex-col ${targetUserId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-border font-bold text-lg flex items-center justify-between">
            Mensagens (E2EE)
            <Lock className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">Nenhuma conversa encontrada.</div>
            ) : (
              conversations.map(c => (
                <div 
                  key={c.id} 
                  onClick={() => navigate(`/mensagens/${c.id}`)}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-accent transition-colors border-b border-border/20 ${targetUserId === c.id ? 'bg-accent/50' : ''}`}
                >
                  <div className="w-12 h-12 rounded-full bg-secondary overflow-hidden shrink-0">
                    {c.avatar_url ? <img src={c.avatar_url} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-primary font-bold">{c.username?.[0]}</div>}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-semibold truncate">{c.username}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.first_name}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Área do Chat */}
        {targetUserId ? (
          <div className="flex-1 flex flex-col bg-background relative h-full">
            {/* Header do Chat */}
            <div className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center px-4 shrink-0 gap-3 z-10 absolute top-0 left-0 w-full">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => navigate('/mensagens')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden shrink-0 cursor-pointer" onClick={() => navigate(`/usuario/${targetUser?.username}`)}>
                {targetUser?.avatar_url && <img src={targetUser.avatar_url} className="w-full h-full object-cover"/>}
              </div>
              <div>
                <p className="font-semibold">{targetUser?.username || 'Carregando...'}</p>
                <p className="text-[10px] text-primary flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Criptografado de Ponta a Ponta
                </p>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 pt-20">
              {messages.map(msg => {
                const isMine = msg.sender_id === user?.id;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMine ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-card border border-border text-foreground rounded-tl-sm'}`}>
                      {msg.decrypted_content}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 mx-1">
                      {format(new Date(msg.created_at), "HH:mm")}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-card border-t border-border absolute bottom-0 left-0 w-full">
              {targetPublicKey ? (
                <div className="flex gap-2 relative">
                  <Input 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Mensagem criptografada..."
                    className="flex-1 rounded-full bg-background border-border pr-12 focus-visible:ring-primary"
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                  />
                  <Button size="icon" className="absolute right-1 top-1 bottom-1 rounded-full w-8 h-8 bg-primary hover:bg-primary/90 text-black" onClick={handleSend} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              ) : (
                <div className="text-center text-sm text-destructive p-2 bg-destructive/10 rounded-lg">
                  Este usuário ainda não gerou chaves de criptografia.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-muted-foreground bg-background">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-border flex items-center justify-center mb-4">
              <Lock className="w-10 h-10 text-border" />
            </div>
            <p className="font-semibold text-lg">Suas Mensagens (E2EE)</p>
            <p className="text-sm max-w-sm text-center mt-2">
              Selecione uma conversa ao lado ou vá no perfil de alguém para iniciar um chat 100% privado e criptografado de ponta a ponta.
            </p>
          </div>
        )}

      </main>
    </div>
  );
}
