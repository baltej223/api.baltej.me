import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import pino from "pino-http";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

import { connectDB } from "./db/database.ts";
import VerifyJson from "./middlewares/JSON_Verify.ts";
import authRouter from "./routes/auth/main.ts";
import ApiRouter from "./routes/api/main.ts";
import defaultRouter from "./routes/main.ts"

connectDB();

const app: Express = express();
app.use(express.json());
app.use(cookieParser());
app.use(VerifyJson);
app.use(pino());
app.use(
  cors({
    origin: "*", // your frontend URL
    credentials: true,
  })
);


app.get("", (_req: Request, res: Response) => res.json({ message_from_space: "Im a teapot" }));

app.use("/auth", authRouter);
app.use("/api", ApiRouter);

app.use("/", defaultRouter);

const port = process.env.PORT;
if (!port) {
  throw new Error("PORT environment variable is not set");
}

if (process.env.VERCEL !== "1") {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
