import { Request, Response, NextFunction } from "express";
import passport from "../auth_strategies/jwt_passport.js";

export default function Authorise(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  passport.authenticate("jwt", { session: false })(req, res, next);
}
