import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Loader2, Pencil, Trash2, X, PlusCircle, Wand2 } from 'lucide-react';

const AdminAfiliados = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Scraping States
  const [magicUrl, setMagicUrl] = useState('');
  const [scraping, setScraping] = useState(false);

  const initialFormState = {
    nome: '',
    category: 'electronics',
    image: '',
    rating: 5.0,
    reviews: 150,
    featured: false,
    price_amazon: '',
    link_amazon: '',
    price_shopee: '',
    link_shopee: '',
    price_meli: '',
    link_meli: '',
    price_aliexpress: '',
    link_aliexpress: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const loadProdutos = async () => {
    setFetching(true);
    const { data, error } = await supabase.from('affiliate_products').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setProdutos(data);
    }
    setFetching(false);
  };

  useEffect(() => {
    loadProdutos();
  }, []);

  const handleScrape = async () => {
    if (!magicUrl) {
      toast({ variant: 'destructive', title: 'URL Inválida', description: 'Cole um link antes de puxar os dados.' });
      return;
    }
    
    setScraping(true);
    try {
      const response = await fetch(`/api/scrape?url=${encodeURIComponent(magicUrl)}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Erro ao extrair dados da página.');
      
      setFormData(prev => ({
        ...prev,
        // Só substitui o nome e imagem se ainda estiverem vazios
        nome: prev.nome ? prev.nome : (data.title || ''),
        image: prev.image ? prev.image : (data.image || ''),
        
        // Tentar inferir a loja e colocar o preço e link nela (mantendo os dados anteriores das outras lojas intactos)
        price_amazon: magicUrl.includes('amazon') && data.price ? data.price : prev.price_amazon,
        link_amazon: magicUrl.includes('amazon') ? magicUrl : prev.link_amazon,
        
        price_aliexpress: magicUrl.includes('aliexpress') && data.price ? data.price : prev.price_aliexpress,
        link_aliexpress: magicUrl.includes('aliexpress') ? magicUrl : prev.link_aliexpress,
        
        price_shopee: magicUrl.includes('shopee') && data.price ? data.price : prev.price_shopee,
        link_shopee: magicUrl.includes('shopee') ? magicUrl : prev.link_shopee,
      }));
      
      toast({ title: "Mágica Feita! 🪄", description: "Os dados foram preenchidos automaticamente." });
      setMagicUrl(''); // Limpar input
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Falha no Robô', description: error.message });
    } finally {
      setScraping(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        nome: formData.nome,
        category: formData.category,
        image: formData.image,
        rating: Number(formData.rating),
        reviews: Number(formData.reviews),
        featured: formData.featured,
        price_amazon: formData.price_amazon ? Number(String(formData.price_amazon).replace(',', '.')) : null,
        link_amazon: formData.link_amazon || null,
        price_shopee: formData.price_shopee ? Number(String(formData.price_shopee).replace(',', '.')) : null,
        link_shopee: formData.link_shopee || null,
        price_meli: formData.price_meli ? Number(String(formData.price_meli).replace(',', '.')) : null,
        link_meli: formData.link_meli || null,
        price_aliexpress: formData.price_aliexpress ? Number(String(formData.price_aliexpress).replace(',', '.')) : null,
        link_aliexpress: formData.link_aliexpress || null
      };

      if (editingId) {
        // Atualizar
        const { error } = await supabase.from('affiliate_products').update(payload).eq('id', editingId);
        if (error) throw error;
        toast({ title: "Atualizado!", description: "Produto modificado com sucesso." });
      } else {
        // Criar Novo
        const { error } = await supabase.from('affiliate_products').insert(payload);
        if (error) throw error;
        toast({ title: "Sucesso!", description: "Produto de afiliado inserido no banco de dados." });
      }

      setFormData(initialFormState);
      setEditingId(null);
      loadProdutos();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (prod: any) => {
    setEditingId(prod.id);
    setFormData({
      nome: prod.nome || '',
      category: prod.category || 'electronics',
      image: prod.image || '',
      rating: prod.rating || 5.0,
      reviews: prod.reviews || 150,
      featured: prod.featured || false,
      price_amazon: prod.price_amazon ? String(prod.price_amazon) : '',
      link_amazon: prod.link_amazon || '',
      price_shopee: prod.price_shopee ? String(prod.price_shopee) : '',
      link_shopee: prod.link_shopee || '',
      price_meli: prod.price_meli ? String(prod.price_meli) : '',
      link_meli: prod.link_meli || '',
      price_aliexpress: prod.price_aliexpress ? String(prod.price_aliexpress) : '',
      link_aliexpress: prod.link_aliexpress || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto permanentemente?')) return;
    
    try {
      const { error } = await supabase.from('affiliate_products').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Excluído", description: "O produto foi removido da loja." });
      loadProdutos();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.message });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-5xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-orbitron font-bold text-neon-purple">
            Painel de Administração
          </h1>
          {editingId && (
            <Button variant="outline" onClick={cancelEdit} className="border-neon-purple text-neon-purple hover:bg-neon-purple/20">
              <PlusCircle className="mr-2 h-4 w-4" /> Novo Cadastro
            </Button>
          )}
        </div>
        
        {/* FORMULÁRIO */}
        <form onSubmit={handleSubmit} className={`p-6 rounded-xl border shadow-lg space-y-8 mb-12 ${editingId ? 'bg-primary/5 border-primary/40' : 'bg-card border-border'}`}>
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <h2 className="text-2xl font-bold text-white">
              {editingId ? '✏️ Editando Produto' : '📦 Novo Produto de Afiliado'}
            </h2>
            {editingId && (
              <Button type="button" variant="ghost" size="sm" onClick={cancelEdit} className="text-muted-foreground hover:text-white">
                <X className="mr-2 h-4 w-4" /> Cancelar Edição
              </Button>
            )}
          </div>
          
          {/* BARRA MÁGICA DE EXTRAÇÃO */}
          {!editingId && (
            <div className="bg-gradient-to-r from-neon-purple/20 to-transparent p-4 rounded-lg border border-neon-purple/30 mb-6">
              <h3 className="text-neon-purple font-semibold mb-2 flex items-center">
                <Wand2 className="w-4 h-4 mr-2" /> Puxador Mágico (Auto-Preenchimento)
              </h3>
              <p className="text-sm text-muted-foreground mb-3">Cole o link da Amazon ou AliExpress abaixo e o robô preencherá a imagem e o título para você.</p>
              <div className="flex gap-2">
                <Input 
                  placeholder="https://amzn.to/..." 
                  value={magicUrl} 
                  onChange={(e) => setMagicUrl(e.target.value)}
                  className="bg-background"
                />
                <Button 
                  type="button" 
                  onClick={handleScrape} 
                  disabled={scraping}
                  className="bg-neon-purple hover:bg-neon-purple/80 text-white"
                >
                  {scraping ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Puxar Dados'}
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <h3 className="text-lg text-neon-cyan pb-2">Detalhes Principais</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto *</Label>
                <Input required id="nome" name="nome" value={formData.nome} onChange={handleChange} placeholder="Ex: Smartphone XYZ" />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={formData.category} onValueChange={(val) => setFormData(p => ({ ...p, category: val }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Eletrônicos</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                    <SelectItem value="wearables">Wearables</SelectItem>
                    <SelectItem value="computers">Computadores/Hardware</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL da Imagem *</Label>
              <Input required id="image" name="image" value={formData.image} onChange={handleChange} placeholder="https://amazon.com/.../img.jpg" />
              {formData.image && (
                <div className="mt-2 p-2 bg-black/40 rounded inline-block">
                  <img src={formData.image} alt="Preview" className="h-16 object-contain" />
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
               <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background/50">
                <div className="space-y-0.5">
                  <Label>Destacar no Feed?</Label>
                  <p className="text-sm text-muted-foreground">Isso fará o produto aparecer como Oferta na Home.</p>
                </div>
                <Switch 
                  checked={formData.featured}
                  onCheckedChange={(c) => setFormData(p => ({ ...p, featured: c }))} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg text-orange-500 pb-2">Amazon</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_amazon">Preço Atual</Label>
                <Input id="price_amazon" name="price_amazon" type="number" step="0.01" value={formData.price_amazon} onChange={handleChange} placeholder="Ex: 199.90" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="link_amazon">Seu Link de Afiliado Amazon</Label>
                <Input id="link_amazon" name="link_amazon" value={formData.link_amazon} onChange={handleChange} placeholder="https://amzn.to/..." />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg text-red-500 pb-2">Shopee</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_shopee">Preço Atual</Label>
                <Input id="price_shopee" name="price_shopee" type="number" step="0.01" value={formData.price_shopee} onChange={handleChange} placeholder="Ex: 185.00" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="link_shopee">Seu Link de Afiliado Shopee</Label>
                <Input id="link_shopee" name="link_shopee" value={formData.link_shopee} onChange={handleChange} placeholder="https://shope.ee/..." />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg text-yellow-500 pb-2">Mercado Livre</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_meli">Preço Atual</Label>
                <Input id="price_meli" name="price_meli" type="number" step="0.01" value={formData.price_meli} onChange={handleChange} placeholder="Ex: 210.00" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="link_meli">Seu Link de Afiliado Mercado Livre</Label>
                <Input id="link_meli" name="link_meli" value={formData.link_meli} onChange={handleChange} placeholder="https://mercadolivre.com.br/..." />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg text-orange-600 pb-2">AliExpress</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_aliexpress">Preço Atual</Label>
                <Input id="price_aliexpress" name="price_aliexpress" type="number" step="0.01" value={formData.price_aliexpress} onChange={handleChange} placeholder="Ex: 110.00" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="link_aliexpress">Seu Link de Afiliado AliExpress</Label>
                <Input id="link_aliexpress" name="link_aliexpress" value={formData.link_aliexpress} onChange={handleChange} placeholder="https://s.click.aliexpress.com/..." />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-lg py-6 shadow-lg shadow-primary/30">
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (editingId ? "Salvar Alterações" : "Publicar Nova Oferta")}
          </Button>

        </form>

        {/* LISTAGEM DE PRODUTOS */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-border/50 pb-2">Catálogo Ativo</h2>
          
          {fetching ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
          ) : produtos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
              Nenhum produto cadastrado no banco de dados.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {produtos.map(prod => (
                <div key={prod.id} className="bg-card border border-border/50 rounded-lg p-4 flex gap-4 items-start relative group hover:border-primary/50 transition-colors">
                  <img src={prod.image} alt={prod.nome} className="w-20 h-20 object-cover rounded bg-muted" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate" title={prod.nome}>{prod.nome}</h4>
                    <p className="text-xs text-muted-foreground capitalize mb-2">{prod.category}</p>
                    
                    <div className="flex gap-2">
                      {prod.price_amazon && <span className="text-[10px] bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded">AMZ</span>}
                      {prod.price_shopee && <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded">SHO</span>}
                      {prod.price_meli && <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded">MELI</span>}
                      {prod.price_aliexpress && <span className="text-[10px] bg-orange-600/20 text-orange-600 px-2 py-0.5 rounded">ALI</span>}
                    </div>
                  </div>
                  
                  {/* Botões de Ação */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur rounded shadow-lg p-1 flex border border-border">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/20" onClick={() => handleEdit(prod)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/20" onClick={() => handleDelete(prod.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminAfiliados;
