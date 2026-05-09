import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../db/database.js";

const JWT_SECRET = "gbtw4hukfvhjksbfcjvkwbjq32knravewdqnlJEKCHVBFEIDNJFKV";

export default async function HandleVerify(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Get the JWT from the login cookie
    const token = req.cookies.login;

    if (!token) {
      res.status(401).json({ message: "No token found" });
      return;
    }

    // Verify the JWT
    const decoded = jwt.verify(token, JWT_SECRET) as { uid: string };

    // Optionally, fetch user data
    const user = await User.findById(decoded.uid).exec();

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Session valid",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
