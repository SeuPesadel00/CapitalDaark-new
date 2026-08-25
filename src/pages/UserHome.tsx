import { AuthGuard } from '@/components/AuthGuard';
import Header from '@/components/Header';
import ModernNewsSection from '@/components/ModernNewsSection';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User, Settings, ShoppingBag, Phone, Image as ImageIcon, Send, Newspaper, MessageCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function UserHome() {
  const { profile, loading } = useAuth();

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
            <TabsContent value="feed" className="space-y-6">
              {/* Criar Postagem */}
              <Card className="border-border/30 bg-card/60 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex gap-3 items-start">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center border border-primary/30">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-grow space-y-3">
                      <Input 
                        placeholder={`No que você está pensando, ${profile?.first_name || ''}?`}
                        className="bg-background/50 border-border/30 rounded-full focus-visible:ring-primary"
                      />
                      <div className="flex justify-between items-center">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-neon-cyan">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Foto/Vídeo
                        </Button>
                        <Button size="sm" className="rounded-full bg-gradient-primary">
                          <Send className="w-4 h-4 mr-2" />
                          Publicar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feed Timeline (Placeholder por enquanto) */}
              <div className="text-center p-8 text-muted-foreground border border-dashed border-border/50 rounded-xl">
                Nenhuma postagem ainda. Seja o primeiro a publicar algo!
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