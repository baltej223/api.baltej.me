import { Request, Response, NextFunction } from "express";

export default function VerifyJson(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof SyntaxError && "status" in err && err.status === 400 && "body" in err) {
    console.error("Invalid JSON received:", err.message);

    res.status(400).json({ error: "Invalid JSON format" });
    return;
  }

  next();
}
