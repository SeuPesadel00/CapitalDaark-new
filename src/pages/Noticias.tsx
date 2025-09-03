import Header from '@/components/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Search, TrendingUp, Zap, Eye } from 'lucide-react';
import { useState } from 'react';

const Noticias = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todas', color: 'bg-gradient-primary' },
    { id: 'tech', name: 'Tecnologia', color: 'bg-neon-cyan' },
    { id: 'ai', name: 'IA', color: 'bg-neon-purple' },
    { id: 'gaming', name: 'Gaming', color: 'bg-neon-green' },
    { id: 'business', name: 'Negócios', color: 'bg-neon-orange' }
  ];

  const featuredNews = [
    {
      id: 1,
      title: "IA Revoluciona o E-commerce: Personalização em Tempo Real",
      excerpt: "Algoritmos avançados agora conseguem prever preferências dos usuários com 95% de precisão, transformando a experiência de compra online.",
      category: "ai",
      date: "2025-03-01",
      readTime: "5 min",
      views: "12.5K",
      image: "/api/placeholder/400/250",
      featured: true
    },
    {
      id: 2,
      title: "Gaming Next-Gen: Ray Tracing em Tempo Real para Todos",
      excerpt: "Nova tecnologia torna gráficos cinematográficos acessíveis em hardware mainstream, democratizando a experiência visual premium.",
      category: "gaming",
      date: "2025-02-28",
      readTime: "7 min",
      views: "8.9K",
      image: "/api/placeholder/400/250",
      featured: true
    }
  ];

  const regularNews = [
    {
      id: 3,
      title: "Computação Quântica: Marco Histórico Alcançado",
      excerpt: "Primeiro computador quântico comercial supera barreira dos 1000 qubits estáveis.",
      category: "tech",
      date: "2025-02-27",
      readTime: "4 min",
      views: "15.2K",
      image: "/api/placeholder/300/200"
    },
    {
      id: 4,
      title: "Blockchain 3.0: Sustentabilidade e Eficiência",
      excerpt: "Nova geração de blockchain reduz consumo energético em 99% mantendo segurança máxima.",
      category: "tech",
      date: "2025-02-26",
      readTime: "6 min",
      views: "9.8K",
      image: "/api/placeholder/300/200"
    },
    {
      id: 5,
      title: "Realidade Virtual: Metaverso Corporativo Cresce 300%",
      excerpt: "Empresas investem massivamente em espaços virtuais para reuniões e colaboração.",
      category: "business",
      date: "2025-02-25",
      readTime: "5 min",
      views: "7.3K",
      image: "/api/placeholder/300/200"
    },
    {
      id: 6,
      title: "Chips Neurais: Interface Cérebro-Computador Aprovada",
      excerpt: "Primeira interface comercial para controle de dispositivos por pensamento recebe aprovação.",
      category: "ai",
      date: "2025-02-24",
      readTime: "8 min",
      views: "18.7K",
      image: "/api/placeholder/300/200"
    }
  ];

  const filteredNews = regularNews.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || 'bg-gradient-primary';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-primary text-white px-4 py-2 text-sm font-medium">
            📰 Sempre atualizado
          </Badge>
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-neon-cyan mb-4">
            Notícias
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Fique por dentro das últimas tendências tecnológicas e inovações que moldam o futuro digital.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 h-5 w-5" />
            <Input
              placeholder="Buscar notícias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card/50 border-border/30 focus:border-neon-cyan"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id 
                  ? `${category.color} text-white border-none` 
                  : "border-border/30 hover:border-neon-cyan/50"
                }
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured News */}
        <div className="mb-12">
          <h2 className="text-2xl font-orbitron font-bold text-neon-purple mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Destaques
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredNews.map((news) => (
              <Card key={news.id} className="bg-card/80 backdrop-blur-sm border-border/30 hover:border-neon-cyan/50 transition-all duration-300 hover:shadow-lg hover:shadow-neon-cyan/10 group overflow-hidden">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <div className="w-full h-full bg-gradient-primary opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="h-16 w-16 text-neon-cyan" />
                  </div>
                  <Badge className={`absolute top-4 left-4 ${getCategoryColor(news.category)} text-white`}>
                    {categories.find(cat => cat.id === news.category)?.name}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-neon-cyan transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-foreground/70 mb-4 line-clamp-3">
                    {news.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-foreground/60">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(news.date).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {news.readTime}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-neon-green">
                      <Eye className="h-4 w-4" />
                      {news.views}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Regular News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <Card key={news.id} className="bg-card/80 backdrop-blur-sm border-border/30 hover:border-neon-purple/50 transition-all duration-300 hover:shadow-lg hover:shadow-neon-purple/10 group overflow-hidden">
              <div className="aspect-video bg-muted relative overflow-hidden">
                <div className="w-full h-full bg-gradient-secondary opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {categories.find(cat => cat.id === news.category)?.name[0]}
                    </span>
                  </div>
                </div>
                <Badge className={`absolute top-3 left-3 ${getCategoryColor(news.category)} text-white text-xs`}>
                  {categories.find(cat => cat.id === news.category)?.name}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-neon-purple transition-colors line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-foreground/70 text-sm mb-3 line-clamp-2">
                  {news.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-foreground/60">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(news.date).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {news.readTime}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-neon-green">
                    <Eye className="h-3 w-3" />
                    {news.views}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results */}
        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 text-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Nenhuma notícia encontrada</h3>
            <p className="text-foreground/60">Tente ajustar os filtros ou termo de busca</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Noticias;