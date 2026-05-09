import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import pino from "pino-http";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

import { connectDB } from "./db/database.ts";
import HandleLogin from "./routes/auth/login/main.ts";
import HandleVerify from "./routes/verify.ts";
import HandleLogout from "./routes/logout.ts";
// import CreateAccount from "./routes/create_acc.ts";
import VerifyJson from "./middlewares/JSON_Verify.ts";

connectDB();

const app: Express = express();
app.use(express.json());
app.use(cookieParser());
app.use(VerifyJson);
app.use(pino());
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,
  })
);

app.post("/login", HandleLogin);
app.get("/verify", HandleVerify);
app.post("/logout", HandleLogout);

// app.post("/register", CreateAccount);

app.get("/", (_req: Request, res: Response) => res.send("Hearbeat Received!"));

const port = process.env.PORT;
if (!port) {
  throw new Error("PORT environment variable is not set");
}

app.listen(port, () => {
  console.log("Running on port", port);
});
