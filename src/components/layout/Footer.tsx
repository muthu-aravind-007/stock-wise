// src/components/layout/Footer.tsx
export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-3 px-6 text-xs text-muted-foreground flex items-center justify-between">
      <span>© {new Date().getFullYear()} StockWise. All rights reserved.</span>
      <span>v1.0.0</span>
    </footer>
  );
}
