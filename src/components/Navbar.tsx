import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useFood } from "@/context/FoodContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, PlusCircle, Search, LayoutDashboard, LogIn, LogOut, Bell, Menu, X, Sun, Moon } from "lucide-react";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useFood();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  };

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/donate", label: "Donate", icon: PlusCircle },
    { to: "/browse", label: "Browse", icon: Search },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="font-heading text-xl font-bold text-gradient">
          🍽️ FoodShare
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to}>
              <Button variant={isActive(item.to) ? "default" : "ghost"} size="sm" className="gap-2">
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleDark}>
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {isAuthenticated && (
            <Link to="/dashboard" className="relative">
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-secondary">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout} className="gap-1">
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm" className="gap-1">
                <LogIn className="h-4 w-4" /> Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-card p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}>
              <Button variant={isActive(item.to) ? "default" : "ghost"} className="w-full justify-start gap-2">
                <item.icon className="h-4 w-4" /> {item.label}
              </Button>
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-2 border-t">
            <Button variant="ghost" size="icon" onClick={toggleDark}>
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            {isAuthenticated ? (
              <Button variant="outline" size="sm" onClick={() => { logout(); setMobileOpen(false); }} className="gap-1">
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="gap-1">
                  <LogIn className="h-4 w-4" /> Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
