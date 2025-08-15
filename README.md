# AutoShipTech — MVP Restore Starter

This repo is a ready-to-deploy MVP for your auto shipping calculator widget + API + dashboard shell.

## Apps
- **/server** — Express API (`/api/quote`, `/api/book`, Stripe webhooks)
- **/widget** — Embeddable iframe widget (`loader.js` + `app.html`), purple theme, quote→book flow
- **/dashboard** — Next.js shell (login, dashboard placeholders)
- **/deploy** — Docker Compose, Nginx reverse proxy
- **/sql** — schema + seed for Postgres

## Quick start (Docker)
```bash
docker compose -f deploy/docker-compose.yml up -d --build

# Create DB schema + seed
docker exec -i autoshiptech-db psql -U postgres -d autoshiptech < /sql/schema.sql
docker exec -i autoshiptech-db psql -U postgres -d autoshiptech < /sql/seed.sql
```

## Embed code example
```html
<div id="autoshiptech-calculator"></div>
<script async src="https://widget.autoshiptech.com/v1/loader.js"
  data-publishable-key="AST-PUB-TEST-123"
  data-primary-color="#6D28D9"
  data-logo-url="https://autoshiptech.com/logo.svg">
</script>
```

## Environment
Copy `/server/.env.example` to `/server/.env` and fill values.
