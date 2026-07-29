# Privacy

VitaeInk is local-first by design.

- Resume content is stored in the browser's IndexedDB on the current device.
- The hosted application has no account system, analytics, tracking pixels, cloud database, advertising, or telemetry.
- Fonts and application assets are bundled and served from the same origin.
- Import, editing, validation, preview, JSON backup, and PDF preparation happen in the browser.
- Printing uses the browser's print subsystem. Choosing a local “Save as PDF” destination does not require VitaeInk to receive the document.

The hosting provider can still receive ordinary network metadata when application files are requested, such as IP address, user agent, timestamp, and requested asset path. A self-hosted operator controls its own access logs and retention.

Clearing site data, using a private browsing session, or removing the browser profile can delete the local resume. Download JSON backups regularly and store them securely; the backup contains the complete resume in plain text.
