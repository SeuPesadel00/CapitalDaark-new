import { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contatos = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Simular envio de formulário
    toast({
      title: "Mensagem enviada!",
      description: "Retornaremos em até 24 horas"
    });
    
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "capitaldaark@gmail.com",
      description: "Resposta em até 24h"
    },
    {
      icon: Phone,
      title: "Telefone",
      value: "+55 (61) 98220-1177",
      description: "Seg a Sex, 9h às 18h"
    },
    {
      icon: MapPin,
      title: "Endereço",
      value: "Brasília, DF - Brasil",
      description: "Zona Sul, Centro Tecnológico"
    },
    {
      icon: Clock,
      title: "Horário",
      value: "24hrs Online",
      description: "Suporte digital sempre ativo"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-primary text-white px-4 py-2 text-sm font-medium">
            💬 Estamos online
          </Badge>
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-neon-cyan mb-4">
            Contatos
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Entre em contato conosco. Estamos aqui para ajudar com qualquer dúvida ou suporte técnico.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Formulário de contato */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-neon-cyan flex items-center gap-2">
                <MessageCircle className="h-6 w-6" />
                Envie sua Mensagem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-background/50 border-border/30 focus:border-neon-cyan"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-background/50 border-border/30 focus:border-neon-cyan"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-foreground">Assunto</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="bg-background/50 border-border/30 focus:border-neon-cyan"
                    placeholder="Sobre o que você gostaria de falar?"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground">Mensagem *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="bg-background/50 border-border/30 focus:border-neon-cyan min-h-[120px]"
                    placeholder="Descreva sua dúvida ou sugestão..."
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary hover:bg-gradient-secondary text-white py-3 text-lg font-medium shadow-lg hover:shadow-neon-cyan/30 transition-all duration-300"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Enviar Mensagem
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informações de contato */}
          <div className="space-y-8">
            <div className="grid gap-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/30 hover:border-neon-purple/50 transition-all duration-300 hover:shadow-lg hover:shadow-neon-purple/10">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-neon-purple mb-1">{info.title}</h3>
                      <div className="text-lg font-medium text-foreground mb-1">{info.value}</div>
                      <p className="text-sm text-foreground/60">{info.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Informações Adicionais */}
            <Card className="bg-gradient-accent rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-3">
                Suporte Técnico Especializado
              </h3>
              <p className="text-white/90 mb-4">
                Nossa equipe técnica está pronta para resolver qualquer problema e garantir a melhor experiência.
              </p>
              <Badge className="bg-white/20 text-white border-white/30">
                Resposta garantida em 24h
              </Badge>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contatos;