import { useEffect, useState } from "react";
import { Package, Users, AlertTriangle, DollarSign, ArrowUpRight } from "lucide-react";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { StockChart } from "@/components/dashboard/StockChart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";

interface Transaction {
  id: string;
  product_name: string;
  type: "in" | "out";
  quantity: number;
  total_value: number;
  created_at: string;
  category: string;
}

interface Metrics {
  totalProducts: number;
  lowStockAlerts: number;
  totalSuppliers: number;
  inventoryValue: number;
  totalProductsChange?: number;
  lowStockChange?: number;
  totalSuppliersChange?: number;
  inventoryValueChange?: number;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalProducts: 0,
    lowStockAlerts: 0,
    totalSuppliers: 0,
    inventoryValue: 0,
  });

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [stockByCategory, setStockByCategory] = useState<{ name: string; value: number }[]>([]);

  // Helpers
  const formatNumber = (value: number) => new Intl.NumberFormat("en-IN").format(value);
  const formatCurrency = (value: number) => `₹${formatNumber(value)}`;
  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-GB", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // --- CURRENT METRICS ---
        const { count: totalProducts } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });

        const { count: lowStockAlerts } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .lt("stock", 5);

        const { count: totalSuppliers } = await supabase
          .from("suppliers")
          .select("*", { count: "exact", head: true });

        const { data: products } = await supabase
          .from("products")
          .select("stock, price, category, name");

        let inventoryValue = 0;
        const categoryTotals: Record<string, number> = {};

        products?.forEach((p: any) => {
          const totalValue = (p.stock || 0) * (p.price || 0);
          inventoryValue += totalValue;
          if (p.category) categoryTotals[p.category] = (categoryTotals[p.category] || 0) + totalValue;
        });

        const stockByCategoryData = Object.entries(categoryTotals).map(([name, value]) => ({
          name,
          value,
        }));

        // --- PREVIOUS PERIOD METRICS ---
        const firstDayThisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { count: totalProductsLastMonth } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .lt("created_at", firstDayThisMonth);

        const { count: lowStockLastWeek } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .lt("stock", 5)
          .lt("created_at", sevenDaysAgo);

        const { count: totalSuppliersLastMonth } = await supabase
          .from("suppliers")
          .select("*", { count: "exact", head: true })
          .lt("created_at", firstDayThisMonth);

        const { data: lastMonthProducts } = await supabase
          .from("products")
          .select("stock, price")
          .lt("created_at", firstDayThisMonth);

        const lastMonthInventoryValue = lastMonthProducts?.reduce(
          (sum: number, p: any) => sum + (p.stock || 0) * (p.price || 0),
          0
        ) || 0;

        // --- CALCULATE % CHANGES ---
        const calcChange = (current: number, previous: number) =>
          previous === 0 ? 0 : ((current - previous) / previous) * 100;

        const totalProductsChange = calcChange(totalProducts || 0, totalProductsLastMonth || 0);
        const lowStockChange = calcChange(lowStockAlerts || 0, lowStockLastWeek || 0);
        const totalSuppliersChange = calcChange(totalSuppliers || 0, totalSuppliersLastMonth || 0);
        const inventoryValueChange = calcChange(inventoryValue, lastMonthInventoryValue);

        // --- RECENT TRANSACTIONS ---
        const { data: transactions } = await supabase
          .from("transactions")
          .select(`
            id,
            type,
            quantity,
            unit_price,
            created_at,
            products(name, category)
          `)
          .order("created_at", { ascending: false })
          .limit(5);

        const formattedTransactions =
          transactions?.map((t: any) => ({
            id: t.id,
            type: t.type.toLowerCase() === "in" ? "in" : "out",
            quantity: t.quantity,
            total_value: t.quantity * t.unit_price,
            product_name: t.products?.name || "Unknown Product",
            category: t.products?.category || "Uncategorized",
            created_at: t.created_at,
          })) || [];

        // --- UPDATE STATE ---
        setMetrics({
          totalProducts: totalProducts || 0,
          lowStockAlerts: lowStockAlerts || 0,
          totalSuppliers: totalSuppliers || 0,
          inventoryValue,
          totalProductsChange,
          lowStockChange,
          totalSuppliersChange,
          inventoryValueChange,
        });

        setRecentTransactions(formattedTransactions);
        setStockByCategory(stockByCategoryData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Products"
          value={formatNumber(metrics.totalProducts)}
          change={{ value: metrics.totalProductsChange || 0, label: "from last month" }}
          icon={Package}
          variant="success"
        />
        <MetricsCard
          title="Low Stock Alerts"
          value={formatNumber(metrics.lowStockAlerts)}
          change={{ value: metrics.lowStockChange || 0, label: "from last week" }}
          icon={AlertTriangle}
          variant={metrics.lowStockAlerts > 0 ? "warning" : "success"}
        />
        <MetricsCard
          title="Total Suppliers"
          value={formatNumber(metrics.totalSuppliers)}
          change={{ value: metrics.totalSuppliersChange || 0, label: "from last month" }}
          icon={Users}
          variant="default"
        />
        <MetricsCard
          title="Inventory Value"
          value={formatCurrency(metrics.inventoryValue)}
          change={{ value: metrics.inventoryValueChange || 0, label: "from last month" }}
          icon={DollarSign}
          variant={metrics.inventoryValueChange && metrics.inventoryValueChange >= 0 ? "success" : "destructive"}
        />
      </div>

      {/* Charts and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StockChart data={stockByCategory} type="bar" />
        </div>

        {/* Recent Transactions */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
            <Button variant="ghost" size="sm" asChild>
              <a href="/transactions">
                View All <ArrowUpRight className="ml-1 w-4 h-4" />
              </a>
            </Button>
          </div>
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 glass-surface rounded-lg hover-lift"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-foreground">{transaction.product_name}</p>
                      <Badge
                        variant={transaction.type === "in" ? "default" : "secondary"}
                        className={transaction.type === "in" ? "status-success" : "status-warning"}
                      >
                        {transaction.type === "in" ? "Stock In" : "Stock Out"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatDate(transaction.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{formatCurrency(transaction.total_value)}</p>
                    <p className="text-xs text-muted-foreground">Qty: {transaction.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No recent transactions</p>
          )}
        </div>
      </div>

      {/* Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockChart data={stockByCategory} type="pie" />
      </div>
    </div>
  );
}
