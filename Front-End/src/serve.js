const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: "*" })); // Allow all origins for development
app.use(express.json());

// Example route
app.get("/api/locations", (req, res) => {
    res.json([{ id: 1, name: "Field 1", address: "123 Street", capacity: 20 }]);
});

// Start the server
const PORT = 8000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running on http://0.0.0.0:${PORT}`);
});
