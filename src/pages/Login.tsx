import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/types";
import { toast } from "sonner";
import { LogIn, UserPlus } from "lucide-react";

const LoginPage = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "", role: "donor" as UserRole });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(loginForm.email, loginForm.password)) {
      toast.success("Welcome back!");
      navigate("/");
    } else {
      toast.error("Invalid credentials. Try: raj@demo.com or green@demo.com");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email) { toast.error("Please fill all fields"); return; }
    if (signup(signupForm.name, signupForm.email, signupForm.password, signupForm.role)) {
      toast.success("Account created!");
      navigate("/");
    } else {
      toast.error("Email already exists");
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-heading">Welcome to FoodShare</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="raj@demo.com" value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" placeholder="Any password (demo)" value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
                </div>
                <Button type="submit" className="w-full gap-2">
                  <LogIn className="h-4 w-4" /> Login
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Demo accounts: raj@demo.com (donor) · green@demo.com (org)
                </p>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input id="signup-name" placeholder="Your name" value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="you@example.com" value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" placeholder="Choose a password" value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={signupForm.role} onValueChange={(v) => setSignupForm({ ...signupForm, role: v as UserRole })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="donor">🤲 Donor</SelectItem>
                      <SelectItem value="organization">🏢 Organization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full gap-2">
                  <UserPlus className="h-4 w-4" /> Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
