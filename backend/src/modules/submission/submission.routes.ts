import { Router } from "express";
import { upload } from "../../middleware/upload.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

import {
  submit,
  update,
  getMine,
  getAllForAssignment,
  remove,
} from "./submission.controller";

const router = Router();

router.post(
  "/:assignmentId",
  authMiddleware,
  roleMiddleware("student"),
  upload.single("file"),
  submit
);

router.put(
  "/:assignmentId",
  authMiddleware,
  roleMiddleware("student"),
  upload.single("file"),
  update
);

router.get(
  "/:assignmentId/my",
  authMiddleware,
  roleMiddleware("student"),
  getMine
);

router.get(
  "/assignment/:assignmentId",
  authMiddleware,
  roleMiddleware("lecturer"),
  getAllForAssignment
);

router.delete(
  "/:assignmentId",
  authMiddleware,
  roleMiddleware("student"),
  remove
);

export default router