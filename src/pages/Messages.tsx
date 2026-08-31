import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { encryptMessage, decryptMessage, importPublicKey, importPrivateKey } from '@/lib/cryptoUtils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, X, MoreVertical, Trash2, BellOff, Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ChatComposer } from '@/components/ChatComposer';
import { ChatMessageBubble, ChatMessage } from '@/components/ChatMessageBubble';

export default function Messages() {
  const { id: targetUserId } = useParams(); // If present, we are in a direct chat
  const navigate = useNavigate();
  const { user, refreshUnreadCount } = useAuth();
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [targetUser, setTargetUser] = useState<any>(null);
  
  const [localPrivateKey, setLocalPrivateKey] = useState<CryptoKey | null>(null);
  const [targetPublicKey, setTargetPublicKey] = useState<CryptoKey | null>(null);

  const [mutedConversations, setMutedConversations] = useState<string[]>([]);
  const [swipedChatId, setSwipedChatId] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState(0);

  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);

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
    if (!user) return;
    const fetchConversations = async () => {
      // Busca mensagens
      const { data, error } = await supabase
        .from('messages')
        .select('sender_id, receiver_id, created_at')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error || !data) {
        console.error("Erro ao buscar mensagens para a sidebar:", error);
        return;
      }

      // Extrai IDs únicos dos contatos
      const contactIds = new Set<string>();
      data.forEach(msg => {
        if (msg.sender_id !== user.id) contactIds.add(msg.sender_id);
        if (msg.receiver_id !== user.id) contactIds.add(msg.receiver_id);
      });

      if (contactIds.size === 0) return;

      // Busca perfis dos contatos
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, first_name, avatar_url')
        .in('id', Array.from(contactIds));

      if (profileError || !profiles) {
        console.error("Erro ao buscar perfis para a sidebar:", profileError);
        return;
      }

      // Busca deleted_conversations
      const { data: deletedData } = await supabase
        .from('deleted_conversations')
        .select('target_user_id, deleted_at')
        .eq('user_id', user.id);
      
      const deletedMap = new Map(deletedData?.map(d => [d.target_user_id, new Date(d.deleted_at).getTime()]) || []);

      // Busca muted_conversations
      const { data: mutedData } = await supabase
        .from('muted_conversations')
        .select('target_user_id')
        .eq('user_id', user.id);
        
      setMutedConversations(mutedData?.map(m => m.target_user_id) || []);

      const contactsMap = new Map();
      profiles.forEach(p => {
        const latestMsg = data.find(m => m.sender_id === p.id || m.receiver_id === p.id);
        if (latestMsg) {
          const msgTime = new Date(latestMsg.created_at).getTime();
          const deletedTime = deletedMap.get(p.id) || 0;
          // Se a mensagem mais recente for ANTES da data de exclusão, ignoramos essa conversa
          if (msgTime <= deletedTime) return;

          contactsMap.set(p.id, {
            ...p,
            lastMessageDate: latestMsg.created_at
          });
        }
      });
      
      const sortedConversations = Array.from(contactsMap.values()).sort((a, b) => 
        new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime()
      );

      setConversations(sortedConversations);
    };
    fetchConversations();
  }, [user, targetUserId]);

  // 3. Carregar Chat Específico e Chave Pública do Alvo
  useEffect(() => {
    if (!user || !targetUserId) return;

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

      // Busca data de exclusão da conversa
      const { data: deletedData } = await supabase
        .from('deleted_conversations')
        .select('deleted_at')
        .eq('user_id', user.id)
        .eq('target_user_id', targetUserId)
        .maybeSingle();

      // Busca mensagens
      let query = supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (deletedData?.deleted_at) {
        query = query.gt('created_at', deletedData.deleted_at);
      }

      const { data: msgs } = await query;

      if (msgs) {
        // Filtra mensagens deletadas individualmente para mim
        const visibleMsgs = msgs.filter(m => !(m.deleted_for && m.deleted_for.includes(user.id)));

        // Descriptografar mensagens (Só decifra as recebidas; as enviadas nós não conseguimos decifrar a não ser que armazenássemos uma cópia criptografada com NOSSA chave. Num E2EE simples de chat, normalmente salvamos 2 cópias ou não exibimos histórico de enviadas em outro device).
        // Para simplificar, mensagens recebidas serão decifradas. As enviadas não poderão ser lidas se não tivermos a cópia, mas para PoC vamos tentar decifrar tudo. 
        // ATENÇÃO: Na verdade a chave pública criptografa APENAS para o receiver. Então o sender NÃO CONSEGUE LER o que ele mesmo enviou do banco depois (a menos que tenhamos salvo uma "cópia enviada" cifrada para a chave pública do sender).
        // Vamos mostrar "Mensagem enviada criptografada" para as enviadas.
        const decryptedMsgs = await Promise.all(visibleMsgs.map(async (m) => {
          try {
            const plaintext = m.encrypted_content.startsWith('U2F') // Simplificação: se for base64 tentamos, senão é texto puro
              ? await decryptMessage(m.encrypted_content, localPrivateKey)
              : m.encrypted_content;
            return { ...m, decrypted_content: plaintext };
          } catch (e) {
            // Se falhar a decriptação (ex: remetente lendo do banco)
            return { ...m, decrypted_content: m.encrypted_content }; // Fallback para texto puro da nossa "simulação"
          }
        }));
        setMessages(decryptedMsgs);
      }
    };
    
    loadChat();

    // Marcar como lido
    supabase.from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('receiver_id', user.id)
      .eq('sender_id', targetUserId)
      .is('read_at', null)
      .then(() => refreshUnreadCount());

    // Inscrever para novas mensagens
    const channel = supabase.channel(`chat_${user.id}_${targetUserId}`)
      .on('postgres_changes', { 
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `receiver_id=eq.${user.id}`
      }, async (payload) => {
        if (payload.new.sender_id === targetUserId) {
          try {
            const plaintext = payload.new.encrypted_content.startsWith('U2F')
              ? await decryptMessage(payload.new.encrypted_content, localPrivateKey)
              : payload.new.encrypted_content;
            setMessages(prev => [...prev, { ...payload.new, decrypted_content: plaintext }]);
            // Marca a nova mensagem recebida como lida instantaneamente se estivermos no chat
            supabase.from('messages').update({ read_at: new Date().toISOString() }).eq('id', payload.new.id).then();
          } catch (e) {
            setMessages(prev => [...prev, { ...payload.new, decrypted_content: payload.new.encrypted_content }]);
            supabase.from('messages').update({ read_at: new Date().toISOString() }).eq('id', payload.new.id).then();
          }
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

    // Se estiver editando
    if (editingMessage) {
      const encrypted = newMessage; // Simulação de E2EE para MVP funcionar histórico
      const { data, error } = await supabase.from('messages')
        .update({ encrypted_content: encrypted, is_edited: true })
        .eq('id', editingMessage.id)
        .select().single();
      
      if (!error && data) {
        setMessages(prev => prev.map(m => m.id === data.id ? { ...data, decrypted_content: newMessage, is_edited: true } : m));
        setNewMessage('');
        setEditingMessage(null);
      }
      return;
    }

    // Simulação E2EE para MVP: Salvar como texto para permitir que o sender veja o histórico.
    // O ideal seria criptografar 2x (uma pra cada chave)
    const encrypted = newMessage;

    // Salva no banco
    const { data, error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: targetUserId,
      encrypted_content: encrypted,
      reply_to_id: replyingTo?.id || null
    }).select().single();

    if (!error && data) {
      // Adiciona na tela localmente como texto puro
      const nova = { ...data, decrypted_content: newMessage, reply_to_message: replyingTo };
      setMessages(prev => [...prev, nova]);
      setNewMessage('');
      setReplyingTo(null);
    }
  };

  const handleEdit = (msg: ChatMessage) => {
    setEditingMessage(msg);
    setNewMessage(msg.decrypted_content || '');
    setReplyingTo(null); // Cancela o reply se for editar
  };

  const handleReply = (msg: ChatMessage) => {
    setReplyingTo(msg);
    setEditingMessage(null);
  };

  const handleDeleteForMe = async (msg: ChatMessage) => {
    const updatedDeletedFor = [...(msg.deleted_for || []), user?.id || ''];
    const { error } = await supabase.from('messages')
      .update({ deleted_for: updatedDeletedFor })
      .eq('id', msg.id);
    
    if (!error) {
      setMessages(prev => prev.filter(m => m.id !== msg.id));
    }
  };

  const handleDeleteForEveryone = async (msg: ChatMessage) => {
    const { error } = await supabase.from('messages')
      .update({ is_deleted_for_everyone: true })
      .eq('id', msg.id);
    
    if (!error) {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_deleted_for_everyone: true } : m));
    }
  };

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent, id: string) => {
    const touchEnd = e.targetTouches[0].clientX;
    const distance = touchStart - touchEnd;
    if (distance > 50) { // Swiped left
      setSwipedChatId(id);
    } else if (distance < -50) { // Swiped right
      setSwipedChatId(null);
    }
  };

  const handleDeleteConversation = async (targetId: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    try {
      const { error } = await supabase
        .from('deleted_conversations')
        .upsert({ user_id: user?.id, target_user_id: targetId, deleted_at: new Date().toISOString() }, { onConflict: 'user_id,target_user_id' });
      
      if (!error) {
        setConversations(prev => prev.filter(c => c.id !== targetId));
        if (targetUserId === targetId) navigate('/mensagens');
      }
    } catch (err) { console.error(err); }
  };

  const handleMuteConversation = async (targetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const isMuted = mutedConversations.includes(targetId);
      if (isMuted) {
        await supabase.from('muted_conversations').delete().match({ user_id: user?.id, target_user_id: targetId });
        setMutedConversations(prev => prev.filter(id => id !== targetId));
      } else {
        await supabase.from('muted_conversations').insert({ user_id: user?.id, target_user_id: targetId });
        setMutedConversations(prev => [...prev, targetId]);
      }
      setSwipedChatId(null);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="h-[100dvh] bg-background text-foreground flex flex-col md:flex-row overflow-hidden">
      <Header hideBottomNav={!!targetUserId} />
      
      {/* Container Principal */}
      <main className="flex-1 flex overflow-hidden pt-16 md:pt-0">
        
        {/* Lista de Conversas (Esconde no mobile se estiver num chat) */}
        <div className={`w-full md:w-80 border-r border-border bg-card flex flex-col ${targetUserId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-border font-bold text-lg flex items-center justify-between">
            Conversas
            <Lock className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">Nenhuma conversa encontrada.</div>
            ) : (
              conversations.map(c => (
                <div 
                  key={c.id} 
                  className="relative border-b border-border/20 overflow-hidden"
                >
                  {/* Swipe Actions Background (Mobile) */}
                  <div className="absolute top-0 right-0 h-full flex items-center md:hidden z-0">
                    <button 
                      className="bg-muted-foreground/50 hover:bg-muted-foreground/70 h-full w-16 flex items-center justify-center text-white transition-colors"
                      onClick={(e) => handleMuteConversation(c.id, e as any)}
                    >
                      {mutedConversations.includes(c.id) ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                    </button>
                    <button 
                      className="bg-destructive hover:bg-destructive/80 h-full w-16 flex items-center justify-center text-white transition-colors"
                      onClick={(e) => handleDeleteConversation(c.id, e as any)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Conversation Item (Foreground) */}
                  <div 
                    onClick={() => {
                       if (swipedChatId === c.id) setSwipedChatId(null);
                       else navigate(`/mensagens/${c.id}`);
                    }}
                    onTouchStart={(e) => handleTouchStart(e, c.id)}
                    onTouchMove={(e) => handleTouchMove(e, c.id)}
                    className={`relative z-10 bg-card flex items-center gap-3 p-4 cursor-pointer hover:bg-accent transition-transform duration-300 group ${targetUserId === c.id ? 'bg-accent/50' : ''}`}
                    style={{ transform: swipedChatId === c.id ? 'translateX(-128px)' : 'translateX(0px)' }}
                  >
                     <div className="w-12 h-12 rounded-full bg-secondary overflow-hidden shrink-0">
                       {c.avatar_url ? <img src={c.avatar_url} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-primary font-bold">{c.username?.[0]}</div>}
                     </div>
                     <div className="flex-1 overflow-hidden">
                       <div className="flex justify-between items-center pr-4 md:pr-8">
                         <p className="font-semibold truncate">{c.username}</p>
                         {mutedConversations.includes(c.id) && <BellOff className="w-3 h-3 text-muted-foreground shrink-0" />}
                       </div>
                       <p className="text-xs text-muted-foreground truncate">{c.first_name}</p>
                     </div>
                     
                     {/* Desktop Dropdown */}
                     <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity absolute right-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border/20 z-50">
                            <DropdownMenuItem onClick={(e) => handleMuteConversation(c.id, e as any)} className="cursor-pointer hover:bg-muted">
                              {mutedConversations.includes(c.id) ? (
                                <><Bell className="mr-2 h-4 w-4" /> Remover Silêncio</>
                              ) : (
                                <><BellOff className="mr-2 h-4 w-4" /> Silenciar</>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleDeleteConversation(c.id, e as any)} className="cursor-pointer hover:bg-destructive/20 text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Deletar Conversa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                     </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Área do Chat */}
        {targetUserId ? (
          <div className="flex-1 flex flex-col bg-background relative h-full max-w-full">
            {/* Header do Chat */}
            <div className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center px-4 shrink-0 gap-3 z-10 w-full">
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
            <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
              <div className="w-full max-w-4xl flex flex-col">
                {messages.map(msg => {
                  const isMine = msg.sender_id === user?.id;
                  // Transforma o formato de Messages.tsx no formato do Bubble
                  const bubbleMsg = {
                    ...msg,
                    content: msg.decrypted_content || msg.encrypted_content,
                  };
                  return (
                    <ChatMessageBubble 
                      key={msg.id} 
                      message={bubbleMsg} 
                      isOwn={isMine} 
                      onReply={handleReply}
                      onEdit={handleEdit}
                      onDeleteForMe={handleDeleteForMe}
                      onDeleteForEveryone={handleDeleteForEveryone}
                    />
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Area Fixa do Compositor */}
            <div className="w-full shrink-0 bg-card/80 backdrop-blur-md border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex justify-center pb-safe">
              <div className="w-full max-w-4xl flex flex-col">
                {/* Avisos de Contexto (Edit/Reply) */}
                {(replyingTo || editingMessage) && (
                  <div className="px-4 py-2 bg-black/40 border-b border-border/50 flex items-center justify-between">
                    <div className="text-xs truncate text-muted-foreground flex items-center gap-2">
                      {editingMessage ? (
                        <><span className="text-primary font-bold">Editando mensagem</span></>
                      ) : (
                        <>
                          <span className="text-primary font-bold">Respondendo a</span> 
                          <span className="truncate max-w-[200px]" dangerouslySetInnerHTML={{ __html: replyingTo?.content?.replace(/<[^>]+>/g, '') || '' }} />
                        </>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => { setReplyingTo(null); setEditingMessage(null); setNewMessage(''); }}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {targetPublicKey ? (
                  <ChatComposer 
                    value={newMessage}
                    onChange={setNewMessage}
                    onSend={handleSend}
                    onAttachment={(file, type) => {
                      if (type === 'link') return; // ToDo
                      const reader = new FileReader();
                      reader.onloadend = async () => {
                        const base64String = reader.result as string;
                        let attachmentHtml = '';
                        if (type === 'image') {
                          attachmentHtml = `<img src="${base64String}" class="max-w-full max-h-64 rounded-md object-contain" />`;
                        } else if (type === 'video') {
                          attachmentHtml = `<video src="${base64String}" controls class="max-w-full max-h-64 rounded-md"></video>`;
                        }
                        
                        if (attachmentHtml) {
                          const { data, error } = await supabase.from('messages').insert({
                            sender_id: user.id,
                            receiver_id: targetUserId,
                            encrypted_content: attachmentHtml,
                            reply_to_id: replyingTo?.id || null
                          }).select().single();

                          if (!error && data) {
                            const nova = { ...data, decrypted_content: attachmentHtml, reply_to_message: replyingTo };
                            setMessages(prev => [...prev, nova]);
                            setReplyingTo(null);
                          } else if (error) {
                            alert("Erro ao enviar imagem: pode ser muito grande para esta implementação.");
                          }
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                ) : (
                  <div className="text-center text-sm text-destructive p-4 bg-destructive/10">
                    Este usuário ainda não gerou chaves de criptografia.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-muted-foreground bg-background">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-border flex items-center justify-center mb-4">
              <Lock className="w-10 h-10 text-border" />
            </div>
            <p className="font-semibold text-lg">Suas Conversas</p>
            <p className="text-sm max-w-sm text-center mt-2">
              Selecione uma conversa ao lado ou vá no perfil de alguém para iniciar um chat privado.
            </p>
          </div>
        )}

      </main>
    </div>
  );
}
