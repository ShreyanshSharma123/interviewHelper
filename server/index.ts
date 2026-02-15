import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import analysisRoutes from "./routes/analysis.js";

dotenv.config();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000;

// ─── Middleware ───
app.use(cors());
app.use(express.json());

// ─── Routes ───
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Interview Helper API is running" });
});

app.use("/api", analysisRoutes);

// ─── Global error handler ───
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});