import { Request, Response } from "express";
import mongoose from "mongoose";
import { User, IUser } from "../db/database.js";
import SendJWT from "../utils/send_jwt.js";

interface Profile {
  name?: string;
  bio?: string;
  interests?: string;
}

interface CreateAccountBody {
  email?: string;
  password?: string;
  profile?: Profile;
}

export default async function CreateAccount(
  req: Request<Record<string, never>, Record<string, never>, CreateAccountBody>,
  res: Response
): Promise<void> {
  const body = req.body;

  if (
    body === undefined ||
    body.email === undefined ||
    body.password === undefined
  ) {
    res.status(401).json({
      error: "Parameters missing",
    });
    return;
  }

  const email = body.email;
  const password = body.password;

  let user: IUser | undefined;

  try {
    const existingUser = await User.find({ email, password }).exec();
    if (existingUser.length !== 0) {
      user = existingUser[0];
      if (user._id) {
        SendJWT(res, user._id as mongoose.Types.ObjectId, "user already exists, logined.");
      }
      return;
    }

    user = await User.create({
      email,
      password,
    });

    console.log(user);
  } catch (e) {
    res.status(500).send("Internal Server Error");
    return;
  }

  if (user._id) {
    SendJWT(res, user._id as mongoose.Types.ObjectId, "User logined successfully");
  }
}
