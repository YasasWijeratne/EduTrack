import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import { authMiddleware } from "./middleware/auth.middleware";

const app = express();

app.use(cors());
app.use(express.json());

//routes 
app.use("/auth", authRoutes);


//temp
app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});

app.get("/", (_req, res) => {
  res.send("EduTrack API Running");
});

export default app;