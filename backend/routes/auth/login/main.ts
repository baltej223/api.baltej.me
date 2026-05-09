import { Request, Response } from "express";
import mongoose from "mongoose";
import { User, IUser } from "../../../db/database.js";
import SendJWT from "../../../utils/send_jwt.js";

interface LoginBody {
  email?: string;
  password?: string;
}

export default async function HandleLogin(
  req: Request<Record<string, never>, Record<string, never>, LoginBody>,
  res: Response
): Promise<void> {
  const body = req.body;

  if (
    body === undefined ||
    body.email === undefined ||
    body.password === undefined
  ) {
    res.status(400).json({
      error: "Bad Request",
      message: "Not all necessary parameters were passed.",
    });
    return;
  }

  const email = body.email;
  const password = body.password;

  let user: IUser[];

  try {
    user = await User.find({ email, password }).exec();
  } catch (e) {
    res.status(500).json({
      error: "Internal Database Error",
      message: e,
    });
    return;
  }

  if (user.length !== 0 && user[0]._id) {
    SendJWT(res, user[0]._id as mongoose.Types.ObjectId);
  } else {
    res.status(400).send("FORBIDDEN!");
  }
}
