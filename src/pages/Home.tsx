import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useFood } from "@/context/FoodContext";
import FoodCard from "@/components/FoodCard";
import ApiDemo from "@/components/ApiDemo";
import { ArrowRight, Heart, Utensils, Users } from "lucide-react";

const HomePage = () => {
  const { listings } = useFood();
  const recentListings = listings.filter((l) => l.status === "available").slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight">
              Share Food,{" "}
              <span className="text-gradient">Share Love</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Connecting food donors with people and organizations in need. Reduce waste, feed communities, make a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/donate">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Heart className="h-5 w-5" /> Donate Food
                </Button>
              </Link>
              <Link to="/browse">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <Utensils className="h-5 w-5" /> Browse Food
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/50">
        <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { icon: Utensils, label: "Meals Shared", value: "2,450+" },
            { icon: Users, label: "Active Donors", value: "180+" },
            { icon: Heart, label: "Communities Served", value: "35+" },
          ].map((stat) => (
            <div key={stat.label} className="space-y-2">
              <stat.icon className="h-8 w-8 mx-auto text-primary" />
              <p className="text-3xl font-heading font-bold">{stat.value}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent listings */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold">Recent Listings</h2>
          <Link to="/browse">
            <Button variant="ghost" className="gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentListings.map((listing) => (
            <div key={listing.id} className="animate-fade-in">
              <FoodCard listing={listing} />
            </div>
          ))}
        </div>
      </section>

      {/* Simple API demo section */}
      <div className="container mx-auto px-4 pb-16">
        <ApiDemo />
      </div>
    </div>
  );
};

export default HomePage;
