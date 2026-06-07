import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useFood } from "@/context/FoodContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FoodType } from "@/types";
import { toast } from "sonner";
import { MapPin, PlusCircle } from "lucide-react";

const DonatePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { addListing } = useFood();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "", quantity: "", type: "veg" as FoodType,
    location: "", expiryTime: "", contact: user?.email || "",
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-heading font-bold">Please login to donate food</h2>
        <Button onClick={() => navigate("/login")}>Go to Login</Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.quantity || !form.location || !form.expiryTime || !form.contact) {
      toast.error("Please fill all fields");
      return;
    }
    addListing({ ...form, expiryTime: new Date(form.expiryTime).toISOString() });
    toast.success("Food listing added successfully!");
    navigate("/browse");
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-2xl">
            <PlusCircle className="h-6 w-6 text-primary" /> Donate Food
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Food Title</Label>
              <Input id="title" placeholder="e.g. Fresh Vegetable Biryani" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" placeholder="e.g. 5 kg or 20 servings" value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Food Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as FoodType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veg">🥬 Vegetarian</SelectItem>
                    <SelectItem value="non-veg">🍗 Non-Vegetarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="location" className="pl-9" placeholder="e.g. Mumbai, Andheri West" value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Time</Label>
              <Input id="expiry" type="datetime-local" value={form.expiryTime}
                onChange={(e) => setForm({ ...form, expiryTime: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Details</Label>
              <Input id="contact" placeholder="Phone or email" value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })} />
            </div>

            <Button type="submit" size="lg" className="w-full">Submit Listing</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonatePage;
