import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import newsTech from '@/assets/news-tech.jpg';
import newsBusiness from '@/assets/news-business.jpg';
import newsGaming from '@/assets/news-gaming.jpg';

const newsData = [
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
  }
];

const NewsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-background">
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
          {newsData.map((news) => (
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
      </div>
    </section>
  );
};

export default NewsSection;