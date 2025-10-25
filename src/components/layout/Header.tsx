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
import logo from "@/assets/Gemini_Generated_Image_6mymox6mymox6mym (1).png";

export function Header() {
  const { user, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState<boolean>(false);

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
    if (newMode) html.classList.add("dark");
    else html.classList.remove("dark");
  };

  return (
    <header className="glass-card border-b border-glass-border bg-surface/70 backdrop-blur-lg px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 flex items-center justify-between">
      
      {/* Left: Sidebar Trigger + Logo (mobile only) */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <SidebarTrigger className="glass-surface hover:bg-surface-glass/80 shrink-0" />

        {/* Logo + Text: mobile only */}
        <div className="flex items-center gap-1 sm:gap-2 md:hidden">
          <img src={logo} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
          <span className="text-lg font-bold leading-tight heading-gradient">
            StockWise
          </span>
        </div>
      </div>

      {/* Center: Slogan (desktop only) */}
      <div className="hidden md:flex justify-center flex-1 px-4">
        <p className="text-lg md:text-xl lg:text-2xl font-bold text-center
          bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
          dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500
          bg-clip-text text-transparent
          leading-snug max-w-[70%] break-words">
          &quot;StockWise⚡ — Empowering Smarter Inventory Decisions&quot;
        </p>
      </div>

      {/* Right: Dark Mode + User Icon */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
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

        {/* User Menu (icon only, fully circular) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="glass"
              className="p-2 rounded-full" // circular button
            >
              <User className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="glass-card border-glass-border">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center gap-2">
                <User className="w-4 h-4" /> Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={signOut}
              className="text-destructive cursor-pointer flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
