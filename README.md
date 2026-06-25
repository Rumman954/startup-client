# StartupForge Client

Frontend for the StartupForge — Startup Team Builder Platform.

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router v7
- Better Auth (Client)
- Framer Motion
- Recharts
- Axios

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env`
3. Install dependencies:

```bash
npm install
```

4. Start development server:

```bash
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |

## Features

- Public pages: Home, Browse Startups, Browse Opportunities
- Authentication: Login, Register (Credential + Google)
- Founder Dashboard: Startup profile, opportunities, applications
- Collaborator Dashboard: Browse & apply, track applications
- Admin Dashboard: Users, startups, transactions
- Stripe premium payment integration
- Server-side pagination & search
- Framer Motion animations
- Fully responsive design

## Build

```bash
npm run build
```

Deploy to Vercel, Netlify, or Firebase Hosting.

## Live Site

Update this URL after deployment.

## Admin Credentials

- Email: `admin@startupforge.com` (configure on server)
- Password: Set via server `ADMIN_PASSWORD` env variable
