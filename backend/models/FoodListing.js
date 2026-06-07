const mongoose = require("mongoose");

// Schema aligned with your existing TypeScript FoodListing type
// (id is provided by Mongo as _id)
const foodListingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    quantity: { type: String, required: true },
    type: { type: String, enum: ["veg", "non-veg"], required: true },
    location: { type: String, required: true },
    expiryTime: { type: String, required: true }, // ISO string
    contact: { type: String, required: true },
    donorId: { type: String, required: true },
    donorName: { type: String, required: true },
    createdAt: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "requested", "completed"],
      default: "available",
    },
  },
  {
    collection: "food_listings",
  }
);

module.exports = mongoose.model("FoodListing", foodListingSchema);
