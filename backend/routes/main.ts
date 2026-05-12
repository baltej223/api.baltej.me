import express from "express";

import defaultHandler from "./defaultHandler.ts";

let defaultRouter: express.Router = express.Router();

defaultRouter.get("/:id", defaultHandler);

export default defaultRouter;
