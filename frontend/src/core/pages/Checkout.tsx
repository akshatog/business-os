import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/core/components/ui/card';
import { Input } from '@/core/components/ui/input';
import { Button } from '@/core/components/ui/button';
import { Search, ShoppingCart, UserPlus, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import type { SaleItem } from '@/types/sale';
import type { Product } from '@/types/product';
import { formatPaiseToRupees } from '@/lib/money';
import { searchProducts } from '@/services/products';

export function Checkout() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchTrigger, setSearchTrigger] = useState(0);

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Perform search when debounced query changes
  useEffect(() => {
    async function performSearch() {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        setSearchError(null);
        return;
      }
      
      setIsSearching(true);
      setSearchError(null);
      
      try {
        const results = await searchProducts(debouncedQuery);
        setSearchResults(results);
      } catch (err) {
        setSearchError(err instanceof Error ? err.message : 'An error occurred during search');
      } finally {
        setIsSearching(false);
      }
    }
    
    performSearch();
  }, [debouncedQuery, searchTrigger]);
  
  // Step 18 scope: Structural foundation only. 
  // Step 19 scope: Search functionality.
  // Interactive cart state and payments are deferred.
  const cartItems: SaleItem[] = []; 
  
  const subtotalMinor = 0;
  const taxAmountMinor = 0;
  const totalAmountMinor = 0;

  return (
    <div className="flex h-full flex-col md:flex-row gap-6 p-6">
      {/* Left Column: Product Search & Results */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
        </div>
        
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Add Products</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, SKU, or barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {/* Initial/empty search state */}
            {!debouncedQuery.trim() && !isSearching && searchResults.length === 0 && !searchError && (
              <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                <Search className="mb-4 h-12 w-12 opacity-20" />
                <p>Search for a product to add to cart</p>
              </div>
            )}

            {/* Loading state */}
            {isSearching && (
              <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                <Loader2 className="mb-4 h-8 w-8 animate-spin opacity-50" />
                <p>Searching products...</p>
              </div>
            )}

            {/* Error state */}
            {!isSearching && searchError && (
              <div className="flex h-full flex-col items-center justify-center text-destructive">
                <AlertCircle className="mb-4 h-8 w-8 opacity-80" />
                <p className="mb-4">{searchError}</p>
                <Button variant="outline" onClick={() => setSearchTrigger(prev => prev + 1)}>
                  Retry Search
                </Button>
              </div>
            )}

            {/* No results state */}
            {!isSearching && debouncedQuery.trim() && searchResults.length === 0 && !searchError && (
              <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                <p>No products found for "{debouncedQuery}"</p>
              </div>
            )}

            {/* Matching results */}
            {!isSearching && searchResults.length > 0 && !searchError && (
              <div className="space-y-2">
                {searchResults.map((product) => (
                  <div 
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => {
                      // Clicking is structurally selectable but deferred cart logic
                      console.log('Selected product:', product);
                    }}
                  >
                    <div>
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        {product.sku && <span>SKU: {product.sku}</span>}
                        {product.sku && product.barcode && <span>•</span>}
                        {product.barcode && <span>Code: {product.barcode}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatPaiseToRupees(product.priceMinor)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Cart & Payment */}
      <div className="w-full md:w-96 flex flex-col gap-4">
        {/* Customer Selection Structure */}
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Customer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full justify-start text-muted-foreground">
              <UserPlus className="mr-2 h-4 w-4" />
              Select Customer (Optional)
            </Button>
          </CardContent>
        </Card>

        {/* Cart Structure */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="py-4 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShoppingCart className="h-5 w-5" />
              Current Sale
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto py-4">
            {cartItems.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground">
                <ShoppingCart className="mb-2 h-8 w-8 opacity-20" />
                <p>Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Future: Render SaleItem rows here */}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-4 border-t pt-4">
            <div className="w-full space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPaiseToRupees(subtotalMinor)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPaiseToRupees(taxAmountMinor)}</span>
              </div>
              <div className="flex justify-between font-medium text-lg pt-2 border-t mt-2">
                <span>Total</span>
                <span>{formatPaiseToRupees(totalAmountMinor)}</span>
              </div>
            </div>
            
            <Button size="lg" className="w-full" disabled={cartItems.length === 0}>
              <CreditCard className="mr-2 h-4 w-4" />
              Proceed to Payment
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
