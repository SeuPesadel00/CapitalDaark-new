import Header from '@/components/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Search, TrendingUp, Zap, Eye, Loader2, Link as LinkIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { FeedItem, fetchNewsFeeds, shuffleArray } from '@/utils/feedUtils';

const Noticias = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newsList, setNewsList] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'Todas', color: 'bg-gradient-primary' },
    { id: 'tech', name: 'Tecnologia', color: 'bg-neon-cyan' },
    { id: 'ai', name: 'IA', color: 'bg-neon-purple' },
    { id: 'gaming', name: 'Gaming', color: 'bg-neon-green' },
    { id: 'business', name: 'Negócios', color: 'bg-neon-orange' }
  ];

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      const news = await fetchNewsFeeds();
      setNewsList(shuffleArray(news)); // Já carrega embaralhado garantindo vitrines unicas
      setLoading(false);
    };
    loadNews();
  }, []);

  const filteredNews = newsList.filter(news => {
    const matchesSearch = (news.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (news.content || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredNews = filteredNews.slice(0, 2);
  const regularNewsList = filteredNews.slice(2);

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || 'bg-gradient-primary';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Cabeçalho */}
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

        {/* Pesquisa e filtros */}
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

        {/* Notícias em destaque */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p>Sincronizando feed de notícias da rede mundial...</p>
          </div>
        ) : (
          <>
            {featuredNews.length > 0 && (
              <div className="mb-12">
          <h2 className="text-2xl font-orbitron font-bold text-neon-purple mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Destaques
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredNews.map((news) => (
              <Card key={news.id} className="bg-card/80 backdrop-blur-sm border-border/30 hover:border-neon-cyan/50 transition-all duration-300 hover:shadow-lg hover:shadow-neon-cyan/10 group overflow-hidden">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {news.image_url ? (
                    <img src={news.image_url} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-primary opacity-20"></div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {!news.image_url && <Zap className="h-16 w-16 text-neon-cyan" />}
                  </div>
                  <Badge className={`absolute top-4 left-4 ${getCategoryColor(news.category || 'tech')} text-white`}>
                    {categories.find(cat => cat.id === news.category)?.name}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-neon-cyan transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-foreground/70 mb-4 line-clamp-3">
                    {news.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-foreground/60">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(news.date).toLocaleDateString('pt-BR')}
                      </span>
                      <Button variant="ghost" size="sm" className="h-6 p-0 text-neon-cyan hover:text-white" onClick={() => window.open(news.link, '_blank')}>
                        Ler artigo original <LinkIcon className="h-3 w-3 ml-1"/>
                      </Button>
                    </div>
                    <span className="flex items-center gap-1 text-neon-green">
                      <Eye className="h-4 w-4" />
                      {Math.floor(Math.random() * 20) + 1}K
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
            )}

            {/* Grade regular de notícias */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularNewsList.map((news) => (
                <Card key={news.id} className="bg-card/80 backdrop-blur-sm border-border/30 hover:border-neon-purple/50 transition-all duration-300 hover:shadow-lg hover:shadow-neon-purple/10 group overflow-hidden">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {news.image_url ? (
                      <img src={news.image_url} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-secondary opacity-20"></div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {!news.image_url && (
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {categories.find(cat => cat.id === news.category)?.name[0] || 'N'}
                          </span>
                        </div>
                      )}
                    </div>
                    <Badge className={`absolute top-3 left-3 ${getCategoryColor(news.category || 'tech')} text-white text-xs`}>
                  {categories.find(cat => cat.id === news.category)?.name}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-neon-purple transition-colors line-clamp-2">
                  {news.title}
                </h3>
                  <p className="text-foreground/70 text-sm mb-3 line-clamp-2">
                    {news.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-foreground/60 mt-auto pt-4">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(news.date).toLocaleDateString('pt-BR')}
                      </span>
                      <Button variant="ghost" size="sm" className="h-5 p-0 text-neon-purple hover:text-white ml-2" onClick={() => window.open(news.link, '_blank')}>
                        Ler <LinkIcon className="h-3 w-3 ml-1"/>
                      </Button>
                    </div>
                    <span className="flex items-center gap-1 text-neon-green">
                      <Eye className="h-3 w-3" />
                      {Math.floor(Math.random() * 10) + 1}K
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Nenhum resultado */}
          {filteredNews.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-10 w-10 text-foreground/50" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Nenhuma notícia encontrada</h3>
              <p className="text-foreground/60">Tente ajustar os filtros ou termo de busca</p>
            </div>
          )}
        </>
        )}
      </main>
    </div>
  );
};

export default Noticias;