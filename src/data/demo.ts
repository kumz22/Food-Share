import { FoodListing, FoodRequest, Notification, User } from "@/types";

export const DEMO_USERS: User[] = [
  { id: "u1", name: "Raj Patel", email: "raj@demo.com", role: "donor" },
  { id: "u2", name: "Green Earth NGO", email: "green@demo.com", role: "organization" },
  { id: "u3", name: "Anita Sharma", email: "anita@demo.com", role: "donor" },
];

const now = new Date();
const hours = (h: number) => new Date(now.getTime() + h * 3600000).toISOString();

export const DEMO_LISTINGS: FoodListing[] = [
  {
    id: "f1", title: "Fresh Vegetable Biryani", quantity: "5 kg", type: "veg",
    location: "Mumbai, Andheri West", expiryTime: hours(3), contact: "+91 98765 43210",
    donorId: "u1", donorName: "Raj Patel", createdAt: hours(-2), status: "available",
  },
  {
    id: "f2", title: "Assorted Sandwiches", quantity: "20 pieces", type: "non-veg",
    location: "Delhi, Connaught Place", expiryTime: hours(5), contact: "+91 91234 56789",
    donorId: "u3", donorName: "Anita Sharma", createdAt: hours(-1), status: "available",
  },
  {
    id: "f3", title: "Dal & Rice Combo", quantity: "10 servings", type: "veg",
    location: "Bangalore, Koramangala", expiryTime: hours(1), contact: "+91 87654 32100",
    donorId: "u1", donorName: "Raj Patel", createdAt: hours(-4), status: "available",
  },
  {
    id: "f4", title: "Fruit Basket", quantity: "3 kg", type: "veg",
    location: "Mumbai, Bandra", expiryTime: hours(12), contact: "+91 98765 43210",
    donorId: "u1", donorName: "Raj Patel", createdAt: hours(-6), status: "available",
  },
  {
    id: "f5", title: "Chicken Curry & Naan", quantity: "8 servings", type: "non-veg",
    location: "Pune, Koregaon Park", expiryTime: hours(2), contact: "+91 91234 56789",
    donorId: "u3", donorName: "Anita Sharma", createdAt: hours(-3), status: "available",
  },
  {
    id: "f6", title: "Paneer Tikka Platter", quantity: "15 pieces", type: "veg",
    location: "Delhi, Hauz Khas", expiryTime: hours(4), contact: "+91 87654 32100",
    donorId: "u3", donorName: "Anita Sharma", createdAt: hours(-5), status: "requested",
  },
];

export const DEMO_REQUESTS: FoodRequest[] = [
  {
    id: "r1", listingId: "f6", listingTitle: "Paneer Tikka Platter",
    requesterId: "u2", requesterName: "Green Earth NGO", donorId: "u3",
    status: "pending", createdAt: hours(-1),
  },
];

export const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "n1", userId: "u3", message: "Green Earth NGO requested your Paneer Tikka Platter",
    read: false, createdAt: hours(-1),
  },
];
