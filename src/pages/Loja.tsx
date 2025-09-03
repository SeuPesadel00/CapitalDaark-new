import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Search, Star, Heart } from 'lucide-react';
import Header from '@/components/Header';
import { useCart } from '../context/CartContext';
import { useToast } from '../hooks/use-toast';
import { Link } from 'react-router-dom';

const TOTAL_PRODUCTS = 200;
const PRODUCTS_PER_LOAD = 24;

function generateProducts() {
  const categories = ['electronics', 'gaming', 'wearables', 'computers'];
  const names = [
    'Quantum Pro', 'Neon Gaming', 'Cyber Watch', 'UltraBook', 'PixelCam', 'SoundMax', 'VR Vision', 'NanoDrone'
  ];
  const products = [];
  for (let i = 1; i <= TOTAL_PRODUCTS; i++) {
    const category = categories[i % categories.length];
    const name = names[i % names.length];
    products.push({
      id: i,
      nome: `${name} #${i}`,
      price: Math.round(500 + Math.random() * 5000),
      originalPrice: Math.random() > 0.5 ? Math.round(500 + Math.random() * 5000) : null,
      category,
      image: '/placeholder.svg',
      rating: +(4 + Math.random()).toFixed(1),
      reviews: Math.floor(Math.random() * 300),
      discount: Math.random() > 0.5 ? Math.floor(Math.random() * 30) : 0,
      inStock: Math.random() > 0.1,
      featured: Math.random() > 0.7
    });
  }
  return products;
}

const allProducts = generateProducts();

const categories = [
  { id: 'all', name: 'Todos' },
  { id: 'electronics', name: 'Eletrônicos' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'wearables', name: 'Wearables' },
  { id: 'computers', name: 'Computadores' }
];

const Loja = () => {
  const { adicionarProduto } = useCart();
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

  // Infinite scroll: load more products when reaching the bottom
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

  const handleAddToCart = (product: any) => {
    adicionarProduto({
      id: product.id,
      nome: product.nome,
      preco: product.price,
      quantidade: 1
    });
    
    toast({
      title: "Produto adicionado!",
      description: `${product.nome} foi adicionado ao seu carrinho.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-neon-cyan mb-4">
            Loja <span className="text-neon-purple">Digital</span>
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Descubra produtos incríveis com tecnologia de ponta e design futurista
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 h-5 w-5" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setVisibleCount(PRODUCTS_PER_LOAD); // Reset scroll on search
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
                  setVisibleCount(PRODUCTS_PER_LOAD); // Reset scroll on filter
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

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.slice(0, visibleCount).map((product) => (
            <Card key={product.id} className="bg-card border-border/20 hover:border-neon-cyan/30 transition-all duration-300 hover:shadow-xl hover:shadow-neon-cyan/10 group">
              <CardHeader className="p-0 relative">
                {/* Product Image */}
                <div className="aspect-square bg-muted rounded-t-lg relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.featured && (
                      <Badge className="bg-neon-purple text-white">Destaque</Badge>
                    )}
                    {product.discount > 0 && (
                      <Badge className="bg-destructive text-white">-{product.discount}%</Badge>
                    )}
                    {!product.inStock && (
                      <Badge variant="secondary" className="bg-muted text-foreground">Esgotado</Badge>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-neon-cyan transition-colors">
                  {product.nome}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-neon-orange text-neon-orange" />
                    <span className="text-sm font-medium text-foreground ml-1">{product.rating}</span>
                  </div>
                  <span className="text-sm text-foreground/60">({product.reviews} avaliações)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-neon-green">
                    R$ {product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-foreground/50 line-through">
                      R$ {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full bg-gradient-primary hover:bg-gradient-secondary disabled:opacity-50"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inStock ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Loader for infinite scroll */}
        {visibleCount < filteredProducts.length && (
          <div ref={loaderRef} className="flex justify-center py-8">
            <span className="text-neon-cyan animate-pulse">Carregando mais produtos...</span>
          </div>
        )}

        {/* No results */}
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