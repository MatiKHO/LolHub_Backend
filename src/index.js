import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import { createServer } from "http";

import { initializeSocket } from "./lib/socket.js";

import { connectDB } from "./lib/db.js";

import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statsRoutes from "./routes/stat.route.js";
import riotRoutes from "./routes/riot.route.js";

import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT;

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(cors({
  origin: "https://lolhubofficial.netlify.app",
  credentials: true,
}));
app.use(morgan("dev"));

app.use(express.json()); // to parse req.body
app.use(clerkMiddleware()); // this will add auth to req obj => req.auth.userId
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "temp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max file(s) size
    },
  })
); // to parse file uploads

// App - Routes
app.get("/", (req, res) => {
  res.send("This is the API");
});
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api", riotRoutes);




// App - errors handler
app.use(errorHandler);

// App - Listen server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  connectDB();
});


