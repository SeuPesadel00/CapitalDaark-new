import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Settings, Image as ImageIcon, X, Share2, Heart, MessageCircle, MoreVertical, Trash2, Pencil, Check } from 'lucide-react';
import DOMPurify from 'dompurify';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [profileData, setProfileData] = useState<any>(null);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Busca o perfil por username ou first_name (ignorando case)
        const search = (username || '').trim();
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .or(`username.ilike.%${search}%,first_name.ilike.%${search}%`)
          .limit(1);

        if (error || !data || data.length === 0) {
          console.error("Erro ao buscar perfil:", error, " Buscando por:", search);
          setProfileData(null);
          return;
        }

        const userProfile = data[0];

        setProfileData(userProfile);

        // Busca estatísticas e posts
        const [postsData, followersData, followingData, checkFollow] = await Promise.all([
          supabase.from('social_posts').select('*').eq('user_id', userProfile.id).order('created_at', { ascending: false }),
          supabase.from('followers').select('*', { count: 'exact', head: true }).eq('following_id', userProfile.id),
          supabase.from('followers').select('*', { count: 'exact', head: true }).eq('follower_id', userProfile.id),
          user ? supabase.from('followers').select('*').eq('follower_id', user.id).eq('following_id', userProfile.id).maybeSingle() : Promise.resolve({ data: null })
        ]);

        setStats({
          posts: postsData.data?.length || 0,
          followers: followersData.count || 0,
          following: followingData.count || 0,
        });
        
        setPosts(postsData.data || []);

        if (checkFollow.data) setIsFollowing(true);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchProfile();
  }, [username, user]);

  const toggleFollow = async () => {
    if (!user || !profileData) return;
    if (isFollowing) {
      await supabase.from('followers').delete().match({ follower_id: user.id, following_id: profileData.id });
      setStats(s => ({ ...s, followers: s.followers - 1 }));
      setIsFollowing(false);
    } else {
      await supabase.from('followers').insert({ follower_id: user.id, following_id: profileData.id });
      await supabase.from('notifications').insert({ recipient_id: profileData.id, sender_id: user.id, type: 'follow_user' });
      setStats(s => ({ ...s, followers: s.followers + 1 }));
      setIsFollowing(true);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase.from('social_posts').delete().eq('id', postId);
      if (error) throw error;
      setPosts(current => current.filter(item => item.id !== postId));
    } catch (error) {
      console.error("Erro ao excluir", error);
    }
  };

  const startEditing = (post: any) => {
    setEditingPostId(post.id);
    setEditContent(post.content || '');
  };

  const handleSaveEdit = async (postId: string) => {
    try {
      const { error } = await supabase.from('social_posts').update({ content: editContent }).eq('id', postId);
      if (error) throw error;
      setPosts(current => current.map(item => item.id === postId ? { ...item, content: editContent } : item));
      setEditingPostId(null);
    } catch (error) {
      console.error("Erro ao editar", error);
    }
  };

  const isOwnProfile = user?.id === profileData?.id;

  if (loading) return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex justify-center items-center h-[60vh] animate-pulse text-primary font-semibold">
        Sincronizando perfil...
      </div>
    </div>
  );

  if (!profileData) return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex justify-center items-center h-[60vh] text-destructive font-semibold">
        Usuário não encontrado na rede.
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <Header />
      <main className="container mx-auto px-4 md:px-12 py-10 max-w-4xl">
        <header className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-16">
          
          {/* Avatar Area */}
          <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden bg-secondary border border-border shrink-0 flex items-center justify-center">
            {profileData.avatar_url ? (
              <img src={profileData.avatar_url} alt={profileData.username} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl text-primary font-bold">{profileData.first_name?.[0] || profileData.username?.[0]}</span>
            )}
          </div>

          {/* Profile Info Area */}
          <div className="flex flex-col flex-1 w-full">
            
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">{profileData.username}</h1>
              <div className="flex gap-2">
                {isOwnProfile ? (
                  <>
                    <Button variant="secondary" onClick={() => navigate('/configuracoes-unificadas')} className="h-8 text-sm font-semibold bg-accent hover:bg-accent/80 text-foreground">
                      Editar perfil
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/configuracoes-unificadas')} className="h-8 w-8 p-0 bg-accent hover:bg-accent/80">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={toggleFollow} 
                      variant={isFollowing ? "secondary" : "default"} 
                      className={`h-8 px-6 text-sm font-semibold transition-colors ${isFollowing ? 'bg-accent hover:bg-accent/80 text-foreground' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
                    >
                      {isFollowing ? 'Seguindo' : 'Seguir'}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate(`/mensagens/${profileData.id}`)} className="h-8 px-4 text-sm font-semibold bg-accent hover:bg-accent/80 text-foreground">
                      Enviar Mensagem
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="flex gap-8 mb-4">
              <span><span className="font-semibold">{stats.posts}</span> posts</span>
              <span className="cursor-pointer hover:text-muted-foreground transition-colors"><span className="font-semibold">{stats.followers}</span> seguidores</span>
              <span className="cursor-pointer hover:text-muted-foreground transition-colors"><span className="font-semibold">{stats.following}</span> seguindo</span>
            </div>

            {/* Bio & Details */}
            <div className="text-sm">
              <p className="font-semibold">{profileData.first_name} {profileData.last_name}</p>
              {profileData.bio && (
                <p className="whitespace-pre-wrap mt-1 text-foreground/90 leading-relaxed">{profileData.bio}</p>
              )}
            </div>

          </div>
        </header>
        
        <div className="border-t border-border flex justify-center gap-12">
          <button className="uppercase tracking-widest text-xs font-semibold py-4 border-t border-foreground flex items-center gap-2 text-foreground">
            <ImageIcon className="w-4 h-4" />
            Publicações
          </button>
        </div>

        {/* Lista de Posts Estilo X/Twitter */}
        <div className="flex flex-col gap-6 mt-4 w-full max-w-2xl mx-auto">
          {posts.map(post => (
            <div key={post.id} className="bg-card border border-border/20 rounded-xl p-4 md:p-5 space-y-4">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden shrink-0 flex items-center justify-center border border-border/50">
                      {profileData.avatar_url ? (
                        <img src={profileData.avatar_url} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-primary font-bold text-lg">
                          {profileData.first_name?.[0] || profileData.username?.[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">{profileData.first_name} {profileData.last_name}</h3>
                      <p className="text-[11px] text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                 </div>
                 
                 {post.user_id === user?.id && (
                   <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                         <MoreVertical className="h-4 w-4" />
                       </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="bg-card/95 border-border/20">
                       <DropdownMenuItem onClick={() => startEditing(post)} className="cursor-pointer hover:bg-muted">
                         <Pencil className="mr-2 h-4 w-4" /> Editar Publicação
                       </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => handleDeletePost(post.id)} className="cursor-pointer hover:bg-destructive/20 text-destructive">
                         <Trash2 className="mr-2 h-4 w-4" /> Excluir permanentemente
                       </DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                 )}
               </div>
               
               <div className="text-sm md:text-base text-foreground leading-relaxed">
                 {editingPostId === post.id ? (
                   <div className="space-y-2">
                     <Textarea 
                       value={editContent} 
                       onChange={(e) => setEditContent(e.target.value)}
                       className="bg-background border-primary/50 focus-visible:ring-primary min-h-[100px]"
                     />
                     <div className="flex gap-2 justify-end">
                       <Button variant="ghost" size="sm" onClick={() => setEditingPostId(null)}>Cancelar</Button>
                       <Button size="sm" className="bg-primary text-black" onClick={() => handleSaveEdit(post.id)}>
                         <Check className="w-4 h-4 mr-1"/> Salvar
                       </Button>
                     </div>
                   </div>
                 ) : (
                   <div 
                     className="prose prose-invert max-w-none text-gray-100 text-base md:text-lg break-words w-full overflow-hidden"
                     dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
                   />
                 )}
               </div>

               {post.image_url && (
                  <div 
                    className="w-full rounded-lg overflow-hidden cursor-pointer mt-3 border border-border/20"
                    onClick={() => setSelectedPost(post)}
                  >
                    {post.image_url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                      <video src={post.image_url} controls className="w-full h-auto rounded-sm hover:opacity-90 transition-opacity" />
                    ) : (
                      <img src={post.image_url} alt="post" className="w-full h-auto rounded-sm hover:opacity-90 transition-opacity" />
                    )}
                  </div>
               )}

               <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border/10 text-muted-foreground">
                 <button className="flex items-center gap-2 text-sm font-medium hover:text-white transition-colors">
                   <Heart className="w-5 h-5" />
                   <span>0</span>
                 </button>
                 <button className="flex items-center gap-2 text-sm font-medium hover:text-white transition-colors">
                   <MessageCircle className="w-5 h-5" />
                   <span>0</span>
                 </button>
                 <button className="flex items-center gap-2 text-sm font-medium hover:text-white transition-colors ml-auto">
                   <Share2 className="w-5 h-5" />
                 </button>
               </div>
            </div>
          ))}
        </div>

      </main>

      {/* Modal de Visualização Simplificada */}
      {selectedPost && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedPost(null)}>
          <button onClick={() => setSelectedPost(null)} className="absolute top-4 right-4 z-[110] p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors">
            <X className="w-6 h-6"/>
          </button>
          
          <div className="max-w-5xl w-full max-h-[90vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
            {selectedPost.image_url ? (
              selectedPost.image_url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                <video src={selectedPost.image_url} controls className="max-w-full max-h-[90vh] object-contain rounded-lg" />
              ) : (
                <img src={selectedPost.image_url} className="max-w-full max-h-[90vh] object-contain rounded-lg" />
              )
            ) : (
              <div className="w-full max-w-2xl bg-card p-10 rounded-lg text-left text-lg">
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedPost.content) }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;