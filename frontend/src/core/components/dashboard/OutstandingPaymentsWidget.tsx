import { useCallback, useEffect, useState } from "react";
import { getOutstandingPayments } from "@/services/dashboard";
import { formatPaiseToRupees } from "@/lib/money";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";

export function OutstandingPaymentsWidget() {
  const [outstandingPaise, setOutstandingPaise] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    getOutstandingPayments()
      .then((data) => {
        if (isMounted) {
          setOutstandingPaise(data.outstandingPaise ?? null);
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
    getOutstandingPayments()
      .then((data) => {
        setOutstandingPaise(data.outstandingPaise ?? null);
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
          aria-label="Loading Outstanding Payments"
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

    if (outstandingPaise === null) {
      return (
        <div className="flex flex-col justify-center mt-1 min-h-[44px]">
          <p className="text-sm text-muted-foreground">No data available</p>
        </div>
      );
    }

    return (
      <div className="mt-1">
        <div className="text-2xl font-bold">
          {formatPaiseToRupees(outstandingPaise)}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          amount outstanding
        </p>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Outstanding Payments
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
          <rect width="20" height="12" x="2" y="6" rx="2" />
          <circle cx="12" cy="12" r="2" />
          <path d="M6 12h.01M18 12h.01" />
        </svg>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
