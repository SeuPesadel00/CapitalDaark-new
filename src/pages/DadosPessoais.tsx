import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

function DadosPessoais() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    bio: '',
    phone: '',
    birth_date: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Brasil'
    }
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        birth_date: profile.birth_date || '',
        address: profile.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Brasil'
        }
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          username: formData.username,
          bio: formData.bio,
          phone: formData.phone,
          birth_date: formData.birth_date || null,
          address: formData.address
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso!"
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione uma imagem válida",
        variant: "destructive"
      });
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: data.publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso!"
      });
    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <User className="w-6 h-6 mr-2" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage 
                    src={profile?.profile_image_url} 
                    alt={profile?.username || 'Avatar'} 
                  />
                  <AvatarFallback className="text-2xl">
                    {(profile?.first_name?.[0] || '') + (profile?.last_name?.[0] || '')}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <Button variant="outline" type="button" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Alterar Foto
                      </span>
                    </Button>
                  </Label>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">Nome</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="last_name">Sobrenome</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="username">Nome de Usuário</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  O e-mail não pode ser alterado por questões de segurança
                </p>
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  Telefone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="birth_date" className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Data de Nascimento
                </Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => handleInputChange('birth_date', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Conte um pouco sobre você..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Endereço
                </h3>
                
                <div>
                  <Label htmlFor="street">Rua</Label>
                  <Input
                    id="street"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    placeholder="Rua, número, complemento"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={formData.address.state}
                      onChange={(e) => handleInputChange('address.state', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      value={formData.address.zipCode}
                      onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                      placeholder="00000-000"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default DadosPessoais;