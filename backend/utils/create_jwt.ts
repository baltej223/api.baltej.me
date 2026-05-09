import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const JWT_SECRET = "gbtw4hukfvhjksbfcjvkwbjq32knravewdqnlJEKCHVBFEIDNJFKV";

export default function createJWT(userid: string | mongoose.Types.ObjectId): string {
  const payload = { uid: userid };
  const generatedToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });

  return generatedToken;
}
