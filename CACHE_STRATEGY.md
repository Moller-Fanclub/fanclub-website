# Cache Strategy - Møller Fanclub Frontend

This document explains how caching is handled throughout the Møller Fanclub application.

## Overview

The application uses multiple caching layers to optimize performance and user experience:

1. **Sanity CMS CDN Cache** (Content)
2. **Backend In-Memory Cache** (Race Data)
3. **Browser LocalStorage** (Shopping Cart)
4. **Browser SessionStorage** (Scroll Position)

---

## 1. Sanity CMS CDN Cache

**Location:** `frontend/src/lib/sanityClient.ts`

### Configuration
```typescript
export const sanityClient = createClient({
  projectId: 'xgm785qx',
  dataset: 'production',
  useCdn: true, // Uses Sanity's edge cache
  apiVersion: '2025-11-04',
})
```

### How it Works
- **useCdn: true** - Enables Sanity's global CDN edge cache
- Content is cached at the edge for fast delivery worldwide
- Cache automatically invalidates when content is updated in Sanity Studio
- Used for: Blog posts, images, and all CMS content

### Cache Control
- **To bypass cache:** Set `useCdn: false` in the client configuration
- Cache invalidation is handled automatically by Sanity
- No manual cache clearing is needed

### Services Using Sanity Cache
- **Blog Service** (`frontend/src/services/blogService.ts`)
  - `getAllPosts()` - Fetches all blog posts
  - `getPostBySlug(slug)` - Fetches a specific blog post
  - `getThumbnails()` - Fetches blog thumbnails

---

## 2. Backend In-Memory Cache (Race Data)

**Location:** `backend/src/server.ts`

### Configuration
```typescript
// Load races.json into memory on startup
let raceResultsCache: Map<string, FisRaceResult> = new Map();

function loadRaceResults() {
  const racesPath = path.join(process.cwd(), 'races.json');
  const racesData = fs.readFileSync(racesPath, 'utf-8');
  const races: FisRaceResult[] = JSON.parse(racesData);
  
  // Build a map indexed by race id for fast lookup
  raceResultsCache = new Map();
  races.forEach(race => {
    if (race.raceId) {
      raceResultsCache.set(race.raceId, race);
    }
  });
}
```

### How it Works
- Race data from `backend/races.json` is loaded into memory when the server starts
- Uses a `Map` data structure for O(1) lookup performance
- All race queries are served from memory (no disk I/O)
- Race data is updated via the GitHub Actions workflow `updateRaces.yml`

### Endpoints Using In-Memory Cache
- **GET /api/fis/all** - Returns all races from cache
- **GET /api/fis/result?id={raceId}** - Returns specific race result from cache

### Cache Updates
- Race data is automatically updated by the `npm run updateRaces` script
- GitHub Actions workflow runs periodically to fetch new race data
- Server restart required to reload updated race data

### Performance Benefits
- **Fast lookups:** O(1) time complexity using Map
- **No database queries:** All data served from memory
- **Reduced I/O:** No file system reads after initial load

---

## 3. Browser LocalStorage (Shopping Cart)

**Location:** `frontend/src/contexts/CartContext.tsx`

### Configuration
```typescript
const [items, setItems] = useState<CartItem[]>(() => {
  const saved = localStorage.getItem('fanclub-cart');
  return saved ? JSON.parse(saved) : [];
});

useEffect(() => {
  localStorage.setItem('fanclub-cart', JSON.stringify(items));
}, [items]);
```

### How it Works
- Shopping cart state is persisted to browser's LocalStorage
- Cart data survives page refreshes and browser restarts
- Storage key: `'fanclub-cart'`
- Data is automatically synced on every cart change

### Data Structure
```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
}
```

### Operations
- **Add Item:** Increments quantity if item+size combo exists, otherwise adds new item
- **Remove Item:** Removes item from cart and updates LocalStorage
- **Update Quantity:** Updates item quantity or removes if quantity <= 0
- **Clear Cart:** Empties cart (called after successful checkout)

### Cache Lifetime
- Persists indefinitely until:
  - User manually clears browser data
  - User completes checkout (cart is cleared)
  - User explicitly removes items

---

## 4. Browser SessionStorage (Scroll Position)

**Location:** `frontend/src/pages/MerchPage/MerchPage.tsx`

### Configuration
```typescript
const SCROLL_KEY = 'merchPageScrollPosition';

// On page load - restore scroll position
useEffect(() => {
  const saved = sessionStorage.getItem(SCROLL_KEY);
  if (saved) {
    window.scrollTo(0, parseInt(saved));
    sessionStorage.removeItem(SCROLL_KEY);
  }
}, []);

// Before navigation - save scroll position
sessionStorage.setItem(SCROLL_KEY, window.scrollY.toString());
```

### How it Works
- Saves scroll position before navigating to a product detail page
- Restores scroll position when navigating back to the merch page
- Uses SessionStorage (data cleared when tab is closed)
- Storage key: `'merchPageScrollPosition'`

### Use Case
Improves UX by maintaining the user's browsing position when:
1. User scrolls down the merch page
2. User clicks on a product to view details
3. User navigates back using browser back button
4. Page restores to the exact scroll position

