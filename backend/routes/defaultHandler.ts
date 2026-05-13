import express from "express";
import { APIModel } from "../db/database.ts";
import http from "http";
import https from "https";
import { URL } from "url";

const hopByHop = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
]);

export default async function defaultHandler(req: express.Request, res: express.Response): Promise<void> {
  let request_path = req.path.replace('/', '');

  let matchingDoc = await APIModel.findOne({
    api_route: request_path
  });

  if (matchingDoc == null) {
    res.status(404).json({ message: "Route Not found." });
    return;
  }

  if (matchingDoc.api_type == "static") {
    let return_type = matchingDoc.api_return_type + "; charset=utf-8";
    let encoded_return_value = matchingDoc.api_return_value;
    let return_value = atob(encoded_return_value);

    res.header("Content-Type", return_type);
    res.status(200).send(return_value);
    return;
  }
  else if (matchingDoc.api_type == "proxy") {
    let proxy_url = matchingDoc.api_proxy_url;
    try {
      const target = new URL(proxy_url);
      const client = target.protocol === "https:" ? https : http;

      const proxyReq = client.request(
        target,
        {
          method: req.method,
          headers: {
            ...Object.fromEntries(
              Object.entries(req.headers).filter(([key, value]) => {
                if (!value) return false;
                const lower = key.toLowerCase();
                return lower !== "host" && !hopByHop.has(lower);
              })
            ),
            host: target.host,
          },
        },
        (proxyRes) => {
          res.status(proxyRes.statusCode || 502);

          for (const [key, value] of Object.entries(proxyRes.headers)) {
            if (!value) continue;
            if (hopByHop.has(key.toLowerCase())) continue;

            if (Array.isArray(value)) {
              res.setHeader(key, value.join(", "));
            } else {
              res.setHeader(key, value);
            }
          }

          // Important: send the upstream bytes as-is.
          // If upstream says gzip/br/zstd, that exact encoding is preserved here.
          proxyRes.pipe(res);
        }
      );

      proxyReq.on("error", (err) => {
        console.error("Proxy error:", err);
        if (!res.headersSent) {
          res.status(500).json({ message: "Proxy Error" });
        } else {
          res.end();
        }
      });

      if (req.method !== "GET" && req.method !== "HEAD") {
        req.pipe(proxyReq);
      } else {
        proxyReq.end();
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Proxy Error" });
      return;
    }
  }

  // return res.json({ message: "Some Error Occured." });
}
