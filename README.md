# Panpata Client

Modern real estate platform frontend built with Next.js App Router, Tailwind CSS, and TypeScript.

## Tech Stack

- **Framework:** Next.js (App Router, SSG & ISR)
- **Styling:** Tailwind CSS, Lucide Icons
- **State & Data Fetching:** React Query, Native Fetch with ISR
- **Auth & Forms:** EmailJS, OAuth Integration

## Scripts

```bash
# Development
npm run dev

# Production Build
npm run build

# Start Production Server
npm run start

# Build & Run Production locally
npm run prod
```

## Environment Variables

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_API_URL="http://localhost:3030/api"
NEXT_PUBLIC_EMAILJS_SERVICE_ID=""
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=""
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=""
```

## Features & Caching Architecture

- **Home Page (`/`)**: ISR (60s revalidation)
- **Properties (`/property/[id]`)**: SSG + ISR on-demand generation
- **Agents (`/agents` & `/agent/[id]`)**: ISR pre-rendered profile & search islands
