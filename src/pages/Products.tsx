import { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockProducts } from '@/lib/mockData';
import { Product } from '@/types/inventory';

export default function Products() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = [...new Set(products.map(p => p.category))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const isLowStock = (product: Product) => {
    return product.quantity <= product.lowStockThreshold;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold heading-gradient">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button size="lg" className="gradient-primary hover-glow">
          <Plus className="mr-2 w-5 h-5" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products or SKU..."
              className="pl-10 glass-surface border-glass-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48 glass-surface border-glass-border">
              <Filter className="mr-2 w-4 h-4" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className="glass-card border-glass-border">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-card">
        <Table>
          <TableHeader>
            <TableRow className="border-glass-border">
              <TableHead className="text-foreground font-semibold">Product</TableHead>
              <TableHead className="text-foreground font-semibold">SKU</TableHead>
              <TableHead className="text-foreground font-semibold">Category</TableHead>
              <TableHead className="text-foreground font-semibold">Stock</TableHead>
              <TableHead className="text-foreground font-semibold">Price</TableHead>
              <TableHead className="text-foreground font-semibold">Total Value</TableHead>
              <TableHead className="text-foreground font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className="border-glass-border hover:bg-surface/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      {isLowStock(product) && (
                        <div className="flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3 h-3 text-warning" />
                          <span className="text-xs text-warning">Low Stock</span>
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {product.sku}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className="glass-surface text-foreground">
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${
                      isLowStock(product) ? 'text-warning' : 'text-foreground'
                    }`}>
                      {product.quantity}
                    </span>
                    {isLowStock(product) && (
                      <Badge variant="outline" className="status-warning text-xs">
                        Low
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {formatCurrency(product.unitPrice)}
                </TableCell>
                <TableCell className="font-semibold text-success">
                  {formatCurrency(product.quantity * product.unitPrice)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-destructive/10 text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-primary">{filteredProducts.length}</p>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">Low Stock Items</h3>
          <p className="text-3xl font-bold text-warning">
            {filteredProducts.filter(isLowStock).length}
          </p>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">Total Value</h3>
          <p className="text-3xl font-bold text-success">
            {formatCurrency(
              filteredProducts.reduce((sum, product) => 
                sum + (product.quantity * product.unitPrice), 0
              )
            )}
          </p>
        </div>
      </div>
    </div>
  );
}