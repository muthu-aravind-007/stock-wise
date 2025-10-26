import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";

type Expense = {
  id: string;
  expense_date: string;
  category: string;
  amount: number;
  notes: string;
};

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [form, setForm] = useState({
    expense_date: "",
    category: "",
    amount: "",
    notes: "",
  });

  // Fetch expenses
  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from("expenses")
      .select("id, expense_date, category, amount, notes")
      .order("expense_date", { ascending: false });

    if (error) {
      console.error("Error fetching expenses:", error.message);
      return;
    }

    setExpenses(data || []);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add expense
  const addExpense = async () => {
    if (!form.expense_date || !form.category || !form.amount) {
      alert("Please fill all required fields!");
      return;
    }

    const { error } = await supabase.from("expenses").insert([
      {
        expense_date: form.expense_date,
        category: form.category,
        amount: Number(form.amount),
        notes: form.notes,
      },
    ]);

    if (error) {
      console.error("Error adding expense:", error.message);
      alert(`Failed to add expense: ${error.message}`);
      return;
    }

    setForm({ expense_date: "", category: "", amount: "", notes: "" });
    fetchExpenses();
  };

  // Delete expense
  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) {
      console.error("Error deleting expense:", error.message);
      alert("Failed to delete expense.");
      return;
    }
    fetchExpenses();
  };

  // Format currency
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl font-bold">Expenses</h1>

      {/* Add Expense Form */}
      <Card className="p-4 space-y-3">
        <h2 className="text-lg font-semibold">Add New Expense</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            name="expense_date"
            type="date"
            value={form.expense_date}
            onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
          />
          <Input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <Input
            name="amount"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <Input
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={addExpense}>Add Expense</Button>
        </div>
      </Card>

      {/* Expenses Table */}
      <Card className="p-4 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-3">Expense List</h2>
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2 whitespace-nowrap">Date</th>
              <th className="p-2 whitespace-nowrap">Category</th>
              <th className="p-2 whitespace-nowrap">Amount</th>
              <th className="p-2 whitespace-nowrap">Notes</th>
              <th className="p-2 text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No expenses yet
                </td>
              </tr>
            ) : (
              expenses.map((exp) => (
                <tr key={exp.id} className="border-b hover:bg-muted/50">
                  <td className="p-2">{exp.expense_date}</td>
                  <td className="p-2">{exp.category}</td>
                  <td className="p-2 font-medium text-primary">
                    {formatCurrency(exp.amount)}
                  </td>
                  <td className="p-2 break-words">{exp.notes}</td>
                  <td className="p-2 text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteExpense(exp.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
