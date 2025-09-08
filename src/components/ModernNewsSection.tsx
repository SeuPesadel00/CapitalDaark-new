import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import das imagens
import newsTech from '@/assets/news-tech.jpg';
import newsBusiness from '@/assets/news-business.jpg';
import newsGaming from '@/assets/news-gaming.jpg';
import newsAi from '@/assets/news-ai.jpg';
import newsCrypto from '@/assets/news-crypto.jpg';
import newsGreen from '@/assets/news-green.jpg';
import newsSecurity from '@/assets/news-security.jpg';
import newsVr from '@/assets/news-vr.jpg';
import newsElectric from '@/assets/news-electric.jpg';
import news5g from '@/assets/news-5g.jpg';
import newsQuantum from '@/assets/news-quantum.jpg';
import newsRobotics from '@/assets/news-robotics.jpg';
import newsHealth from '@/assets/news-health.jpg';
import newsSpace from '@/assets/news-space.jpg';

const allNewsData = [
  {
    id: 1,
    title: 'Revolução da IA: Nova Era Digital Transformando o Mercado Global',
    excerpt: 'Descobra como a inteligência artificial está transformando o mundo dos negócios e criando oportunidades únicas no mercado digital.',
    image: newsTech,
    date: '28/08/2025',
    readTime: '5 min',
    category: 'Tecnologia',
    featured: true
  },
  {
    id: 2,
    title: 'Inovação Empresarial 2025: Tendências que Moldam o Futuro',
    excerpt: 'As principais tendências que estão moldando o futuro dos negócios e como se adaptar às mudanças do mercado atual.',
    image: newsBusiness,
    date: '27/08/2025',
    readTime: '7 min',
    category: 'Negócios',
    featured: true
  },
  {
    id: 3,
    title: 'Gaming: O Futuro dos Entretenimentos Digitais',
    excerpt: 'Explore as últimas novidades do mundo gaming, desde realidade virtual até os jogos mais aguardados do ano.',
    image: newsGaming,
    date: '26/08/2025',
    readTime: '4 min',
    category: 'Gaming'
  },
  {
    id: 4,
    title: 'IA Generativa Revoluciona Processo de Criação',
    excerpt: 'Como a inteligência artificial generativa está mudando a forma como criamos conteúdo e soluções inovadoras.',
    image: newsAi,
    date: '25/08/2025',
    readTime: '6 min',
    category: 'Inteligência Artificial'
  },
  {
    id: 5,
    title: 'Criptomoedas: O Futuro das Finanças Digitais',
    excerpt: 'Análise das principais tendências do mercado de criptomoedas e seu impacto na economia global.',
    image: newsCrypto,
    date: '24/08/2025',
    readTime: '8 min',
    category: 'Blockchain'
  },
  {
    id: 6,
    title: 'Tecnologia Verde: Inovações em Sustentabilidade',
    excerpt: 'Inovações em energia renovável e como a tecnologia verde está moldando um futuro sustentável.',
    image: newsGreen,
    date: '23/08/2025',
    readTime: '5 min',
    category: 'Sustentabilidade'
  },
  {
    id: 7,
    title: 'Cibersegurança 2025: Proteção na Era Digital',
    excerpt: 'As principais ameaças cibernéticas de 2025 e como se proteger no mundo digital.',
    image: newsSecurity,
    date: '22/08/2025',
    readTime: '7 min',
    category: 'Segurança'
  },
  {
    id: 8,
    title: 'Realidade Virtual: Criando Novos Mundos Digitais',
    excerpt: 'Como a realidade virtual está criando experiências imersivas e revolucionando diversos setores.',
    image: newsVr,
    date: '21/08/2025',
    readTime: '6 min',
    category: 'VR/AR'
  }
];

const ModernNewsSection = () => {
  const navigate = useNavigate();
  const [displayedNews, setDisplayedNews] = useState(allNewsData.slice(0, 8));
  const [loading, setLoading] = useState(false);

  const featuredNews = displayedNews.filter(news => news.featured);
  const regularNews = displayedNews.filter(news => !news.featured);
  const mainNews = featuredNews[0];
  const secondaryFeatured = featuredNews.slice(1);

  const loadMoreNews = () => {
    if (loading) return;
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/f2993ceb-7c75-4bf7-84fd-dbec0ad7aba2.png" 
              alt="Capital Daark Mascot" 
              className="w-10 h-10"
            />
            <h2 className="text-2xl md:text-3xl font-orbitron font-bold">
              <span className="text-primary">Últimas</span>
              <span className="text-secondary ml-2">Notícias</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Em Destaque</span>
          </div>
        </div>

        {/* Main Layout - Similar to UOL/Globo */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Main Featured News */}
          {mainNews && (
            <div className="lg:col-span-2">
              <Card 
                className="group cursor-pointer overflow-hidden border-border/20 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-500"
                onClick={() => navigate(`/noticia/${mainNews.id}`)}
              >
                <div className="relative">
                  <img
                    src={mainNews.image}
                    alt={mainNews.title}
                    className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge variant="default" className="bg-primary/90 text-primary-foreground text-xs">
                      {mainNews.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h1 className="text-xl md:text-2xl font-bold mb-3 line-clamp-2 group-hover:text-neon-cyan transition-colors">
                      {mainNews.title}
                    </h1>
                    <p className="text-gray-200 mb-4 line-clamp-2">
                      {mainNews.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <span>{mainNews.date}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {mainNews.readTime}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Secondary Featured News */}
          <div className="space-y-4">
            {secondaryFeatured.map((news) => (
              <Card 
                key={news.id}
                className="group cursor-pointer overflow-hidden border-border/20 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                onClick={() => navigate(`/noticia/${news.id}`)}
              >
                <div className="flex gap-4 p-4">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="flex-1 min-w-0">
                    <Badge variant="outline" className="mb-2 text-xs">
                      {news.category}
                    </Badge>
                    <h3 className="font-semibold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">
                      {news.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                      <span>{news.date}</span>
                      <span>•</span>
                      <span>{news.readTime}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Regular News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {regularNews.map((news) => (
            <Card 
              key={news.id}
              className="group cursor-pointer overflow-hidden border-border/20 bg-card/30 backdrop-blur-sm hover:shadow-lg hover:bg-card/50 transition-all duration-300"
              onClick={() => navigate(`/noticia/${news.id}`)}
            >
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="p-4">
                <Badge variant="outline" className="mb-2 text-xs">
                  {news.category}
                </Badge>
                <h3 className="font-medium text-sm line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                  {news.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{news.date}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {news.readTime}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8">
          <button
            onClick={loadMoreNews}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg transition-all duration-300 text-primary hover:text-primary-foreground hover:bg-primary group"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Carregando...
              </>
            ) : (
              <>
                Ver mais notícias
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ModernNewsSection;