# StartupForge Client

Frontend for the StartupForge — Startup Team Builder Platform (StartUp Labs branding).

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router v7
- Better Auth (Client)
- Framer Motion
- Recharts
- Axios

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (e.g. `http://localhost:5000` or Render URL) |

## Features

- Public: Home, Browse Startups, Browse Opportunities, Startup/Opportunity Details
- Auth: Login & Register (Credential + Google OAuth)
- ImgBB file upload on Register, Profile, and Startup logo
- Founder / Collaborator / Admin dashboards with charts
- Stripe premium checkout
- Server-side pagination, search & filters
- Framer Motion on Home page
- Dark / light theme toggle
- Responsive design (mobile, tablet, desktop)
- SPA routing: `vercel.json` + `public/_redirects`

## Build & Deploy

```bash
npm run build
```

Deploy to **Vercel** (recommended). Set `VITE_API_URL` to your production API.

See root [DEPLOYMENT.md](../DEPLOYMENT.md) for full instructions.

## Live Site

| | |
|---|---|
| **Production** | _Add your Vercel URL after deployment_ |
| **GitHub** | https://github.com/Rumman954/startup-client |

## Admin Credentials

| | |
|---|---|
| **Email** | `admin@startuplabs.com` |
| **Password** | `Admin@123` (configured on server `ADMIN_EMAIL` / `ADMIN_PASSWORD`) |
