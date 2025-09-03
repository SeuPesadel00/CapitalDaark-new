import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  User, 
  CreditCard,
  Save,
  Eye,
  EyeOff,
  Mail,
  Key
} from 'lucide-react';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';

const Configuracoes = () => {
  const { toast } = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [emailRecoveryCode, setEmailRecoveryCode] = useState('');

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      marketing: true,
      security: true
    },
    privacy: {
      profileVisible: true,
      activityVisible: false,
      purchaseHistory: true
    },
    appearance: {
      theme: 'dark',
      animations: true,
      compactMode: false
    }
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSettingChange = (category: string, setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }

    if (passwords.new.length < 8) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 8 caracteres",
        variant: "destructive"
      });
      return;
    }

    // Password change logic here
    toast({
      title: "Sucesso",
      description: "Senha alterada com sucesso!"
    });
    
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const sendRecoveryCode = () => {
    // Send recovery code logic
    toast({
      title: "Código Enviado",
      description: "Um código de autenticação foi enviado para seu email"
    });
  };

  const saveSettings = () => {
    // Save settings logic
    toast({
      title: "Configurações Salvas",
      description: "Suas preferências foram atualizadas com sucesso!"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-orbitron font-bold text-neon-cyan">Configurações</h1>
              <p className="text-foreground/70">Personalize sua experiência na plataforma</p>
            </div>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card/80 backdrop-blur-sm border border-border/30 rounded-xl">
              <TabsTrigger value="general" className="data-[state=active]:bg-gradient-primary">
                <Settings className="h-4 w-4 mr-2" />
                Geral
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-gradient-primary">
                <Shield className="h-4 w-4 mr-2" />
                Segurança
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-gradient-primary">
                <Bell className="h-4 w-4 mr-2" />
                Notificações
              </TabsTrigger>
              <TabsTrigger value="appearance" className="data-[state=active]:bg-gradient-primary">
                <Palette className="h-4 w-4 mr-2" />
                Aparência
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-neon-cyan/10">
                <CardHeader>
                  <CardTitle className="text-neon-cyan">Configurações Gerais</CardTitle>
                  <CardDescription>
                    Gerencie suas preferências básicas da conta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Perfil Público</Label>
                        <p className="text-sm text-foreground/60">
                          Permite que outros usuários vejam seu perfil
                        </p>
                      </div>
                      <Switch 
                        checked={settings.privacy.profileVisible}
                        onCheckedChange={(value) => handleSettingChange('privacy', 'profileVisible', value)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Histórico de Atividades</Label>
                        <p className="text-sm text-foreground/60">
                          Mostra suas atividades recentes na plataforma
                        </p>
                      </div>
                      <Switch 
                        checked={settings.privacy.activityVisible}
                        onCheckedChange={(value) => handleSettingChange('privacy', 'activityVisible', value)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Histórico de Compras Público</Label>
                        <p className="text-sm text-foreground/60">
                          Permite que outros vejam seus produtos comprados
                        </p>
                      </div>
                      <Switch 
                        checked={settings.privacy.purchaseHistory}
                        onCheckedChange={(value) => handleSettingChange('privacy', 'purchaseHistory', value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card className="bg-card border-border/20">
                <CardHeader>
                  <CardTitle className="text-neon-cyan">Alterar Senha</CardTitle>
                  <CardDescription>
                    Mantenha sua conta segura com uma senha forte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Senha Atual</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwords.current}
                          onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova Senha</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={passwords.new}
                          onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                      />
                    </div>

                    <Button 
                      onClick={handlePasswordChange}
                      className="w-full bg-gradient-primary hover:bg-gradient-secondary"
                      disabled={!passwords.current || !passwords.new || !passwords.confirm}
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Alterar Senha
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/20">
                <CardHeader>
                  <CardTitle className="text-neon-green">Recuperação de Senha</CardTitle>
                  <CardDescription>
                    Configure a autenticação por email para recuperação de senha
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg border border-neon-green/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="border-neon-green text-neon-green">
                          Ativo
                        </Badge>
                        <span className="text-sm font-medium">Email de recuperação configurado</span>
                      </div>
                      <p className="text-sm text-foreground/60">
                        Você pode solicitar um código de verificação a qualquer momento
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recovery-code">Código de Verificação</Label>
                      <div className="flex gap-2">
                        <Input
                          id="recovery-code"
                          placeholder="Digite o código de 6 dígitos"
                          value={emailRecoveryCode}
                          onChange={(e) => setEmailRecoveryCode(e.target.value)}
                          maxLength={6}
                          className="flex-1"
                        />
                        <Button 
                          variant="outline"
                          onClick={sendRecoveryCode}
                          className="border-neon-green/50 text-neon-green hover:bg-neon-green/10"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Enviar Código
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="bg-card border-border/20">
                <CardHeader>
                  <CardTitle className="text-neon-cyan">Preferências de Notificação</CardTitle>
                  <CardDescription>
                    Configure como e quando você deseja receber notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Notificações por Email</Label>
                        <p className="text-sm text-foreground/60">
                          Receba atualizações importantes por email
                        </p>
                      </div>
                      <Switch 
                        checked={settings.notifications.email}
                        onCheckedChange={(value) => handleSettingChange('notifications', 'email', value)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Notificações Push</Label>
                        <p className="text-sm text-foreground/60">
                          Receba notificações em tempo real no navegador
                        </p>
                      </div>
                      <Switch 
                        checked={settings.notifications.push}
                        onCheckedChange={(value) => handleSettingChange('notifications', 'push', value)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Ofertas e Promoções</Label>
                        <p className="text-sm text-foreground/60">
                          Receba informações sobre novos produtos e ofertas
                        </p>
                      </div>
                      <Switch 
                        checked={settings.notifications.marketing}
                        onCheckedChange={(value) => handleSettingChange('notifications', 'marketing', value)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Alertas de Segurança</Label>
                        <p className="text-sm text-foreground/60">
                          Notificações sobre atividades suspeitas na conta
                        </p>
                      </div>
                      <Switch 
                        checked={settings.notifications.security}
                        onCheckedChange={(value) => handleSettingChange('notifications', 'security', value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-6">
              <Card className="bg-card border-border/20">
                <CardHeader>
                  <CardTitle className="text-neon-cyan">Personalizar Aparência</CardTitle>
                  <CardDescription>
                    Configure a aparência da interface para sua preferência
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Animações</Label>
                        <p className="text-sm text-foreground/60">
                          Ativa animações e transições na interface
                        </p>
                      </div>
                      <Switch 
                        checked={settings.appearance.animations}
                        onCheckedChange={(value) => handleSettingChange('appearance', 'animations', value)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Modo Compacto</Label>
                        <p className="text-sm text-foreground/60">
                          Reduz o espaçamento entre elementos
                        </p>
                      </div>
                      <Switch 
                        checked={settings.appearance.compactMode}
                        onCheckedChange={(value) => handleSettingChange('appearance', 'compactMode', value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end pt-6">
            <Button 
              onClick={saveSettings}
              className="bg-gradient-primary hover:bg-gradient-secondary px-8"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Configuracoes;