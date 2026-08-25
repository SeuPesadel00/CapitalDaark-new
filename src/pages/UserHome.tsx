import { useState, useEffect, useRef, useCallback } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { User, Image as ImageIcon, Send, Clock, Heart, RefreshCw, X, Link as LinkIcon, Newspaper, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FeedItem {
  type: 'post' | 'news';
  id: string; // ID do Supabase ou URL para RSS
  title?: string;
  content?: string;
  image_url?: string | null;
  date: Date;
  author?: string;
  avatar_url?: string | null;
  link?: string;
  category?: string;
  likes_count: number;
  has_liked: boolean;
}

const RSS_FEEDS = [
  { url: 'https://g1.globo.com/rss/g1/tecnologia/', category: 'Tecnologia' },
  { url: 'https://br.cointelegraph.com/rss', category: 'Criptomoedas' }
];

function UserHome() {
  const { user, profile, loading } = useAuth();
  
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [feedData, setFeedData] = useState<FeedItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchTimeline = useCallback(async (isPullToRefresh = false) => {
    if (isPullToRefresh) setIsRefreshing(true);

    try {
      // 1. Buscar Posts do Usuário e Likes
      const { data: postsData, error: postsError } = await supabase
        .from('social_posts')
        .select(`
          *,
          profiles (first_name, last_name, avatar_url),
          post_likes (user_id)
        `)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Converter para o padrão FeedItem
      const formattedPosts: FeedItem[] = (postsData || []).map((post: any) => ({
        type: 'post',
        id: post.id,
        content: post.content,
        image_url: post.image_url,
        date: new Date(post.created_at),
        author: `${post.profiles?.first_name || 'Usuário'} ${post.profiles?.last_name || ''}`,
        avatar_url: post.profiles?.avatar_url,
        likes_count: post.post_likes?.length || 0,
        has_liked: post.post_likes?.some((like: any) => like.user_id === user?.id) || false
      }));

      // 2. Buscar Notícias dos Feeds RSS (G1 e CoinTelegraph)
      let formattedNews: FeedItem[] = [];
      const newsPromises = RSS_FEEDS.map(async (feed) => {
        try {
          const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${feed.url}`);
          const data = await response.json();
          if (data.items) {
            return data.items.slice(0, 15).map((item: any) => {
              // Limpeza básica
              let imageUrl = item.thumbnail || item.enclosure?.link;
              if (!imageUrl && item.description) {
                const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
                if (imgMatch) imageUrl = imgMatch[1];
              }

              return {
                type: 'news',
                id: item.link, // Usamos o link como ID único
                title: item.title,
                content: item.description.replace(/<[^>]+>/g, '').substring(0, 180) + '...',
                image_url: imageUrl || 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=800',
                date: new Date(item.pubDate),
                link: item.link,
                category: feed.category,
                likes_count: 0, // Inicia zero até cruzarmos com o banco
                has_liked: false
              };
            });
          }
          return [];
        } catch (e) {
          console.error(`Erro ao buscar feed ${feed.category}`, e);
          return [];
        }
      });

      const newsResults = await Promise.all(newsPromises);
      formattedNews = newsResults.flat();

      // 3. Buscar Likes das Notícias Externas
      if (formattedNews.length > 0 && user) {
        const links = formattedNews.map(n => n.id);
        const { data: newsLikesData } = await supabase
          .from('news_likes')
          .select('*')
          .in('news_link', links);
          
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

      // 4. Misturar Posts + Notícias e Ordenar por Data (Timeline Cibernética!)
      const mergedTimeline = [...formattedPosts, ...formattedNews].sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );

      setFeedData(mergedTimeline);
    } catch (error) {
      console.error("Erro ao carregar timeline unificada", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchTimeline();
  }, [user, fetchTimeline]);

  // Pull-To-Refresh Detection (Mobile)
  useEffect(() => {
    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        const endY = e.changedTouches[0].clientY;
        if (endY - startY > 150) { // Arrasto de > 150px
          fetchTimeline(true);
        }
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
        
        const { error: uploadError } = await supabase.storage.from('post_images').upload(filePath, postImage);
        if (uploadError) throw uploadError;
        
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
      fetchTimeline();
    } catch (error) {
      console.error("Erro ao publicar:", error);
    } finally {
      setIsPublishing(false);
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
        if (item.has_liked) {
          await supabase.from('news_likes').delete().match({ user_id: user.id, news_link: item.id });
        } else {
          await supabase.from('news_likes').insert({ user_id: user.id, news_link: item.id, news_title: item.title });
        }
      }
      
      // Atualização otimista da UI para parecer instantâneo
      setFeedData(current => current.map(f => {
        if (f.id === item.id) {
          return {
            ...f,
            has_liked: !f.has_liked,
            likes_count: f.has_liked ? f.likes_count - 1 : f.likes_count + 1
          };
        }
        return f;
      }));
    } catch (error) {
      console.error("Erro ao curtir", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Banner Cyberpunk (Ideologia da Marca) */}
        <div className="bg-card/40 border-b border-border/20 py-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neon-cyan via-background to-background"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-2xl md:text-4xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple mb-4">
              CAPITAL DAARK
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              A comunidade imbatível. Libertária, descentralizada e incondicionalmente focada no futuro. 
              Mergulhe no universo cyberpunk e tome o controle.
            </p>
          </div>
        </div>
        
        <main className="container mx-auto px-2 md:px-6 py-6 pb-20">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Indicador de Pull to Refresh (Visível quando puxa) */}
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
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-full h-full p-2 text-primary" />
                    )}
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
                      <Button size="sm" className="bg-primary text-black font-semibold hover:bg-primary/80 shadow-[0_0_10px_rgba(0,255,255,0.4)]" onClick={handlePublish} disabled={isPublishing || (!postContent.trim() && !postImage)}>
                        {isPublishing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                        Transmitir
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* TIMELINE HIBRIDA */}
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
                      <div className="p-4 flex justify-between items-center bg-background/30">
                        <div className="flex gap-3 items-center">
                          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 overflow-hidden">
                            {item.avatar_url ? <img src={item.avatar_url} className="w-full h-full object-cover"/> : <User className="w-full h-full p-2 text-primary"/>}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-white">{item.author}</p>
                            <p className="text-xs text-muted-foreground">{formatDistanceToNow(item.date, { addSuffix: true, locale: ptBR })}</p>
                          </div>
                        </div>
                      </div>
                      
                      {item.content && <div className="px-4 py-3 text-sm text-gray-200 whitespace-pre-wrap">{item.content}</div>}
                      {item.image_url && <img src={item.image_url} alt="Post media" className="w-full max-h-96 object-cover border-y border-border/20" />}
                      
                      <div className="p-3 bg-background/20 flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`flex-1 ${item.has_liked ? 'text-neon-cyan' : 'text-muted-foreground'}`}
                          onClick={() => handleLike(item)}
                        >
                          <Flame className={`w-4 h-4 mr-2 ${item.has_liked ? 'fill-neon-cyan' : ''}`} /> 
                          {item.likes_count > 0 ? item.likes_count : 'Gostar'}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground flex-1">Comentar</Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  // ----- NOTÍCIA RSS -----
                  <Card key={item.id} className="border-neon-purple/20 bg-card/60 backdrop-blur-sm overflow-hidden hover:border-neon-purple/50 transition-colors cursor-pointer relative group">
                    <div className="absolute top-0 right-0 p-2 z-10">
                      <Badge variant="outline" className="bg-background/80 text-neon-purple border-neon-purple/50 backdrop-blur">
                        <Newspaper className="w-3 h-3 mr-1" /> {item.category}
                      </Badge>
                    </div>
                    
                    <div onClick={() => window.open(item.link, '_blank')}>
                      {item.image_url && (
                        <div className="relative h-48 w-full overflow-hidden">
                          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-2 text-white group-hover:text-neon-purple transition-colors line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.content}</p>
                        
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDistanceToNow(item.date, { addSuffix: true, locale: ptBR })}
                        </div>
                      </CardContent>
                    </div>

                    <div className="p-3 border-t border-border/10 bg-background/20 flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`flex-1 ${item.has_liked ? 'text-neon-purple' : 'text-muted-foreground hover:text-neon-purple'}`}
                          onClick={(e) => { e.stopPropagation(); handleLike(item); }}
                        >
                          <Heart className={`w-4 h-4 mr-2 ${item.has_liked ? 'fill-neon-purple' : ''}`} /> 
                          {item.likes_count > 0 ? item.likes_count : 'Inspirador'}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-neon-purple flex-1" onClick={() => window.open(item.link, '_blank')}>
                          <LinkIcon className="w-4 h-4 mr-2" /> Ler Artigo
                        </Button>
                      </div>
                  </Card>
                )
              ))}
            </div>
            
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

export default UserHome;