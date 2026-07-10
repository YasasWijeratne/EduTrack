import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import adminRoutes from "./modules/admin/admin.routes";
import { authMiddleware } from "./middleware/auth.middleware";
import { roleMiddleware } from "./middleware/role.middleware";
import courseRoutes from "./modules/course/course.routes";
import assignmentRoutes from "./modules/assignment/assignment.routes";
import submissionRoutes from "./modules/submission/submission.routes";
import gradeRoutes from "./modules/grade/grade.routes";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  authMiddleware,
  express.static(
    path.join(__dirname, "../uploads")
  )
);

//routes 
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/courses", courseRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/submissions", submissionRoutes);
app.use("/grades", gradeRoutes);

app.get("/", (_req, res) => {
  res.send("EduTrack API Running");
});

export default app;