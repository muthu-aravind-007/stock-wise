import { useState, useEffect } from "react";
import {
  ArrowUp,
  ArrowDown,
  Calendar,
  Search,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [modalType, setModalType] = useState<"in" | "out">("in");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    productId: "",
    quantity: 0,
    unitPrice: 0,
    supplierId: "",
    notes: "",
  });

  // Fetch Data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const { data: productsData } = await supabase.from("products").select("*");
    const { data: suppliersData } = await supabase.from("suppliers").select("*");
    const { data: transactionsData } = await supabase
      .from("transactions")
      .select(`
        *,
        products(name),
        suppliers(name)
      `)
      .order("created_at", { ascending: false });

    if (productsData) setProducts(productsData);
    if (suppliersData) setSuppliers(suppliersData);

    if (transactionsData) {
      const formatted = transactionsData.map((t: any) => ({
        id: t.id,
        productName: t.products?.name,
        supplierName: t.suppliers?.name,
        type: t.type,
        quantity: t.quantity,
        unitPrice: t.unit_price,
        totalValue: t.quantity * t.unit_price,
        notes: t.notes,
        createdAt: new Date(t.created_at),
      }));
      setTransactions(formatted);
    }
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { productId, quantity, unitPrice, supplierId, notes } = formData;
    if (!productId || quantity <= 0 || unitPrice <= 0) {
      setIsSubmitting(false);
      return;
    }

    // Insert transaction
    const { error } = await supabase.from("transactions").insert({
      product_id: productId,
      type: modalType.toUpperCase(),
      quantity,
      unit_price: unitPrice,
      supplier_id: supplierId || null,
      notes,
    });

    if (!error) {
      // Update stock
      const product = products.find((p) => p.id === productId);
      if (product) {
        const newStock =
          modalType === "in"
            ? product.stock + quantity
            : Math.max(0, product.stock - quantity);

        await supabase.from("products").update({ stock: newStock }).eq("id", productId);
      }

      setFormData({ productId: "", quantity: 0, unitPrice: 0, supplierId: "", notes: "" });
      setIsDialogOpen(false);
      await fetchAllData();
    }

    setIsSubmitting(false);
  };

  // Filtering & Stats
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.supplierName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || t.type.toLowerCase() === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalStockIn = filteredTransactions
    .filter((t) => t.type === "IN")
    .reduce((sum, t) => sum + t.totalValue, 0);

  const totalStockOut = filteredTransactions
    .filter((t) => t.type === "OUT")
    .reduce((sum, t) => sum + t.totalValue, 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);


  const formatDate = (d: Date) =>
    new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // optional, for AM/PM format
    }).format(d);


  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold heading-gradient">Transactions</h1>
          <p className="text-muted-foreground">Track all stock movements</p>
        </div>

        <div className="flex gap-2">
          {["in", "out"].map((type) => (
            <Dialog key={type} open={isDialogOpen && modalType === type} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setModalType(type as "in" | "out");
                    setIsDialogOpen(true);
                  }}
                  className={`${
                    type === "in"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  } text-white`}
                >
                  {type === "in" ? <ArrowUp className="mr-2 w-5 h-5" /> : <ArrowDown className="mr-2 w-5 h-5" />}
                  {type === "in" ? "Stock In" : "Stock Out"}
                </Button>
              </DialogTrigger>

              <DialogContent className="bg-background text-foreground border border-border shadow-lg max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">
                    {type === "in" ? "Add Stock In" : "Record Stock Out"}
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  {/* Product */}
                  <Select
                    value={formData.productId}
                    onValueChange={(v) => setFormData({ ...formData, productId: v })}
                  >
                    <SelectTrigger className="w-full bg-card border border-border text-foreground">
                      <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent className="bg-card text-foreground">
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Quantity */}
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: parseInt(e.target.value) })
                    }
                    min={1}
                    required
                    className="bg-card border text-foreground"
                  />

                  {/* Unit Price */}
                  <Input
                    type="number"
                    placeholder="Unit Price"
                    value={formData.unitPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })
                    }
                    min={0.01}
                    step={0.01}
                    required
                    className="bg-card border text-foreground"
                  />

                  {/* Supplier */}
                  <Select
                    value={formData.supplierId}
                    onValueChange={(v) => setFormData({ ...formData, supplierId: v })}
                  >
                    <SelectTrigger className="w-full bg-card border text-foreground">
                      <SelectValue placeholder="Select Supplier (optional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-card text-foreground">
                      {suppliers.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="bg-card border text-foreground"
                  />

                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      ) : null}
                      {isSubmitting ? "Saving..." : "Submit"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center gap-3">
          <ArrowUp className="w-6 h-6 text-green-600" />
          <div>
            <p className="text-sm text-muted-foreground">Stock In Value</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalStockIn)}
            </p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-3">
          <ArrowDown className="w-6 h-6 text-red-600" />
          <div>
            <p className="text-sm text-muted-foreground">Stock Out Value</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(totalStockOut)}
            </p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-3">
          <Calendar className="w-6 h-6 text-blue-600" />
          <div>
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-2xl font-bold text-blue-600">
              {filteredTransactions.length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card text-foreground"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48 bg-card text-foreground">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent className="bg-card text-foreground">
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="in">Stock In</SelectItem>
            <SelectItem value="out">Stock Out</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{formatDate(t.createdAt)}</TableCell>
                <TableCell>{t.productName}</TableCell>
                <TableCell>
                  <Badge
                    className={`flex items-center gap-1 w-fit px-2 py-1 rounded-md ${
                      t.type === "IN"
                        ? "bg-green-500/20 text-green-600 dark:text-green-400"
                        : "bg-red-500/20 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {t.type === "IN" ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                    {t.type === "IN" ? "Stock In" : "Stock Out"}
                  </Badge>
                </TableCell>
                <TableCell>{t.quantity}</TableCell>
                <TableCell>{formatCurrency(t.unitPrice)}</TableCell>
                <TableCell>{formatCurrency(t.totalValue)}</TableCell>
                <TableCell>{t.supplierName || "-"}</TableCell>
                <TableCell>{t.notes || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
