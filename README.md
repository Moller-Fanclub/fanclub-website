# Møller Fanclub ⛰️⛷️
![Preview](./.images/preview.gif)

## Forutsetninger

-   [Node.js](https://nodejs.org/) (versjon >=20.19.0)
-   [Sanity](https://www.sanity.io/) - Headless CMS for innholdsadministrasjon

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

**Deploye Sanity Studio:**
``` bash
npm run start:studio
```

For mer informasjon om Sanity, se [Sanity dokumentasjonen](https://www.sanity.io/docs).

