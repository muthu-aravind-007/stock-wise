import { useState } from 'react';
import { Plus, Search, ArrowUp, ArrowDown, Calendar, Filter } from 'lucide-react';
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
import { mockTransactions } from '@/lib/mockData';
import { Transaction } from '@/types/inventory';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const totalStockIn = filteredTransactions
    .filter(t => t.type === 'in')
    .reduce((sum, t) => sum + t.totalValue, 0);

  const totalStockOut = filteredTransactions
    .filter(t => t.type === 'out')
    .reduce((sum, t) => sum + t.totalValue, 0);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold heading-gradient">Transactions</h1>
          <p className="text-muted-foreground">Track all stock movements</p>
        </div>
        <div className="flex gap-2">
          <Button size="lg" variant="secondary" className="gradient-accent hover-glow">
            <ArrowUp className="mr-2 w-5 h-5" />
            Stock In
          </Button>
          <Button size="lg" className="gradient-primary hover-glow">
            <ArrowDown className="mr-2 w-5 h-5" />
            Stock Out
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
              <ArrowUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stock In Value</p>
              <p className="text-2xl font-bold text-success">{formatCurrency(totalStockIn)}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-secondary rounded-xl flex items-center justify-center">
              <ArrowDown className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stock Out Value</p>
              <p className="text-2xl font-bold text-warning">{formatCurrency(totalStockOut)}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-bold text-accent">{filteredTransactions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-10 glass-surface border-glass-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48 glass-surface border-glass-border">
              <Filter className="mr-2 w-4 h-4" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="glass-card border-glass-border">
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="in">Stock In</SelectItem>
              <SelectItem value="out">Stock Out</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card">
        <Table>
          <TableHeader>
            <TableRow className="border-glass-border">
              <TableHead className="text-foreground font-semibold">Date</TableHead>
              <TableHead className="text-foreground font-semibold">Product</TableHead>
              <TableHead className="text-foreground font-semibold">Type</TableHead>
              <TableHead className="text-foreground font-semibold">Quantity</TableHead>
              <TableHead className="text-foreground font-semibold">Unit Price</TableHead>
              <TableHead className="text-foreground font-semibold">Total Value</TableHead>
              <TableHead className="text-foreground font-semibold">Supplier</TableHead>
              <TableHead className="text-foreground font-semibold">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id} className="border-glass-border hover:bg-surface/30">
                <TableCell className="text-foreground">
                  {formatDate(transaction.createdAt)}
                </TableCell>
                <TableCell>
                  <p className="font-medium text-foreground">{transaction.productName}</p>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={`flex items-center gap-1 w-fit ${
                      transaction.type === 'in' 
                        ? 'status-success' 
                        : 'status-warning'
                    }`}
                  >
                    {transaction.type === 'in' ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                    {transaction.type === 'in' ? 'Stock In' : 'Stock Out'}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {transaction.quantity}
                </TableCell>
                <TableCell className="text-foreground">
                  {formatCurrency(transaction.unitPrice)}
                </TableCell>
                <TableCell className="font-semibold text-success">
                  {formatCurrency(transaction.totalValue)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {transaction.supplierName || '-'}
                </TableCell>
                <TableCell className="text-muted-foreground max-w-48 truncate">
                  {transaction.notes || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {filteredTransactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 glass-surface rounded-lg hover-lift">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  transaction.type === 'in' ? 'gradient-primary' : 'gradient-secondary'
                }`}>
                  {transaction.type === 'in' ? (
                    <ArrowUp className="w-4 h-4 text-white" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {transaction.type === 'in' ? 'Added' : 'Removed'} {transaction.quantity} {transaction.productName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>
              </div>
              <p className="font-semibold text-foreground">
                {formatCurrency(transaction.totalValue)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}