require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const FoodListing = require("./models/FoodListing");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set. Please create a .env file in backend/.");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Simple health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// GET /foods - list all food listings
app.get("/foods", async (req, res) => {
  try {
    const items = await FoodListing.find().sort({ createdAt: -1 });
    const mapped = items.map((doc) => {
      const obj = doc.toObject();
      return { ...obj, id: obj._id, _id: undefined, __v: undefined };
    });
    res.json(mapped);
  } catch (err) {
    console.error("GET /foods error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /foods - create a new food listing
app.post("/foods", async (req, res) => {
  try {
    const data = req.body;
    const item = new FoodListing({
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
    });
    await item.save();
    const obj = item.toObject();
    res.status(201).json({ ...obj, id: obj._id, _id: undefined, __v: undefined });
  } catch (err) {
    console.error("POST /foods error:", err);
    res.status(400).json({ error: "Invalid data" });
  }
});

// PATCH /foods/:id - update parts of a listing (e.g. status)
app.patch("/foods/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await FoodListing.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error("PATCH /foods/:id error:", err);
    res.status(400).json({ error: "Invalid request" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
