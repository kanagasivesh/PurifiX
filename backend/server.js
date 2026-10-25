
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
  ]
}));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    app: "PurifiX Admin API",
    status: "ok"
  });
});

app.listen(PORT, () => {
  console.log(`PurifiX Admin API running on port ${PORT}`);
});
