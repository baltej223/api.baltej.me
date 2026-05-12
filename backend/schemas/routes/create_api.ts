import { z } from "zod";

const schema = z.object({
  api_name: z.string(),

  api_type: z.enum(["static", "proxy"]), // "module"

  api_return_type: z.enum([
    "application/xml",
    "application/json",
    "text/html",
    "text/plain",
  ]),

  api_route: z.string(),

  // Required only for static APIs
  api_return_value: z.string().optional(), // base 64 encoded

  // For proxy apis
  api_proxy_url: z.string().url().optional(),
}).superRefine((data, ctx) => {
  if (data.api_type === "static" && !data.api_return_value) {
    ctx.addIssue({
      code: "custom",
      path: ["api_return_value"],
      message: "api_return_value is required when api_type is 'static'",
    });
  }

  if (data.api_type === "proxy" && !data.api_proxy_url) {
    ctx.addIssue({
      code: "custom",
      path: ["api_proxy_url"],
      message: "api_proxy_url is required when api_type is 'proxy'",
    });
  }
});

export default schema;

