import { useCallback, useEffect, useState } from "react";
import { getTotalProducts } from "@/services/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Package } from "lucide-react";

export function TotalProductsWidget() {
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    getTotalProducts()
      .then((data) => {
        if (isMounted) {
          setTotalProducts(data.totalProducts ?? null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    getTotalProducts()
      .then((data) => {
        setTotalProducts(data.totalProducts ?? null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div 
          className="h-8 w-1/3 bg-muted animate-pulse rounded mt-1" 
          role="status" 
          aria-label="Loading Products"
        >
          <span className="sr-only">Loading</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-between mt-1 h-8">
          <p className="text-sm text-destructive font-medium">Unable to load data</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetry}
            className="h-7 text-xs px-2"
          >
            Retry
          </Button>
        </div>
      );
    }

    if (totalProducts === null) {
      return (
        <div className="flex items-center mt-1 h-8">
          <p className="text-sm text-muted-foreground">No data available</p>
        </div>
      );
    }

    return (
      <div className="text-2xl font-bold mt-1 h-8 flex items-center">
        {totalProducts.toLocaleString('en-IN')}
      </div>
    );
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 hover:border-orange-500/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Products
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center">
          <Package className="h-4 w-4 text-orange-500" />
        </div>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
