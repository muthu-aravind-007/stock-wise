import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white flex flex-col transition-colors duration-300">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Manage Your Stock, Suppliers & Expenses Smarter
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-8">
          Track inventory, monitor expenses, and generate reports—all in one
          place with StockWise.
        </p>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 md:px-20 py-16">
        {[
          { title: "Products", desc: "Track stock levels with ease 📦" },
          { title: "Suppliers", desc: "Manage supplier details & contacts 👥" },
          { title: "Expenses", desc: "Monitor shop expenses in real-time 💰" },
          { title: "Reports", desc: "Generate clear business insights 📊" },
        ].map((feature, i) => (
          <Card
            key={i}
            className="glass-card bg-surface/60 border border-glass-border shadow-lg dark:bg-surface/40 transition-colors duration-300"
          >
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{feature.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Preview Section */}
      <section className="flex flex-col items-center text-center px-6 md:px-20 py-20">
        <h2 className="text-3xl font-bold mb-6">Your Entire Business at a Glance</h2>
        <div className="w-full md:w-3/4 rounded-2xl overflow-hidden shadow-xl border border-glass-border">
          <img
            src="/dashboard-preview.png"
            alt="Dashboard Preview"
            className="w-full"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 bg-blue-600 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to take control of your shop’s inventory?
        </h2>
        <Button
          size="lg"
          className="bg-black hover:bg-gray-900 text-white px-8 py-4 text-lg rounded-xl dark:bg-white dark:text-black dark:hover:bg-gray-100 transition-colors duration-300"
        >
          Start Free →
        </Button>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-600 dark:text-gray-400 text-sm bg-white dark:bg-black border-t border-glass-border">
        © {new Date().getFullYear()} StockWise. All rights reserved.
      </footer>
    </div>
  );
}
