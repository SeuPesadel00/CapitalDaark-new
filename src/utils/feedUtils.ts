export interface FeedItem {
  type: 'post' | 'news';
  id: string; // ID do Supabase ou URL para RSS
  user_id?: string; // ID do criador original (para posts)
  title?: string;
  content?: string;
  image_url?: string | null;
  date: Date;
  author?: string;
  avatar_url?: string | null;
  link?: string;
  category?: string;
  likes_count: number;
  has_liked: boolean;
}

export const RSS_FEEDS = [
  { url: 'https://g1.globo.com/rss/g1/tecnologia/', category: 'tech' },
  { url: 'https://br.cointelegraph.com/rss', category: 'business' },
  { url: 'https://jovemnerd.com.br/feed', category: 'gaming' },
  { url: 'https://www.techtudo.com.br/feed', category: 'tech' },
  { url: 'https://rss.tecmundo.com.br/feed', category: 'tech' },
  { url: 'https://www.tudocelular.com/rss.xml', category: 'tech' },
  { url: 'https://www.infomoney.com.br/feed/', category: 'business' },
  { url: 'https://www.theenemy.com.br/feed', category: 'gaming' },
  { url: 'https://tecnoblog.net/feed/', category: 'tech' },
  { url: 'https://macmagazine.com.br/feed/', category: 'tech' },
  { url: 'https://olhardigital.com.br/feed/', category: 'tech' },
  { url: 'https://www.gamevicio.com/rss/', category: 'gaming' },
  { url: 'https://epocanegocios.globo.com/rss/EpocaNegocios/', category: 'business' },
  { url: 'https://investnews.com.br/feed/', category: 'business' },
  { url: 'https://mitsloanreview.com.br/feed/', category: 'ai' }
];

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export async function fetchNewsFeeds(): Promise<FeedItem[]> {
  // Sorteamos fontes diferentes a cada F5 para dar variedade imensa sem explodir o limite gratuito da API (Rate Limit 429)
  const techFeeds = shuffleArray(RSS_FEEDS.filter(f => f.category === 'tech')).slice(0, 2);
  const businessFeeds = shuffleArray(RSS_FEEDS.filter(f => f.category === 'business')).slice(0, 1);
  const gamingFeeds = shuffleArray(RSS_FEEDS.filter(f => f.category === 'gaming')).slice(0, 1);
  const aiFeeds = shuffleArray(RSS_FEEDS.filter(f => f.category === 'ai')).slice(0, 1);
  
  const selectedFeeds = [...techFeeds, ...businessFeeds, ...gamingFeeds, ...aiFeeds];

  const newsPromises = selectedFeeds.map(async (feed) => {
    try {
      // Usando cachebuster simples para forçar dados mais novos
      const cacheBuster = `&t=${new Date().getTime()}`;
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${feed.url}${cacheBuster}`);
      const data = await response.json();
      if (data.items) {
        return data.items.slice(0, 15).map((item: any) => {
          let imageUrl = item.thumbnail || item.enclosure?.link;
          if (!imageUrl && item.description) {
            const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch) imageUrl = imgMatch[1];
          }

          return {
            type: 'news',
            id: item.link,
            title: item.title,
            content: item.description.replace(/<[^>]+>/g, '').substring(0, 180) + '...',
            image_url: imageUrl || 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=800',
            date: new Date(item.pubDate),
            link: item.link,
            category: feed.category,
            likes_count: 0,
            has_liked: false
          } as FeedItem;
        });
      }
      return [];
    } catch (e) {
      console.error(`Erro ao buscar feed ${feed.category}`, e);
      return [];
    }
  });

  const newsResults = await Promise.all(newsPromises);
  return newsResults.flat();
}
