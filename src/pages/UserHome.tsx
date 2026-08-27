import { useState, useEffect, useRef, useCallback } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, Image as ImageIcon, Send, Clock, Heart, RefreshCw, X, Link as LinkIcon, 
  Newspaper, Flame, MoreVertical, Trash2, Pencil, Check, Loader2, MessageCircle
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

import { FeedItem, fetchNewsFeeds, shuffleArray, formatSocialDate } from '@/utils/feedUtils';

const ITEMS_PER_PAGE = 10;

function UserHome() {
  const navigate = useNavigate();
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
  
  // Estado de Edição de POST
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Estado do Modal (Instagram Post)
  const [selectedPost, setSelectedPost] = useState<FeedItem | null>(null);

  // Estados de Comentários
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');

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
      // 1. Buscar Posts do Supabase com Paginação e COMENTÁRIOS
      const from = (pageNum - 1) * ITEMS_PER_PAGE;
      const to = (pageNum * ITEMS_PER_PAGE) - 1;

      const { data: postsData, error: postsError, count } = await supabase
        .from('social_posts')
        .select(`
          *,
          profiles (first_name, last_name, avatar_url, username),
          post_likes (user_id),
          post_comments (id, content, created_at, user_id, profiles(first_name, last_name, username, avatar_url))
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
        username: post.profiles?.username,
        avatar_url: post.profiles?.avatar_url,
        likes_count: post.post_likes?.length || 0,
        has_liked: post.post_likes?.some((like: any) => like.user_id === user?.id) || false,
        comments: (post.post_comments || []).sort((a:any, b:any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      }));

      // 2. Buscar Notícias RSS (Agora para todas as páginas)
      let formattedNews: FeedItem[] = [];
      formattedNews = await fetchNewsFeeds(pageNum);

      if (formattedNews.length > 0 && user) {
        const links = formattedNews.map(n => n.id);
        
        // Buscar likes e comentários das notícias
        const [newsLikesData, newsCommentsData] = await Promise.all([
          supabase.from('news_likes').select('*').in('news_link', links),
          supabase.from('news_comments').select('id, news_link, content, created_at, user_id, profiles(first_name, last_name, username, avatar_url)').in('news_link', links)
        ]);
          
        formattedNews = formattedNews.map(news => {
          const likesForThisNews = newsLikesData.data?.filter(l => l.news_link === news.id) || [];
          const commentsForThisNews = newsCommentsData.data?.filter(c => c.news_link === news.id) || [];
          
          return {
            ...news,
            likes_count: likesForThisNews.length,
            has_liked: likesForThisNews.some(l => l.user_id === user.id),
            comments: commentsForThisNews.sort((a:any, b:any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          };
        });
      }

      // 3. Buscar ANÚNCIOS (Ofertas da Loja em destaque)
      let sponsorAds: FeedItem[] = [];
      if (pageNum === 1) {
        const { data: adsData } = await supabase.from('affiliate_products').select('*').eq('featured', true).limit(5);
        if (adsData) {
          sponsorAds = adsData.map((ad: any) => ({
            type: 'news',
            id: `sponsor_${ad.id}`,
            title: `🔥 OFERTA: ${ad.nome}`,
            content: `Confira essa super oferta rastreada pelo nosso sistema com o menor preço.`,
            image_url: ad.image,
            link: '/loja',
            date: new Date(ad.created_at || new Date()),
            category: 'Patrocinado',
            likes_count: Math.floor(Math.random() * 100),
            has_liked: false,
            comments: []
          }));
        }
      }

      // Merge & Sort
      if (pageNum === 1) {
        const sortedPosts = [...formattedPosts].sort((a, b) => b.date.getTime() - a.date.getTime());
        const topPosts = sortedPosts.slice(0, 2);
        const restOfPosts = sortedPosts.slice(2);
        const shuffledMix = shuffleArray([...restOfPosts, ...formattedNews, ...sponsorAds]);
        setFeedData([...topPosts, ...shuffledMix]);
      } else {
        setFeedData(prev => {
          const newItemsMap = new Map(prev.map(item => [item.id, item]));
          // Adiciona posts antigos
          formattedPosts.forEach(post => newItemsMap.set(post.id, post));
          // Adiciona novas notícias da rolagem infinita
          formattedNews.forEach(news => newItemsMap.set(news.id, news));
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
    if (user) {
      fetchTimeline(true, 1);
      import('@/lib/cryptoUtils').then(m => m.initializeUserKeys(user.id));
    }
  }, [user, fetchTimeline]);

  // Lógica do Intersection Observer para INFINITE SCROLL
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        // Agora verificamos se está carregando. O 'hasMorePosts' servia só pro Supabase, 
        // mas como queremos notícias infinitas, tiramos essa trava pra continuar rolando
        if (entries[0].isIntersecting && !isLoadingMore && !isRefreshing) {
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
  }, [observerTarget, isLoadingMore, isRefreshing, fetchTimeline]);

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

  // --- LÓGICA DE COMENTÁRIOS ---
  const toggleComments = (itemId: string) => {
    setExpandedComments(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleCommentSubmit = async (item: FeedItem) => {
    if (!user) return;
    const text = commentInputs[item.id];
    if (!text || !text.trim()) return;

    try {
      let insertedComment: any = null;

      if (item.type === 'post') {
        const { data, error } = await supabase.from('post_comments').insert({
          post_id: item.id,
          user_id: user.id,
          content: text.trim()
        }).select('id, content, created_at, user_id, profiles(first_name, last_name, username, avatar_url)').single();
        if (error) throw error;
        insertedComment = data;
      } else {
        const { data, error } = await supabase.from('news_comments').insert({
          news_link: item.id,
          user_id: user.id,
          content: text.trim()
        }).select('id, news_link, content, created_at, user_id, profiles(first_name, last_name, username, avatar_url)').single();
        if (error) throw error;
        insertedComment = data;
      }

      setFeedData(current => current.map(f => f.id === item.id ? {
        ...f, comments: [...(f.comments || []), insertedComment]
      } : f));
      
      setCommentInputs(prev => ({ ...prev, [item.id]: '' }));
    } catch (error) {
      console.error("Erro ao comentar", error);
    }
  };

  const handleDeleteComment = async (commentId: string, item: FeedItem) => {
    try {
      if (item.type === 'post') {
        await supabase.from('post_comments').delete().eq('id', commentId);
      } else {
        await supabase.from('news_comments').delete().eq('id', commentId);
      }
      setFeedData(current => current.map(f => f.id === item.id ? {
        ...f, comments: f.comments?.filter(c => c.id !== commentId)
      } : f));
    } catch (error) {
      console.error("Erro ao excluir comentário", error);
    }
  };

  const startEditingComment = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  const handleSaveCommentEdit = async (commentId: string, item: FeedItem) => {
    try {
      if (item.type === 'post') {
        await supabase.from('post_comments').update({ content: editCommentContent }).eq('id', commentId);
      } else {
        await supabase.from('news_comments').update({ content: editCommentContent }).eq('id', commentId);
      }
      setFeedData(current => current.map(f => f.id === item.id ? {
        ...f, comments: f.comments?.map(c => c.id === commentId ? { ...c, content: editCommentContent } : c)
      } : f));
      setEditingCommentId(null);
    } catch (error) {
      console.error("Erro ao editar comentário", error);
    }
  };

  const renderComments = (item: FeedItem, forceShow = false) => {
    if (!expandedComments[item.id] && !forceShow) return null;
    
    return (
      <div className="bg-background/40 border-t border-border/10 p-4 space-y-4">
        {/* Lista de Comentários */}
        <div className="space-y-3">
          {item.comments && item.comments.length > 0 ? (
            item.comments.map(comment => (
              <div key={comment.id} className="flex gap-3 items-start group">
                <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden shrink-0">
                  {comment.profiles?.avatar_url ? (
                    <img src={comment.profiles.avatar_url} className="w-full h-full object-cover"/>
                  ) : (
                    <User className="w-full h-full p-1.5 text-primary" />
                  )}
                </div>
                <div className="flex-1 bg-card border border-border/30 rounded-2xl rounded-tl-none p-3 relative">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-baseline gap-2">
                      <p className="font-semibold text-xs text-white">
                        {comment.profiles?.first_name || 'Usuário'} {comment.profiles?.last_name || ''}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {formatSocialDate(comment.created_at)}
                      </span>
                    </div>
                    {/* Menu Três Pontinhos do Comentário */}
                    {comment.user_id === user?.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-white absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card/95 border-border/20 text-xs">
                          <DropdownMenuItem onClick={() => startEditingComment(comment)} className="cursor-pointer hover:bg-muted">
                            <Pencil className="mr-2 h-3 w-3" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteComment(comment.id, item)} className="cursor-pointer hover:bg-destructive/20 text-destructive">
                            <Trash2 className="mr-2 h-3 w-3" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  
                  {editingCommentId === comment.id ? (
                    <div className="space-y-2 mt-2">
                      <Input 
                        value={editCommentContent} 
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        className="bg-background border-primary/50 focus-visible:ring-primary h-8 text-xs"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setEditingCommentId(null)}>Cancelar</Button>
                        <Button size="sm" className="h-6 text-xs bg-primary text-black" onClick={() => handleSaveCommentEdit(comment.id, item)}>
                          <Check className="w-3 h-3 mr-1"/> Salvar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-xs text-muted-foreground py-2">Nenhum comentário ainda. Seja o primeiro!</div>
          )}
        </div>

        {/* Input para novo comentário */}
        <div className="flex gap-2 items-center pt-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/40 overflow-hidden shrink-0">
            {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <User className="w-full h-full p-1.5 text-primary" />}
          </div>
          <Input 
            value={commentInputs[item.id] || ''}
            onChange={(e) => setCommentInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
            placeholder="Escreva um comentário..."
            className="flex-1 bg-background border-border/50 focus-visible:ring-primary h-9 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(item)}
          />
          <Button size="icon" className="h-9 w-9 bg-primary text-black hover:bg-primary/90 shrink-0" onClick={() => handleCommentSubmit(item)}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
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
        
        <main className="container mx-auto px-2 md:px-6 py-6 pb-28">
          <div className="max-w-3xl mx-auto space-y-6">
            
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
                      placeholder={`Compartilhe uma atualização com a rede, ${profile?.first_name || 'membro'}...`}
                      className="bg-background/80 border-border/50 focus-visible:ring-primary shadow-inner"
                      onKeyDown={(e) => e.key === 'Enter' && handlePublish()}
                    />
                    
                    {imagePreview && (
                      <div className="relative inline-block mt-2">
                        {postImage?.type.startsWith('video/') ? (
                          <video src={imagePreview} controls className="max-h-48 rounded-md border border-primary/30" />
                        ) : (
                          <img src={imagePreview} alt="Preview" className="max-h-48 rounded-md border border-primary/30" />
                        )}
                        <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 w-6 h-6 rounded-full" onClick={() => {setPostImage(null); setImagePreview(null);}}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-2">
                        <input type="file" accept="image/*,video/*" className="hidden" ref={fileInputRef} onChange={handleImageSelect} />
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
                        <div 
                          className="flex gap-3 items-center cursor-pointer hover:bg-white/5 p-1 -m-1 rounded-lg transition-colors"
                          onClick={() => {
                            const searchParam = item.username || item.author?.split(' ')[0];
                            if (searchParam) navigate(`/usuario/${searchParam}`);
                          }}
                        >
                          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 overflow-hidden">
                            {item.avatar_url ? <img src={item.avatar_url} className="w-full h-full object-cover"/> : <User className="w-full h-full p-2 text-primary"/>}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-white hover:underline">{item.author}</p>
                            <p className="text-xs text-muted-foreground">{formatSocialDate(item.date)}</p>
                          </div>
                        </div>

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

                      {item.image_url && (
                        item.image_url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                          <video src={item.image_url} controls className="w-full max-h-[600px] object-contain bg-black border-y border-border/20 cursor-pointer" onClick={() => setSelectedPost(item)} />
                        ) : (
                          <img src={item.image_url} alt="Post media" className="w-full max-h-[600px] object-contain bg-black border-y border-border/20 cursor-pointer" onClick={() => setSelectedPost(item)} />
                        )
                      )}
                      
                      <div className="p-3 bg-background/20 flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`flex-1 group transition-all duration-300 ease-out ${
                            item.has_liked 
                              ? 'text-orange-500 bg-orange-500/10 hover:bg-orange-500/20 shadow-[inset_0_0_10px_rgba(249,115,22,0.1)]' 
                              : 'text-muted-foreground hover:text-orange-400 hover:bg-white/5'
                          }`} 
                          onClick={() => handleLike(item)}
                        >
                          <Flame 
                            className={`w-5 h-5 mr-2 transition-all duration-500 ${
                              item.has_liked 
                                ? 'fill-orange-500 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] scale-110' 
                                : 'group-hover:scale-110'
                            }`} 
                          /> 
                          <span className={`${item.has_liked ? 'font-bold' : ''}`}>
                            {item.likes_count > 0 ? item.likes_count : 'Gostar'}
                          </span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-muted-foreground flex-1 hover:bg-white/5 hover:text-white transition-colors"
                          onClick={() => toggleComments(item.id)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          {item.comments && item.comments.length > 0 ? `${item.comments.length} Comentários` : 'Comentar'}
                        </Button>
                      </div>

                      {/* Seção de Comentários */}
                      {renderComments(item)}
                    </CardContent>
                  </Card>
                ) : (
                  // ----- NOTÍCIA RSS -----
                  <Card key={item.id} className="border-border/30 bg-card/80 backdrop-blur-sm overflow-hidden hover:border-primary/50 transition-colors cursor-pointer relative group shadow-sm">
                    <div className="absolute top-0 right-0 p-2 z-10">
                      <Badge variant="outline" className="bg-background/90 text-primary border-primary/30 backdrop-blur-md">
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
                          <Clock className="w-3 h-3 mr-1" /> {formatSocialDate(item.date)}
                        </div>
                      </CardContent>
                    </div>
                      <div className="p-3 border-t border-border/10 bg-background/20 flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`flex-1 group transition-all duration-300 ease-out ${
                            item.has_liked 
                              ? 'text-neon-purple bg-neon-purple/10 hover:bg-neon-purple/20 shadow-[inset_0_0_10px_rgba(188,19,254,0.1)]' 
                              : 'text-muted-foreground hover:text-neon-purple hover:bg-white/5'
                          }`} 
                          onClick={(e) => { e.stopPropagation(); handleLike(item); }}
                        >
                          <Heart 
                            className={`w-5 h-5 mr-2 transition-all duration-500 ${
                              item.has_liked 
                                ? 'fill-neon-purple text-neon-purple drop-shadow-[0_0_8px_rgba(188,19,254,0.8)] scale-110' 
                                : 'group-hover:scale-110'
                            }`} 
                          /> 
                          <span className={`${item.has_liked ? 'font-bold' : ''}`}>
                            {item.likes_count > 0 ? item.likes_count : 'Inspirador'}
                          </span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-muted-foreground hover:text-neon-purple flex-1 hover:bg-white/5 transition-colors" 
                          onClick={() => toggleComments(item.id)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          {item.comments && item.comments.length > 0 ? `${item.comments.length} Comentários` : 'Comentar'}
                        </Button>
                      </div>

                      {/* Seção de Comentários */}
                      {renderComments(item)}
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

        {/* POST MODAL (Instagram Style) */}
        {selectedPost && (
          <div 
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 md:p-10 backdrop-blur-sm"
            onClick={() => setSelectedPost(null)}
          >
            <Button 
              variant="ghost" 
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-[110] rounded-full w-10 h-10 p-0"
              onClick={() => setSelectedPost(null)}
            >
              <X className="w-6 h-6" />
            </Button>
            
            <div 
              className="flex flex-col md:flex-row w-full max-w-6xl bg-card border border-border/30 rounded-lg overflow-hidden h-[85vh] md:h-[90vh] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Lado Esquerdo: Media */}
              <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden h-[45vh] md:h-full">
                {selectedPost.image_url?.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                  <video src={selectedPost.image_url} controls className="w-full h-full object-contain" />
                ) : (
                  <img src={selectedPost.image_url} className="w-full h-full object-contain" />
                )}
              </div>

              {/* Lado Direito: Detalhes e Comentários */}
              <div className="w-full md:w-[400px] flex flex-col bg-card/95 h-[40vh] md:h-full overflow-hidden shrink-0 border-l border-border/20">
                {/* Header do Autor */}
                <div className="p-4 border-b border-border/20 flex items-center gap-3 shrink-0 bg-background/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 overflow-hidden">
                    {selectedPost.avatar_url ? <img src={selectedPost.avatar_url} className="w-full h-full object-cover"/> : <User className="w-full h-full p-2 text-primary"/>}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-white hover:underline cursor-pointer" onClick={() => {
                        const searchParam = selectedPost.username || selectedPost.author?.split(' ')[0];
                        if (searchParam) navigate(`/usuario/${searchParam}`);
                    }}>{selectedPost.author}</p>
                    <p className="text-xs text-muted-foreground">{formatSocialDate(selectedPost.date)}</p>
                  </div>
                </div>
                
                {/* Conteúdo e Comentários */}
                <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                  {/* Legenda Original */}
                  {selectedPost.content && (
                    <div className="p-4 border-b border-border/10 space-y-2 bg-background/30">
                      <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-1 hidden md:block">
                          {selectedPost.avatar_url ? <img src={selectedPost.avatar_url} className="w-full h-full object-cover"/> : <User className="w-full h-full p-1 text-primary"/>}
                        </div>
                        <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                          <span className="font-semibold text-white mr-2">{selectedPost.author}</span>
                          {selectedPost.content}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Ações: Curtir e Comentar (Modal) */}
                  <div className="p-3 bg-background/20 flex gap-2 border-b border-border/10">
                    <Button 
                      variant="ghost" size="sm" className={`flex-1 group ${selectedPost.has_liked ? 'text-orange-500 bg-orange-500/10' : 'text-muted-foreground hover:bg-white/5'}`} 
                      onClick={() => handleLike(selectedPost)}
                    >
                      <Flame className={`w-5 h-5 mr-2 ${selectedPost.has_liked ? 'fill-orange-500 text-orange-500 scale-110' : ''}`} /> 
                      <span className={`${selectedPost.has_liked ? 'font-bold' : ''}`}>
                        {selectedPost.likes_count > 0 ? selectedPost.likes_count : 'Gostar'}
                      </span>
                    </Button>
                  </div>

                  {/* Comentários via renderComments forçado a exibir */}
                  <div className="bg-background/20">
                     {renderComments(selectedPost, true)}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </AuthGuard>
  );
}

export default UserHome;