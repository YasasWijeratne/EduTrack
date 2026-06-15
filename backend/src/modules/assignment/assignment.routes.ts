import { Router } from "express";

import {
  create,
  getMyAssignments,
  getByCourse,
  update,
  remove,
} from "./assignment.controller";

import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("lecturer"),
  create
);

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("lecturer"),
  getMyAssignments
);

router.get(
  "/course/:courseId",
  authMiddleware,
  getByCourse
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("lecturer"),
  update
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("lecturer"),
  remove
);

export default router;