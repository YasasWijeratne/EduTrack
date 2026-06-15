import { Router } from "express";
import {
  create,
  getMyCourses,
  getOne,
  update,
  remove,
  enroll,
  unenroll,
} from "./course.controller";

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
  getMyCourses
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

router.get("/:id", authMiddleware, getOne);

router.post(
  "/:id/enroll",
  authMiddleware,
  roleMiddleware("student"),
  enroll
);

router.post(
  "/:id/unenroll",
  authMiddleware,
  roleMiddleware("student"),
  unenroll
);

export default router;