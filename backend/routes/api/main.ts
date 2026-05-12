import express from "express"

import Authorise from "../../middlewares/authorise";
import CreateNewApi from "./create_api";

const ApiRouter: express.Router = express.Router();

ApiRouter.post("/create_api", Authorise, CreateNewApi);

export default ApiRouter;
