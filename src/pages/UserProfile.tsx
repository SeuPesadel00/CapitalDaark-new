import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Settings, Image as ImageIcon } from 'lucide-react';

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [profileData, setProfileData] = useState<any>(null);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

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

        // Busca estatísticas
        const [postsData, followersData, followingData, checkFollow] = await Promise.all([
          supabase.from('social_posts').select('*', { count: 'exact', head: true }).eq('user_id', userProfile.id),
          supabase.from('followers').select('*', { count: 'exact', head: true }).eq('following_id', userProfile.id),
          supabase.from('followers').select('*', { count: 'exact', head: true }).eq('follower_id', userProfile.id),
          user ? supabase.from('followers').select('*').eq('follower_id', user.id).eq('following_id', userProfile.id).maybeSingle() : Promise.resolve({ data: null })
        ]);

        setStats({
          posts: postsData.count || 0,
          followers: followersData.count || 0,
          following: followingData.count || 0,
        });

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
      setStats(s => ({ ...s, followers: s.followers + 1 }));
      setIsFollowing(true);
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
                    <Button variant="secondary" onClick={() => navigate('/dados-pessoais')} className="h-8 text-sm font-semibold bg-accent hover:bg-accent/80 text-foreground">
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
        
        {/* Border / Tabs for posts list */}
        <div className="border-t border-border flex justify-center gap-12">
          <button className="uppercase tracking-widest text-xs font-semibold py-4 border-t border-foreground flex items-center gap-2 text-foreground">
            <ImageIcon className="w-4 h-4" />
            Publicações
          </button>
        </div>

      </main>
    </div>
  );
};

export default UserProfile;