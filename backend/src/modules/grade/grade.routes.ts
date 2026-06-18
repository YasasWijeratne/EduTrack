import { Router } from "express";

import {
  grade,
  updateGradeHandler,
  getMine,
  getByAssignment,
  getCourseResults,
  getCourseResultsByCode
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


router.put(
  "/submission/:submissionId",
  authMiddleware,
  roleMiddleware("lecturer"),
  updateGradeHandler
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

router.get(
  "/course-code/:code",
  authMiddleware,
  getCourseResultsByCode
);


export default router;