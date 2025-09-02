// StockWise Data Types
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unitPrice: number;
  lowStockThreshold: number;
  supplierId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  productsSupplied: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out';
  quantity: number;
  unitPrice: number;
  totalValue: number;
  supplierId?: string;
  supplierName?: string;
  notes?: string;
  createdAt: Date;
}

export interface DashboardMetrics {
  totalProducts: number;
  lowStockAlerts: number;
  totalSuppliers: number;
  inventoryValue: number;
  recentTransactions: Transaction[];
  stockByCategory: Array<{
    name: string;
    value: number;
    products: number;
  }>;
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type SupplierFormData = Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>;
export type TransactionFormData = Omit<Transaction, 'id' | 'createdAt' | 'productName' | 'supplierName' | 'totalValue'>;