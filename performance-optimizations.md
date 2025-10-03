# Performance-Optimierungen für KMUpower

## 1. Bilder optimieren:

### Aktuelle Probleme:
- Unkomprimierte Bilder
- Fehlende WebP-Formate
- Keine Lazy Loading

### Lösungen:
```html
<!-- Moderne Bildformate nutzen -->
<picture>
  <source srcset="/assets/images/ml.webp" type="image/webp">
  <source srcset="/assets/images/ml.avif" type="image/avif">
  <img src="/assets/images/ml.jpg" alt="Marcel Lehmann, Microsoft MVP" loading="lazy">
</picture>

<!-- Responsive Images -->
<img src="/assets/images/ml-400.webp" 
     srcset="/assets/images/ml-400.webp 400w, 
             /assets/images/ml-800.webp 800w"
     sizes="(max-width: 768px) 400px, 800px"
     alt="Marcel Lehmann, Microsoft MVP" 
     loading="lazy">
```

## 2. CSS optimieren:

### Probleme:
- Inline CSS (40KB+)
- Keine Minifikation
- Unused CSS

### Lösungen:
```html
<!-- Critical CSS inline behalten -->
<style>
/* Nur Above-the-fold CSS hier */
</style>

<!-- Rest asynchron laden -->
<link rel="preload" href="/css/main.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/css/main.min.css"></noscript>
```

## 3. JavaScript optimieren:

### Aktuell:
- Inline JS am Ende ✅ (gut)
- TypeScript/Vite Setup ✅ (gut)

### Verbesserungen:
```html
<!-- Async für nicht-kritisches JS -->
<script src="/js/modal.js" async></script>
<script src="/js/navigation.js" defer></script>
```

## 4. Schriften optimieren:

### Aktuell:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Optimiert:
```html
<!-- Preload wichtigste Schrift -->
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>

<!-- Font-display swap für bessere Performance -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

## 5. Core Web Vitals Ziele:

### Largest Contentful Paint (LCP):
- **Ziel**: < 2.5 Sekunden
- **Maßnahmen**: Hero-Image optimieren, Critical CSS

### First Input Delay (FID):
- **Ziel**: < 100 Millisekunden  
- **Maßnahmen**: JS-Ausführung optimieren

### Cumulative Layout Shift (CLS):
- **Ziel**: < 0.1
- **Maßnahmen**: Bildgrößen definieren, Schriften preloaden

## 6. Caching-Strategie:

### .htaccess Regeln:
```apache
# Browser Caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
</IfModule>

# Gzip Kompression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE text/html
</IfModule>
```