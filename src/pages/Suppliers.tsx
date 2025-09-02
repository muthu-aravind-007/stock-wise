import { useState } from 'react';
import { Plus, Search, Mail, Phone, MapPin, Edit, Trash2, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockSuppliers, mockProducts } from '@/lib/mockData';
import { Supplier } from '@/types/inventory';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSuppliedProductsCount = (supplierId: string) => {
    return mockProducts.filter(product => product.supplierId === supplierId).length;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold heading-gradient">Suppliers</h1>
          <p className="text-muted-foreground">Manage your supplier relationships</p>
        </div>
        <Button size="lg" className="gradient-secondary hover-glow">
          <Plus className="mr-2 w-5 h-5" />
          Add Supplier
        </Button>
      </div>

      {/* Search */}
      <div className="glass-card p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search suppliers..."
            className="pl-10 glass-surface border-glass-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="glass-card p-6 hover-lift animate-scale-in">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 gradient-secondary rounded-xl flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{supplier.name}</h3>
                  <p className="text-sm text-muted-foreground">{supplier.contactPerson}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="hover:bg-destructive/10 text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{supplier.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{supplier.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>{supplier.address}</span>
              </div>
            </div>

            <div className="border-t border-glass-border pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Products Supplied</span>
                <Badge className="gradient-primary text-white">
                  {getSuppliedProductsCount(supplier.id)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Partner Since</span>
                <span className="text-sm font-medium text-foreground">
                  {formatDate(supplier.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                View Products
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 text-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Suppliers</h3>
          <p className="text-3xl font-bold text-primary">{filteredSuppliers.length}</p>
        </div>
        <div className="glass-card p-6 text-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Active This Month</h3>
          <p className="text-3xl font-bold text-success">{Math.floor(filteredSuppliers.length * 0.8)}</p>
        </div>
        <div className="glass-card p-6 text-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">New This Quarter</h3>
          <p className="text-3xl font-bold text-accent">{Math.floor(filteredSuppliers.length * 0.2)}</p>
        </div>
        <div className="glass-card p-6 text-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Avg Products/Supplier</h3>
          <p className="text-3xl font-bold text-secondary">
            {Math.round(mockProducts.length / filteredSuppliers.length)}
          </p>
        </div>
      </div>
    </div>
  );
}