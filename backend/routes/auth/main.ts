import express from "express";
import HandleLogin from "./login";
import HandleVerify from "./verify";
import HandleLogout from "./logout";

let authRouter
  : express.Router = express.Router();

authRouter.post("/login", HandleLogin);
authRouter.get("/verify", HandleVerify);
authRouter.post("/logout", HandleLogout);

export default authRouter;
