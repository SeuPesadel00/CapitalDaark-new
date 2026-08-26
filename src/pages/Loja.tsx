import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Star, Heart, ExternalLink, Flame, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import { useToast } from '../hooks/use-toast';

const TOTAL_PRODUCTS = 40;
const PRODUCTS_PER_LOAD = 12;

export interface AffiliateProduct {
  id: number;
  nome: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  prices: {
    amazon: { price: number; link: string; original?: number };
    shopee: { price: number; link: string; original?: number };
    mercadolivre: { price: number; link: string; original?: number };
  };
  bestPrice: number;
  bestStore: 'amazon' | 'shopee' | 'mercadolivre';
  featured: boolean;
}

function generateProducts(): AffiliateProduct[] {
  const categories = ['electronics', 'gaming', 'wearables', 'computers'];
  const names = [
    'Smartphone Quantum Pro 5G', 'Headset Neon Gaming 7.1', 'Smartwatch Cyber Watch 3', 
    'Laptop UltraBook M2', 'Câmera PixelCam 4K', 'Caixa SoundMax Bluetooth', 
    'Óculos VR Vision Pro', 'NanoDrone Dobrável'
  ];
  const products = [];
  for (let i = 1; i <= TOTAL_PRODUCTS; i++) {
    const category = categories[i % categories.length];
    const name = names[i % names.length];
    
    // Simula preços para as 3 lojas
    const basePrice = Math.round(500 + Math.random() * 5000);
    const pAmazon = basePrice + Math.round(Math.random() * 100 - 50);
    const pShopee = basePrice + Math.round(Math.random() * 100 - 60); // Geralmente mais barato
    const pMeli = basePrice + Math.round(Math.random() * 100 - 40);

    const prices = {
      amazon: { price: pAmazon, link: 'https://amazon.com.br' },
      shopee: { price: pShopee, link: 'https://shopee.com.br' },
      mercadolivre: { price: pMeli, link: 'https://mercadolivre.com.br' }
    };

    // Descobrir qual o menor preço para o crachá
    let bestStore: 'amazon' | 'shopee' | 'mercadolivre' = 'amazon';
    let bestPrice = pAmazon;

    if (pShopee < bestPrice) { bestPrice = pShopee; bestStore = 'shopee'; }
    if (pMeli < bestPrice) { bestPrice = pMeli; bestStore = 'mercadolivre'; }

    products.push({
      id: i,
      nome: `${name} #${i}`,
      category,
      image: `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80`, // placeholder bonito
      rating: +(4 + Math.random()).toFixed(1),
      reviews: Math.floor(Math.random() * 300) + 10,
      prices,
      bestPrice,
      bestStore,
      featured: Math.random() > 0.8
    });
  }
  return products;
}

const allProducts = generateProducts();

const categories = [
  { id: 'all', name: 'Todas as Ofertas' },
  { id: 'electronics', name: 'Eletrônicos' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'wearables', name: 'Wearables' },
  { id: 'computers', name: 'Informática' }
];

