import { User, LogOut, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Admin User";

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
    <header className="glass-card border-b border-glass-border bg-surface/70 backdrop-blur-lg relative">
      {/* Main layout row */}
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 relative z-10">
        {/* Left: Sidebar Trigger */}
        <SidebarTrigger className="glass-surface hover:bg-surface-glass/80 shrink-0" />

        {/* Right: Dark Mode + User Menu */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
          {/* Dark/Light Mode Toggle */}
          <Button
            variant="glass"
            size="icon"
            onClick={toggleDarkMode}
            className="p-1.5 sm:p-2 rounded-full transition-all duration-300"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="glass"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3"
              >
                <span className="hidden sm:inline text-sm md:text-base">
                  {displayName}
                </span>
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

      {/* Centered Slogan */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-2">
        <p
          className="
            text-base sm:text-lg md:text-xl lg:text-2xl
            font-bold text-center
            bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
            dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500
            bg-clip-text text-transparent
            leading-snug
            max-w-[90%] sm:max-w-[80%] md:max-w-[70%]
            break-words
          "
        >
          &quot;StockWise⚡ — Empowering Smarter Inventory Decisions&quot;
        </p>
      </div>
    </header>
  );
}
