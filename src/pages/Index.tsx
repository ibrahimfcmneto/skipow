import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product, Token } from '@/types';
import { getProducts, generateTokens, getAvailableTokens } from '@/lib/store';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { QuantityModal } from '@/components/QuantityModal';
import { QRModal } from '@/components/QRModal';
import { TokenItem } from '@/components/TokenItem';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { ShoppingBag, Ticket, ScanLine, Loader2 } from 'lucide-react';

export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modais e Abas
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantityModalOpen, setQuantityModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('loja');

  // Carrega dados iniciais do banco
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [prods, toks] = await Promise.all([getProducts(), getAvailableTokens()]);
    setProducts(prods);
    setTokens(toks);
    setLoading(false);
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setQuantityModalOpen(true);
  };

  const handleConfirmPurchase = async (product: Product, quantity: number) => {
    try {
      setLoading(true);
      await generateTokens(product, quantity); // Salva no banco
      
      // Atualiza a lista local
      const novosTokens = await getAvailableTokens();
      setTokens(novosTokens);
      
      setQuantityModalOpen(false);
      setSelectedProduct(null);
      setActiveTab('pedidos');
      
      toast({
        title: "Compra realizada!",
        description: `${quantity}x ${product.name} adicionado(s) à sua carteira.`,
      });
    } catch (error) {
      toast({
        title: "Erro na compra",
        description: "Não foi possível processar. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTokenClick = (token: Token) => {
    setSelectedToken(token);
    setQrModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="🎟️ Fichas Digitais"
        rightContent={
          <Link to="/bar">
            <Button variant="ghost" size="sm" className="text-header-foreground hover:bg-header-foreground/10">
              <ScanLine className="h-4 w-4 mr-2" />
              Bar
            </Button>
          </Link>
        }
      />

      <main className="container mx-auto pb-8 px-4">
        {loading && products.length === 0 ? (
          <div className="flex justify-center mt-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 mt-4 h-14 bg-secondary">
              <TabsTrigger value="loja" className="flex items-center gap-2 text-base h-12 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <ShoppingBag className="h-5 w-5" />
                Loja
              </TabsTrigger>
              <TabsTrigger value="pedidos" className="flex items-center gap-2 text-base h-12 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative">
                <Ticket className="h-5 w-5" />
                Carteira
                {tokens.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {tokens.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="loja" className="mt-6 animate-slide-up">
              <div className="grid grid-cols-2 gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => handleProductClick(product)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pedidos" className="mt-6 animate-slide-up">
              {tokens.length === 0 ? (
                <div className="text-center py-12">
                  <Ticket className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Sua carteira está vazia.</p>
                  <Button variant="link" onClick={() => setActiveTab('loja')}>
                    Ir para a Loja
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {tokens.map((token) => (
                    <TokenItem
                      key={token.id}
                      token={token}
                      onClick={() => handleTokenClick(token)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      <QuantityModal
        product={selectedProduct}
        open={quantityModalOpen}
        onClose={() => {
          setQuantityModalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleConfirmPurchase}
      />

      <QRModal
        token={selectedToken}
        open={qrModalOpen}
        onClose={() => {
          setQrModalOpen(false);
          setSelectedToken(null);
        }}
      />
    </div>
  );
}