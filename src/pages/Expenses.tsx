import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Expense = {
  id: number;
  date: string;
  category: string;
  amount: number;
  notes: string;
};

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, date: "2025-09-10", category: "Office Supplies", amount: 120, notes: "Printer ink" },
    { id: 2, date: "2025-09-12", category: "Utilities", amount: 75, notes: "Electricity bill" },
  ]);

  const [form, setForm] = useState<Expense>({
    id: 0,
    date: "",
    category: "",
    amount: 0,
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addExpense = () => {
    if (!form.date || !form.category || !form.amount) return;
    setExpenses([...expenses, { ...form, id: expenses.length + 1, amount: Number(form.amount) }]);
    setForm({ id: 0, date: "", category: "", amount: 0, notes: "" });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Expenses</h1>

      {/* Add Expense Form */}
      <Card className="p-4 space-y-3">
        <h2 className="text-lg font-semibold">Add New Expense</h2>
        <div className="grid grid-cols-2 gap-3">
          <Input name="date" type="date" value={form.date} onChange={handleChange} />
          <Input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
          <Input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} />
          <Input name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />
        </div>
        <Button onClick={addExpense}>Add Expense</Button>
      </Card>

      {/* Expenses Table */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-3">Expense List</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Date</th>
              <th className="p-2">Category</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id} className="border-b hover:bg-muted/50">
                <td className="p-2">{exp.date}</td>
                <td className="p-2">{exp.category}</td>
                <td className="p-2 font-medium text-primary">${exp.amount}</td>
                <td className="p-2">{exp.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
