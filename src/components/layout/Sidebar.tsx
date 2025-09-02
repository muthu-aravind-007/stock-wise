import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ArrowUpDown, 
  FileText, 
  Menu,
  X,
  TrendingUp
} from 'lucide-react';
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
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    url: '/products',
    icon: Package,
  },
  {
    title: 'Suppliers',
    url: '/suppliers',
    icon: Users,
  },
  {
    title: 'Transactions',
    url: '/transactions',
    icon: ArrowUpDown,
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: FileText,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === 'collapsed';
  
  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };
  
  const getNavClassName = (path: string) => {
    const active = isActive(path);
    return active 
      ? 'gradient-primary text-primary-foreground shadow-[var(--shadow-primary)]' 
      : 'hover:bg-surface/70 text-muted-foreground hover:text-foreground';
  };

  return (
    <Sidebar className={`glass-card border-r-0 ${isCollapsed ? 'w-14' : 'w-64'}`}>
      <SidebarContent className="p-4">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold heading-gradient">StockWise</h1>
              <p className="text-xs text-muted-foreground">Inventory Management</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? 'sr-only' : 'text-muted-foreground font-medium mb-2'}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`${getNavClassName(item.url)} flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 hover-lift`}
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

        {/* Stats Section - Only show when expanded */}
        {!isCollapsed && (
          <div className="mt-8 p-4 glass-surface rounded-xl">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Active Products</span>
                <span className="text-sm font-semibold text-primary">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Low Stock</span>
                <span className="text-sm font-semibold text-warning">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Total Value</span>
                <span className="text-sm font-semibold text-success">$89.2K</span>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}