ADMINDASHBOARD - Angular 20 standalone starter kit (zone-less)
=============================================================

How to run:
1. Install dependencies: npm install
2. Start dev server: npm run start
3. Open http://localhost:4200

Notes:
- This starter uses standalone bootstrap (no AppModule).
- zone.js is intentionally omitted for zone-less operation.
- CoreModule is provided via importProvidersFrom in main.ts so interceptors are registered.
- UI is plain HTML (no Angular Material).
