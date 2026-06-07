import React, { useState } from "react";
import { useFood } from "@/context/FoodContext";
import { useAuth } from "@/context/AuthContext";
import FoodCard from "@/components/FoodCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search } from "lucide-react";

const BrowsePage = () => {
  const { listings, requestFood } = useFood();
  const { isAuthenticated, user } = useAuth();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = listings
    .filter((l) => l.status !== "completed")
    .filter((l) => typeFilter === "all" || l.type === typeFilter)
    .filter((l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase())
    );

  const handleRequest = (id: string) => {
    if (!isAuthenticated) { toast.error("Please login to request food"); return; }
    requestFood(id);
    toast.success("Request sent!");
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-heading font-bold mb-6">Browse Available Food</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by name or location..." value={search}
            onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="veg">🥬 Vegetarian</SelectItem>
            <SelectItem value="non-veg">🍗 Non-Vegetarian</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">No food listings found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((listing) => (
            <div key={listing.id} className="animate-fade-in">
              <FoodCard
                listing={listing}
                showRequest={isAuthenticated && listing.donorId !== user?.id}
                onRequest={() => handleRequest(listing.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowsePage;
