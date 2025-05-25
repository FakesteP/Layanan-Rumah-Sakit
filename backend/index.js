import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import layananRoute from "./routes/layananRoute.js";
import antrianRoute from "./routes/antrianRoute.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Konfigurasi CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://layanan-rumah-sakit-dot-b-01-450713.uc.r.appspot.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(cookieParser());
app.use(express.json());

app.use("/antrian", antrianRoute);
app.use("/layanan", layananRoute);
app.use("/users", userRoute);
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

app.listen(PORT, () =>
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`)
);
