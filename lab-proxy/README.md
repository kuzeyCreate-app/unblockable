# Local proxy study lab

This folder is a deliberately constrained reverse-proxy lab. It binds only to `127.0.0.1`, requires an admin token, and forwards only to the included local demo upstream. There is no arbitrary URL input and no `CONNECT` tunnel.

## Run

Requires Node.js 18+.

### macOS / Linux

```bash
cd lab-proxy
ADMIN_TOKEN="choose-a-long-random-token" npm start
```

### PowerShell

```powershell
cd lab-proxy
$env:ADMIN_TOKEN="choose-a-long-random-token"
npm start
```

The process starts:

- proxy: `http://127.0.0.1:9090`
- demo upstream: `http://127.0.0.1:9091`

## Test

```bash
curl -H "x-admin-token: choose-a-long-random-token" \
  "http://127.0.0.1:9090/proxy/demo/hello?lesson=1"
```

You should receive JSON from the demo upstream showing the request that arrived after passing through the proxy.

Try a POST:

```bash
curl -X POST \
  -H "x-admin-token: choose-a-long-random-token" \
  -H "content-type: text/plain" \
  --data "hello through the proxy" \
  "http://127.0.0.1:9090/proxy/demo/echo"
```

## What to study

1. Compare the request URL seen by the proxy with the URL seen by the upstream.
2. Inspect which headers are forwarded and which are removed.
3. Change a harmless header and watch it appear at the upstream.
4. Remove the admin token and observe the `401`.
5. Request a route other than `/proxy/demo` and observe that it is rejected.
6. Read the JSON request log printed by the proxy.

## Why it is constrained

A real open proxy that accepts arbitrary destinations is easy to abuse and can become an SSRF or network-evasion primitive. This lab keeps the useful HTTP mechanics while removing that dangerous part.
