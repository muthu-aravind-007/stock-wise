import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type Product = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  stock: number;
  price: number;
  supplier_id: string | null;
  created_at: string | null;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    stock: "",
    price: "",
  });

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name");
    if (error) console.error("Error fetching products:", error.message);
    else setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      category: form.category.trim() || null,
      stock: Number(form.stock),
      price: Number(form.price),
    };

    if (editProduct) {
      const { data, error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editProduct.id)
        .select();
      if (error) console.error(error.message);
      else {
        setProducts((prev) =>
          prev.map((p) => (p.id === editProduct.id ? data[0] : p))
        );
        setOpen(false);
      }
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert([payload])
        .select();
      if (error) console.error(error.message);
      else setProducts((prev) => [...prev, ...(data || [])]);
      setOpen(false);
    }

    setForm({ name: "", description: "", category: "", stock: "", price: "" });
    setEditProduct(null);
  };

  const confirmDelete = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productToDelete.id);
    if (error) console.error(error.message);
    else setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
    setDeleteDialog(false);
    setProductToDelete(null);
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description || "",
      category: product.category || "",
      stock: product.stock.toString(),
      price: product.price.toString(),
    });
    setOpen(true);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
      value
    );

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false);
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold heading-gradient">Products</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your product inventory
          </p>
        </div>
        <Button
          size="lg"
          className="gradient-primary hover-glow flex-1 sm:flex-none"
          onClick={() => {
            setEditProduct(null);
            setForm({ name: "", description: "", category: "", stock: "", price: "" });
            setOpen(true);
          }}
        >
          <Plus className="mr-2 w-5 h-5" /> Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 text-white placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48 glass-surface border-glass-border">
              <Filter className="mr-2 w-4 h-4" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className="glass-card border-glass-border">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto glass-card">
        {loading ? (
          <p className="text-center text-muted-foreground py-4">Loading...</p>
        ) : (
          <Table className="min-w-[600px] sm:min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell className="text-success">
                    {formatCurrency(product.stock * product.price)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 flex-wrap">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => confirmDelete(product)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Modals */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-card border border-glass-border text-white max-w-md w-full">
          <DialogHeader>
            <DialogTitle>{editProduct ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <Input
              name="name"
              placeholder="Product name"
              value={form.name}
              onChange={handleChange}
              className="text-white placeholder:text-gray-400"
            />
            <Input
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="text-white placeholder:text-gray-400"
            />
            <Input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              className="text-white placeholder:text-gray-400"
            />
            <Input
              name="stock"
              placeholder="Stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              className="text-white placeholder:text-gray-400"
            />
            <Input
              name="price"
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className="text-white placeholder:text-gray-400"
            />
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editProduct ? "Update" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="glass-card border border-glass-border text-white text-center max-w-sm w-full">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-destructive">{productToDelete?.name}</span>?
          </p>
          <DialogFooter className="mt-4 flex justify-center gap-3">
            <Button variant="secondary" onClick={() => setDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