### Cache Lifetime
- Persists only for the current browser session
- Cleared when:
  - Browser tab is closed
  - After scroll position is restored (self-cleaning)

---

## 5. HTTP Caching (Not Implemented)

Currently, the application **does not** implement HTTP cache headers such as:
- `Cache-Control`
- `ETag`
- `Last-Modified`
- `max-age`

### Potential Improvements
To implement HTTP caching on API responses:

```typescript
// Example for static data endpoints
app.get('/api/products', (_req, res) => {
  res.set('Cache-Control', 'public, max-age=3600'); // 1 hour
  res.json(products);
});

// Example for dynamic data with validation
app.get('/api/fis/all', (_req, res) => {
  const etag = generateETag(raceResultsCache);
  res.set('ETag', etag);
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  res.json(Array.from(raceResultsCache.values()));
});
```

---

## 6. React State Caching (Implicit)

While not explicit caching, React's component state provides implicit caching:

### Component-Level State
- Components fetch data and cache in state via `useState`
- Data persists for component lifetime
- Re-fetch occurs on component mount/remount

### Examples
- Blog posts fetched on BlogPage mount
- Products fetched on MerchPage mount
- Race data fetched on CalendarPage mount

### No Query Caching Library
The application **does not use** React Query, SWR, or similar libraries that provide:
- Automatic request deduplication
- Background refetching
- Stale-while-revalidate patterns
- Automatic cache invalidation

---

## Cache Invalidation Strategy

### Sanity CMS Content
- **Automatic:** Sanity CDN handles cache invalidation when content is updated
- **Manual:** Not required

### Race Data (Backend)
- **Automatic:** GitHub Actions workflow updates `races.json` periodically
- **Manual:** Restart backend server to reload race data cache

### Shopping Cart
- **Automatic:** Cleared after successful checkout
- **Manual:** User can remove items or clear browser data

### Scroll Position
- **Automatic:** Cleared after restoration or when session ends
- **Manual:** Close browser tab

---

## Best Practices

### When to Clear Cache

1. **Development:**
   - Clear browser LocalStorage/SessionStorage when testing cart functionality
   - Restart backend server after manually updating `races.json`
   - Use incognito mode for testing fresh state

2. **Production:**
   - Race data updates automatically via CI/CD
   - Cart data clears automatically on checkout
   - Sanity content updates propagate automatically

### Performance Considerations

1. **Sanity CDN:**
   - ✅ Good for globally distributed content
   - ✅ Reduces API calls to Sanity
   - ✅ Automatic cache invalidation

2. **Backend In-Memory Cache:**
   - ✅ Extremely fast lookups
   - ✅ No database overhead
   - ⚠️ Requires server restart for updates
   - ⚠️ Lost on server crash (acceptable for read-only data)

3. **LocalStorage:**
   - ✅ Persists across sessions
   - ✅ Good for user-specific data like cart
   - ⚠️ 5-10MB storage limit per domain
   - ⚠️ Synchronous API (can block UI on large data)

4. **SessionStorage:**
   - ✅ Automatic cleanup on session end
   - ✅ Good for temporary UI state
   - ⚠️ Lost when tab closes

---

## Future Enhancements

### Recommended Improvements

1. **Add React Query or SWR:**
   ```typescript
   // Example with React Query
   const { data: races } = useQuery('races', 
     () => raceService.getAllRaces(),
     { staleTime: 5 * 60 * 1000 } // 5 minutes
   );
   ```

2. **Implement HTTP Cache Headers:**
   - Add `Cache-Control` headers to API responses
   - Implement ETags for conditional requests
   - Reduce unnecessary API calls

3. **Add Service Worker:**
   - Cache static assets offline
   - Implement offline-first strategy
   - Enable Progressive Web App (PWA) features

4. **Image Optimization:**
   - Use Sanity's image transformation API with caching
   - Implement lazy loading with intersection observer
   - Add blur-up placeholders

5. **API Response Compression:**
   - Enable gzip/brotli compression on backend
   - Reduce payload sizes

---

## Debugging Cache Issues

### Sanity Content Not Updating
```bash
# 1. Check Sanity Studio - verify content is published
# 2. Force refresh with useCdn: false temporarily
# 3. Check browser network tab for 304 responses
```

### Race Data Not Updating
```bash
# 1. Check if races.json file is updated
ls -la backend/races.json

# 2. Check GitHub Actions workflow status
# 3. Restart backend server
cd backend && npm restart
```

### Cart Not Persisting
```javascript
// Check LocalStorage in browser DevTools
localStorage.getItem('fanclub-cart')

// Clear and test
localStorage.removeItem('fanclub-cart')
```

### Scroll Position Not Restoring
```javascript
// Check SessionStorage in browser DevTools
sessionStorage.getItem('merchPageScrollPosition')

// Clear and test
sessionStorage.removeItem('merchPageScrollPosition')
```

---

## Summary

The Møller Fanclub application uses a pragmatic caching strategy:

- **Content (Sanity):** CDN-cached for global performance
- **Race Data (Backend):** In-memory cache for fast lookups
- **Shopping Cart (Frontend):** LocalStorage for persistence
- **UI State (Frontend):** SessionStorage for temporary state

This approach provides good performance without the complexity of sophisticated caching libraries, while maintaining clear cache invalidation paths.
