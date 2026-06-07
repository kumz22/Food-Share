export type UserRole = "donor" | "organization";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type FoodType = "veg" | "non-veg";

export interface FoodListing {
  id: string;
  title: string;
  quantity: string;
  type: FoodType;
  location: string;
  expiryTime: string; // ISO string
  contact: string;
  donorId: string;
  donorName: string;
  createdAt: string;
  status: "available" | "requested" | "completed";
}

export type RequestStatus = "pending" | "accepted" | "completed";

export interface FoodRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  requesterId: string;
  requesterName: string;
  donorId: string;
  status: RequestStatus;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}
