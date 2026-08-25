import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, User, Mail, Phone, MapPin, Calendar, Heart, Flame, ExternalLink, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function DadosPessoais() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'activity'>('profile');
  const [loading, setLoading] = useState(false);
  
  // Atividades
  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [likedNews, setLikedNews] = useState<any[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '', last_name: '', username: '', bio: '', phone: '', birth_date: '', cpf: '',
    address: { street: '', city: '', state: '', zipCode: '', country: 'Brasil' }
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '', last_name: profile.last_name || '',
        username: profile.username || '', bio: profile.bio || '',
        phone: profile.phone || '', birth_date: profile.birth_date || '', cpf: profile.cpf || '',
        address: profile.address || { street: '', city: '', state: '', zipCode: '', country: 'Brasil' }
      });
    }
  }, [profile]);

  useEffect(() => {
    if (activeTab === 'activity' && user) fetchActivities();
  }, [activeTab, user]);

  const fetchActivities = async () => {
    setLoadingActivity(true);
    try {
      // Busca posts que o usuario curtiu
      const { data: posts } = await supabase
        .from('post_likes')
        .select(`
          created_at,
          social_posts (
            id, content, image_url, created_at,
            profiles (first_name, avatar_url)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      setLikedPosts(posts || []);

      // Busca noticias que curtiu
      const { data: news } = await supabase
        .from('news_likes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      setLikedNews(news || []);
    } catch (e) {
      console.error("Erro ao carregar atividades:", e);
    } finally {
      setLoadingActivity(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({ ...prev, address: { ...prev.address, [addressField]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const buscarCep = async (cepBuscado: string) => {
    const cepLimpo = cepBuscado.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setFormData(prev => ({
          ...prev, address: { ...prev.address, street: data.logradouro || prev.address.street, city: data.localidade || prev.address.city, state: data.uf || prev.address.state }
        }));
        toast({ title: "Endereço encontrado" });
      }
    } catch (error) {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').update({
        first_name: formData.first_name, last_name: formData.last_name, username: formData.username,
        bio: formData.bio, phone: formData.phone, birth_date: formData.birth_date || null,
        cpf: formData.cpf, address: formData.address
      }).eq('id', user?.id);
      if (error) throw error;
      toast({ title: "Perfil atualizado", description: "Suas informações foram salvas com sucesso!" });
    } catch (error: any) {
      toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast({ title: "Arquivo muito grande", variant: "destructive" });
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(`${user?.id}/${fileName}`, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('avatars').getPublicUrl(`${user?.id}/${fileName}`);
      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user?.id);
      if (updateError) throw updateError;
      toast({ title: "Foto atualizada!" });
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 md:px-6 py-8">
        
        {/* TABS Navigation */}
        <div className="max-w-4xl mx-auto flex gap-4 mb-6">
          <Button 
            variant={activeTab === 'profile' ? 'default' : 'outline'}
            className={`flex-1 ${activeTab === 'profile' ? 'bg-primary text-black' : 'border-primary/30 text-primary hover:bg-primary/10'}`}
            onClick={() => setActiveTab('profile')}
          >
            <User className="w-4 h-4 mr-2" /> Meu Perfil
          </Button>
          <Button 
            variant={activeTab === 'activity' ? 'default' : 'outline'}
            className={`flex-1 ${activeTab === 'activity' ? 'bg-neon-purple text-white hover:bg-neon-purple/80' : 'border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10'}`}
            onClick={() => setActiveTab('activity')}
          >
            <Heart className="w-4 h-4 mr-2" /> Minhas Atividades
          </Button>
        </div>

        {activeTab === 'profile' && (
          <Card className="max-w-4xl mx-auto bg-card/80 backdrop-blur border-border/30">
            <CardHeader>
              <CardTitle className="text-2xl font-orbitron font-bold flex items-center text-neon-cyan">
                <User className="w-6 h-6 mr-2" /> Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                   <Avatar className="w-32 h-32 border-2 border-primary/30">
                     <AvatarImage src={profile?.avatar_url} />
                     <AvatarFallback className="text-2xl bg-primary/10">
                       {(profile?.first_name?.[0] || '') + (profile?.last_name?.[0] || '')}
                     </AvatarFallback>
                   </Avatar>
                  <div>
                    <input type="file" id="avatar-upload" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <Button variant="outline" type="button" asChild className="border-neon-cyan/30 hover:border-neon-cyan hover:bg-neon-cyan/10">
                        <span><Upload className="w-4 h-4 mr-2 text-neon-cyan" /> Alterar Foto</span>
                      </Button>
                    </Label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name" className="text-primary">Nome</Label>
                    <Input id="first_name" value={formData.first_name} onChange={(e) => handleInputChange('first_name', e.target.value)} className="bg-muted/30 border-border/30 focus:border-primary" required />
                  </div>
                  <div>
                    <Label htmlFor="last_name" className="text-primary">Sobrenome</Label>
                    <Input id="last_name" value={formData.last_name} onChange={(e) => handleInputChange('last_name', e.target.value)} className="bg-muted/30 border-border/30 focus:border-primary" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="username" className="text-primary">Nome de Usuário</Label>
                  <Input id="username" value={formData.username} onChange={(e) => handleInputChange('username', e.target.value)} className="bg-muted/30 border-border/30 focus:border-primary" required />
                </div>
                <div>
                  <Label htmlFor="email" className="flex items-center text-primary"><Mail className="w-4 h-4 mr-1" /> E-mail</Label>
                  <Input id="email" type="email" value={user?.email || ''} disabled className="bg-muted/50 opacity-50" />
                </div>
                <div>
                  <Label htmlFor="phone" className="flex items-center text-primary"><Phone className="w-4 h-4 mr-1" /> Telefone</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="bg-muted/30 border-border/30 focus:border-primary" />
                </div>
                <div>
                  <Label htmlFor="bio" className="text-primary">Biografia</Label>
                  <Textarea id="bio" value={formData.bio} onChange={(e) => handleInputChange('bio', e.target.value)} className="min-h-[100px] bg-muted/30 border-border/30 focus:border-primary" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center text-secondary"><MapPin className="w-5 h-5 mr-2" /> Endereço</h3>
                  <div><Label htmlFor="street" className="text-primary">Rua</Label><Input id="street" value={formData.address.street} onChange={(e) => handleInputChange('address.street', e.target.value)} className="bg-muted/30 border-border/30 focus:border-primary" /></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><Label htmlFor="city" className="text-primary">Cidade</Label><Input id="city" value={formData.address.city} onChange={(e) => handleInputChange('address.city', e.target.value)} className="bg-muted/30 border-border/30 focus:border-primary" /></div>
                    <div><Label htmlFor="state" className="text-primary">Estado</Label><Input id="state" value={formData.address.state} onChange={(e) => handleInputChange('address.state', e.target.value)} className="bg-muted/30 border-border/30 focus:border-primary" /></div>
                    <div><Label htmlFor="zipCode" className="text-primary">CEP</Label>
                      <Input id="zipCode" value={formData.address.zipCode} onChange={(e) => {
                        const novo = e.target.value; handleInputChange('address.zipCode', novo);
                        if (novo.replace(/\D/g, '').length === 8) buscarCep(novo);
                      }} maxLength={9} className="bg-muted/30 border-border/30 focus:border-primary" />
                    </div>
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-black font-medium">
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* AREA DE ATIVIDADES */}
        {activeTab === 'activity' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {loadingActivity ? (
               <div className="text-center p-8 text-muted-foreground"><RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" /> Carregando registros...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Posts Curtidos */}
                <Card className="bg-card/60 border-border/30">
                  <CardHeader className="border-b border-border/10 pb-4">
                    <CardTitle className="text-lg flex items-center text-neon-cyan">
                      <Flame className="w-5 h-5 mr-2" />
                      Ideias (Posts Curtidos)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {likedPosts.length === 0 ? (
                      <p className="p-6 text-center text-muted-foreground text-sm">Você ainda não curtiu nenhuma postagem da rede.</p>
                    ) : (
                      <div className="divide-y divide-border/10 max-h-[600px] overflow-y-auto">
                        {likedPosts.map((item, idx) => (
                          <div key={idx} className="p-4 hover:bg-muted/10 transition-colors">
                            <div className="flex gap-3 mb-2">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={item.social_posts.profiles?.avatar_url} />
                                <AvatarFallback><User className="w-4 h-4"/></AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-semibold">{item.social_posts.profiles?.first_name || 'Usuário'}</p>
                                <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: ptBR })}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-300 line-clamp-3">{item.social_posts.content}</p>
                            {item.social_posts.image_url && (
                              <img src={item.social_posts.image_url} alt="Midia" className="mt-2 rounded-md max-h-32 object-cover" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Notícias Curtidas */}
                <Card className="bg-card/60 border-border/30">
                  <CardHeader className="border-b border-border/10 pb-4">
                    <CardTitle className="text-lg flex items-center text-neon-purple">
                      <Heart className="w-5 h-5 mr-2" />
                      Sua Biblioteca (Notícias)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {likedNews.length === 0 ? (
                      <p className="p-6 text-center text-muted-foreground text-sm">Nenhum artigo foi salvo na sua biblioteca.</p>
                    ) : (
                      <div className="divide-y divide-border/10 max-h-[600px] overflow-y-auto">
                        {likedNews.map((news, idx) => (
                          <div key={idx} className="p-4 hover:bg-muted/10 transition-colors flex justify-between items-center group cursor-pointer" onClick={() => window.open(news.news_link, '_blank')}>
                            <div>
                              <p className="text-sm font-medium text-gray-200 group-hover:text-neon-purple transition-colors line-clamp-2">{news.news_title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(new Date(news.created_at), { addSuffix: true, locale: ptBR })}</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-neon-purple ml-2 flex-shrink-0" />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Spacer pro Bottom Nav no Mobile */}
      <div className="h-16 md:hidden"></div>
    </div>
  );
}

export default DadosPessoais;