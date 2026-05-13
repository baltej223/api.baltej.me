import express from "express";
import * as z from "zod";

import CreateNewApiSchema from "../../schemas/routes/create_api.ts"
import { APIModel } from "../../db/database.ts"

async function CreateNewApi(req: express.Request, res: express.Response): Promise<express.Response> {
  let body;
  try {
    body = CreateNewApiSchema.parse(req.body);
  }
  catch (e) {
    if (e instanceof z.ZodError) {
      res.status(400).json({ message: "Bad Request.", error: e.toString() });
    }
  }

  // Now I need to check if its static or proxy,
  // and according to that, I need to write it to db

  let prev_api = await APIModel.find({
    $or: [
      { api_name: body?.api_name },
      { api_route: body?.api_route }
    ]
  }).exec();
  if (!(prev_api.length === 0)) {
    return res.status(400).json({
      message: "API with same name/route already exists."
    });
  }

  if (body?.api_type == "static") {
    try {
      atob(body.api_return_value as string);
    }
    catch (e) {
      return res.status(400).json({ message: "base64 return value not properly encoded." });
    }

    let new_api = new APIModel(
      {
        user: req.user_id,
        api_name: body.api_name,
        api_type: body.api_type,
        api_route: body.api_route,
        api_return_type: body.api_return_type,
        api_return_value: body.api_return_value
      }
    )
    try {
      await new_api.save()
    }
    catch (e) {
      res.status(500).json({
        message: "Internal Server Error",
        error: e?.toString() as string,
      });
    }

    return res.status(200).json({
      message: "Succesful",
      api_name: new_api.api_name,
      api_id: new_api._id
    });
  } else if (body?.api_type == "proxy") {
    let new_api = new APIModel(
      {
        user: req.user_id,
        api_name: body.api_name,
        api_type: body.api_type,
        api_route: body.api_route,
        api_return_type: body.api_return_type,
        api_proxy_url: body.api_proxy_url
      }
    )

    try {
      new_api.save();
    }
    catch (e) {
      res.status(500).json({
        message: "Internal Server Error",
        error: e?.toString() as string,
      });
    }
    return res.status(200).json({
      message: "Succesful",
      api_name: new_api.api_name,
      api_id: new_api._id
    });
  }

  return res.json(body);
}

export default CreateNewApi;
