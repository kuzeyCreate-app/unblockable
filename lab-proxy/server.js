const http = require("http");
const crypto = require("crypto");

const PROXY_HOST = "127.0.0.1";
const PROXY_PORT = 9090;
const UPSTREAM_HOST = "127.0.0.1";
const UPSTREAM_PORT = 9091;

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
if (!ADMIN_TOKEN) {
  console.error("Set ADMIN_TOKEN before starting the lab.");
  process.exit(1);
}

function safeEqual(a, b) {
  const aa = Buffer.from(String(a || ""));
  const bb = Buffer.from(String(b || ""));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

function json(res, status, body) {
  const data = Buffer.from(JSON.stringify(body, null, 2));
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": data.length,
    "cache-control": "no-store"
  });
  res.end(data);
}

// Demo upstream. It is deliberately local so this lab cannot relay arbitrary Internet traffic.
const upstream = http.createServer((req, res) => {
  const chunks = [];
  req.on("data", chunk => chunks.push(chunk));
  req.on("end", () => {
    json(res, 200, {
      service: "demo-upstream",
      method: req.method,
      url: req.url,
      receivedHeaders: req.headers,
      body: Buffer.concat(chunks).toString("utf8")
    });
  });
});

upstream.listen(UPSTREAM_PORT, UPSTREAM_HOST, () => {
  console.log(`Demo upstream: http://${UPSTREAM_HOST}:${UPSTREAM_PORT}`);
});

const proxy = http.createServer((req, res) => {
  const started = Date.now();

  if (!safeEqual(req.headers["x-admin-token"], ADMIN_TOKEN)) {
    json(res, 401, { error: "unauthorized" });
    return;
  }

  if (!req.url.startsWith("/proxy/demo")) {
    json(res, 404, {
      error: "unknown route",
      allowed: ["/proxy/demo"]
    });
    return;
  }

  const forwardedPath = req.url.slice("/proxy/demo".length) || "/";

  const headers = { ...req.headers };
  delete headers["x-admin-token"];
  delete headers["proxy-authorization"];
  delete headers["proxy-connection"];
  delete headers["connection"];
  headers.host = `${UPSTREAM_HOST}:${UPSTREAM_PORT}`;

  const upstreamReq = http.request({
    hostname: UPSTREAM_HOST,
    port: UPSTREAM_PORT,
    path: forwardedPath,
    method: req.method,
    headers
  }, upstreamRes => {
    const responseHeaders = { ...upstreamRes.headers };
    delete responseHeaders["connection"];
    delete responseHeaders["transfer-encoding"];

    res.writeHead(upstreamRes.statusCode || 502, responseHeaders);
    upstreamRes.pipe(res);

    upstreamRes.on("end", () => {
      console.log(JSON.stringify({
        time: new Date().toISOString(),
        method: req.method,
        path: req.url,
        status: upstreamRes.statusCode,
        durationMs: Date.now() - started
      }));
    });
  });

  upstreamReq.on("error", err => {
    console.error(err);
    if (!res.headersSent) {
      json(res, 502, { error: "upstream unavailable" });
    } else {
      res.end();
    }
  });

  req.pipe(upstreamReq);
});

proxy.listen(PROXY_PORT, PROXY_HOST, () => {
  console.log(`Private proxy lab: http://${PROXY_HOST}:${PROXY_PORT}`);
  console.log("Only /proxy/demo is available; arbitrary destinations are intentionally disabled.");
});
