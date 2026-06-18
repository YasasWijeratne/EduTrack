export interface Submission {
  _id: string;
  student: string | { _id: string; firstName: string; lastName: string; email: string };
  assignment: string | { _id: string; title: string };
  filePath: string;
  createdAt: string;
  updatedAt: string;
}
