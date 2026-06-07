import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { FoodListing, FoodRequest, Notification } from "@/types";
import { DEMO_LISTINGS, DEMO_REQUESTS, DEMO_NOTIFICATIONS } from "@/data/demo";
import { useAuth } from "./AuthContext";

interface FoodContextType {
  listings: FoodListing[];
  requests: FoodRequest[];
  notifications: Notification[];
  addListing: (listing: Omit<FoodListing, "id" | "createdAt" | "status" | "donorId" | "donorName">) => void;
  updateListing: (id: string, data: Partial<FoodListing>) => void;
  deleteListing: (id: string) => void;
  requestFood: (listingId: string) => void;
  updateRequestStatus: (requestId: string, status: FoodRequest["status"]) => void;
  markNotificationRead: (id: string) => void;
  unreadCount: number;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export const FoodProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const [listings, setListings] = useState<FoodListing[]>([]);

  const [requests, setRequests] = useState<FoodRequest[]>(() => {
    const saved = localStorage.getItem("foodshare_requests");
    return saved ? JSON.parse(saved) : DEMO_REQUESTS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem("foodshare_notifications");
    return saved ? JSON.parse(saved) : DEMO_NOTIFICATIONS;
  });

  useEffect(() => { localStorage.setItem("foodshare_listings", JSON.stringify(listings)); }, [listings]);
  useEffect(() => { localStorage.setItem("foodshare_requests", JSON.stringify(requests)); }, [requests]);
  useEffect(() => { localStorage.setItem("foodshare_notifications", JSON.stringify(notifications)); }, [notifications]);

  useEffect(() => {
    const loadListings = async () => {
      try {
        const res = await fetch("http://localhost:4000/foods");
        if (!res.ok) throw new Error("Failed to load from API");
        const data: FoodListing[] = await res.json();
        setListings(data);
      } catch {
        const saved = localStorage.getItem("foodshare_listings");
        setListings(saved ? JSON.parse(saved) : DEMO_LISTINGS);
      }
    };
    void loadListings();
  }, []);

  const addListing = (data: Omit<FoodListing, "id" | "createdAt" | "status" | "donorId" | "donorName">) => {
    if (!user) return;
    const listing: FoodListing = {
      ...data,
      id: `f${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "available",
      donorId: user.id,
      donorName: user.name,
    };
    setListings((prev) => [listing, ...prev]);

    // Fire-and-forget sync to backend (does not change UI concept or API)
    void (async () => {
      try {
        await fetch("http://localhost:4000/foods", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(listing),
        });
      } catch (e) {
        console.error("Failed to sync listing to backend", e);
      }
    })();
  };

  const updateListing = (id: string, data: Partial<FoodListing>) => {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)));
  };

  const deleteListing = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const requestFood = (listingId: string) => {
    if (!user) return;
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return;
    const request: FoodRequest = {
      id: `r${Date.now()}`, listingId, listingTitle: listing.title,
      requesterId: user.id, requesterName: user.name, donorId: listing.donorId,
      status: "pending", createdAt: new Date().toISOString(),
    };
    setRequests((prev) => [...prev, request]);
    updateListing(listingId, { status: "requested" });
    const notif: Notification = {
      id: `n${Date.now()}`, userId: listing.donorId,
      message: `${user.name} requested your "${listing.title}"`,
      read: false, createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const updateRequestStatus = (requestId: string, status: FoodRequest["status"]) => {
    setRequests((prev) => prev.map((r) => {
      if (r.id !== requestId) return r;
      if (status === "completed") updateListing(r.listingId, { status: "completed" });
      return { ...r, status };
    }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const unreadCount = user ? notifications.filter((n) => n.userId === user.id && !n.read).length : 0;

  return (
    <FoodContext.Provider value={{
      listings, requests, notifications, addListing, updateListing,
      deleteListing, requestFood, updateRequestStatus, markNotificationRead, unreadCount,
    }}>
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => {
  const ctx = useContext(FoodContext);
  if (!ctx) throw new Error("useFood must be used within FoodProvider");
  return ctx;
};
