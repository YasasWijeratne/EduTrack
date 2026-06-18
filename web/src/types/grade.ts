export interface Grade {
  _id: string;
  submission: string | { _id: string; assignment?: string | { _id: string; title: string } };
  marks: number;
  grade: string;
  gradedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseResult {
  course: string;
  assignmentsGraded: number;
  marks: number;
  grade: string;
  status: string;
  performance: string;
  message?: string;
}
