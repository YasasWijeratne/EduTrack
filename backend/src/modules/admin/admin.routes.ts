import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";
import {
  coursesForAdmin,
  createUser,
  dashboardStats,
  deleteUser,
  getUser,
  updateUser,
  usersByRole,
} from "./admin.controller";

const router = Router();

router.get("/dashboard/stats", authMiddleware, roleMiddleware("admin"), dashboardStats);
router.get("/users", authMiddleware, roleMiddleware("admin"), usersByRole);
router.post("/users", authMiddleware, roleMiddleware("admin"), createUser);
router.get("/users/:id", authMiddleware, roleMiddleware("admin"), getUser);
router.put("/users/:id", authMiddleware, roleMiddleware("admin"), updateUser);
router.delete("/users/:id", authMiddleware, roleMiddleware("admin"), deleteUser);
router.get("/courses", authMiddleware, roleMiddleware("admin"), coursesForAdmin);

export default router;
