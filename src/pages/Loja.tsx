import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Search, Filter, Star, Heart } from 'lucide-react';
import Header from '@/components/Header';

const Loja = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const products = [
    {
      id: 1,
      name: 'Smartphone Quantum Pro',
      price: 2499.99,
      originalPrice: 2999.99,
      category: 'electronics',
      image: '/placeholder.svg',
      rating: 4.8,
      reviews: 156,
      discount: 17,
      inStock: true,
      featured: true
    },
    {
      id: 2,
      name: 'Headset Neon Gaming',
      price: 799.99,
      originalPrice: 999.99,
      category: 'gaming',
      image: '/placeholder.svg',
      rating: 4.9,
      reviews: 89,
      discount: 20,
      inStock: true,
      featured: false
    },
    {
      id: 3,
      name: 'Smart Watch Cyber',
      price: 1299.99,
      originalPrice: 1599.99,
      category: 'wearables',
      image: '/placeholder.svg',
      rating: 4.7,
      reviews: 234,
      discount: 19,
      inStock: false,
      featured: true
    },
    {
      id: 4,
      name: 'Notebook UltraBook',
      price: 4999.99,
      originalPrice: null,
      category: 'computers',
      image: '/placeholder.svg',
      rating: 4.9,
      reviews: 67,
      discount: 0,
      inStock: true,
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'electronics', name: 'Eletrônicos' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'wearables', name: 'Wearables' },
    { id: 'computers', name: 'Computadores' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: any) => {
    // Cart logic here
    console.log('Added to cart:', product);
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-border/30 focus:border-neon-cyan"
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
          {filteredProducts.map((product) => (
            <Card key={product.id} className="bg-card border-border/20 hover:border-neon-cyan/30 transition-all duration-300 hover:shadow-xl hover:shadow-neon-cyan/10 group">
              <CardHeader className="p-0 relative">
                {/* Product Image */}
                <div className="aspect-square bg-muted rounded-t-lg relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
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
                  {product.name}
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
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inStock ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

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