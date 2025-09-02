// StockWise Mock Data for Development
import { Product, Supplier, Transaction, DashboardMetrics } from '@/types/inventory';

// Mock Products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 16"',
    sku: 'MBP-16-001',
    category: 'Electronics',
    quantity: 15,
    unitPrice: 2499.99,
    lowStockThreshold: 5,
    supplierId: '1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    sku: 'MSE-WL-002',
    category: 'Accessories',
    quantity: 3,
    unitPrice: 79.99,
    lowStockThreshold: 10,
    supplierId: '2',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: '3',
    name: 'USB-C Hub',
    sku: 'HUB-UC-003',
    category: 'Accessories',
    quantity: 25,
    unitPrice: 129.99,
    lowStockThreshold: 8,
    supplierId: '2',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: '4',
    name: 'External SSD 1TB',
    sku: 'SSD-1TB-004',
    category: 'Storage',
    quantity: 2,
    unitPrice: 199.99,
    lowStockThreshold: 5,
    supplierId: '1',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-28'),
  },
  {
    id: '5',
    name: 'Mechanical Keyboard',
    sku: 'KBD-MEC-005',
    category: 'Accessories',
    quantity: 18,
    unitPrice: 159.99,
    lowStockThreshold: 6,
    supplierId: '3',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-18'),
  },
];

// Mock Suppliers
export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'TechVendor Pro',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@techvendor.com',
    phone: '+1-555-0123',
    address: '123 Tech Street, Silicon Valley, CA 94025',
    productsSupplied: ['1', '4'],
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Gadget Supply Co.',
    contactPerson: 'Michael Chen',
    email: 'michael@gadgetsupply.com',
    phone: '+1-555-0456',
    address: '456 Innovation Blvd, Austin, TX 78701',
    productsSupplied: ['2', '3'],
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Premium Peripherals',
    contactPerson: 'Emily Rodriguez',
    email: 'emily@premiumperipherals.com',
    phone: '+1-555-0789',
    address: '789 Hardware Ave, Seattle, WA 98101',
    productsSupplied: ['5'],
    createdAt: new Date('2023-10-20'),
    updatedAt: new Date('2024-01-05'),
  },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    productId: '1',
    productName: 'MacBook Pro 16"',
    type: 'in',
    quantity: 10,
    unitPrice: 2499.99,
    totalValue: 24999.90,
    supplierId: '1',
    supplierName: 'TechVendor Pro',
    notes: 'Bulk order for Q1',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    productId: '2',
    productName: 'Wireless Mouse',
    type: 'out',
    quantity: 5,
    unitPrice: 79.99,
    totalValue: 399.95,
    notes: 'Customer order #1001',
    createdAt: new Date('2024-01-25'),
  },
  {
    id: '3',
    productId: '3',
    productName: 'USB-C Hub',
    type: 'in',
    quantity: 20,
    unitPrice: 129.99,
    totalValue: 2599.80,
    supplierId: '2',
    supplierName: 'Gadget Supply Co.',
    notes: 'Restocking popular item',
    createdAt: new Date('2024-01-22'),
  },
  {
    id: '4',
    productId: '4',
    productName: 'External SSD 1TB',
    type: 'out',
    quantity: 3,
    unitPrice: 199.99,
    totalValue: 599.97,
    notes: 'Enterprise client order',
    createdAt: new Date('2024-01-28'),
  },
  {
    id: '5',
    productId: '5',
    productName: 'Mechanical Keyboard',
    type: 'in',
    quantity: 15,
    unitPrice: 159.99,
    totalValue: 2399.85,
    supplierId: '3',
    supplierName: 'Premium Peripherals',
    notes: 'New model arrival',
    createdAt: new Date('2024-01-18'),
  },
];

// Calculate dashboard metrics
export const calculateDashboardMetrics = (
  products: Product[],
  suppliers: Supplier[],
  transactions: Transaction[]
): DashboardMetrics => {
  const totalProducts = products.length;
  const lowStockAlerts = products.filter(p => p.quantity <= p.lowStockThreshold).length;
  const totalSuppliers = suppliers.length;
  const inventoryValue = products.reduce((sum, product) => sum + (product.quantity * product.unitPrice), 0);
  
  // Group products by category for chart
  const stockByCategory = products.reduce((acc, product) => {
    const existing = acc.find(item => item.name === product.category);
    if (existing) {
      existing.value += product.quantity * product.unitPrice;
      existing.products += 1;
    } else {
      acc.push({
        name: product.category,
        value: product.quantity * product.unitPrice,
        products: 1,
      });
    }
    return acc;
  }, [] as Array<{ name: string; value: number; products: number }>);
  
  // Get recent transactions (last 5)
  const recentTransactions = transactions
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return {
    totalProducts,
    lowStockAlerts,
    totalSuppliers,
    inventoryValue,
    stockByCategory,
    recentTransactions,
  };
};

export const mockDashboardMetrics = calculateDashboardMetrics(mockProducts, mockSuppliers, mockTransactions);