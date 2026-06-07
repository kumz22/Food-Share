import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ApiFood {
  id: number;
  title: string;
  location: string;
}

const API_BASE = "http://localhost:4000";

const ApiDemo: React.FC = () => {
  const [foods, setFoods] = useState<ApiFood[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  const loadFoods = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/foods`);
      if (!res.ok) throw new Error(`GET /foods failed (${res.status})`);
      const data: ApiFood[] = await res.json();
      setFoods(data);
    } catch (err: any) {
      setError(err.message || "Failed to load foods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFoods();
  }, []);

  const handleAdd = async () => {
    if (!title || !location) {
      alert("Please enter title and location");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/foods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, location }),
      });
      if (!res.ok) throw new Error(`POST /foods failed (${res.status})`);
      const created: ApiFood = await res.json();
      setFoods((prev) => [...prev, created]);
      setTitle("");
      setLocation("");
    } catch (err: any) {
      setError(err.message || "Failed to add food");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-heading">
            API Demo (GET & POST /foods)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This section calls a simple Node HTTP server running at
            {" "}
            <code>http://localhost:3000</code>.
          </p>

          <div className="flex flex-col md:flex-row gap-3 items-start">
            <Input
              placeholder="Food title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="md:max-w-xs"
            />
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="md:max-w-xs"
            />
            <Button onClick={handleAdd} disabled={loading}>
              Add via POST /foods
            </Button>
            <Button variant="outline" onClick={loadFoods} disabled={loading}>
              Refresh (GET /foods)
            </Button>
          </div>

          {error && (
            <p className="text-sm text-red-500">Error: {error}</p>
          )}

          {loading && (
            <p className="text-sm text-muted-foreground">Loading...</p>
          )}

          <ul className="space-y-2">
            {foods.map((f) => (
              <li
                key={f.id}
                className="border rounded-md px-3 py-2 text-sm flex justify-between"
              >
                <span className="font-medium">{f.title}</span>
                <span className="text-muted-foreground">{f.location}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
};

export default ApiDemo;
