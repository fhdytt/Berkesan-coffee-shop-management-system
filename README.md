
# Berkesan Coffee — POS & Ordering System

Point of Sale and table ordering system for Berkesan Coffee Shop.

**Stack:** Express.js · PostgreSQL · Tailwind CSS · Vanilla JS

## Features

- JWT authentication with Admin and Kasir roles
- Menu & category management
- Table management with QR code ordering
- Order flow: order → payment → queue → done
- Auto queue numbering
- Dashboard stats, monthly recap & sales reports
- Receipt printing

## Installation

```bash
git clone git@github.com:fhdytt/Berkesan-coffee-shop-management-system.git
cd Berkesan-coffee-shop-management-system
npm install
```

```bash
cp backend/.env.example backend/.env
```

```bash
psql -U postgres -c "CREATE DATABASE berkesan;"
psql -U postgres -d berkesan -f backend/database/schema.postgres.sql
psql -U postgres -d berkesan -f backend/database/dummy_data.sql
```

```bash
npm run start
```

Server runs at `http://localhost:3000`. Or use Docker: `docker compose up -d`

## Demo Accounts

| Role  | Username | Password |
|-------|----------|----------|
| Admin | Admin    | admin    |
| Kasir | Kasir    | kasir    |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for local setup and git workflow.