const Loja = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_LOAD);
  const loaderRef = useRef<HTMLDivElement>(null);

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Rolagem infinita: carregue mais produtos ao chegar ao fundo
  useEffect(() => {
    const handleScroll = () => {
      if (
        loaderRef.current &&
        loaderRef.current.getBoundingClientRect().top < window.innerHeight
      ) {
        setVisibleCount((prev) =>
          Math.min(prev + PRODUCTS_PER_LOAD, filteredProducts.length)
        );
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredProducts.length]);

  const handleLinkClick = (storeName: string, product: AffiliateProduct) => {
    toast({
      title: "Redirecionando de forma segura...",
      description: `Abrindo ${product.nome} no site oficial da ${storeName}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
           <Badge className="mb-6 bg-gradient-primary text-white px-4 py-2 text-sm font-medium flex items-center gap-2 mx-auto w-fit">
              <Flame className="w-4 h-4" /> Comparador de Preços em Tempo Real
            </Badge>
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-neon-cyan mb-4">
            Central de <span className="text-neon-purple">Ofertas</span>
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Nós rastreamos os maiores sites do Brasil para você sempre comprar pelo menor preço com segurança.
          </p>
        </div>

        {/*Pesquisar e Filtrar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 h-5 w-5" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setVisibleCount(PRODUCTS_PER_LOAD); // Redefinir rolagem na pesquisa
              }}
              className="pl-10 bg-card border-border/30 focus:border-neon-cyan"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedCategory(category.id);
                  setVisibleCount(PRODUCTS_PER_LOAD); // Redefinir rolagem no filtro
                }}
                className={selectedCategory === category.id 
                  ? "bg-gradient-primary" 
                  : "border-border/30 hover:border-neon-cyan/50"
                }
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Grade de Produtos */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.slice(0, visibleCount).map((product) => (
            <Card key={product.id} className="bg-card border-border/20 hover:border-neon-cyan/30 transition-all duration-300 hover:shadow-xl hover:shadow-neon-cyan/10 group">
              <CardHeader className="p-0 relative">
                {/* Imagem do produto */}
                <div className="aspect-square bg-muted rounded-t-lg relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Emblemas */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.featured && (
                      <Badge className="bg-neon-purple text-white">Imperdível</Badge>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3">
                     <Badge className="bg-green-600 font-bold text-white shadow-lg text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3"/> Melhor Preço: {product.bestStore}
                     </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 flex-grow">
                <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-neon-cyan transition-colors line-clamp-2">
                  {product.nome}
                </h3>
                
                {/* Avaliação */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-neon-orange text-neon-orange" />
                    <span className="text-sm font-medium text-foreground ml-1">{product.rating}</span>
                  </div>
                  <span className="text-sm text-foreground/60">({product.reviews} avaliações)</span>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                <p className="text-xs text-foreground/50 text-left w-full">Comparativo:</p>
                
                <Button 
                  className={`w-full justify-between hover:scale-105 transition-transform ${product.bestStore === 'amazon' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-card border border-orange-500/30'}`}
                  variant={product.bestStore === 'amazon' ? 'default' : 'outline'}
                  onClick={() => { handleLinkClick('Amazon', product); window.open(product.prices.amazon.link, '_blank'); }}
                >
                  <span className="flex items-center gap-2">Amazon</span>
                  <span className="font-bold">R$ {product.prices.amazon.price.toFixed(2)}</span>
                </Button>

                <Button 
                  className={`w-full justify-between hover:scale-105 transition-transform ${product.bestStore === 'shopee' ? 'bg-red-500 hover:bg-red-600' : 'bg-card border border-red-500/30'}`}
                  variant={product.bestStore === 'shopee' ? 'default' : 'outline'}
                  onClick={() => { handleLinkClick('Shopee', product); window.open(product.prices.shopee.link, '_blank'); }}
                >
                  <span className="flex items-center gap-2">Shopee</span>
                  <span className="font-bold">R$ {product.prices.shopee.price.toFixed(2)}</span>
                </Button>

                <Button 
                  className={`w-full justify-between hover:scale-105 transition-transform ${product.bestStore === 'mercadolivre' ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-card border border-yellow-500/30 text-yellow-500'}`}
                  variant={product.bestStore === 'mercadolivre' ? 'default' : 'outline'}
                  onClick={() => { handleLinkClick('Mercado Livre', product); window.open(product.prices.mercadolivre.link, '_blank'); }}
                >
                  <span className="flex items-center gap-2">Mercado Livre</span>
                  <span className="font-bold">R$ {product.prices.mercadolivre.price.toFixed(2)}</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Carregador para rolagem infinita */}
        {visibleCount < filteredProducts.length && (
          <div ref={loaderRef} className="flex justify-center py-8">
            <span className="text-neon-cyan animate-pulse">Carregando mais produtos...</span>
          </div>
        )}

        {/* Nenhum resultado */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 text-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum produto encontrado</h3>
            <p className="text-foreground/60">Tente ajustar os filtros ou termo de busca</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Loja;