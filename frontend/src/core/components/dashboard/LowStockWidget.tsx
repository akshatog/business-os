import { useCallback, useEffect, useState } from "react";
import { getLowStockCount } from "@/services/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function LowStockWidget() {
  const [lowStockCount, setLowStockCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    getLowStockCount()
      .then((data) => {
        if (isMounted) {
          setLowStockCount(data.lowStockCount ?? null);
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
    getLowStockCount()
      .then((data) => {
        setLowStockCount(data.lowStockCount ?? null);
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
          className="flex flex-col gap-1 mt-1" 
          role="status" 
          aria-label="Loading Low Stock"
        >
          <div className="h-8 w-1/3 bg-muted animate-pulse rounded" />
          <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
          <span className="sr-only">Loading</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col justify-center mt-1 min-h-[44px]">
          <div className="flex items-center justify-between">
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
        </div>
      );
    }

    if (lowStockCount === null) {
      return (
        <div className="flex flex-col justify-center mt-1 min-h-[44px]">
          <p className="text-sm text-muted-foreground">No data available</p>
        </div>
      );
    }

    return (
      <div className="mt-1">
        <div className="text-2xl font-bold">
          {lowStockCount.toLocaleString('en-IN')}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          products need attention
        </p>
      </div>
    );
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 hover:border-destructive/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Low Stock
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </div>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
