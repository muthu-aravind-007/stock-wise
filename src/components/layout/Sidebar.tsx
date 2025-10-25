import { NavLink, useLocation } from "react-router-dom";
import image from "@/assets/Gemini_Generated_Image_6mymox6mymox6mym (1).png";
import {
  LayoutDashboard,
  Package,
  Users,
  ArrowUpDown,
  FileText,
  Wallet,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Products", url: "/products", icon: Package },
  { title: "Suppliers", url: "/suppliers", icon: Users },
  { title: "Transactions", url: "/transactions", icon: ArrowUpDown },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Expenses", url: "/expenses", icon: Wallet },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    const active = isActive(path);
    return active
      ? "gradient-primary text-primary-foreground shadow-[var(--shadow-primary)]"
      : "hover:bg-surface/70 text-muted-foreground hover:text-foreground";
  };

  return (
    <Sidebar className={`glass-card border-r-0 ${isCollapsed ? "w-14" : "w-64"}`}>
      <SidebarContent className="p-4">
        {/* ✅ Logo Section */}
        <NavLink
          to="/"
          className="flex items-center gap-3 mb-8 cursor-pointer hover:opacity-90 transition-all duration-300"
        >
          {/* Adjusted size and spacing */}
          <div className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden bg-transparent">
            <img
              src={image}
              alt="logo"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Show text only when sidebar is expanded */}
          {!isCollapsed && (
            <div className="flex flex-col justify-center">
              <h1 className="text-lg font-bold leading-tight heading-gradient">
                StockWise
              </h1>
              <p className="text-xs text-muted-foreground leading-tight">
                Inventory Management
              </p>
            </div>
          )}
        </NavLink>

        {/* ✅ Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel
            className={
              isCollapsed ? "sr-only" : "text-muted-foreground font-medium mb-2"
            }
          >
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`${getNavClassName(
                        item.url
                      )} flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 hover-lift`}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
