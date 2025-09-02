import { Package, Users, AlertTriangle, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { StockChart } from '@/components/dashboard/StockChart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockDashboardMetrics } from '@/lib/mockData';
import heroImage from '@/assets/hero-dashboard.jpg';

export default function Dashboard() {
  const metrics = mockDashboardMetrics;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl glass-card border-glass-border">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative z-10 p-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold heading-gradient mb-4">
              Welcome to StockWise
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Monitor your inventory, track transactions, and manage suppliers all in one place.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="gradient-primary hover-glow">
                <Package className="mr-2 w-5 h-5" />
                View Products
              </Button>
              <Button variant="outline" size="lg">
                <TrendingUp className="mr-2 w-5 h-5" />
                View Reports
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Products"
          value={metrics.totalProducts}
          change={{ value: 12, label: 'from last month' }}
          icon={Package}
          variant="success"
        />
        <MetricsCard
          title="Low Stock Alerts"
          value={metrics.lowStockAlerts}
          change={{ value: -25, label: 'from last week' }}
          icon={AlertTriangle}
          variant={metrics.lowStockAlerts > 0 ? 'warning' : 'success'}
        />
        <MetricsCard
          title="Total Suppliers"
          value={metrics.totalSuppliers}
          change={{ value: 8, label: 'from last month' }}
          icon={Users}
          variant="default"
        />
        <MetricsCard
          title="Inventory Value"
          value={formatCurrency(metrics.inventoryValue)}
          change={{ value: 15.3, label: 'from last month' }}
          icon={DollarSign}
          variant="success"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Chart */}
        <div className="lg:col-span-2">
          <StockChart data={metrics.stockByCategory} type="bar" />
        </div>

        {/* Recent Transactions */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
            <Button variant="ghost" size="sm">
              View All <ArrowUpRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {metrics.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 glass-surface rounded-lg hover-lift">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground">
                      {transaction.productName}
                    </p>
                    <Badge 
                      variant={transaction.type === 'in' ? 'default' : 'secondary'}
                      className={transaction.type === 'in' ? 'status-success' : 'status-warning'}
                    >
                      {transaction.type === 'in' ? 'Stock In' : 'Stock Out'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {formatCurrency(transaction.totalValue)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {transaction.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockChart data={metrics.stockByCategory} type="pie" />
        
        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Package className="w-6 h-6 mb-2" />
              <span>Add Product</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="w-6 h-6 mb-2" />
              <span>Add Supplier</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="w-6 h-6 mb-2" />
              <span>Stock In</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <ArrowUpRight className="w-6 h-6 mb-2" />
              <span>Stock Out</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}