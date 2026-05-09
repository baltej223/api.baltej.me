import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import pino from "pino-http";

dotenv.config();

import { connectDB } from "./db/database.js";
import HandleLogin from "./routes/auth/login/main.js";
// import CreateAccount from "./routes/create_acc.js";
import VerifyJson from "./middlewares/JSON_Verify.js";

connectDB();

const app: Express = express();
app.use(express.json());
app.use(VerifyJson);
app.use(pino());

app.post("/login", HandleLogin);
// app.post("/create_account", CreateAccount);

app.get("/", (_req: Request, res: Response) => res.send("Hearbeat Received!"));

const port = process.env.PORT;
if (!port) {
  throw new Error("PORT environment variable is not set");
}

app.listen(port, () => {
  console.log("Running on port", port);
});
