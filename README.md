# HopeHive

**Show up. Serve together.** HopeHive is a community platform where neighbours create, join and track social service events in their local area, such as a Winter Clothes Distribution in Mirpur 10 or a Blanket Distribution in Mohammadpur, Dhaka.

- **Live site:** https://hopehive-client.vercel.app/
- **Server repository:** https://github.com/sakibrafi2002/hopehive-server
- **Client repository:** https://github.com/sakibrafi2002/hopehive-client

## Features

- **Create social service events** with a title, description, event type, thumbnail, location and a future-only date. Past dates are blocked in the date picker and again on the server.
- **Join an event in one click.** Anyone can read an event page, but joining needs an account. A volunteer can join an event only once, and the database enforces it.
- **Track what you joined.** The Joined Events page lists your events sorted by date, with a Completed badge once the day has passed.
- **Manage your own events.** Update or delete any event you created. Ownership is checked on the server with a signed JWT, so nobody can edit another person's event.
- **Search and filter** upcoming events by title or location, filter by event type and sort by date. Filters live in the URL, so a filtered view survives a reload and can be shared.
- **Light and dark themes** with a toggle in the navbar. The choice is saved and applied before the first paint, so there is no flash.
- **Profile page** to view your account and update your display name and picture.
- **Loading skeletons** on every list and form, and friendly empty and error states.
- **Reload-safe routing.** Reloading any route works, and a logged-in user stays on a private page after a reload.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router), TypeScript |
| UI | Tailwind CSS 4 and daisyUI 5 with two custom themes |
| Auth | BetterAuth with the MongoDB adapter, email and password plus Google sign-in |
| API security | BetterAuth JWT plugin. The Express server verifies tokens against the JWKS endpoint |
| Feedback | react-hot-toast and SweetAlert2 (no browser `alert()` anywhere) |
| Server | Express and MongoDB, in the separate `hopehive-server` repository |

## How authentication and JWT fit together

1. BetterAuth runs inside this Next.js app (`/api/auth/*`) and stores users and sessions in MongoDB.
2. For a protected API call, the browser asks BetterAuth for a short-lived JWT (`authClient.token()`), keeps it in memory and sends it as `Authorization: Bearer <token>`.
3. The Express server verifies the signature with the public keys at `/api/auth/jwks`, then reads the user's email from the verified token. It never trusts an email sent in the request body.
4. Private pages (`/create-event`, `/manage-events`, `/joined-events`, `/profile`) are guarded by middleware plus a server-side session check, so reloading them keeps a logged-in user in place.

## Run it locally

You need Node 20 or newer and a MongoDB database (Atlas free tier works).

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

Start the API from the server repository first (see its README), and seed it with `npm run seed` so the home page has events.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | URL of the Express API |
| `BETTER_AUTH_URL` | Public URL of this app. Must equal the server's `AUTH_BASE_URL` |
| `BETTER_AUTH_SECRET` | Long random string (`openssl rand -base64 32`) |
| `MONGODB_URI` | MongoDB connection string, including a database name |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google sign-in. Redirect URI: `<BETTER_AUTH_URL>/api/auth/callback/google` |

## Deploy on Vercel

1. Import this repository in Vercel. The Next.js preset needs no extra settings and no rewrite rules, so every route works on reload.
2. Add the environment variables above. Set `BETTER_AUTH_URL` to your final Vercel URL.
3. In the server's environment, set `AUTH_BASE_URL` to that same URL and add it to `CLIENT_URL`.
4. In Google Cloud Console, add `https://YOUR-CLIENT.vercel.app/api/auth/callback/google` as an authorised redirect URI.

## Scripts

- `npm run dev` starts the development server
- `npm run build` creates a production build
- `npm run start` serves the production build
- `npm run typecheck` runs the TypeScript compiler without emitting files
