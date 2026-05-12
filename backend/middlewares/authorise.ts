import { Request, Response, NextFunction } from "express";
import passport from "../auth_strategies/jwt_passport.js";

// express Request type extended
declare global {
  namespace Express {
    interface Request {
      user_id?: string;
    }
  }
}

export default function Authorise(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: any) => {
      if (err || !user) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      req.user_id = user.id; // or user._id depending on your JWT payload
      next();
    }
  )(req, res, next);
}
