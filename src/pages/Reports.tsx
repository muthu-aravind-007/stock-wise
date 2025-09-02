import { useState } from 'react';
import { Download, FileText, PieChart, BarChart3, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StockChart } from '@/components/dashboard/StockChart';
import { mockDashboardMetrics, mockProducts, mockTransactions } from '@/lib/mockData';

export default function Reports() {
  const metrics = mockDashboardMetrics;
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const generateReport = (type: string) => {
    // In a real app, this would generate and download actual reports
    console.log(`Generating ${type} report...`);
  };

  const lowStockProducts = mockProducts.filter(p => p.quantity <= p.lowStockThreshold);
  const totalInventoryValue = mockProducts.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);
  const recentTransactionValue = mockTransactions.reduce((sum, t) => sum + t.totalValue, 0);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold heading-gradient">Reports</h1>
          <p className="text-muted-foreground">Analytics and insights for your inventory</p>
        </div>
        <Button size="lg" className="gradient-primary hover-glow">
          <Download className="mr-2 w-5 h-5" />
          Export All Reports
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card border-glass-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalInventoryValue)}</p>
                <p className="text-xs text-success">+12% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-glass-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{lowStockProducts.length}</p>
                <p className="text-xs text-warning">Requires attention</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-glass-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transaction Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(recentTransactionValue)}</p>
                <p className="text-xs text-accent">Last 30 days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-glass-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-secondary rounded-lg flex items-center justify-center">
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockProducts.length}</p>
                <p className="text-xs text-secondary">In inventory</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockChart data={metrics.stockByCategory} type="bar" />
        <StockChart data={metrics.stockByCategory} type="pie" />
      </div>

      {/* Report Generation */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Generate Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="glass-surface p-4 rounded-lg hover-lift">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <h4 className="font-semibold text-foreground">Inventory Summary</h4>
                <p className="text-sm text-muted-foreground">Complete inventory overview</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => generateReport('inventory-pdf')}
              >
                PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => generateReport('inventory-csv')}
              >
                CSV
              </Button>
            </div>
          </div>

          <div className="glass-surface p-4 rounded-lg hover-lift">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="w-8 h-8 text-secondary" />
              <div>
                <h4 className="font-semibold text-foreground">Transaction Report</h4>
                <p className="text-sm text-muted-foreground">Stock movement history</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => generateReport('transactions-pdf')}
              >
                PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => generateReport('transactions-csv')}
              >
                CSV
              </Button>
            </div>
          </div>

          <div className="glass-surface p-4 rounded-lg hover-lift">
            <div className="flex items-center gap-3 mb-3">
              <PieChart className="w-8 h-8 text-accent" />
              <div>
                <h4 className="font-semibold text-foreground">Supplier Analysis</h4>
                <p className="text-sm text-muted-foreground">Supplier performance data</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => generateReport('suppliers-pdf')}
              >
                PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => generateReport('suppliers-csv')}
              >
                CSV
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="glass-card p-6 border-warning/20 bg-warning/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Low Stock Alert</h3>
              <p className="text-sm text-muted-foreground">
                {lowStockProducts.length} products need restocking
              </p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-2 bg-surface/50 rounded">
                <span className="font-medium text-foreground">{product.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="status-warning">
                    {product.quantity} left
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Threshold: {product.lowStockThreshold}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Button 
            variant="warning" 
            onClick={() => generateReport('low-stock')}
            className="bg-warning text-warning-foreground hover:bg-warning/90"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Low Stock Report
          </Button>
        </div>
      )}
    </div>
  );
}