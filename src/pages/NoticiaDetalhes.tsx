import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Calendar, Clock, Share2, User } from 'lucide-react';
import newsTech from '@/assets/news-tech.jpg';
import newsBusiness from '@/assets/news-business.jpg';
import newsGaming from '@/assets/news-gaming.jpg';

const newsContent = {
  1: {
    title: 'Revolução da IA: Nova Era Digital',
    image: newsTech,
    date: '28/08/2025',
    readTime: '5 min',
    author: 'Maria Silva',
    category: 'Tecnologia',
    content: [
      'A inteligência artificial está redefinindo completamente a forma como interagimos com a tecnologia e conduzimos nossos negócios. Esta revolução digital não é apenas uma tendência passageira, mas uma transformação fundamental que está moldando o futuro.',
      'Nos últimos anos, testemunhamos avanços extraordinários em machine learning, processamento de linguagem natural e automação inteligente. Essas tecnologias estão sendo integradas em praticamente todos os setores, desde healthcare até finanças.',
      'As empresas que abraçam essa transformação digital estão vendo resultados impressionantes. Aumento de produtividade, redução de custos operacionais e melhor experiência do cliente são apenas alguns dos benefícios observados.',
      'O que torna essa era ainda mais empolgante é a democratização da IA. Hoje, pequenas empresas têm acesso às mesmas ferramentas poderosas que antes eram exclusivas das grandes corporações.',
      'Olhando para o futuro, podemos esperar ainda mais inovações. A combinação de IA com outras tecnologias emergentes como IoT, blockchain e realidade aumentada promete criar possibilidades que ainda nem imaginamos.',
      'É fundamental que profissionais e empresas se preparem para essa nova realidade, investindo em capacitação e adaptação às novas ferramentas disponíveis.'
    ]
  },
  2: {
    title: 'Inovação Empresarial 2025',
    image: newsBusiness,
    date: '27/08/2025',
    readTime: '7 min',
    author: 'João Santos',
    category: 'Negócios',
    content: [
      'O cenário empresarial de 2025 está sendo moldado por transformações sem precedentes. As empresas que prosperam são aquelas que abraçam a inovação como parte integral de sua estratégia.',
      'A sustentabilidade deixou de ser um diferencial para se tornar uma necessidade. Consumidores estão cada vez mais conscientes e exigem práticas responsáveis das marcas que escolhem apoiar.',
      'A transformação digital acelerou dramaticamente, especialmente após os eventos globais recentes. Empresas que resistiam à digitalização foram forçadas a se adaptar rapidamente ou ficaram para trás.',
      'Novos modelos de negócio estão emergindo, baseados em economia compartilhada, assinaturas e serviços personalizados. A flexibilidade se tornou uma vantagem competitiva crucial.',
      'A experiência do cliente evoluiu para além das expectativas tradicionais. Hoje, os consumidores esperam interações personalizadas, atendimento instantâneo e soluções que antecipem suas necessidades.',
      'Investir em talento e cultura organizacional nunca foi tão importante. As empresas mais inovadoras são aquelas que criam ambientes onde a criatividade e a experimentação são encorajadas.',
      'O futuro pertence às organizações ágeis, que conseguem se adaptar rapidamente às mudanças e transformar desafios em oportunidades.'
    ]
  },
  3: {
    title: 'Gaming: O Futuro dos Entretenimentos',
    image: newsGaming,
    date: '26/08/2025',
    readTime: '4 min',
    author: 'Ana Costa',
    category: 'Gaming',
    content: [
      'A indústria de games está vivenciando uma era dourada, com inovações tecnológicas que estão redefinindo completamente a experiência de entretenimento digital.',
      'A realidade virtual e aumentada saíram do reino da ficção científica para se tornarem realidades acessíveis. Os headsets de nova geração oferecem experiências imersivas que borram as linhas entre o virtual e o real.',
      'Cloud gaming está democratizando o acesso a jogos de alta qualidade. Agora é possível jogar títulos AAA em qualquer dispositivo, sem a necessidade de hardware caro.',
      'A inteligência artificial está sendo integrada nos jogos de formas criativas, criando NPCs mais realistas, narrativas adaptativas e experiências personalizadas para cada jogador.',
      'Esports continuam crescendo exponencialmente, com eventos que atraem milhões de espectadores e prêmios que rivalizam com esportes tradicionais. Uma nova geração de atletas digitais está emergindo.',
      'O metaverso gaming está criando economia virtuais completas, onde jogadores podem ganhar dinheiro real através de suas atividades no jogo, revolucionando o conceito de trabalho e entretenimento.'
    ]
  }
};

function NoticiaDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const article = newsContent[parseInt(id || '1') as keyof typeof newsContent];

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Notícia não encontrada</h1>
          <Button onClick={() => navigate('/')}>Voltar ao início</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        <div className="mb-6">
          <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
            {article.category}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-orbitron font-bold mb-6 text-foreground">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {article.author}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {article.date}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {article.readTime} de leitura
          </div>
          <Button variant="outline" size="sm" className="ml-auto">
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
        </div>

        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none">
          {article.content.map((paragraph, index) => (
            <p key={index} className="mb-6 text-foreground/90 leading-relaxed text-lg">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-12 p-6 bg-card/50 rounded-xl border border-border/20">
          <h3 className="text-xl font-semibold mb-4">Gostou desta notícia?</h3>
          <p className="text-muted-foreground mb-4">
            Fique por dentro das últimas novidades e tendências do mercado.
          </p>
          <Button onClick={() => navigate('/')}>
            Ver mais notícias
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </article>
    </Layout>
  );
}

export default NoticiaDetalhes;