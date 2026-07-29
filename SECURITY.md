# Security policy

## Supported version

Security fixes target the latest release on the `main` branch.

## Reporting a vulnerability

Please do not open a public issue for a suspected vulnerability. Use GitHub's private vulnerability reporting for `dimidotdev/vitaeink`. Include the affected commit, impact, reproduction steps, and any suggested mitigation. You should receive an acknowledgment within seven days.

## Security model

VitaeInk has no backend, account, authentication token, or secret. Imported JSON is size-limited and strictly validated. React escapes resume content, custom HTML is not supported, and links are emitted only for HTTP(S) URLs. Production configurations include a restrictive Content Security Policy and run the Docker image without root privileges.

Resume backups are unencrypted plain JSON. Users are responsible for protecting exported files and local device access.
