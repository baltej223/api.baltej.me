import { Schema, Document } from "mongoose";

export interface IUserProfile {
  name: string;
  bio: string;
  interests: string;
}

export interface IUser extends Document {
  email: string;
  password: string;
  age?: number;
  profile: IUserProfile;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export default userSchema;
