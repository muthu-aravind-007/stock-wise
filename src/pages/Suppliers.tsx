// Suppliers.tsx
import { useEffect, useState } from 'react';
import { Plus, Mail, Phone, MapPin, Edit, Trash2, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '../lib/supabaseClient';

interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
  });

  // Fetch suppliers
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Fetch suppliers error:', error);
    else setSuppliers(data as Supplier[]);
  };

  // Add new supplier
  const addSupplier = async () => {
    const { name, contact_person, email, phone, address } = form;
    if (!name || !contact_person || !email) return alert('Please fill required fields');

    const { error } = await supabase
      .from('suppliers')
      .insert([{ name, contact_person, email, phone, address }]);
    if (error) console.error('Insert supplier error:', error);
    else {
      fetchSuppliers();
      closeModal();
    }
  };

  // Update existing supplier
  const updateSupplier = async () => {
    if (!editingSupplier) return;
    const { error } = await supabase
      .from('suppliers')
      .update(form)
      .eq('id', editingSupplier.id);
    if (error) console.error('Update supplier error:', error);
    else {
      fetchSuppliers();
      closeModal();
    }
  };

  // Delete supplier
  const deleteSupplier = async (id: string) => {
    const { error } = await supabase.from('suppliers').delete().eq('id', id);
    if (error) console.error('Delete supplier error:', error);
    else fetchSuppliers();
  };

  // Open modal for editing
  const startEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setForm({
      name: supplier.name,
      contact_person: supplier.contact_person,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
    setForm({ name: '', contact_person: '', email: '', phone: '', address: '' });
  };

  // Filter suppliers
  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold heading-gradient">Suppliers</h1>
          <p className="text-muted-foreground">Manage your supplier relationships</p>
        </div>

        {/* Add/Edit Supplier Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gradient-secondary hover-glow">
              <Plus className="mr-2 w-5 h-5" />
              {editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[450px] text-white">
            <DialogHeader>
              <DialogTitle>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 mt-4 text-white">
              <Input
                placeholder="Name*"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                placeholder="Contact Person*"
                value={form.contact_person}
                onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
              />
              <Input
                placeholder="Email*"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <Input
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />

              <Button className="w-full mt-2" onClick={editingSupplier ? updateSupplier : addSupplier}>
                {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="glass-card p-6">
        <div className="relative max-w-md">
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
                  <p className="text-sm text-muted-foreground">{supplier.contact_person}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-primary/10"
                  onClick={() => startEditSupplier(supplier)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-destructive/10 text-destructive"
                  onClick={() => deleteSupplier(supplier.id)}
                >
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

            <div className="border-t border-glass-border pt-4 flex justify-between text-sm text-muted-foreground">
              <span>Partner Since</span>
              <span className="font-medium text-foreground">{formatDate(supplier.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
