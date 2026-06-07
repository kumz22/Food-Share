import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useFood } from "@/context/FoodContext";
import FoodCard from "@/components/FoodCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FoodType } from "@/types";
import { toast } from "sonner";
import { Bell, Check, Edit, Trash2, X } from "lucide-react";

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { listings, requests, notifications, deleteListing, updateListing, updateRequestStatus, markNotificationRead } = useFood();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-heading font-bold">Please login to view dashboard</h2>
        <Button onClick={() => navigate("/login")}>Go to Login</Button>
      </div>
    );
  }

  const myListings = listings.filter((l) => l.donorId === user.id);
  const myRequests = requests.filter((r) => r.requesterId === user.id);
  const incomingRequests = requests.filter((r) => r.donorId === user.id);
  const myNotifications = notifications.filter((n) => n.userId === user.id);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
        <Badge variant="outline" className="text-sm">
          {user.role === "donor" ? "🤲 Donor" : "🏢 Organization"}
        </Badge>
      </div>

      <Tabs defaultValue={user.role === "donor" ? "listings" : "requests"}>
        <TabsList className="mb-6">
          {user.role === "donor" && <TabsTrigger value="listings">My Listings</TabsTrigger>}
          {user.role === "donor" && <TabsTrigger value="incoming">Incoming Requests</TabsTrigger>}
          {user.role === "organization" && <TabsTrigger value="requests">My Requests</TabsTrigger>}
          <TabsTrigger value="notifications" className="gap-1">
            <Bell className="h-4 w-4" /> Notifications
            {myNotifications.filter((n) => !n.read).length > 0 && (
              <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-secondary">
                {myNotifications.filter((n) => !n.read).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {user.role === "donor" && (
          <>
            <TabsContent value="listings">
              {myListings.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <p>No listings yet.</p>
                  <Button className="mt-4" onClick={() => navigate("/donate")}>Create one</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myListings.map((listing) => (
                    <FoodCard key={listing.id} listing={listing} actions={
                      <div className="flex gap-2 w-full">
                        <EditDialog listing={listing} onSave={(data) => { updateListing(listing.id, data); toast.success("Updated!"); }} />
                        <Button variant="destructive" size="sm" className="gap-1"
                          onClick={() => { deleteListing(listing.id); toast.success("Deleted!"); }}>
                          <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                      </div>
                    } />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="incoming">
              <RequestList requests={incomingRequests} type="incoming" onUpdateStatus={updateRequestStatus} />
            </TabsContent>
          </>
        )}

        {user.role === "organization" && (
          <TabsContent value="requests">
            <RequestList requests={myRequests} type="outgoing" onUpdateStatus={updateRequestStatus} />
          </TabsContent>
        )}

        <TabsContent value="notifications">
          {myNotifications.length === 0 ? (
            <p className="text-center py-16 text-muted-foreground">No notifications</p>
          ) : (
            <div className="space-y-3 max-w-xl">
              {myNotifications.map((n) => (
                <Card key={n.id} className={n.read ? "opacity-60" : ""}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm">{n.message}</p>
                      <p className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                    {!n.read && (
                      <Button size="sm" variant="ghost" onClick={() => markNotificationRead(n.id)}>
                        Mark read
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const RequestList = ({ requests, type, onUpdateStatus }: {
  requests: any[]; type: "incoming" | "outgoing";
  onUpdateStatus: (id: string, status: any) => void;
}) => {
  if (requests.length === 0) return <p className="text-center py-16 text-muted-foreground">No requests yet</p>;

  const statusColor = { pending: "secondary", accepted: "default", completed: "outline" } as const;

  return (
    <div className="space-y-3 max-w-2xl">
      {requests.map((r) => (
        <Card key={r.id}>
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-4">
            <div>
              <p className="font-medium">{r.listingTitle}</p>
              <p className="text-sm text-muted-foreground">
                {type === "incoming" ? `From: ${r.requesterName}` : `Status`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={statusColor[r.status as keyof typeof statusColor]}>{r.status}</Badge>
              {type === "incoming" && r.status === "pending" && (
                <>
                  <Button size="sm" className="gap-1" onClick={() => { onUpdateStatus(r.id, "accepted"); toast.success("Accepted!"); }}>
                    <Check className="h-4 w-4" /> Accept
                  </Button>
                  <Button size="sm" variant="destructive" className="gap-1"
                    onClick={() => { onUpdateStatus(r.id, "completed"); toast.info("Marked complete"); }}>
                    Done
                  </Button>
                </>
              )}
              {type === "incoming" && r.status === "accepted" && (
                <Button size="sm" variant="outline" onClick={() => { onUpdateStatus(r.id, "completed"); toast.success("Completed!"); }}>
                  Mark Complete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const EditDialog = ({ listing, onSave }: { listing: any; onSave: (data: any) => void }) => {
  const [form, setForm] = useState({ title: listing.title, quantity: listing.quantity, type: listing.type, location: listing.location, contact: listing.contact });
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1"><Edit className="h-4 w-4" /> Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Listing</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label>Quantity</Label>
            <Input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as FoodType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="veg">Veg</SelectItem>
                <SelectItem value="non-veg">Non-Veg</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Location</Label>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <Button className="w-full" onClick={() => { onSave(form); setOpen(false); }}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardPage;
