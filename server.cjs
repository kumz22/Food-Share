const http = require("http");
const { parse } = require("url");

const PORT = process.env.PORT || 4000;

let foods = [
  { id: 1, title: "Fresh Vegetable Biryani", location: "Mumbai, Andheri West" },
  { id: 2, title: "Assorted Sandwiches", location: "Delhi, Connaught Place" },
  { id: 3, title: "Dal & Rice Combo", location: "Bangalore, Koramangala" },
];

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    ...CORS_HEADERS,
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const { pathname } = parse(req.url || "", true);

  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS_HEADERS);
    return res.end();
  }

  if (pathname === "/foods" && req.method === "GET") {
    return sendJson(res, 200, foods);
  }

  if (pathname === "/foods" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const data = body ? JSON.parse(body) : {};
        const nextId = foods.length ? foods[foods.length - 1].id + 1 : 1;
        const newFood = {
          id: nextId,
          title: data.title || "Untitled Item",
          location: data.location || "Unknown Location",
        };
        foods.push(newFood);
        sendJson(res, 201, newFood);
      } catch (err) {
        sendJson(res, 400, { error: "Invalid JSON" });
      }
    });
    return;
  }

  sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Simple API server running on http://localhost:${PORT}`);
});
