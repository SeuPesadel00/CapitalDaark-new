import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Shield, Bell, Settings, Eye, EyeOff, Key, CreditCard, Plus, LogOut, Headset, User, Upload, Mail, Phone, MapPin, Heart, Flame, ExternalLink, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PreferenciasUsuario {
  tema: string;
  idioma: string;
  notificacoes_email: boolean;
  notificacoes_push: boolean;
  emails_marketing: boolean;
  autenticacao_dois_fatores: boolean;
}

interface MetodoPagamento {
  id: string;
  tipo_metodo: string;
  ultimos_quatro: string;
  bandeira_cartao: string;
  mes_expiracao: number;
  ano_expiracao: number;
  nome_portador: string;
  eh_padrao: boolean;
}

function ConfiguracoesUnificadas() {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  
  // -- ESTADOS (CONFIG) --
  const [preferencias, setPreferencias] = useState<PreferenciasUsuario>({
    tema: 'system', idioma: 'pt-BR', notificacoes_email: true, notificacoes_push: true,
    emails_marketing: false, autenticacao_dois_fatores: false
  });
  const [dadosSenha, setDadosSenha] = useState({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
  const [metodosPagamento, setMetodosPagamento] = useState<MetodoPagamento[]>([]);
  const [mostrarFormularioAdicionar, setMostrarFormularioAdicionar] = useState(false);
  const [dadosFormulario, setDadosFormulario] = useState({ numeroCartao: '', mesExpiracao: '', anoExpiracao: '', cvv: '', nomePortador: '' });
  const [carregando, setCarregando] = useState(true);
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);

  // -- ESTADOS (PERFIL E ATIVIDADES) --
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', username: '', bio: '', phone: '', birth_date: '', cpf: '',
    address: { street: '', city: '', state: '', zipCode: '', country: 'Brasil' }
  });
  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [likedNews, setLikedNews] = useState<any[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // -- EFEITOS --
  useEffect(() => {
    if (user) {
      buscarPreferenciasUsuario();
      buscarMetodosPagamento();
      fetchActivities();
    }
  }, [user]);

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

  // -- FUNÇÕES (PERFIL) --
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

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
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
      setSavingProfile(false);
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

  const fetchActivities = async () => {
    setLoadingActivity(true);
    try {
      const { data: posts } = await supabase.from('post_likes').select(`
          created_at, social_posts ( id, content, image_url, created_at, profiles (first_name, avatar_url) )
        `).eq('user_id', user?.id).order('created_at', { ascending: false });
      setLikedPosts(posts || []);

      const { data: news } = await supabase.from('news_likes').select('*').eq('user_id', user?.id).order('created_at', { ascending: false });
      setLikedNews(news || []);
    } catch (e) {
      console.error("Erro ao carregar atividades:", e);
    } finally {
      setLoadingActivity(false);
    }
  };

  // -- FUNÇÕES (CONFIG) --
  const buscarPreferenciasUsuario = async () => {
    try {
      const { data, error } = await supabase.from('user_preferences').select('*').eq('user_id', user?.id).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setPreferencias({
          tema: data.theme || 'system', idioma: data.language || 'pt-BR',
          notificacoes_email: data.email_notifications ?? true, notificacoes_push: data.push_notifications ?? true,
          emails_marketing: data.marketing_emails ?? false, autenticacao_dois_fatores: data.two_factor_enabled ?? false
        });
      }
    } catch (error: any) {
      toast({ title: "Erro ao carregar preferências", description: error.message, variant: "destructive" });
    } finally {
      setCarregando(false);
    }
  };

  const buscarMetodosPagamento = async () => {
    try {
      const { data, error } = await supabase.from('user_payment_methods').select('*').eq('user_id', user?.id).order('created_at', { ascending: false });
      if (error) throw error;
      const metodosFormatados = data?.map(item => ({
        id: item.id, tipo_metodo: item.method_type, ultimos_quatro: item.last_four, bandeira_cartao: item.card_brand,
        mes_expiracao: item.expiry_month, ano_expiracao: item.expiry_year, nome_portador: item.cardholder_name, eh_padrao: item.is_default
      })) || [];
      setMetodosPagamento(metodosFormatados);
    } catch (error: any) {
      toast({ title: "Erro ao carregar métodos de pagamento", description: error.message, variant: "destructive" });
    }
  };

  const atualizarPreferencias = async (novasPreferencias: Partial<PreferenciasUsuario>) => {
    try {
      const preferenciasAtualizadas = { ...preferencias, ...novasPreferencias };
      const { error } = await supabase.from('user_preferences').upsert({
        user_id: user?.id, theme: preferenciasAtualizadas.tema, language: preferenciasAtualizadas.idioma,
        email_notifications: preferenciasAtualizadas.notificacoes_email, push_notifications: preferenciasAtualizadas.notificacoes_push,
        marketing_emails: preferenciasAtualizadas.emails_marketing, two_factor_enabled: preferenciasAtualizadas.autenticacao_dois_fatores
      });
      if (error) throw error;
      setPreferencias(preferenciasAtualizadas);
      toast({ title: "Preferências atualizadas" });
    } catch (error: any) {
      toast({ title: "Erro ao atualizar preferências", description: error.message, variant: "destructive" });
    }
  };

  const lidarComAlteracaoSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dadosSenha.novaSenha !== dadosSenha.confirmarSenha) return toast({ title: "Erro na senha", description: "As senhas não coincidem", variant: "destructive" });
    if (dadosSenha.novaSenha.length < 6) return toast({ title: "Erro na senha", description: "A nova senha deve ter pelo menos 6 caracteres", variant: "destructive" });
    try {
      const { error } = await supabase.auth.updateUser({ password: dadosSenha.novaSenha });
      if (error) throw error;
      toast({ title: "Senha alterada" });
      setDadosSenha({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
    } catch (error: any) {
      toast({ title: "Erro ao alterar senha", description: error.message, variant: "destructive" });
    }
  };

  const formatarNumeroCartao = (valor: string) => {
    const v = valor.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const partes = [];
    for (let i = 0, len = match.length; i < len; i += 4) { partes.push(match.substring(i, i + 4)); }
    return partes.length ? partes.join(' ') : v;
  };

  const adicionarMetodoPagamento = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (dadosFormulario.numeroCartao.length < 16) throw new Error('Número do cartão inválido');
      const ultimosQuatro = dadosFormulario.numeroCartao.slice(-4);
      let bandeiraCartao = 'desconhecida';
      if (dadosFormulario.numeroCartao.startsWith('4')) bandeiraCartao = 'visa';
      else if (dadosFormulario.numeroCartao.startsWith('5')) bandeiraCartao = 'mastercard';
      else if (dadosFormulario.numeroCartao.startsWith('3')) bandeiraCartao = 'amex';

      const { error } = await supabase.from('user_payment_methods').insert({
        user_id: user?.id, last_four: ultimosQuatro, card_brand: bandeiraCartao,
        expiry_month: parseInt(dadosFormulario.mesExpiracao), expiry_year: parseInt(dadosFormulario.anoExpiracao),
        cardholder_name: dadosFormulario.nomePortador, is_default: metodosPagamento.length === 0
      });
      if (error) throw error;
      toast({ title: "Método de pagamento adicionado" });
      setDadosFormulario({ numeroCartao: '', mesExpiracao: '', anoExpiracao: '', cvv: '', nomePortador: '' });
      setMostrarFormularioAdicionar(false);
      buscarMetodosPagamento();
    } catch (error: any) {
      toast({ title: "Erro ao adicionar cartão", description: error.message, variant: "destructive" });
    }
  };

  const excluirMetodoPagamento = async (id: string) => {
    try {
      const { error } = await supabase.from('user_payment_methods').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Método removido" });
      buscarMetodosPagamento();
    } catch (error: any) {
      toast({ title: "Erro ao remover cartão", description: error.message, variant: "destructive" });
    }
  };

  const lidarComExclusaoConta = async () => {
    try {
      await supabase.from('user_activity_log').insert({ user_id: user?.id, activity_type: 'account_deletion_request', description: 'Usuário solicitou exclusão da conta' });
      toast({ title: "Solicitação de exclusão enviada", description: "Entre em contato conosco para confirmar a exclusão da conta.", variant: "destructive" });
    } catch (error: any) {
      toast({ title: "Erro na solicitação", description: error.message, variant: "destructive" });
    }
  };

  if (carregando) return <div className="min-h-screen bg-background"><Header /><div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div></div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-neon-cyan">Configurações</h1>
            <p className="text-foreground/70">Gerencie seu perfil, preferências e conta</p>
          </div>
        </div>

        <Tabs defaultValue="perfil" className="space-y-6">
          <TabsList className="flex overflow-x-auto w-full h-auto p-1 bg-card/80 backdrop-blur-sm border border-border/30 rounded-xl gap-1 no-scrollbar justify-start sm:justify-center">
            <TabsTrigger value="perfil" className="flex-shrink-0 whitespace-nowrap data-[state=active]:bg-gradient-primary py-2.5 px-4"><User className="h-4 w-4 mr-2" />Perfil</TabsTrigger>
            <TabsTrigger value="atividades" className="flex-shrink-0 whitespace-nowrap data-[state=active]:bg-gradient-primary py-2.5 px-4"><Heart className="h-4 w-4 mr-2" />Atividades</TabsTrigger>
            <TabsTrigger value="notificacoes" className="flex-shrink-0 whitespace-nowrap data-[state=active]:bg-gradient-primary py-2.5 px-4"><Bell className="h-4 w-4 mr-2" />Notificações</TabsTrigger>
            <TabsTrigger value="seguranca" className="flex-shrink-0 whitespace-nowrap data-[state=active]:bg-gradient-primary py-2.5 px-4"><Shield className="h-4 w-4 mr-2" />Segurança</TabsTrigger>
            <TabsTrigger value="pagamento" className="flex-shrink-0 whitespace-nowrap data-[state=active]:bg-gradient-primary py-2.5 px-4"><CreditCard className="h-4 w-4 mr-2" />Pagamento</TabsTrigger>
            <TabsTrigger value="conta" className="flex-shrink-0 whitespace-nowrap data-[state=active]:bg-gradient-primary py-2.5 px-4">Conta</TabsTrigger>
          </TabsList>

          {/* PERFIL */}
          <TabsContent value="perfil">
            <Card className="bg-card/80 backdrop-blur border-border/30">
              <CardHeader><CardTitle className="flex items-center text-neon-cyan"><User className="w-5 h-5 mr-2" /> Dados Pessoais</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-32 h-32 border-2 border-primary/30">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="text-2xl bg-primary/10">{(profile?.first_name?.[0] || '') + (profile?.last_name?.[0] || '')}</AvatarFallback>
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
                    <div><Label>Nome</Label><Input value={formData.first_name} onChange={e => handleInputChange('first_name', e.target.value)} required /></div>
                    <div><Label>Sobrenome</Label><Input value={formData.last_name} onChange={e => handleInputChange('last_name', e.target.value)} required /></div>
                  </div>
                  <div><Label>Nome de Usuário</Label><Input value={formData.username} onChange={e => handleInputChange('username', e.target.value)} required /></div>
                  <div><Label><Mail className="w-4 h-4 inline mr-1"/> E-mail</Label><Input value={user?.email || ''} disabled className="opacity-50" /></div>
                  <div><Label><Phone className="w-4 h-4 inline mr-1"/> Telefone</Label><Input type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} /></div>
                  <div><Label>Biografia</Label><Textarea value={formData.bio} onChange={e => handleInputChange('bio', e.target.value)} /></div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center text-secondary"><MapPin className="w-5 h-5 mr-2" /> Endereço</h3>
                    <div><Label>Rua</Label><Input value={formData.address.street} onChange={e => handleInputChange('address.street', e.target.value)} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div><Label>Cidade</Label><Input value={formData.address.city} onChange={e => handleInputChange('address.city', e.target.value)} /></div>
                      <div><Label>Estado</Label><Input value={formData.address.state} onChange={e => handleInputChange('address.state', e.target.value)} /></div>
                      <div><Label>CEP</Label><Input value={formData.address.zipCode} onChange={e => { const novo = e.target.value; handleInputChange('address.zipCode', novo); if(novo.replace(/\D/g,'').length===8) buscarCep(novo); }} maxLength={9} /></div>
                    </div>
                  </div>
                  <Button type="submit" disabled={savingProfile} className="w-full bg-gradient-primary">{savingProfile ? 'Salvando...' : 'Salvar Perfil'}</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ATIVIDADES */}
          <TabsContent value="atividades">
            {loadingActivity ? <div className="text-center p-8 text-muted-foreground"><RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" /> Carregando...</div> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card/60 border-border/30"><CardHeader className="border-b border-border/10 pb-4"><CardTitle className="text-lg flex items-center text-neon-cyan"><Flame className="w-5 h-5 mr-2" /> Ideias Curtidas</CardTitle></CardHeader><CardContent className="p-0">
                  {likedPosts.length === 0 ? <p className="p-6 text-center text-muted-foreground text-sm">Nenhuma curtida.</p> : (
                    <div className="divide-y divide-border/10 max-h-[600px] overflow-y-auto">
                      {likedPosts.map((item, idx) => (
                        <div key={idx} className="p-4 hover:bg-muted/10 transition-colors">
                          <div className="flex gap-3 mb-2">
                            <Avatar className="w-8 h-8"><AvatarImage src={item.social_posts.profiles?.avatar_url} /><AvatarFallback><User className="w-4 h-4"/></AvatarFallback></Avatar>
                            <div><p className="text-sm font-semibold">{item.social_posts.profiles?.first_name || 'Usuário'}</p><p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: ptBR })}</p></div>
                          </div>
                          <p className="text-sm text-gray-300 line-clamp-3">{item.social_posts.content}</p>
                          {item.social_posts.image_url && <img src={item.social_posts.image_url} className="mt-2 rounded-md max-h-32 object-cover" />}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent></Card>
                <Card className="bg-card/60 border-border/30"><CardHeader className="border-b border-border/10 pb-4"><CardTitle className="text-lg flex items-center text-neon-purple"><Heart className="w-5 h-5 mr-2" /> Notícias Curtidas</CardTitle></CardHeader><CardContent className="p-0">
                  {likedNews.length === 0 ? <p className="p-6 text-center text-muted-foreground text-sm">Nenhuma notícia.</p> : (
                    <div className="divide-y divide-border/10 max-h-[600px] overflow-y-auto">
                      {likedNews.map((news, idx) => (
                        <div key={idx} className="p-4 hover:bg-muted/10 transition-colors flex justify-between items-center group cursor-pointer" onClick={() => window.open(news.news_link, '_blank')}>
                          <div><p className="text-sm font-medium text-gray-200 group-hover:text-neon-purple transition-colors line-clamp-2">{news.news_title}</p><p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(new Date(news.created_at), { addSuffix: true, locale: ptBR })}</p></div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-neon-purple ml-2 flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent></Card>
              </div>
            )}
          </TabsContent>

          {/* NOTIFICACOES */}
          <TabsContent value="notificacoes"><Card className="bg-card/80 backdrop-blur-sm border-border/30"><CardHeader><CardTitle className="flex items-center"><Bell className="w-5 h-5 mr-2" /> Configurações de Notificação</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="flex items-center justify-between"><div><Label>Notificações por E-mail</Label><p className="text-sm text-muted-foreground">Receba atualizações importantes</p></div><Switch checked={preferencias.notificacoes_email} onCheckedChange={checked => atualizarPreferencias({ notificacoes_email: checked })} /></div><Separator />
            <div className="flex items-center justify-between"><div><Label>Notificações Push</Label><p className="text-sm text-muted-foreground">Receba em tempo real</p></div><Switch checked={preferencias.notificacoes_push} onCheckedChange={checked => atualizarPreferencias({ notificacoes_push: checked })} /></div><Separator />
            <div className="flex items-center justify-between"><div><Label>E-mails de Marketing</Label><p className="text-sm text-muted-foreground">Receba ofertas</p></div><Switch checked={preferencias.emails_marketing} onCheckedChange={checked => atualizarPreferencias({ emails_marketing: checked })} /></div>
          </CardContent></Card></TabsContent>

          {/* SEGURANCA */}
          <TabsContent value="seguranca"><Card className="bg-card/80 backdrop-blur-sm border-border/30"><CardHeader><CardTitle className="flex items-center"><Shield className="w-5 h-5 mr-2" /> Segurança</CardTitle></CardHeader><CardContent className="space-y-6">
            <div className="flex items-center justify-between"><div><Label>Autenticação de Dois Fatores</Label><p className="text-sm text-muted-foreground">Camada extra de proteção</p></div><Switch checked={preferencias.autenticacao_dois_fatores} onCheckedChange={checked => atualizarPreferencias({ autenticacao_dois_fatores: checked })} /></div><Separator />
            <div><h3 className="text-lg font-medium mb-4">Alterar Senha</h3><form onSubmit={lidarComAlteracaoSenha} className="space-y-4">
              <div><Label>Senha Atual</Label><div className="relative"><Input type={mostrarSenhaAtual ? "text" : "password"} value={dadosSenha.senhaAtual} onChange={e => setDadosSenha({...dadosSenha, senhaAtual: e.target.value})} required /><Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6" onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}>{mostrarSenhaAtual ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button></div></div>
              <div><Label>Nova Senha</Label><div className="relative"><Input type={mostrarNovaSenha ? "text" : "password"} value={dadosSenha.novaSenha} onChange={e => setDadosSenha({...dadosSenha, novaSenha: e.target.value})} required /><Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6" onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}>{mostrarNovaSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button></div></div>
              <div><Label>Confirmar Nova Senha</Label><Input type="password" value={dadosSenha.confirmarSenha} onChange={e => setDadosSenha({...dadosSenha, confirmarSenha: e.target.value})} required /></div>
              <Button type="submit" className="bg-gradient-primary hover:bg-gradient-secondary"><Key className="w-4 h-4 mr-2" /> Alterar Senha</Button>
            </form></div>
          </CardContent></Card></TabsContent>

          {/* PAGAMENTO */}
          <TabsContent value="pagamento"><Card className="bg-card/80 backdrop-blur-sm border-border/30"><CardHeader className="flex flex-row items-center justify-between"><CardTitle className="flex items-center"><CreditCard className="w-5 h-5 mr-2" /> Métodos de Pagamento</CardTitle><Button onClick={() => setMostrarFormularioAdicionar(!mostrarFormularioAdicionar)}><Plus className="w-4 h-4 mr-2" /> Adicionar Cartão</Button></CardHeader><CardContent>
            {mostrarFormularioAdicionar && (
              <Card className="mb-6"><CardHeader><CardTitle className="text-lg">Novo Cartão</CardTitle></CardHeader><CardContent><form onSubmit={adicionarMetodoPagamento} className="space-y-4">
                <div><Label>Número do Cartão</Label><Input type="text" value={formatarNumeroCartao(dadosFormulario.numeroCartao)} onChange={e => setDadosFormulario({...dadosFormulario, numeroCartao: e.target.value.replace(/\s/g, '')})} maxLength={19} required /></div>
                <div className="grid grid-cols-2 gap-4"><div><Label>Mês</Label><Input type="number" min="1" max="12" value={dadosFormulario.mesExpiracao} onChange={e => setDadosFormulario({...dadosFormulario, mesExpiracao: e.target.value})} required /></div><div><Label>Ano</Label><Input type="number" min={new Date().getFullYear()} value={dadosFormulario.anoExpiracao} onChange={e => setDadosFormulario({...dadosFormulario, anoExpiracao: e.target.value})} required /></div></div>
                <div><Label>CVV</Label><Input type="text" maxLength={4} value={dadosFormulario.cvv} onChange={e => setDadosFormulario({...dadosFormulario, cvv: e.target.value.replace(/\D/g, '')})} required /></div>
                <div><Label>Nome no Cartão</Label><Input type="text" value={dadosFormulario.nomePortador} onChange={e => setDadosFormulario({...dadosFormulario, nomePortador: e.target.value})} required /></div>
                <div className="flex gap-4"><Button type="submit">Adicionar Cartão</Button><Button type="button" variant="outline" onClick={() => setMostrarFormularioAdicionar(false)}>Cancelar</Button></div>
              </form></CardContent></Card>
            )}
            {metodosPagamento.length === 0 ? (
              <div className="text-center py-8"><CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">Nenhum método cadastrado</p></div>
            ) : (
              <div className="space-y-4">{metodosPagamento.map(metodo => (
                <Card key={metodo.id} className="relative"><CardContent className="p-4"><div className="flex items-center justify-between"><div className="flex items-center space-x-4"><CreditCard className="w-8 h-8 text-primary" /><div><p className="font-medium">**** **** **** {metodo.ultimos_quatro}</p><p className="text-sm text-muted-foreground">{metodo.bandeira_cartao.toUpperCase()} • {metodo.mes_expiracao}/{metodo.ano_expiracao}</p><p className="text-sm text-muted-foreground">{metodo.nome_portador}</p></div></div><div className="flex items-center space-x-2">{metodo.eh_padrao && <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">Padrão</span>}<Button variant="outline" size="sm" onClick={() => excluirMetodoPagamento(metodo.id)}><Trash2 className="w-4 h-4" /></Button></div></div></CardContent></Card>
              ))}</div>
            )}
          </CardContent></Card></TabsContent>

          {/* CONTA */}
          <TabsContent value="conta" className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/30"><CardHeader><CardTitle className="flex items-center"><Headset className="w-5 h-5 mr-2" /> Central de Atendimento</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm text-muted-foreground">Precisa de ajuda com sua conta, assinaturas ou recursos da plataforma? Nosso suporte VIP está disponível direto no WhatsApp.</p><Button asChild className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto font-bold border border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"><a href="https://wa.me/5561982201177?text=Olá, preciso de suporte na plataforma Capital Daark." target="_blank" rel="noopener noreferrer">Falar com Suporte VIP</a></Button></CardContent></Card>
            <Card className="bg-card/80 backdrop-blur-sm border-border/30"><CardHeader><CardTitle className="flex items-center"><LogOut className="w-5 h-5 mr-2" /> Sessão</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground mb-4">Deseja desconectar sua conta deste dispositivo?</p><Button variant="outline" className="w-full sm:w-auto border-border/50 hover:bg-destructive/20 hover:text-destructive transition-colors" onClick={() => signOut()}><LogOut className="w-4 h-4 mr-2" /> Sair da Conta (Logout)</Button></CardContent></Card>
            <Card className="border-destructive bg-card/80 backdrop-blur-sm"><CardHeader><CardTitle className="flex items-center text-destructive"><Trash2 className="w-5 h-5 mr-2" /> Zona de Perigo</CardTitle></CardHeader><CardContent><div className="space-y-4"><div><h3 className="text-lg font-medium">Excluir Conta</h3><p className="text-sm text-muted-foreground mb-4">Esta ação é irreversível. Todos os seus dados serão permanentemente removidos.</p><AlertDialog><AlertDialogTrigger asChild><Button variant="destructive"><Trash2 className="w-4 h-4 mr-2" /> Excluir Minha Conta</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Confirmar Exclusão da Conta</AlertDialogTitle><AlertDialogDescription>Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita. Todos os seus dados, incluindo perfil, configurações e histórico serão permanentemente removidos.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={lidarComExclusaoConta} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Sim, Excluir Conta</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></div></CardContent></Card>
          </TabsContent>

        </Tabs>
      </main>
      <div className="h-16 md:hidden"></div>
    </div>
  );
}

export default ConfiguracoesUnificadas;