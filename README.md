TastyBites backend (demo)

This is a small Node.js/Express demo backend included for local development.
It provides simple JSON-file backed endpoints for signup, login, menu, and orders.

Quick start (Windows PowerShell):

1. Open a PowerShell terminal in this folder:
   cd "c:\Users\HP\Desktop\TastyBites-Restuarant\Backend"

2. Install dependencies:
   npm install

3. Start the server:
   npm start

The server listens on port 4000 by default. Endpoints:
- GET /api/ping          -> health
- POST /api/signup       -> { username, password }
- POST /api/login        -> { username, password }
- GET  /api/menu         -> list of menu items
- POST /api/order        -> { items: [..], customer: {...} }
- GET  /api/orders       -> list orders

The server also serves static files from the project root (one level up) so you can open http://localhost:4000/tastybites.html to view the frontend while developing.

Notes:
- This is a demo-only backend. The authentication token is a simple UUID stored in the users JSON file — not secure for production.
- Passwords are hashed with bcryptjs.
- If you want a more robust backend (database, sessions, JWT, validations), I can help upgrade this later.
