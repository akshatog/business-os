import { useCallback, useEffect, useState } from "react";
import { getTotalCustomers } from "@/services/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";

export function TotalCustomersWidget() {
  const [totalCustomers, setTotalCustomers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    getTotalCustomers()
      .then((data) => {
        if (isMounted) {
          setTotalCustomers(data.totalCustomers ?? null);
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
    getTotalCustomers()
      .then((data) => {
        setTotalCustomers(data.totalCustomers ?? null);
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
          aria-label="Loading Total Customers"
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

    if (totalCustomers === null) {
      return (
        <div className="flex items-center mt-1 h-8">
          <p className="text-sm text-muted-foreground">No data available</p>
        </div>
      );
    }

    return (
      <div className="text-2xl font-bold mt-1 h-8 flex items-center">
        {totalCustomers.toLocaleString('en-IN')}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Total Customers
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
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
