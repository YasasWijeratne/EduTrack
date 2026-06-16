import { Router } from "express";

import {
  grade,
  getMine,
  getByAssignment,
  getCourseResults
} from "./grade.controller";

import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";


const router = Router();


router.post(
  "/submission/:submissionId",
  authMiddleware,
  roleMiddleware("lecturer"),
  grade
);


router.get(
  "/my",
  authMiddleware,
  roleMiddleware("student"),
  getMine
);


router.get(
  "/assignment/:assignmentId",
  authMiddleware,
  roleMiddleware("lecturer"),
  getByAssignment
);

router.get(
  "/course/:courseId",
  authMiddleware,
  getCourseResults
);


export default router;