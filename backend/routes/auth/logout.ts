import { Request, Response } from "express";

export default function HandleLogout(
  _req: Request,
  res: Response
): void {
  // Clear the login cookie by setting Max-Age to 0
  res.setHeader(
    "Set-Cookie",
    "login=; HttpOnly; Secure; Max-Age=0; Path=/; SameSite=None"
  );
  res.status(200).json({ message: "Logged out successfully" });
}
