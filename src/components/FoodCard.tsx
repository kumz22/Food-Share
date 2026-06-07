import React from "react";
import { FoodListing } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, Leaf, Drumstick } from "lucide-react";

interface FoodCardProps {
  listing: FoodListing;
  onRequest?: () => void;
  showRequest?: boolean;
  actions?: React.ReactNode;
}

const getExpiryStatus = (expiryTime: string) => {
  const diff = new Date(expiryTime).getTime() - Date.now();
  const hours = diff / 3600000;
  if (hours <= 0) return { label: "Expired", variant: "destructive" as const, urgent: true };
  if (hours <= 2) return { label: `${Math.round(hours * 60)}m left`, variant: "destructive" as const, urgent: true };
  if (hours <= 6) return { label: `${Math.round(hours)}h left`, variant: "secondary" as const, urgent: false };
  return { label: `${Math.round(hours)}h left`, variant: "outline" as const, urgent: false };
};

const FoodCard = ({ listing, onRequest, showRequest = false, actions }: FoodCardProps) => {
  const expiry = getExpiryStatus(listing.expiryTime);

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg ${expiry.urgent ? "ring-2 ring-warning/50" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-heading leading-tight">{listing.title}</CardTitle>
          <Badge variant={listing.type === "veg" ? "default" : "secondary"} className="shrink-0 gap-1">
            {listing.type === "veg" ? <Leaf className="h-3 w-3" /> : <Drumstick className="h-3 w-3" />}
            {listing.type === "veg" ? "Veg" : "Non-Veg"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>{listing.location}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0" />
          <span>Qty: {listing.quantity}</span>
          <Badge variant={expiry.variant} className="ml-auto text-xs">
            {expiry.urgent && "⚠️ "}{expiry.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-4 w-4 shrink-0" />
          <span>{listing.contact}</span>
        </div>
        <p className="text-xs text-muted-foreground">By {listing.donorName}</p>
      </CardContent>
      <CardFooter className="pt-0">
        {actions}
        {showRequest && listing.status === "available" && (
          <Button onClick={onRequest} className="w-full">Request Food</Button>
        )}
        {listing.status === "requested" && !actions && (
          <Badge variant="secondary" className="w-full justify-center py-1">Requested</Badge>
        )}
        {listing.status === "completed" && !actions && (
          <Badge variant="outline" className="w-full justify-center py-1">Completed</Badge>
        )}
      </CardFooter>
    </Card>
  );
};

export default FoodCard;
