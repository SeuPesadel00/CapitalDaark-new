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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Shield, Bell, Mail, Settings, Eye, EyeOff, Key, CreditCard, Plus } from 'lucide-react';

// Interface para preferências do usuário
interface PreferenciasUsuario {
  tema: string;
  idioma: string;
  notificacoes_email: boolean;
  notificacoes_push: boolean;
  emails_marketing: boolean;
  autenticacao_dois_fatores: boolean;
}

// Interface para métodos de pagamento
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
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  // Estados para preferências
  const [preferencias, setPreferencias] = useState<PreferenciasUsuario>({
    tema: 'system',
    idioma: 'pt-BR',
    notificacoes_email: true,
    notificacoes_push: true,
    emails_marketing: false,
    autenticacao_dois_fatores: false
  });
  
  // Estados para senhas
  const [dadosSenha, setDadosSenha] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  
  // Estados para métodos de pagamento
  const [metodosPagamento, setMetodosPagamento] = useState<MetodoPagamento[]>([]);
  const [mostrarFormularioAdicionar, setMostrarFormularioAdicionar] = useState(false);
  const [dadosFormulario, setDadosFormulario] = useState({
    numeroCartao: '',
    mesExpiracao: '',
    anoExpiracao: '',
    cvv: '',
    nomePortador: ''
  });
  
  // Estados para controle de exibição
  const [carregando, setCarregando] = useState(true);
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);

  useEffect(() => {
    if (user) {
      buscarPreferenciasUsuario();
      buscarMetodosPagamento();
    }
  }, [user]);

  // Buscar preferências do usuário
  const buscarPreferenciasUsuario = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setPreferencias({
          tema: data.theme || 'system',
          idioma: data.language || 'pt-BR',
          notificacoes_email: data.email_notifications ?? true,
          notificacoes_push: data.push_notifications ?? true,
          emails_marketing: data.marketing_emails ?? false,
          autenticacao_dois_fatores: data.two_factor_enabled ?? false
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar preferências",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setCarregando(false);
    }
  };

  // Buscar métodos de pagamento
  const buscarMetodosPagamento = async () => {
    try {
      const { data, error } = await supabase
        .from('user_payment_methods')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const metodosFormatados = data?.map(item => ({
        id: item.id,
        tipo_metodo: item.method_type,
        ultimos_quatro: item.last_four,
        bandeira_cartao: item.card_brand,
        mes_expiracao: item.expiry_month,
        ano_expiracao: item.expiry_year,
        nome_portador: item.cardholder_name,
        eh_padrao: item.is_default
      })) || [];
      
      setMetodosPagamento(metodosFormatados);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar métodos de pagamento",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Atualizar preferências
  const atualizarPreferencias = async (novasPreferencias: Partial<PreferenciasUsuario>) => {
    try {
      const preferenciasAtualizadas = { ...preferencias, ...novasPreferencias };
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          theme: preferenciasAtualizadas.tema,
          language: preferenciasAtualizadas.idioma,
          email_notifications: preferenciasAtualizadas.notificacoes_email,
          push_notifications: preferenciasAtualizadas.notificacoes_push,
          marketing_emails: preferenciasAtualizadas.emails_marketing,
          two_factor_enabled: preferenciasAtualizadas.autenticacao_dois_fatores
        });

      if (error) throw error;

      setPreferencias(preferenciasAtualizadas);
      toast({
        title: "Preferências atualizadas",
        description: "Suas configurações foram salvas com sucesso!"
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar preferências",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Alterar senha
  const lidarComAlteracaoSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (dadosSenha.novaSenha !== dadosSenha.confirmarSenha) {
      toast({
        title: "Erro na senha",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }

    if (dadosSenha.novaSenha.length < 6) {
      toast({
        title: "Erro na senha",
        description: "A nova senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: dadosSenha.novaSenha
      });

      if (error) throw error;

      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso!"
      });

      setDadosSenha({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
      });
    } catch (error: any) {
      toast({
        title: "Erro ao alterar senha",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Adicionar método de pagamento
  const adicionarMetodoPagamento = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (dadosFormulario.numeroCartao.length < 16) {
        throw new Error('Número do cartão inválido');
      }

      const ultimosQuatro = dadosFormulario.numeroCartao.slice(-4);
      let bandeiraCartao = 'desconhecida';
      
      if (dadosFormulario.numeroCartao.startsWith('4')) bandeiraCartao = 'visa';
      else if (dadosFormulario.numeroCartao.startsWith('5')) bandeiraCartao = 'mastercard';
      else if (dadosFormulario.numeroCartao.startsWith('3')) bandeiraCartao = 'amex';

      const { error } = await supabase
        .from('user_payment_methods')
        .insert({
          user_id: user?.id,
          last_four: ultimosQuatro,
          card_brand: bandeiraCartao,
          expiry_month: parseInt(dadosFormulario.mesExpiracao),
          expiry_year: parseInt(dadosFormulario.anoExpiracao),
          cardholder_name: dadosFormulario.nomePortador,
          is_default: metodosPagamento.length === 0
        });

      if (error) throw error;

      toast({
        title: "Método de pagamento adicionado",
        description: "Cartão adicionado com sucesso!"
      });

      setDadosFormulario({
        numeroCartao: '',
        mesExpiracao: '',
        anoExpiracao: '',
        cvv: '',
        nomePortador: ''
      });
      setMostrarFormularioAdicionar(false);
      buscarMetodosPagamento();
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar cartão",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Excluir método de pagamento
  const excluirMetodoPagamento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_payment_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Método removido",
        description: "Cartão removido com sucesso!"
      });

      buscarMetodosPagamento();
    } catch (error: any) {
      toast({
        title: "Erro ao remover cartão",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Excluir conta
  const lidarComExclusaoConta = async () => {
    try {
      await supabase.from('user_activity_log').insert({
        user_id: user?.id,
        activity_type: 'account_deletion_request',
        description: 'Usuário solicitou exclusão da conta'
      });

      toast({
        title: "Solicitação de exclusão enviada",
        description: "Entre em contato conosco para confirmar a exclusão da conta.",
        variant: "destructive"
      });
    } catch (error: any) {
      toast({
        title: "Erro na solicitação",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Formatar número do cartão
  const formatarNumeroCartao = (valor: string) => {
    const v = valor.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const partes = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      partes.push(match.substring(i, i + 4));
    }
    if (partes.length) {
      return partes.join(' ');
    } else {
      return v;
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-neon-cyan">Configurações</h1>
            <p className="text-foreground/70">Gerencie suas preferências e configurações da conta</p>
          </div>
        </div>

        <Tabs defaultValue="notificacoes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card/80 backdrop-blur-sm border border-border/30 rounded-xl">
            <TabsTrigger value="notificacoes" className="data-[state=active]:bg-gradient-primary">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="data-[state=active]:bg-gradient-primary">
              <Shield className="h-4 w-4 mr-2" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="pagamento" className="data-[state=active]:bg-gradient-primary">
              <CreditCard className="h-4 w-4 mr-2" />
              Pagamento
            </TabsTrigger>
            <TabsTrigger value="conta" className="data-[state=active]:bg-gradient-primary">
              <Trash2 className="h-4 w-4 mr-2" />
              Conta
            </TabsTrigger>
          </TabsList>

          {/* Aba de Notificações */}
          <TabsContent value="notificacoes" className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Configurações de Notificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notificacoes-email">Notificações por E-mail</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba atualizações importantes por e-mail
                    </p>
                  </div>
                  <Switch
                    id="notificacoes-email"
                    checked={preferencias.notificacoes_email}
                    onCheckedChange={(checked) => 
                      atualizarPreferencias({ notificacoes_email: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notificacoes-push">Notificações Push</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações em tempo real
                    </p>
                  </div>
                  <Switch
                    id="notificacoes-push"
                    checked={preferencias.notificacoes_push}
                    onCheckedChange={(checked) => 
                      atualizarPreferencias({ notificacoes_push: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emails-marketing">E-mails de Marketing</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba ofertas e novidades
                    </p>
                  </div>
                  <Switch
                    id="emails-marketing"
                    checked={preferencias.emails_marketing}
                    onCheckedChange={(checked) => 
                      atualizarPreferencias({ emails_marketing: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Segurança */}
          <TabsContent value="seguranca" className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Configurações de Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autenticacao-dois-fatores">Autenticação de Dois Fatores</Label>
                    <p className="text-sm text-muted-foreground">
                      Adicione uma camada extra de segurança
                    </p>
                  </div>
                  <Switch
                    id="autenticacao-dois-fatores"
                    checked={preferencias.autenticacao_dois_fatores}
                    onCheckedChange={(checked) => 
                      atualizarPreferencias({ autenticacao_dois_fatores: checked })
                    }
                  />
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Alterar Senha</h3>
                  <form onSubmit={lidarComAlteracaoSenha} className="space-y-4">
                    <div>
                      <Label htmlFor="senha-atual">Senha Atual</Label>
                      <div className="relative">
                        <Input
                          id="senha-atual"
                          type={mostrarSenhaAtual ? "text" : "password"}
                          value={dadosSenha.senhaAtual}
                          onChange={(e) => setDadosSenha({
                            ...dadosSenha,
                            senhaAtual: e.target.value
                          })}
                          className="pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                          onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                        >
                          {mostrarSenhaAtual ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="nova-senha">Nova Senha</Label>
                      <div className="relative">
                        <Input
                          id="nova-senha"
                          type={mostrarNovaSenha ? "text" : "password"}
                          value={dadosSenha.novaSenha}
                          onChange={(e) => setDadosSenha({
                            ...dadosSenha,
                            novaSenha: e.target.value
                          })}
                          className="pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                          onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                        >
                          {mostrarNovaSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirmar-senha">Confirmar Nova Senha</Label>
                      <Input
                        id="confirmar-senha"
                        type="password"
                        value={dadosSenha.confirmarSenha}
                        onChange={(e) => setDadosSenha({
                          ...dadosSenha,
                          confirmarSenha: e.target.value
                        })}
                        required
                      />
                    </div>

                    <Button type="submit" className="bg-gradient-primary hover:bg-gradient-secondary">
                      <Key className="w-4 h-4 mr-2" />
                      Alterar Senha
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Pagamento */}
          <TabsContent value="pagamento" className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Métodos de Pagamento
                </CardTitle>
                <Button onClick={() => setMostrarFormularioAdicionar(!mostrarFormularioAdicionar)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Cartão
                </Button>
              </CardHeader>
              <CardContent>
                {mostrarFormularioAdicionar && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Adicionar Novo Cartão</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={adicionarMetodoPagamento} className="space-y-4">
                        <div>
                          <Label htmlFor="numero-cartao">Número do Cartão</Label>
                          <Input
                            id="numero-cartao"
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={formatarNumeroCartao(dadosFormulario.numeroCartao)}
                            onChange={(e) => setDadosFormulario({
                              ...dadosFormulario,
                              numeroCartao: e.target.value.replace(/\s/g, '')
                            })}
                            maxLength={19}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="mes-expiracao">Mês</Label>
                            <Input
                              id="mes-expiracao"
                              type="number"
                              placeholder="12"
                              min="1"
                              max="12"
                              value={dadosFormulario.mesExpiracao}
                              onChange={(e) => setDadosFormulario({
                                ...dadosFormulario,
                                mesExpiracao: e.target.value
                              })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="ano-expiracao">Ano</Label>
                            <Input
                              id="ano-expiracao"
                              type="number"
                              placeholder="2025"
                              min={new Date().getFullYear()}
                              value={dadosFormulario.anoExpiracao}
                              onChange={(e) => setDadosFormulario({
                                ...dadosFormulario,
                                anoExpiracao: e.target.value
                              })}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            type="text"
                            placeholder="123"
                            maxLength={4}
                            value={dadosFormulario.cvv}
                            onChange={(e) => setDadosFormulario({
                              ...dadosFormulario,
                              cvv: e.target.value.replace(/\D/g, '')
                            })}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="nome-portador">Nome no Cartão</Label>
                          <Input
                            id="nome-portador"
                            type="text"
                            placeholder="João Silva"
                            value={dadosFormulario.nomePortador}
                            onChange={(e) => setDadosFormulario({
                              ...dadosFormulario,
                              nomePortador: e.target.value
                            })}
                            required
                          />
                        </div>

                        <div className="flex gap-4">
                          <Button type="submit">Adicionar Cartão</Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setMostrarFormularioAdicionar(false)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {metodosPagamento.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum método de pagamento cadastrado</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {metodosPagamento.map((metodo) => (
                      <Card key={metodo.id} className="relative">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <CreditCard className="w-8 h-8 text-primary" />
                              <div>
                                <p className="font-medium">
                                  **** **** **** {metodo.ultimos_quatro}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {metodo.bandeira_cartao.toUpperCase()} • {metodo.mes_expiracao}/{metodo.ano_expiracao}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {metodo.nome_portador}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {metodo.eh_padrao && (
                                <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                                  Padrão
                                </span>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => excluirMetodoPagamento(metodo.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Conta */}
          <TabsContent value="conta" className="space-y-6">
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center text-destructive">
                  <Trash2 className="w-5 h-5 mr-2" />
                  Zona de Perigo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Excluir Conta</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Esta ação é irreversível. Todos os seus dados serão permanentemente removidos.
                    </p>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir Minha Conta
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Exclusão da Conta</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.
                            Todos os seus dados, incluindo perfil, configurações e histórico serão permanentemente removidos.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={lidarComExclusaoConta}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Sim, Excluir Conta
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Termos e Privacidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" asChild>
                    <a href="/terms" target="_blank">Ver Termos de Uso</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/privacy" target="_blank">Ver Política de Privacidade</a>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ao usar nossa plataforma, você concorda com nossos Termos de Uso e Política de Privacidade.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default ConfiguracoesUnificadas;