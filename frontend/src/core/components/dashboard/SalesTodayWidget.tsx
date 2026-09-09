import { useCallback, useEffect, useState } from "react";
import { getSalesToday } from "@/services/dashboard";
import { formatPaiseToRupees } from "@/lib/money";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";

export function SalesTodayWidget() {
  const [salesPaise, setSalesPaise] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    getSalesToday()
      .then((data) => {
        if (isMounted) {
          setSalesPaise(data.totalSalesPaise ?? null);
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
    getSalesToday()
      .then((data) => {
        setSalesPaise(data.totalSalesPaise ?? null);
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
          className="h-8 w-1/2 bg-muted animate-pulse rounded mt-1" 
          role="status" 
          aria-label="Loading Sales Today"
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

    if (salesPaise === null) {
      return (
        <div className="flex items-center mt-1 h-8">
          <p className="text-sm text-muted-foreground">No sales data available</p>
        </div>
      );
    }

    return (
      <div className="text-2xl font-bold mt-1 h-8 flex items-center">
        {formatPaiseToRupees(salesPaise)}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Sales Today
        </CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
