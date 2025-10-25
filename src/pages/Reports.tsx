import { useEffect, useState } from "react";
import { Download, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Product {
  id: string;
  name: string;
  category: string | null;
  price: number;
  stock: number;
  low_stock_threshold?: number;
}

interface Transaction {
  id: string;
  type: "IN" | "OUT";
  quantity: number;
  unit_price: number;
}

interface Supplier {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
}

export default function Reports() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch live data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [{ data: productsData }, { data: transactionsData }, { data: suppliersData }] =
        await Promise.all([
          supabase.from("products").select("*"),
          supabase.from("transactions").select("*"),
          supabase.from("suppliers").select("*"),
        ]);

      setProducts(productsData || []);
      setTransactions(transactionsData || []);
      setSuppliers(suppliersData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Derived metrics
  const lowStockProducts = products.filter((p) => p.stock <= (p.low_stock_threshold || 5));
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.stock * (p.price || 0)), 0);
  const recentTransactionValue = transactions.reduce((sum, t) => sum + t.quantity * t.unit_price, 0);

  // Stock value by category for Radar chart
  const stockByCategory = Object.values(
    products.reduce((acc: any, p) => {
      const cat = p.category || "Uncategorized";
      if (!acc[cat]) acc[cat] = { name: cat, value: 0 };
      acc[cat].value += p.stock * (p.price || 0);
      return acc;
    }, {})
  );

  // Currency formatter
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);

  // PDF export function
  const exportPDF = (data: any[], title: string) => {
    const doc = new jsPDF();
    doc.text(title, 14, 15);

    if (!data || data.length === 0) {
      doc.text("No data available.", 14, 25);
    } else {
      const columns = Object.keys(data[0]);
      const rows = data.map((obj) => columns.map((key) => String(obj[key] ?? "")));

      autoTable(doc, { startY: 25, head: [columns], body: rows });
    }

    doc.save(`${title}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold heading-gradient">Reports</h1>
          <p className="text-muted-foreground">Analytics and insights from live inventory data</p>
        </div>
        <Button
          size="lg"
          className="gradient-primary hover-glow"
          onClick={() =>
            exportPDF([...products, ...transactions, ...suppliers], "All Reports")
          }
        >
          <Download className="mr-2 w-5 h-5" />
          Export All Reports
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Inventory */}
        <Card className="glass-card border-glass-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Total Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(totalInventoryValue)}
                </p>
                <p className="text-xs text-success">Updated live</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock */}
        <Card className="glass-card border-glass-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{lowStockProducts.length}</p>
                <p className="text-xs text-warning">Needs restock</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="glass-card border-glass-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Transaction Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(recentTransactionValue)}
                </p>
                <p className="text-xs text-accent">All-time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Products */}
        <Card className="glass-card border-glass-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Active Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-secondary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{products.length}</p>
                <p className="text-xs text-secondary">In stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Radar Chart */}
      <div className="glass-card p-4">
        <h3 className="text-lg font-semibold mb-2">Stock Value by Category</h3>
        {stockByCategory.length === 0 ? (
          <p className="text-center text-muted-foreground">No category data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={stockByCategory}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar
                name="Stock Value"
                dataKey="value"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Report Download Section */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Generate Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Inventory Summary", data: products, color: "text-primary" },
            { title: "Transaction Report", data: transactions, color: "text-secondary" },
            { title: "Supplier Analysis", data: suppliers, color: "text-accent" },
          ].map((r) => (
            <div key={r.title} className="glass-surface p-4 rounded-lg hover-lift">
              <div className="flex items-center gap-3 mb-3">
                <FileText className={`w-8 h-8 ${r.color}`} />
                <div>
                  <h4 className="font-semibold text-foreground">{r.title}</h4>
                  <p className="text-sm text-muted-foreground">Download {r.title.toLowerCase()}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => exportPDF(r.data, r.title)}
              >
                <Download className="w-4 h-4 mr-2" /> PDF
              </Button>
            </div>
          ))}
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
            {lowStockProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-2 bg-surface/50 rounded">
                <span className="font-medium text-foreground">{p.name}</span>
                <Badge variant="outline" className="status-warning">
                  {p.stock} left
                </Badge>
              </div>
            ))}
          </div>
          <Button
            variant="warning"
            className="bg-warning text-warning-foreground hover:bg-warning/90"
            onClick={() => exportPDF(lowStockProducts, "Low Stock Report")}
          >
            <Download className="w-4 h-4 mr-2" /> Export Low Stock Report
          </Button>
        </div>
      )}
    </div>
  );
}
