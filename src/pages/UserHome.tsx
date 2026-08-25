import { useState, useEffect, useRef } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import Header from '@/components/Header';
import ModernNewsSection from '@/components/ModernNewsSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { User, Settings, ShoppingBag, Phone, Image as ImageIcon, Send, Newspaper, MessageCircle, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SocialPost {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

function UserHome() {
  const { user, profile, loading } = useAuth();
  
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_posts')
        .select(`
          *,
          profiles (first_name, last_name, avatar_url)
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setPosts(data as unknown as SocialPost[]);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostImage(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const removeImage = () => {
    setPostImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
        
        const { error: uploadError } = await supabase.storage
          .from('post_images')
          .upload(filePath, postImage);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('post_images')
          .getPublicUrl(filePath);
          
        image_url = publicUrl;
      }

      const { error } = await supabase
        .from('social_posts')
        .insert({
          user_id: user?.id,
          content: postContent,
          image_url: image_url
        });

      if (error) throw error;
      
      // Sucesso
      setPostContent('');
      removeImage();
      fetchPosts();
    } catch (error) {
      console.error("Erro ao publicar:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Cabeçalho de boas-vindas */}
            <div className="flex items-center gap-4 mb-8 p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/20">
              <div>
                <h1 className="text-2xl md:text-3xl font-orbitron font-bold text-neon-cyan">
                  Bem-vindo, {profile?.first_name || 'Usuário'}!
                </h1>
                <p className="text-muted-foreground">
                  Acompanhe as últimas notícias e tendências do mundo da tecnologia
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Abas e Conteúdo da Rede Social (Mobile-first) */}
        <div className="container mx-auto px-2 md:px-6 pb-8">
          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-card border border-border/20">
              <TabsTrigger value="feed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <MessageCircle className="w-4 h-4 mr-2 hidden sm:inline" />
                Feed Social
              </TabsTrigger>
              <TabsTrigger value="noticias" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Newspaper className="w-4 h-4 mr-2 hidden sm:inline" />
                Notícias Rápidas
              </TabsTrigger>
            </TabsList>

            {/* ABA: FEED SOCIAL */}
            <TabsContent value="feed" className="space-y-6 max-w-3xl mx-auto">
              {/* Criar Postagem */}
              <Card className="border-border/30 bg-card/60 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex gap-3 items-start">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center border border-primary/30 overflow-hidden">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-grow space-y-3">
                      <Input 
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder={`No que você está pensando, ${profile?.first_name || ''}?`}
                        className="bg-background/50 border-border/30 rounded-full focus-visible:ring-primary"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handlePublish();
                        }}
                      />
                      
                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="relative inline-block mt-2">
                          <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg object-contain border border-border/50" />
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                            onClick={removeImage}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2">
                        <div>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleImageSelect}
                          />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-muted-foreground hover:text-neon-cyan"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Foto/Vídeo
                          </Button>
                        </div>
                        <Button 
                          size="sm" 
                          className="rounded-full bg-gradient-primary"
                          onClick={handlePublish}
                          disabled={isPublishing || (!postContent.trim() && !postImage)}
                        >
                          {isPublishing ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          ) : (
                            <Send className="w-4 h-4 mr-2" />
                          )}
                          Publicar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feed Timeline */}
              <div className="space-y-6">
                {posts.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground border border-dashed border-border/50 rounded-xl">
                    Nenhuma postagem ainda. Seja o primeiro a publicar algo!
                  </div>
                ) : (
                  posts.map((post) => (
                    <Card key={post.id} className="border-border/20 bg-card overflow-hidden">
                      <CardContent className="p-0">
                        {/* Post Header */}
                        <div className="p-4 flex gap-3 items-center">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden">
                            {post.profiles?.avatar_url ? (
                              <img src={post.profiles.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">
                              {post.profiles?.first_name} {post.profiles?.last_name || ''}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR })}
                            </p>
                          </div>
                        </div>

                        {/* Post Content */}
                        {post.content && (
                          <div className="px-4 pb-3 text-sm whitespace-pre-wrap">
                            {post.content}
                          </div>
                        )}

                        {/* Post Image */}
                        {post.image_url && (
                          <div className="w-full">
                            <img 
                              src={post.image_url} 
                              alt="Post" 
                              className="w-full max-h-96 object-cover" 
                            />
                          </div>
                        )}

                        {/* Actions */}
                        <div className="p-3 border-t border-border/10 flex gap-2">
                          <Button variant="ghost" size="sm" className="text-muted-foreground flex-1">Curtir</Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground flex-1">Comentar</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* ABA: NOTÍCIAS EXTERNAS */}
            <TabsContent value="noticias">
              <ModernNewsSection />
            </TabsContent>
          </Tabs>
        </div>

        <footer className="bg-card/50 border-t border-border/20 p-6 text-center mt-16">
          <p className="text-muted-foreground">&copy; 2025 Capital Daark. Todos os direitos reservados.</p>
          <p className="text-sm mt-2 text-muted-foreground">Construindo o futuro, hoje.</p>
        </footer>
      </div>
    </AuthGuard>
  );
}

export default UserHome;