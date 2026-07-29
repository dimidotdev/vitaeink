<p align="center">
  <img src="public/icons/vitaeink.svg" width="72" height="72" alt="VitaeInk logo">
</p>

<h1 align="center">VitaeInk</h1>

<p align="center"><strong>A private, open-source studio for resumes that read beautifully — by people and machines.</strong></p>

<p align="center">
  <a href="README.pt-BR.md">Português</a> ·
  <a href="https://vitaeink.matheus-silva-74d.workers.dev">Live studio</a> ·
  <a href="#run-locally">Run locally</a> ·
  <a href="docs/SELF_HOSTING.md">Self-hosting</a> ·
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

VitaeInk is a local-first resume builder. It opens with a complete example, updates a real semantic HTML preview as you type, and exports selectable PDF text through the browser's native print engine. There are no accounts, analytics, cloud databases, or external font requests.

The studio interface uses shadcn/ui's Base Nova preset with Base UI primitives. The resume renderer remains an isolated semantic HTML/CSS boundary so interface styling cannot change its ATS reading order or print output.

Try the hosted version at **[vitaeink.matheus-silva-74d.workers.dev](https://vitaeink.matheus-silva-74d.workers.dev)**. The hosted studio uses the same public build and still stores resume content only on your device.

## Why VitaeInk

- **Private by default:** resume data stays in IndexedDB on your device.
- **ATS-friendly by construction:** one-column templates, conventional headings, linear DOM order, real lists, visible links, and no canvas-rendered text.
- **Honest checks:** practical findings instead of an invented compatibility score or a promise no product can make.
- **Portable:** import and export a versioned JSON backup; print on A4 or US Letter.
- **Customizable without layout traps:** three templates, three locally hosted open-source typefaces, density, text size, line height, section ordering, visibility, and accessible accent colors.
- **Self-hostable:** the same static build runs on Linux, Windows, macOS, Docker, Nginx, or Cloudflare Workers.
- **Accessible:** keyboard-first controls, semantic landmarks, visible focus, reduced-motion support, and WCAG contrast checks.

## Run locally

Requirements: Node.js 22.13+ and pnpm 11.

```bash
corepack enable
pnpm install
pnpm dev
```

Open `http://localhost:5173`.

## Docker

```bash
docker compose up --build
```

Open `http://localhost:8080`. The runtime image uses unprivileged Nginx, a read-only filesystem, and no backend service.

## Cloudflare Workers

```bash
pnpm install
pnpm deploy
```

Wrangler deploys `dist/` as Workers Static Assets with SPA fallback. No KV, D1, secret, or server-side resume processing is involved.

## Quality checks

```bash
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
pnpm deploy:dry
```

The browser suite covers the editing/persistence journey, accessibility, print media, PDF text extraction, and PDF structure. See [self-hosting](docs/SELF_HOSTING.md) for production headers and deployment notes.

## ATS scope

VitaeInk optimizes the document structure for automatic readers; it does not claim “100% ATS compatibility.” Parsing still varies by employer, vendor, browser, language, and job portal. Native print keeps text searchable and selectable, but browser PDFs are not guaranteed to be fully tagged PDF/UA documents. Always review the final PDF and keep a JSON backup.

## Project structure

```text
src/domain/             versioned schema, presentation rules, document checks
src/storage/            IndexedDB repository
src/components/ui/      shadcn Base Nova interface primitives
src/features/editor/    accessible structured editing
src/features/preview/   shared semantic preview and print renderer
src/styles/             application, document, and print styles
e2e/                    browser and PDF contracts
```

## Security and privacy

User content is rendered by React as text. VitaeInk does not accept custom HTML, executes no imported code, and only creates links for complete HTTP(S) URLs. JSON imports are size-limited and validated against a strict, versioned schema. Read [PRIVACY.md](PRIVACY.md) and [SECURITY.md](SECURITY.md).

## License

VitaeInk is licensed under [Apache-2.0](LICENSE). Bundled fonts and Remix Icon interface symbols retain their own licenses; see [third-party notices](THIRD_PARTY_NOTICES.md).
