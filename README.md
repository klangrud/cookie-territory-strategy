# Cookie Territory Strategy

Interactive map tool for planning Girl Scout cookie booth locations and visualizing troop territories.

## Privacy & Data Protection

This application handles sensitive information about Girl Scouts, including names and home addresses. Privacy is a first-class concern and is enforced at every layer:

- **Scout names and addresses are never exposed on any public page.** All personally identifiable information (PII) is restricted to the authenticated admin panel, which requires login and is protected by middleware.
- **The public map shows booth locations only.** Unauthenticated visitors can see booth pins (location, date, time, troop number) but zero scout data.
- **Logged-in users** see scout pins on the map as anonymous dots — only coordinates and troop number. Names and addresses are never sent to the browser for the map view. The server query uses a strict `select` to return only `id`, `latitude`, `longitude`, and `troopNumber`.
- **Admin pages** (`/admin/*`) are the only place where scout names and addresses appear. These routes are protected by NextAuth middleware — unauthenticated requests are redirected to the login page.
- **No public API endpoints expose scout PII.** All data fetching for scouts goes through server components and server actions that check authentication.

If you are deploying this for your troop or service unit, please also review the [Security Best Practices](#security-best-practices) section below.

## Features

- **Territory Map** — Google Maps view showing scout residences and booth locations, color-coded by troop
- **Booth Planning** — Visualize booth coverage radius by type (storefront, neighborhood, rural)
- **Filters & Controls** — Filter by troop, date range, toggle scouts/booths/radius/heatmap
- **Report View** — Print-friendly dashboard with troop statistics, scout counts, and geocoding coverage
- **Bulk Import** — Import troops, scouts, and booths from Excel or CSV files with row-level validation
- **Admin Panel** — Full CRUD for troops, scouts, and booth assignments
- **Authentication** — Email/password registration and login with role-based admin access
- **Geocoding** — Automatic address-to-coordinate conversion with database-level caching
- **Change Password** — Logged-in users can change their password from the admin settings page

## Technologies

- **Frontend** — React 19, Next.js 16 (App Router), Tailwind CSS 4, TypeScript
- **Backend** — Next.js Server Actions & API Routes, NextAuth (Auth.js), Zod validation, bcryptjs
- **Database** — PostgreSQL 16, Prisma 5 ORM
- **Maps & Geolocation** — Google Maps JavaScript API, Geocoding API, @vis.gl/react-google-maps
- **Data Import** — xlsx (SheetJS) for Excel parsing
- **Infrastructure** — Docker (multi-stage builds), Docker Compose, Kubernetes manifests

## Prerequisites

- Node.js 20+
- Docker (for local PostgreSQL)
- Google Maps API key and Map ID from the [Google Cloud Console](https://console.cloud.google.com/)

## Google Maps Setup

This app uses the Google Maps JavaScript API (map display) and Geocoding API (address-to-coordinate conversion).

### 1. Create a project and enable APIs

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services > Library**
4. Enable these APIs:
   - **Maps JavaScript API**
   - **Geocoding API**

### 2. Create an API key

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > API key**
3. Click **Restrict Key** and:
   - Under **Application restrictions**, add HTTP referrer restrictions for your domain (e.g., `https://yourdomain.com/*`)
   - Under **API restrictions**, limit the key to Maps JavaScript API and Geocoding API only

This key is used for both `GOOGLE_MAPS_API_KEY` and `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in your environment.

### 3. Create a Map ID

A Map ID is required for advanced markers (colored pins per troop).

1. Go to **Google Maps Platform > Map Management** in the Cloud Console
2. Click **Create Map ID**
3. Choose **JavaScript** as the map type and **Vector** as the map rendering type
4. Copy the Map ID — this is your `NEXT_PUBLIC_GOOGLE_MAP_ID`

### Cost

Google Maps Platform gives every account **$200 in free usage each month** — more than enough for a typical troop or service unit. The app also **caches every geocoded address in the database**, so each unique address only costs one API call no matter how many times you view the map or re-import data. You should not need to pay anything for normal use.

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://cookie:cookie@localhost:5433/cookie_territory?schema=public` |
| `NEXTAUTH_SECRET` | Secret for session encryption (see below) | `K7g2...` (random 32+ chars) |
| `NEXTAUTH_URL` | Public URL where the app is served | `http://localhost:3001` |
| `GOOGLE_MAPS_API_KEY` | Server-side Geocoding API key | `AIza...` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Client-side Maps API key | `AIza...` |
| `NEXT_PUBLIC_GOOGLE_MAP_ID` | Map ID for advanced markers | `64eb...` |

Generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

## Local Development

```bash
# Clone and install
git clone <repo-url> && cd cookie-territory-strategy
cp .env.example .env
# Edit .env with your Google Maps API key, Map ID, and a generated NEXTAUTH_SECRET

# Start the database
docker compose up -d db

# Install dependencies and push the schema
npm install
npx prisma db push

# Start the dev server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) and register an account.

### Creating an admin user

There is no self-service admin signup — this is intentional. The first user registers through the UI, then an existing admin promotes them by updating the database directly:

```bash
# Connect to the database
docker compose exec db psql -U cookie cookie_territory

# Promote a user to admin
UPDATE "User" SET "isAdmin" = true WHERE email = 'you@example.com';
```

Only admin users can access the `/admin` pages.

## Docker Compose

Run the full stack locally with Docker Compose:

```bash
# Set your environment variables in .env, then:
docker compose up -d
```

This starts PostgreSQL and the Next.js app. The app is available at [http://localhost:3001](http://localhost:3001).

To apply database schema changes:

```bash
docker compose exec app npx prisma db push
```

## Kubernetes Deployment

Plain YAML manifests are provided in the `k8s/` directory. These assume an nginx ingress controller and cert-manager for TLS, but can be adapted to any setup.

### 1. Build and push the image

```bash
docker build \
  --build-arg NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key \
  --build-arg NEXT_PUBLIC_GOOGLE_MAP_ID=your-map-id \
  -t your-registry/cookie-territory:latest .
docker push your-registry/cookie-territory:latest
```

### 2. Update configuration

Edit `k8s/secret.yaml` with your real values (database URL, NextAuth secret, Google Maps keys).

Edit `k8s/app-deployment.yaml` to reference your pushed image.

Edit `k8s/ingress.yaml` to set your hostname.

### 3. Apply manifests

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/postgres.yaml        # skip if using an external database
kubectl apply -f k8s/app-deployment.yaml
kubectl apply -f k8s/app-service.yaml
kubectl apply -f k8s/ingress.yaml
```

### 4. Run database migration

```bash
# Update the image in db-migrate-job.yaml to match your registry, then:
kubectl apply -f k8s/db-migrate-job.yaml
kubectl logs -n cookie-territory job/cookie-territory-db-migrate
```

Re-run the migration job after schema changes by deleting and re-creating it:

```bash
kubectl delete job -n cookie-territory cookie-territory-db-migrate
kubectl apply -f k8s/db-migrate-job.yaml
```

### Using an external database

Skip applying `k8s/postgres.yaml` and update `DATABASE_URL` in `k8s/secret.yaml` to point to your managed PostgreSQL instance (RDS, Cloud SQL, etc.).

## Security Best Practices

If you are deploying this application for real troop data, take these steps to keep it secure:

### Authentication & secrets

- **Generate a strong `NEXTAUTH_SECRET`** — use `openssl rand -base64 32`. Never reuse secrets across environments or commit them to source control.
- **Use strong passwords** — all admin accounts should use unique passwords of 12+ characters.
- **Change default database credentials** — the dev defaults (`cookie:cookie`) are fine for local development but must be changed for any deployment accessible over a network.

### Network & infrastructure

- **Always use HTTPS in production** — the Kubernetes manifests include cert-manager TLS. For Docker Compose deployments, put a reverse proxy (nginx, Caddy, Traefik) in front of the app with a valid TLS certificate.
- **Set `AUTH_TRUST_HOST=true`** when running behind a reverse proxy or Docker port mapping. This is already set in the Docker Compose file.
- **Restrict your Google Maps API key** — in the Cloud Console, add HTTP referrer restrictions so the key only works from your domain. Limit it to the Maps JavaScript API and Geocoding API only.
- **Keep your `.env` file out of version control** — it is already listed in `.gitignore`.

### Database

- **Back up your database regularly** — scout and booth data is difficult to reconstruct. Use `pg_dump` or your cloud provider's automated backup feature.
- **Restrict database access** — only the application server should be able to reach the database. In Kubernetes, use network policies. In Docker Compose, do not expose the database port to the host in production.

### Keeping up to date

- **Update dependencies regularly** — run `npm audit` periodically and update packages to patch known vulnerabilities.
- **Review Prisma schema changes** — `npx prisma db push` applies schema changes directly. Review what will change before running it against a production database.

## Usage Guide

### Public map view

The home page displays an interactive Google Map. Booth locations are plotted as colored markers grouped by troop. Visitors who are not logged in can view booth locations but cannot see any scout data.

### Admin panel

Log in and navigate to `/admin` to access the dashboard. The sidebar provides links to:

- **Dashboard** — Troop statistics, scout/booth counts, geocoding coverage
- **Troops** — Create and manage troops with a number, name, and service unit area
- **Scouts** — Add scouts with their home address. Addresses are automatically geocoded for map placement
- **Booths** — Add booth locations with address, date, time, and booth type (storefront, neighborhood, rural)
- **Import** — Bulk-upload troops, scouts, and booths from Excel or CSV files. Files can contain extra columns — they will be ignored. Each import tab shows the expected columns and validates every row before importing
- **Settings** — Change your account password

### Map controls

When logged in, the map shows both scouts and booths. Use the sidebar controls to:

- Filter by troop (multi-select)
- Filter booths by date range
- Toggle scout/booth visibility
- Toggle booth radius circles (sized by booth type: 1 mi for neighborhood, 2 mi for storefront, 5 mi for rural)
- Toggle scout radius circles with adjustable distance
- Switch to heatmap view for density analysis
- Switch color mode between troop-based and date-based
- Enter report view for a print-friendly layout

## Project Structure

```
src/
├── app/              # Next.js App Router pages and API routes
│   ├── (auth)/       # Login and registration pages
│   ├── admin/        # Admin dashboard, troops, scouts, booths, import, settings
│   └── api/          # Auth handlers and health check
├── components/       # React components (map, admin, import)
└── lib/              # Shared logic
    ├── actions/      # Server actions (mutations)
    ├── queries/      # Data fetching functions
    └── validators/   # Zod schemas
prisma/
└── schema.prisma     # Database schema
k8s/                  # Kubernetes manifests
```

## License

[MIT](LICENSE)

## Author

**Kurt Langrud** — [github.com/klangrud](https://github.com/klangrud)
