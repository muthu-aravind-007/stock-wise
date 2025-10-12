import { User, LogOut, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";

export function Header() {
  const { user, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // 🧠 Get user's display name and avatar
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Admin User";

  const avatarUrl =
    user?.user_metadata?.picture ||
    user?.user_metadata?.avatar_url ||
    "/placeholder-avatar.png";

  // ✅ Apply saved dark mode preference on initial load
  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    const html = document.documentElement;
    if (storedMode === "true") {
      html.classList.add("dark");
      setDarkMode(true);
    } else {
      html.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  // ✅ Toggle and persist dark mode
  const toggleDarkMode = () => {
    const html = document.documentElement;
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));

    if (newMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  };

  return (
    <header className="glass-card border-b border-glass-border bg-surface/70 backdrop-blur-lg">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="glass-surface hover:bg-surface-glass/80" />

          {/* 🔍 Search Bar */}
          <div className="relative">
            <Input
              type="search"
              placeholder="Search products, suppliers..."
              className="pl-10 w-80 glass-surface border-glass-border backdrop-blur-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* 🌗 Dark/Light Mode Toggle */}
          <Button
              variant="glass"
              size="icon"
              onClick={toggleDarkMode}
              className="p-2 rounded-full transition-all duration-300"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Moon className="w-5 h-5 text-slate-700" /> // 🌙 shows to switch to dark
              ) : (
                <Sun className="w-5 h-5 text-yellow-400" /> // ☀️ shows to switch to light
              )}
          </Button>


          {/* 👤 User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="glass" className="flex items-center gap-2">
                <span className="hidden md:inline">{displayName}</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="glass-card border-glass-border"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={signOut}
                className="text-destructive cursor-pointer flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
