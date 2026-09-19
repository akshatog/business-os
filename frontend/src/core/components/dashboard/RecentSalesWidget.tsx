import { useCallback, useEffect, useState } from "react";
import { getRecentSales, type DashboardRecentSale } from "@/services/dashboard";
import { formatPaiseToRupees } from "@/lib/money";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";

export function RecentSalesWidget() {
  const [recentSales, setRecentSales] = useState<DashboardRecentSale[] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    getRecentSales()
      .then((data) => {
        if (isMounted) {
          setRecentSales(data.recentSales ?? null);
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
    getRecentSales()
      .then((data) => {
        setRecentSales(data.recentSales ?? null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status: DashboardRecentSale["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-600 hover:bg-green-700">
            Completed
          </Badge>
        );
      case "voided":
        return <Badge variant="secondary">Voided</Badge>;
      case "refunded":
      case "partially_refunded":
        return <Badge variant="destructive">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div
          className="flex flex-col gap-3 mt-1"
          role="status"
          aria-label="Loading Recent Sales"
        >
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex flex-col gap-1 w-1/3">
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
              </div>
              <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
              <div className="h-6 bg-muted animate-pulse rounded w-1/6" />
            </div>
          ))}
          <span className="sr-only">Loading</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col justify-center mt-1 min-h-[200px]">
          <div className="flex flex-col items-center justify-center space-y-3">
            <p className="text-sm text-destructive font-medium">
              Unable to load recent sales
            </p>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        </div>
      );
    }

    if (!recentSales || recentSales.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center mt-1 min-h-[200px] text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            No recent sales found.
          </p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[100px] text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentSales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell className="font-medium text-xs">
                {sale.invoiceNumber}
              </TableCell>
              <TableCell className="text-xs">{sale.customerName}</TableCell>
              <TableCell className="text-right text-xs">
                {formatPaiseToRupees(sale.totalAmountMinor)}
              </TableCell>
              <TableCell className="text-right">
                {getStatusBadge(sale.status)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card className="md:col-span-2 lg:col-span-2 hover:shadow-md transition-all duration-200 hover:border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">
            Recent Sales
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest transactions across the business.
          </p>
        </div>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
