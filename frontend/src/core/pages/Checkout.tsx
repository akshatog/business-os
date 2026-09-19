import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/core/components/ui/card";
import { Input } from "@/core/components/ui/input";
import { Button } from "@/core/components/ui/button";
import {
  Search,
  ShoppingCart,
  CreditCard,
  Loader2,
  AlertCircle,
  Minus,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import type { Product } from "@/types/product";
import type { Customer } from "@/types/customer";

interface CartItem {
  product: Product;
  quantity: number;
}
import { formatPaiseToRupees } from "@/lib/money";
import { searchProducts } from "@/services/products";
import { searchCustomers } from "@/services/customers";

export function Checkout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

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
        setSearchError(
          err instanceof Error
            ? err.message
            : "An error occurred during search",
        );
      } finally {
        setIsSearching(false);
      }
    }

    performSearch();
  }, [debouncedQuery, searchTrigger]);

  const [customerSearch, setCustomerSearch] = useState("");
  const [debouncedCustomerSearch, setDebouncedCustomerSearch] = useState("");
  const [customerResults, setCustomerResults] = useState<Customer[]>([]);
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [customerError, setCustomerError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCustomerSearch(customerSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [customerSearch]);

  useEffect(() => {
    async function performCustomerSearch() {
      if (!debouncedCustomerSearch.trim()) {
        setCustomerResults([]);
        setCustomerError(null);
        return;
      }

      setIsSearchingCustomer(true);
      setCustomerError(null);

      try {
        const results = await searchCustomers(debouncedCustomerSearch);
        setCustomerResults(results);
      } catch (err) {
        setCustomerError(
          err instanceof Error ? err.message : "Error searching customers",
        );
      } finally {
        setIsSearchingCustomer(false);
      }
    }

    performCustomerSearch();
  }, [debouncedCustomerSearch]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | "card">(
    "cash",
  );
  const [amountPaidInput, setAmountPaidInput] = useState<string>("");

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      }),
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => {
      const newItems = prev.filter((item) => item.product.id !== productId);
      if (newItems.length === 0) {
        setAmountPaidInput("");
        setPaymentMethod("cash");
      }
      return newItems;
    });
  };

  const subtotalMinor = cartItems.reduce(
    (sum, item) => sum + item.product.priceMinor * item.quantity,
    0,
  );
  const taxAmountMinor = 0;
  const totalAmountMinor = subtotalMinor + taxAmountMinor;

  const amountPaidMinor = amountPaidInput
    ? Math.round(parseFloat(amountPaidInput) * 100) || 0
    : 0;
  const remainingMinor = Math.max(0, totalAmountMinor - amountPaidMinor);
  const changeMinor = Math.max(0, amountPaidMinor - totalAmountMinor);

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
            {!debouncedQuery.trim() &&
              !isSearching &&
              searchResults.length === 0 &&
              !searchError && (
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
                <Button
                  variant="outline"
                  onClick={() => setSearchTrigger((prev) => prev + 1)}
                >
                  Retry Search
                </Button>
              </div>
            )}

            {/* No results state */}
            {!isSearching &&
              debouncedQuery.trim() &&
              searchResults.length === 0 &&
              !searchError && (
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
                    onClick={() => addToCart(product)}
                  >
                    <div>
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        {product.sku && <span>SKU: {product.sku}</span>}
                        {product.sku && product.barcode && <span>•</span>}
                        {product.barcode && (
                          <span>Code: {product.barcode}</span>
                        )}
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
            {selectedCustomer ? (
              <div className="flex items-center justify-between rounded-md border p-3 bg-muted/30">
                <div>
                  <p className="font-medium text-sm">{selectedCustomer.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedCustomer.phone ||
                      selectedCustomer.email ||
                      "No contact info"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedCustomer(null)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customer (name, phone)..."
                  className="pl-9"
                  value={customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setShowCustomerDropdown(true);
                  }}
                  onFocus={() => setShowCustomerDropdown(true)}
                  onBlur={() =>
                    setTimeout(() => setShowCustomerDropdown(false), 200)
                  }
                />

                {showCustomerDropdown && customerSearch.trim() && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover text-popover-foreground border rounded-md shadow-md z-50 max-h-48 overflow-y-auto">
                    {isSearchingCustomer && (
                      <div className="p-3 text-center text-sm text-muted-foreground">
                        Searching...
                      </div>
                    )}
                    {!isSearchingCustomer && customerError && (
                      <div className="p-3 text-center text-sm text-destructive">
                        {customerError}
                      </div>
                    )}
                    {!isSearchingCustomer &&
                      !customerError &&
                      customerResults.length === 0 && (
                        <div className="p-3 text-center text-sm text-muted-foreground">
                          No customers found.
                        </div>
                      )}
                    {!isSearchingCustomer &&
                      !customerError &&
                      customerResults.length > 0 && (
                        <div className="py-1">
                          {customerResults.map((customer) => (
                            <div
                              key={customer.id}
                              className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setCustomerSearch("");
                                setShowCustomerDropdown(false);
                              }}
                            >
                              <p className="font-medium">{customer.name}</p>
                              {(customer.phone || customer.email) && (
                                <p className="text-xs text-muted-foreground">
                                  {customer.phone}{" "}
                                  {customer.phone && customer.email ? "•" : ""}{" "}
                                  {customer.email}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                )}
              </div>
            )}
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
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex flex-col gap-2 rounded-lg border p-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">
                          {item.product.name}
                        </h4>
                        <div className="text-muted-foreground text-xs">
                          {formatPaiseToRupees(item.product.priceMinor)} x{" "}
                          {item.quantity}
                        </div>
                      </div>
                      <div className="font-semibold text-sm">
                        {formatPaiseToRupees(
                          item.product.priceMinor * item.quantity,
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-none"
                          onClick={() => updateQuantity(item.product.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <div className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-none"
                          onClick={() => updateQuantity(item.product.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
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

            {cartItems.length > 0 && (
              <div className="w-full space-y-4 pt-2 border-t">
                <h3 className="font-medium">Payment Details</h3>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={paymentMethod === "cash" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("cash")}
                    size="sm"
                  >
                    Cash
                  </Button>
                  <Button
                    variant={paymentMethod === "upi" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("upi")}
                    size="sm"
                  >
                    UPI
                  </Button>
                  <Button
                    variant={paymentMethod === "card" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("card")}
                    size="sm"
                  >
                    Card
                  </Button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-muted-foreground">
                    Amount Received (₹)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={amountPaidInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (Number(val) < 0) return;
                      setAmountPaidInput(val);
                    }}
                    placeholder={(totalAmountMinor / 100).toString()}
                  />
                </div>

                {amountPaidInput && (
                  <div className="space-y-1.5 text-sm pt-2 bg-muted/30 p-3 rounded-md">
                    {amountPaidMinor < totalAmountMinor ? (
                      <div className="flex justify-between text-destructive font-medium">
                        <span>Remaining Balance</span>
                        <span>{formatPaiseToRupees(remainingMinor)}</span>
                      </div>
                    ) : amountPaidMinor > totalAmountMinor ? (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Change Due</span>
                        <span>{formatPaiseToRupees(changeMinor)}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-primary font-medium">
                        <span>Status</span>
                        <span>Fully Paid</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <Button
              size="lg"
              className="w-full mt-2"
              disabled={cartItems.length === 0}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Complete Sale
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
