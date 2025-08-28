import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
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
import newsSmartHome from '@/assets/news-smart-home.jpg';
import newsCloud from '@/assets/news-cloud.jpg';
import newsFintech from '@/assets/news-fintech.jpg';
import newsEcommerce from '@/assets/news-ecommerce.jpg';
import newsSocial from '@/assets/news-social.jpg';
import newsBiotech from '@/assets/news-biotech.jpg';
import newsAr from '@/assets/news-ar.jpg';
import newsEnergy from '@/assets/news-energy.jpg';
import newsDrones from '@/assets/news-drones.jpg';

const allNewsData = [
  {
    id: 1,
    title: 'Revolução da IA: Nova Era Digital',
    excerpt: 'Descobra como a inteligência artificial está transformando o mundo dos negócios e criando oportunidades únicas no mercado digital.',
    image: newsTech,
    date: '28/08/2025',
    readTime: '5 min',
    category: 'Tecnologia'
  },
  {
    id: 2,
    title: 'Inovação Empresarial 2025',
    excerpt: 'As principais tendências que estão moldando o futuro dos negócios e como se adaptar às mudanças do mercado atual.',
    image: newsBusiness,
    date: '27/08/2025',
    readTime: '7 min',
    category: 'Negócios'
  },
  {
    id: 3,
    title: 'Gaming: O Futuro dos Entretenimentos',
    excerpt: 'Explore as últimas novidades do mundo gaming, desde realidade virtual até os jogos mais aguardados do ano.',
    image: newsGaming,
    date: '26/08/2025',
    readTime: '4 min',
    category: 'Gaming'
  },
  {
    id: 4,
    title: 'IA Generativa Revoluciona Criação',
    excerpt: 'Como a inteligência artificial generativa está mudando a forma como criamos conteúdo e soluções inovadoras.',
    image: newsAi,
    date: '25/08/2025',
    readTime: '6 min',
    category: 'Inteligência Artificial'
  },
  {
    id: 5,
    title: 'Criptomoedas: Futuro das Finanças',
    excerpt: 'Análise das principais tendências do mercado de criptomoedas e seu impacto na economia global.',
    image: newsCrypto,
    date: '24/08/2025',
    readTime: '8 min',
    category: 'Blockchain'
  },
  {
    id: 6,
    title: 'Tecnologia Verde: Sustentabilidade',
    excerpt: 'Inovações em energia renovável e como a tecnologia verde está moldando um futuro sustentável.',
    image: newsGreen,
    date: '23/08/2025',
    readTime: '5 min',
    category: 'Sustentabilidade'
  },
  {
    id: 7,
    title: 'Cibersegurança: Proteção Digital',
    excerpt: 'As principais ameaças cibernéticas de 2025 e como se proteger no mundo digital.',
    image: newsSecurity,
    date: '22/08/2025',
    readTime: '7 min',
    category: 'Segurança'
  },
  {
    id: 8,
    title: 'Realidade Virtual: Novos Mundos',
    excerpt: 'Como a realidade virtual está criando experiências imersivas e revolucionando diversos setores.',
    image: newsVr,
    date: '21/08/2025',
    readTime: '6 min',
    category: 'VR/AR'
  },
  {
    id: 9,
    title: 'Carros Elétricos: Mobilidade Limpa',
    excerpt: 'A revolução dos veículos elétricos e o futuro da mobilidade urbana sustentável.',
    image: newsElectric,
    date: '20/08/2025',
    readTime: '5 min',
    category: 'Mobilidade'
  },
  {
    id: 10,
    title: 'Rede 5G: Conectividade Total',
    excerpt: 'Como a tecnologia 5G está transformando a conectividade e habilitando novas possibilidades.',
    image: news5g,
    date: '19/08/2025',
    readTime: '4 min',
    category: 'Telecomunicações'
  },
  {
    id: 11,
    title: 'Computação Quântica: Poder Infinito',
    excerpt: 'Os avanços da computação quântica e seu potencial para resolver problemas complexos.',
    image: newsQuantum,
    date: '18/08/2025',
    readTime: '9 min',
    category: 'Ciência'
  },
  {
    id: 12,
    title: 'Robótica Avançada: Automação',
    excerpt: 'Como os robôs estão revolucionando a indústria e criando novas oportunidades de trabalho.',
    image: newsRobotics,
    date: '17/08/2025',
    readTime: '6 min',
    category: 'Robótica'
  },
  {
    id: 13,
    title: 'Saúde Digital: Medicina 4.0',
    excerpt: 'A transformação digital da medicina e como a tecnologia está salvando mais vidas.',
    image: newsHealth,
    date: '16/08/2025',
    readTime: '7 min',
    category: 'Saúde'
  },
  {
    id: 14,
    title: 'Exploração Espacial: Novas Fronteiras',
    excerpt: 'Os últimos avanços na exploração espacial e os planos para colonização de outros planetas.',
    image: newsSpace,
    date: '15/08/2025',
    readTime: '8 min',
    category: 'Espaço'
  },
  {
    id: 15,
    title: 'Casa Inteligente: Vida Conectada',
    excerpt: 'Como a Internet das Coisas está transformando nossas casas em ambientes inteligentes.',
    image: newsSmartHome,
    date: '14/08/2025',
    readTime: '5 min',
    category: 'IoT'
  },
  {
    id: 16,
    title: 'Computação na Nuvem: Acesso Total',
    excerpt: 'A evolução da computação em nuvem e como está democratizando o acesso à tecnologia.',
    image: newsCloud,
    date: '13/08/2025',
    readTime: '6 min',
    category: 'Cloud'
  },
  {
    id: 17,
    title: 'Fintech: Revolução Financeira',
    excerpt: 'Como as fintechs estão revolucionando o sistema financeiro e democratizando serviços.',
    image: newsFintech,
    date: '12/08/2025',
    readTime: '7 min',
    category: 'Fintech'
  },
  {
    id: 18,
    title: 'E-commerce: Compras do Futuro',
    excerpt: 'As tendências do comércio eletrônico e como a experiência de compra está evoluindo.',
    image: newsEcommerce,
    date: '11/08/2025',
    readTime: '5 min',
    category: 'E-commerce'
  },
  {
    id: 19,
    title: 'Redes Sociais: Conexão Global',
    excerpt: 'O impacto das redes sociais na sociedade e as novas formas de comunicação digital.',
    image: newsSocial,
    date: '10/08/2025',
    readTime: '6 min',
    category: 'Social Media'
  },
  {
    id: 20,
    title: 'Biotecnologia: Engenharia da Vida',
    excerpt: 'Os avanços da biotecnologia e como está revolutionando tratamentos médicos.',
    image: newsBiotech,
    date: '09/08/2025',
    readTime: '8 min',
    category: 'Biotecnologia'
  }
];

