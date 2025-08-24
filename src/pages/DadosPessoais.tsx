import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Save,
  Camera,
  CreditCard,
  Shield,
  Check,
  X
} from 'lucide-react';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';

const DadosPessoais = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [emailVerified, setEmailVerified] = useState(true);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [userData, setUserData] = useState({
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao.silva@gmail.com',
    phone: '+55 11 99999-9999',
    cpf: '123.456.789-00',
    birthDate: '1990-05-15',
    gender: 'masculino',
    address: {
      street: 'Rua das Flores, 123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      country: 'Brasil'
    },
    bio: 'Desenvolvedor apaixonado por tecnologia e inovação.',
    profileImage: '/placeholder.svg'
  });

  const validateCPF = (cpf: string) => {
    // Simple CPF validation
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    return cleanCPF.length === 11;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'uol.com.br', 'terra.com.br'];
    const domain = email.split('@')[1];
    return emailRegex.test(email) && validDomains.includes(domain?.toLowerCase());
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    return numbers.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 $2 $3-$4');
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setUserData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = () => {
    // Validate required fields
    if (!userData.firstName || !userData.lastName || !userData.email) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Validate email
    if (!validateEmail(userData.email)) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email válido de um domínio conhecido (Gmail, Outlook, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate CPF
    if (!validateCPF(userData.cpf)) {
      toast({
        title: "Erro",
        description: "CPF inválido. Verifique o número digitado.",
        variant: "destructive"
      });
      return;
    }

    // Save logic here
    setIsEditing(false);
    toast({
      title: "Sucesso",
      description: "Dados pessoais atualizados com sucesso!"
    });
  };

  const verifyEmail = () => {
    // Email verification logic
    toast({
      title: "Email de Verificação Enviado",
      description: "Verifique sua caixa de entrada e spam"
    });
  };

  const verifyPhone = () => {
    // Phone verification logic  
    toast({
      title: "SMS de Verificação Enviado",
      description: "Você receberá um código por SMS em alguns instantes"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-orbitron font-bold text-neon-cyan">Dados Pessoais</h1>
                <p className="text-foreground/70">Gerencie suas informações pessoais e de contato</p>
              </div>
            </div>
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={isEditing ? "bg-gradient-accent" : "bg-gradient-primary"}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </>
              )}
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-1 bg-card border-border/20">
              <CardHeader className="text-center">
                <div className="relative mx-auto mb-4">
                  <Avatar className="w-24 h-24 border-2 border-neon-cyan">
                    <AvatarImage src={userData.profileImage} alt="Profile" />
                    <AvatarFallback className="bg-gradient-primary text-white text-2xl font-bold">
                      {userData.firstName[0]}{userData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="icon"
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-neon-cyan text-primary-foreground"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <CardTitle className="text-neon-cyan">
                  {userData.firstName} {userData.lastName}
                </CardTitle>
                <CardDescription>{userData.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status da conta:</span>
                  <Badge className="bg-neon-green text-white">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email verificado:</span>
                  {emailVerified ? (
                    <Badge className="bg-neon-green text-white">
                      <Check className="w-3 h-3 mr-1" />
                      Verificado
                    </Badge>
                  ) : (
                    <Button size="sm" variant="outline" onClick={verifyEmail}>
                      Verificar
                    </Button>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Telefone verificado:</span>
                  {phoneVerified ? (
                    <Badge className="bg-neon-green text-white">
                      <Check className="w-3 h-3 mr-1" />
                      Verificado
                    </Badge>
                  ) : (
                    <Button size="sm" variant="outline" onClick={verifyPhone}>
                      Verificar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="lg:col-span-2 bg-card border-border/20">
              <CardHeader>
                <CardTitle className="text-neon-cyan">Informações Pessoais</CardTitle>
                <CardDescription>
                  Mantenha seus dados atualizados para uma melhor experiência
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome *</Label>
                    <Input
                      id="firstName"
                      value={userData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                      className="disabled:opacity-70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome *</Label>
                    <Input
                      id="lastName"
                      value={userData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                      className="disabled:opacity-70"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        value={userData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="pl-10 disabled:opacity-70"
                      />
                    </div>
                    {isEditing && !validateEmail(userData.email) && userData.email && (
                      <p className="text-sm text-destructive">
                        Email deve ser de um domínio válido (Gmail, Outlook, etc.)
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 h-4 w-4" />
                      <Input
                        id="phone"
                        value={userData.phone}
                        onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                        disabled={!isEditing}
                        className="pl-10 disabled:opacity-70"
                        maxLength={18}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 h-4 w-4" />
                      <Input
                        id="cpf"
                        value={userData.cpf}
                        onChange={(e) => handleInputChange('cpf', formatCPF(e.target.value))}
                        disabled={!isEditing}
                        className="pl-10 disabled:opacity-70"
                        maxLength={14}
                      />
                    </div>
                    {isEditing && !validateCPF(userData.cpf) && userData.cpf && (
                      <p className="text-sm text-destructive">CPF inválido</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 h-4 w-4" />
                      <Input
                        id="birthDate"
                        type="date"
                        value={userData.birthDate}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        disabled={!isEditing}
                        className="pl-10 disabled:opacity-70"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gênero</Label>
                    <Select 
                      value={userData.gender} 
                      onValueChange={(value) => handleInputChange('gender', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="disabled:opacity-70">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                        <SelectItem value="nao-informar">Prefiro não informar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    value={userData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    className="disabled:opacity-70"
                    placeholder="Conte um pouco sobre você..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="lg:col-span-3 bg-card border-border/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-neon-cyan">
                  <MapPin className="h-5 w-5" />
                  Endereço
                </CardTitle>
                <CardDescription>
                  Informações de endereço para entrega e cobrança
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Rua e Número</Label>
                    <Input
                      id="street"
                      value={userData.address.street}
                      onChange={(e) => handleInputChange('address.street', e.target.value)}
                      disabled={!isEditing}
                      className="disabled:opacity-70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      value={userData.address.neighborhood}
                      onChange={(e) => handleInputChange('address.neighborhood', e.target.value)}
                      disabled={!isEditing}
                      className="disabled:opacity-70"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={userData.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      disabled={!isEditing}
                      className="disabled:opacity-70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={userData.address.state}
                      onChange={(e) => handleInputChange('address.state', e.target.value)}
                      disabled={!isEditing}
                      className="disabled:opacity-70"
                      maxLength={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      value={userData.address.zipCode}
                      onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                      disabled={!isEditing}
                      className="disabled:opacity-70"
                      maxLength={9}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      value={userData.address.country}
                      onChange={(e) => handleInputChange('address.country', e.target.value)}
                      disabled={!isEditing}
                      className="disabled:opacity-70"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DadosPessoais;