import { useState, useEffect, useRef, useCallback } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, Image as ImageIcon, Send, Clock, Heart, RefreshCw, X, Link as LinkIcon, 
  Newspaper, Flame, MoreVertical, Trash2, Pencil, Check, Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { FeedItem, fetchNewsFeeds, shuffleArray } from '@/utils/feedUtils';

const ITEMS_PER_PAGE = 10;

function UserHome() {
  const { user, profile, loading } = useAuth();
  
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [feedData, setFeedData] = useState<FeedItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Controle do Infinite Scroll (Paginamento)
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef(null);
  
  // Estado de Edição
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchTimeline = useCallback(async (isPullToRefresh = false, pageNum = 1) => {
    if (isPullToRefresh) {
      setIsRefreshing(true);
      setPage(1);
      pageNum = 1;
    } else if (pageNum > 1) {
      setIsLoadingMore(true);
    }

    try {
      // 1. Buscar Posts do Supabase com Paginação
      const from = (pageNum - 1) * ITEMS_PER_PAGE;
      const to = (pageNum * ITEMS_PER_PAGE) - 1;

      const { data: postsData, error: postsError, count } = await supabase
        .from('social_posts')
        .select(`
          *,
          profiles (first_name, last_name, avatar_url),
          post_likes (user_id)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (postsError) throw postsError;
      
      if (count !== null && to >= count) {
        setHasMorePosts(false);
      } else {
        setHasMorePosts(true);
      }

      const formattedPosts: FeedItem[] = (postsData || []).map((post: any) => ({
        type: 'post',
        id: post.id,
        user_id: post.user_id,
        content: post.content,
        image_url: post.image_url,
        date: new Date(post.created_at),
        author: `${post.profiles?.first_name || 'Usuário'} ${post.profiles?.last_name || ''}`,
        avatar_url: post.profiles?.avatar_url,
        likes_count: post.post_likes?.length || 0,
        has_liked: post.post_likes?.some((like: any) => like.user_id === user?.id) || false
      }));

      // 2. Buscar Notícias RSS
      let formattedNews: FeedItem[] = [];
      if (pageNum === 1) {
        formattedNews = await fetchNewsFeeds();

        if (formattedNews.length > 0 && user) {
          const links = formattedNews.map(n => n.id);
          const { data: newsLikesData } = await supabase.from('news_likes').select('*').in('news_link', links);
            
          if (newsLikesData) {
            formattedNews = formattedNews.map(news => {
              const likesForThisNews = newsLikesData.filter(l => l.news_link === news.id);
              return {
                ...news,
                likes_count: likesForThisNews.length,
                has_liked: likesForThisNews.some(l => l.user_id === user.id)
              };
            });
          }
        }
      }

      // Merge & Sort
      if (pageNum === 1) {
        // EMBARALHAMENTO DO FEED INICIAL PARA EVITAR REPETIÇÃO:
        
        // Criando alguns anúncios nativos para monetizar o feed
        const sponsorAds: FeedItem[] = [
          {
            type: 'news',
            id: 'sponsor_1',
            title: '🔥 Comparador de Preços: Menor preço no Smartphone Quantum Pro',
            content: 'Nossa inteligência artificial rastreou o menor preço entre Amazon, Shopee e Mercado Livre. Confira a oferta na nossa Central!',
            image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800',
            date: new Date(),
            link: '/loja',
            category: 'Patrocinado',
            likes_count: 53,
            has_liked: false
          },
          {
            type: 'news',
            id: 'sponsor_2',
            title: '🔥 Achadinhos: Headset Gamer 7.1',
            content: 'Acabamos de achar um bug de preço na Shopee para este produto. Corre antes que acabe.',
            image_url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800',
            date: new Date(new Date().getTime() - 1000 * 60 * 30),
            link: '/loja',
            category: 'Patrocinado',
            likes_count: 12,
            has_liked: false
          }
        ];

        // Mantemos os 2 posts mais recentes de usuários da plataforma estritamente no topo para priorizar o conteúdo da comunidade
        const sortedPosts = [...formattedPosts].sort((a, b) => b.date.getTime() - a.date.getTime());
        const topPosts = sortedPosts.slice(0, 2);
        
        // O restante se mistura com notícias e ANÚNCIOS PATROCINADOS
        const restOfPosts = sortedPosts.slice(2);
        const shuffledMix = shuffleArray([...restOfPosts, ...formattedNews, ...sponsorAds]);
        
        setFeedData([...topPosts, ...shuffledMix]);
      } else {
        // Se for página > 1, estamos descendo, apenas anexe os novos posts mais antigos
        setFeedData(prev => {
          // Usa Map para evitar chaves/ids duplicados caso o usuário puxe algo que já estava lá
          const newItemsMap = new Map(prev.map(item => [item.id, item]));
          formattedPosts.forEach(post => newItemsMap.set(post.id, post));
          return Array.from(newItemsMap.values()).sort((a, b) => b.date.getTime() - a.date.getTime());
        });
      }
    } catch (error) {
      console.error("Erro timeline", error);
    } finally {
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  }, [user]);

  // Carregamento Inicial
  useEffect(() => {
    if (user) fetchTimeline(true, 1);
  }, [user, fetchTimeline]);

  // Lógica do Intersection Observer para INFINITE SCROLL
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMorePosts && !isLoadingMore && !isRefreshing) {
          setPage(prev => {
            const next = prev + 1;
            fetchTimeline(false, next);
            return next;
          });
        }
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [observerTarget, hasMorePosts, isLoadingMore, isRefreshing, fetchTimeline]);

  // Lógica de Pull-To-Refresh no Mobile
  useEffect(() => {
    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const handleTouchEnd = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        const endY = e.changedTouches[0].clientY;
        if (endY - startY > 150) fetchTimeline(true, 1);
      }
    };
    
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [fetchTimeline]);


  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePublish = async () => {
    if (!postContent.trim() && !postImage) return;
    setIsPublishing(true);
    let image_url = null;
    try {
      if (postImage) {
        const fileExt = postImage.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user?.id}/${fileName}`;
        const { error } = await supabase.storage.from('post_images').upload(filePath, postImage);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('post_images').getPublicUrl(filePath);
        image_url = publicUrl;
      }
      const { error } = await supabase.from('social_posts').insert({
        user_id: user?.id,
        content: postContent,
        image_url: image_url
      });
      if (error) throw error;
      
      setPostContent('');
      setPostImage(null);
      setImagePreview(null);
      // Ao postar algo novo, volta pra página 1
      fetchTimeline(true, 1);
    } catch (error) {
      console.error("Erro ao publicar:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase.from('social_posts').delete().eq('id', postId);
      if (error) throw error;
      setFeedData(current => current.filter(item => item.id !== postId));
    } catch (error) {
      console.error("Erro ao excluir", error);
    }
  };

  const startEditing = (post: FeedItem) => {
    setEditingPostId(post.id);
    setEditContent(post.content || '');
  };

  const handleSaveEdit = async (postId: string) => {
    try {
      const { error } = await supabase.from('social_posts').update({ content: editContent }).eq('id', postId);
      if (error) throw error;
      setFeedData(current => current.map(item => item.id === postId ? { ...item, content: editContent } : item));
      setEditingPostId(null);
    } catch (error) {
      console.error("Erro ao editar", error);
    }
  };

  const handleLike = async (item: FeedItem) => {
    if (!user) return;
    try {
      if (item.type === 'post') {
        if (item.has_liked) {
          await supabase.from('post_likes').delete().match({ user_id: user.id, post_id: item.id });
        } else {
          await supabase.from('post_likes').insert({ user_id: user.id, post_id: item.id });
          
          // Disparar Notificação (Se não for curtir o próprio post)
          if (item.user_id && item.user_id !== user.id) {
            await supabase.from('notifications').insert({
              recipient_id: item.user_id,
              sender_id: user.id,
              type: 'like_post',
              post_id: item.id
            });
          }
        }
      } else {
        if (item.has_liked) await supabase.from('news_likes').delete().match({ user_id: user.id, news_link: item.id });
        else await supabase.from('news_likes').insert({ user_id: user.id, news_link: item.id, news_title: item.title });
      }
      setFeedData(current => current.map(f => f.id === item.id ? {
        ...f, has_liked: !f.has_liked, likes_count: f.has_liked ? f.likes_count - 1 : f.likes_count + 1
      } : f));
    } catch (error) {
      console.error("Erro ao curtir", error);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center animate-pulse">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Banner Cyberpunk */}
        <div className="bg-card/40 border-b border-border/20 py-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neon-cyan via-background to-background"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-2xl md:text-4xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple mb-4">
              CAPITAL DAARK
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              A comunidade imbatível. Libertária, descentralizada e focada no futuro.
            </p>
          </div>
        </div>
        
        <main className="container mx-auto px-2 md:px-6 py-6 pb-20">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Pull to Refresh */}
            {isRefreshing && (
              <div className="flex justify-center py-4">
                <div className="bg-primary/20 text-primary px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,255,0.3)] animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sincronizando a Rede...
                </div>
              </div>
            )}

            {/* CAIXA DE POSTAGEM */}
            <Card className="border-border/30 bg-card/60 backdrop-blur shadow-lg shadow-black/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary" />
              <CardContent className="p-4 pt-6">
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/40 overflow-hidden flex-shrink-0">
                    {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <User className="w-full h-full p-2 text-primary" />}
                  </div>
                  <div className="flex-grow space-y-3">
                    <Input 
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder={`Dissemine a ideia, ${profile?.first_name || 'anarquista'}...`}
                      className="bg-background/80 border-border/50 focus-visible:ring-primary shadow-inner"
                      onKeyDown={(e) => e.key === 'Enter' && handlePublish()}
                    />
                    
                    {imagePreview && (
                      <div className="relative inline-block mt-2">
                        <img src={imagePreview} alt="Preview" className="max-h-48 rounded-md border border-primary/30" />
                        <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 w-6 h-6 rounded-full" onClick={() => {setPostImage(null); setImagePreview(null);}}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-2">
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageSelect} />
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-neon-cyan" onClick={() => fileInputRef.current?.click()}>
                          <ImageIcon className="w-4 h-4 mr-2" /> Mídia
                        </Button>
                      </div>
                      <Button size="sm" className="bg-primary text-black font-semibold shadow-[0_0_10px_rgba(0,255,255,0.4)]" onClick={handlePublish} disabled={isPublishing || (!postContent.trim() && !postImage)}>
                        {isPublishing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                        Transmitir
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* TIMELINE */}
            <div className="space-y-6 pt-4">
              {feedData.length === 0 && !isRefreshing && (
                <div className="text-center p-8 text-muted-foreground border border-dashed border-border/50 rounded-xl">
                  A rede está silenciosa...
                </div>
              )}
              
              {feedData.map((item) => (
                item.type === 'post' ? (
                  // ----- POST DE USUÁRIO -----
                  <Card key={item.id} className="border-border/20 bg-card overflow-hidden hover:border-primary/30 transition-colors">
                    <CardContent className="p-0">
                      <div className="p-4 flex justify-between items-start bg-background/30">
                        <div className="flex gap-3 items-center">
                          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 overflow-hidden">
                            {item.avatar_url ? <img src={item.avatar_url} className="w-full h-full object-cover"/> : <User className="w-full h-full p-2 text-primary"/>}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-white">{item.author}</p>
                            <p className="text-xs text-muted-foreground">{formatDistanceToNow(item.date, { addSuffix: true, locale: ptBR })}</p>
                          </div>
                        </div>

                        {/* Menu Três Pontinhos */}
                        {item.user_id === user?.id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-card/95 border-border/20">
                              <DropdownMenuItem onClick={() => startEditing(item)} className="cursor-pointer hover:bg-muted">
                                <Pencil className="mr-2 h-4 w-4" /> Editar Publicação
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeletePost(item.id)} className="cursor-pointer hover:bg-destructive/20 text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Excluir permanentemente
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                      
                      {/* Conteúdo do Post */}
                      <div className="px-4 py-3 text-sm text-gray-200 whitespace-pre-wrap">
                        {editingPostId === item.id ? (
                          <div className="space-y-2">
                            <Textarea 
                              value={editContent} 
                              onChange={(e) => setEditContent(e.target.value)}
                              className="bg-background border-primary/50 focus-visible:ring-primary min-h-[100px]"
                            />
                            <div className="flex gap-2 justify-end">
                              <Button variant="ghost" size="sm" onClick={() => setEditingPostId(null)}>Cancelar</Button>
                              <Button size="sm" className="bg-primary text-black" onClick={() => handleSaveEdit(item.id)}>
                                <Check className="w-4 h-4 mr-1"/> Salvar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          item.content
                        )}
                      </div>

                      {item.image_url && <img src={item.image_url} alt="Post media" className="w-full max-h-96 object-cover border-y border-border/20" />}
                      
                      <div className="p-3 bg-background/20 flex gap-2">
                        <Button variant="ghost" size="sm" className={`flex-1 ${item.has_liked ? 'text-neon-cyan' : 'text-muted-foreground'}`} onClick={() => handleLike(item)}>
                          <Flame className={`w-4 h-4 mr-2 ${item.has_liked ? 'fill-neon-cyan' : ''}`} /> {item.likes_count > 0 ? item.likes_count : 'Gostar'}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground flex-1">Comentar</Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  // ----- NOTÍCIA RSS -----
                  <Card key={item.id} className="border-neon-purple/20 bg-card/60 backdrop-blur-sm overflow-hidden hover:border-neon-purple/50 transition-colors cursor-pointer relative group">
                    <div className="absolute top-0 right-0 p-2 z-10">
                      <Badge variant="outline" className="bg-background/80 text-neon-purple border-neon-purple/50">
                        <Newspaper className="w-3 h-3 mr-1" /> {item.category}
                      </Badge>
                    </div>
                    <div onClick={() => window.open(item.link, '_blank')}>
                      {item.image_url && (
                        <div className="relative h-48 w-full overflow-hidden">
                          <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-2 text-white group-hover:text-neon-purple transition-colors line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.content}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" /> {formatDistanceToNow(item.date, { addSuffix: true, locale: ptBR })}
                        </div>
                      </CardContent>
                    </div>
                    <div className="p-3 border-t border-border/10 bg-background/20 flex gap-2">
                        <Button variant="ghost" size="sm" className={`flex-1 ${item.has_liked ? 'text-neon-purple' : 'text-muted-foreground hover:text-neon-purple'}`} onClick={(e) => { e.stopPropagation(); handleLike(item); }}>
                          <Heart className={`w-4 h-4 mr-2 ${item.has_liked ? 'fill-neon-purple' : ''}`} /> {item.likes_count > 0 ? item.likes_count : 'Inspirador'}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-neon-purple flex-1" onClick={() => window.open(item.link, '_blank')}>
                          <LinkIcon className="w-4 h-4 mr-2" /> Ler Artigo
                        </Button>
                      </div>
                  </Card>
                )
              ))}
              
              {/* SENSOR DO FIM DA PÁGINA (INFINITE SCROLL) */}
              <div ref={observerTarget} className="py-6 flex justify-center items-center">
                {isLoadingMore ? (
                  <div className="flex items-center text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Carregando memórias da rede...
                  </div>
                ) : !hasMorePosts && page > 1 ? (
                  <p className="text-muted-foreground text-sm">Fim da linha do tempo. Crie novas memórias.</p>
                ) : null}
              </div>

            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

export default UserHome;