const NewsSection = () => {
  const navigate = useNavigate();
  const [displayedNews, setDisplayedNews] = useState(allNewsData.slice(0, 6));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreNews = () => {
    if (loading || !hasMore) return;

    setLoading(true);
    
    setTimeout(() => {
      const currentLength = displayedNews.length;
      const nextNews = allNewsData.slice(currentLength, currentLength + 6);
      
      if (nextNews.length === 0) {
        setHasMore(false);
      } else {
        setDisplayedNews(prev => [...prev, ...nextNews]);
      }
      
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMoreNews();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, displayedNews.length]);

  return (
    <section id="news-section" className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
            <span className="text-primary">Últimas</span>
            <span className="text-secondary ml-2">Notícias</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Fique por dentro das novidades e tendências que estão moldando o futuro
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedNews.map((news) => (
            <Card 
              key={news.id} 
              className="group hover:shadow-lg transition-all duration-300 border-border/20 bg-card/50 backdrop-blur-sm overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full">
                    {news.category}
                  </span>
                </div>
              </div>
              
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {news.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {news.readTime}
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {news.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="mb-4 text-sm leading-relaxed">
                  {news.excerpt}
                </CardDescription>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="group/btn border-primary/20 text-primary hover:bg-primary/10"
                  onClick={() => navigate(`/noticia/${news.id}`)}
                >
                  Ler mais
                  <ArrowRight className="ml-2 w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {loading && (
          <div className="text-center mt-12">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-primary bg-card/50 transition ease-in-out duration-150">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Carregando mais notícias...
            </div>
          </div>
        )}

        {!hasMore && displayedNews.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              Você visualizou todas as notícias disponíveis
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;