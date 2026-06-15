import { Request, Response, NextFunction } from "express";

export const roleMiddleware = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role;

        if (!userRole) {
            return res.status(401).json({ message: "Unauthorized"});
        }

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({message: "Forbidden: Access denied"});
        }

        next();
    }
}