import { Schema, Document } from "mongoose";
import * as z from "zod";
import APISchema from "../schemas/routes/create_api";

type APIType = z.infer<typeof APISchema>;

export interface API extends Document, APIType {
  user: string
}

const ApiDbSchema = new Schema<API>({
  user: {
    type: String,
    required: true,
    trim: true,
  },

  api_name: {
    type: String,
    required: true,
    trim: true,
  },

  api_type: {
    type: String,
    enum: ["static", "proxy", "module"],
    required: true,
  },
  api_route: {
    type: String,
    required: true,
  },

  api_return_type: {
    type: String,
    enum: [
      "application/xml",
      "application/json",
      "text/html",
      "text/plain",
    ],
    required: true,
  },

  //used when api_type ius "static"
  api_return_value: {
    type: String,
    required: function() {
      return this.api_type === "static";
    },
  },

  //used when api_type is "proxy"
  api_proxy_url: {
    type: String,
    required: function() {
      return this.api_type === "proxy";
    },
  },
});

export default ApiDbSchema;
