import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: string;
      role: string;
      iat?: number;
      exp?: number;
    };
  }
}