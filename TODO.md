# TODO

- [x] Fix sidebar usability: add Navbar button to open sidebar and wire to AppShell.

- [ ] Improve mobile UX: add/remove backdrop and ensure sidebar closes appropriately.
- [ ] Keep provider detection consistent on Profile page (support both `role === "provider"` and stored `isProvider`).
- [ ] Run lint/typecheck and verify sidebar + profile provider UI.

## Essential Marketplace Modules (Scaffolding-first, PayPal placeholders)
- [ ] Add marketplace JSON models + DB helpers (orders/escrow, invoices, verifications, disputes, bookings/calendar, messages, search)
- [ ] Add API routes for each module under `app/api/*` (mock external integrations)
- [ ] Add UI scaffolds/pages for: provider verification, booking/availability, dispute center, messaging room, search/discovery
- [ ] Wire navigation links into Sidebar for the new pages
- [ ] Run `npm run lint` + `npm run build` to confirm compilation

