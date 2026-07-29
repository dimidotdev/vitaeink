# Contributing

Thank you for helping VitaeInk stay private, accessible, portable, and honest about ATS behavior.

## Before opening a pull request

1. Discuss large features in an issue. Small fixes can go directly to a focused PR.
2. Keep resume content structured; do not introduce arbitrary HTML or coordinate-based layout.
3. Preserve a linear semantic reading order and keyboard alternatives for every interaction.
4. Do not add analytics, remote fonts, tracking, or server-side resume storage.
5. Add or update tests for behavior changes.

```bash
corepack enable
pnpm install
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
```

Use Conventional Commit messages when practical, for example `feat(editor): add certification ordering` or `fix(print): preserve A4 margins`.

By contributing, you agree that your contribution is licensed under Apache-2.0 and that you will follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
