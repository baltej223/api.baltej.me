import { Response } from "express";
import mongoose from "mongoose";
import createJWT from "../utils/create_jwt.js";

export default function SendJWT(
  res: Response,
  _id: string | mongoose.Types.ObjectId,
  message = "success"
): void {
  if (!res || !_id) {
    res.status(500).send({ error: "Some Internal Server Error occured." });
    return;
  }

  const JWT = createJWT(_id);

  res.setHeader(
    "Set-Cookie",
    `login=${JWT}; HttpOnly; Secure; Max-Age=${7 * 24 * 60}; Path=/; SameSite=Strict`
  );
  res.status(200).json({ message });
}
