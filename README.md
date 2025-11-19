# Møller Fanclub ⛰️⛷️
![Preview](./.images/preview.gif)

## Forutsetninger

-   [Node.js](https://nodejs.org/) (versjon >=20.19.0)
-   [Sanity](https://www.sanity.io/) - Headless CMS for innholdsadministrasjon
-   [PostgreSQL](https://www.postgresql.org/) - Database for ordrer og brukerdata

## Arkitektur

Prosjektet består av tre hovedkomponenter:

-   **Frontend** - React-applikasjon bygget med Vite og TypeScript
-   **Backend** - Express API-server bygget med TypeScript
-   **Sanity Studio** - Headless CMS for innholdsadministrasjon (studio-moller-fanclub)

## Oppsett

### Installer avhengigheter

For å installere alle avhengigheter (root, backend, frontend og Sanity Studio):
``` bash
npm run install:all
```

## Kjøring

### Utviklingsmodus

For å kjøre backend, frontend og Sanity Studio samtidig i utviklingsmodus:
``` bash
npm run dev
```

Dette starter:
- Backend på [http://localhost:3001](http://localhost:3001)
- Frontend på [http://localhost:5173](http://localhost:5173)
- Sanity Studio på [http://localhost:3333](http://localhost:3333)

### Kjør komponenter separat

Hvis du ønsker å kjøre komponentene separat:

**Backend:**
``` bash
npm run dev:backend
```

**Frontend:**
``` bash
npm run dev:frontend
```

**Sanity Studio:**
``` bash
npm run dev:studio
```

### Produksjon

For å bygge prosjektet for produksjon:
``` bash
npm run build
```

For å starte produksjonsversjonen:
``` bash
npm run start
```

### Sanity Studio

Sanity Studio er et headless CMS som brukes til å administrere innhold på nettsiden. Innholdet inkluderer produkter, bilder, tekster og andre dynamiske data.

**Bygge Sanity Studio for produksjon:**
``` bash
npm run build:studio
```

**Starte Sanity Studio i produksjonsmodus:**
``` bash
npm run start:studio
```

**Deploye Sanity Studio til Sanity's hosting:**
``` bash
cd studio-moller-fanclub && npm run deploy
```

For mer informasjon om Sanity, se [Sanity dokumentasjonen](https://www.sanity.io/docs).

### Prisma (Database)

Prisma brukes til å administrere databasen for ordrer, betalinger og brukerdata. Backend bruker PostgreSQL som database.

**Generer Prisma Client:**

Etter å ha installert avhengigheter, må Prisma Client genereres basert på databaseskjemaet:
``` bash
cd backend && npm run db:generate
```

Dette kommandoen kjører `prisma generate` og genererer TypeScript-typer basert på `prisma/schema.prisma`.

**Kjør database-migrasjoner:**

For å oppdatere databasestrukturen i produksjon:
``` bash
cd backend && npm run db:migrate
```

**Åpne Prisma Studio:**

Prisma Studio er et GUI-verktøy for å se og redigere data i databasen:
``` bash
cd backend && npm run db:studio
```

Dette åpner Prisma Studio på [http://localhost:5555](http://localhost:5555)

**Merk:** Du må ha en `DATABASE_URL` miljøvariabel konfigurert i `.env`-filen i backend-mappen for at Prisma skal fungere.

For mer informasjon om Prisma, se [Prisma dokumentasjonen](https://www.prisma.io/docs).

