# Cache-Optimierung für KMUpower Website

## 1. .htaccess Konfiguration (Apache Server)

```apache
# Browser Caching - Setze Expire Headers
<IfModule mod_expires.c>
    ExpiresActive on
    
    # HTML Dateien - Kurze Cache-Zeit wegen häufigen Updates
    ExpiresByType text/html "access plus 1 hour"
    
    # CSS und JavaScript - Lange Cache-Zeit mit Versionierung
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/javascript "access plus 1 year"
    
    # Bilder - Sehr lange Cache-Zeit
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/ico "access plus 1 year"
    
    # Fonts - Lange Cache-Zeit
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/ttf "access plus 1 year"
    ExpiresByType application/font-woff2 "access plus 1 year"
    
    # Videos
    ExpiresByType video/mp4 "access plus 1 month"
    
    # Sitemaps und Feeds
    ExpiresByType application/xml "access plus 1 day"
    ExpiresByType text/xml "access plus 1 day"
</IfModule>

# Cache Control Headers
<IfModule mod_headers.c>
    # HTML - Muss revalidiert werden
    <FilesMatch "\.(html|htm)$">
        Header set Cache-Control "max-age=3600, must-revalidate"
    </FilesMatch>
    
    # CSS und JS mit Versionierung - Lange Cache-Zeit
    <FilesMatch "\.(css|js)$">
        Header set Cache-Control "max-age=31536000, public, immutable"
    </FilesMatch>
    
    # Bilder - Lange Cache-Zeit
    <FilesMatch "\.(jpg|jpeg|png|gif|webp|svg|ico)$">
        Header set Cache-Control "max-age=31536000, public, immutable"
    </FilesMatch>
    
    # Fonts - Lange Cache-Zeit
    <FilesMatch "\.(woff2|woff|ttf|eot)$">
        Header set Cache-Control "max-age=31536000, public, immutable"
        Header set Access-Control-Allow-Origin "*"
    </FilesMatch>
    
    # API Responses - Kurze Cache-Zeit
    <FilesMatch "\.(json|xml)$">
        Header set Cache-Control "max-age=3600, public"
    </FilesMatch>
</IfModule>

# Gzip Compression
<IfModule mod_deflate.c>
    # Komprimiere Text-basierte Dateien
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE text/javascript
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
    AddOutputFilterByType DEFLATE image/svg+xml
    
    # Schließe bereits komprimierte Dateien aus
    SetEnvIfNoCase Request_URI \
        \.(?:gif|jpe?g|png|webp|zip|gz|bz2|exe|pdf|doc|docx|xls|xlsx|ppt|pptx)$ no-gzip dont-vary
</IfModule>

# ETag Headers entfernen (für bessere Cache-Kontrolle)
<IfModule mod_headers.c>
    Header unset ETag
</IfModule>

FileETag None
```

## 2. Nginx Konfiguration (Alternative)

```nginx
# Cache-Optimierung für Nginx

# Gzip Compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_proxied expired no-cache no-store private must-revalidate auth;
gzip_types
    application/atom+xml
    application/javascript
    application/json
    application/ld+json
    application/manifest+json
    application/rss+xml
    application/vnd.geo+json
    application/vnd.ms-fontobject
    application/x-font-ttf
    application/x-web-app-manifest+json
    application/xhtml+xml
    application/xml
    font/opentype
    image/bmp
    image/svg+xml
    image/x-icon
    text/cache-manifest
    text/css
    text/plain
    text/vcard
    text/vnd.rim.location.xloc
    text/vtt
    text/x-component
    text/x-cross-domain-policy;

# Cache-Control Headers
location ~* \.(css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary Accept-Encoding;
}

location ~* \.(jpg|jpeg|png|gif|webp|svg|ico|woff2|woff|ttf)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(html|htm)$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}
```

## 3. Versionierung für Cache-Busting

### Automatische Versionierung mit Build-Tools:

```javascript
// vite.config.ts Erweiterung
export default {
  build: {
    rollupOptions: {
      output: {
        // Füge Hash zu Asset-Namen hinzu
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'js/[name].[hash].js',
        entryFileNames: 'js/[name].[hash].js'
      }
    }
  }
}
```

### Manuelle Versionierung:

```html
<!-- Vor der Optimierung -->
<link rel="stylesheet" href="/css/style.css">
<script src="/js/main.js"></script>

<!-- Nach der Optimierung -->
<link rel="stylesheet" href="/css/style.css?v=2025-10-03">
<script src="/js/main.js?v=2025-10-03"></script>
```

## 4. Service Worker für erweiterte Cache-Kontrolle

```javascript
// sw.js - Service Worker für intelligentes Caching
const CACHE_NAME = 'kmupower-v1.0.0';
const urlsToCache = [
  '/',
  '/css/main.css',
  '/js/main.js',
  '/assets/logos/LOGO_KMUpower_high.webp',
  '/assets/images/ml.jpg'
];

// Cache Installation
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache First Strategie für statische Assets
self.addEventListener('fetch', function(event) {
  if (event.request.destination === 'image' || 
      event.request.url.includes('.css') ||
      event.request.url.includes('.js')) {
    
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          return response || fetch(event.request);
        }
      )
    );
  }
});
```

## 5. Überwachung der Cache-Performance

### Browser DevTools Check:
1. F12 → Network Tab
2. Disable Cache deaktivieren
3. Seite neu laden
4. Prüfen: "from disk cache" oder "from memory cache"

### Lighthouse Audit wiederholen:
```bash
npx lighthouse https://kmupower.ch --only-categories=performance --view
```

### Erwartete Verbesserungen:
- **Cache-Insight**: Von 12-13 Warnungen auf 0-2
- **Performance Score**: +15-25 Punkte
- **Time to Interactive**: -20-30% Verbesserung
```