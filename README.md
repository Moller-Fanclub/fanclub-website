# Møller Fanclub ⛰️⛷️
![Preview](./.images/preview.gif)

## Forutsetninger

-   [Node.js](https://nodejs.org/) (versjon >=20.19.0)

## Oppsett

### Installer avhengigheter

For å installere alle avhengigheter (root, backend og frontend):
``` bash
npm run install:all
```

## Kjøring

### Utviklingsmodus

For å kjøre både backend og frontend samtidig i utviklingsmodus:
``` bash
npm run dev
```

Dette starter:
- Backend på [http://localhost:3001](http://localhost:3001)
- Frontend på [http://localhost:5173](http://localhost:5173)

### Kjør backend og frontend separat

Hvis du ønsker å kjøre backend og frontend separat:

**Backend:**
``` bash
npm run dev:backend
```

**Frontend:**
``` bash
npm run dev:frontend
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

