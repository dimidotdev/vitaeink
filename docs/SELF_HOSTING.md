# Self-hosting VitaeInk

VitaeInk is a static, local-first application. Hosting serves HTML, CSS, JavaScript, and bundled fonts only; resume content never reaches the host.

## Docker Compose

```bash
docker compose up --build -d
curl --fail http://127.0.0.1:8080/
```

The container listens on port `8080` as an unprivileged user. Compose enables a read-only root filesystem, temporary Nginx runtime mounts, and `no-new-privileges`.

To expose it behind a reverse proxy, terminate TLS at the proxy and forward to `vitaeink:8080`. Preserve the security headers already defined in `nginx.conf` or replace them with equally restrictive values.

## Static hosting

```bash
pnpm install --frozen-lockfile
pnpm build
```

Serve `dist/` and route unknown navigation paths to `index.html`. Keep hashed files under `/assets/` immutable for one year and serve `index.html` with `Cache-Control: no-cache`.

Required behavior:

- HTTPS in production.
- SPA fallback to `index.html`.
- Correct `font/woff2`, JavaScript, CSS, JSON, and SVG content types.
- The CSP and related headers in `public/_headers`.
- No HTML injection or runtime configuration containing secrets.

## Cloudflare Workers Static Assets

Authenticate Wrangler, then run:

```bash
pnpm deploy:dry
pnpm deploy
```

`wrangler.jsonc` intentionally has no Worker script or binding. Cloudflare serves the static assets at the edge and applies `public/_headers`. The SPA fallback is configured with `not_found_handling: "single-page-application"`.

## Updating

1. Pull a tagged release or a reviewed commit.
2. Run `pnpm install --frozen-lockfile` and `pnpm check`.
3. Rebuild the container or redeploy the static assets.
4. Verify the response headers and complete one PDF export.

VitaeInk's document format is versioned. Users should download a JSON backup before a major update even though compatible migrations are expected to preserve local data.
