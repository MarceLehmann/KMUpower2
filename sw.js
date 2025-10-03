// Service Worker für KMUpower Website
const CACHE_NAME = 'kmupower-v1.0.0';
const urlsToCache = [
  '/',
  '/loesungen',
  '/kontakt',
  '/assets/logos/LOGO_KMUpower_high.webp',
  '/assets/images/ml.jpg'
];

// Installation des Service Workers
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch Event - Cache First Strategie für statische Assets
self.addEventListener('fetch', function(event) {
  // Nur für GET-Requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Cache First für Bilder, CSS, JS
  if (event.request.destination === 'image' || 
      event.request.url.includes('.css') ||
      event.request.url.includes('.js') ||
      event.request.url.includes('.webp') ||
      event.request.url.includes('.jpg') ||
      event.request.url.includes('.png')) {
    
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
          
          // Clone the request
          var fetchRequest = event.request.clone();
          
          return fetch(fetchRequest).then(
            function(response) {
              // Check if we received a valid response
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // Clone the response
              var responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
              
              return response;
            }
          );
        }
      )
    );
  }
  
  // Network First für HTML-Seiten (für aktuelle Inhalte)
  else if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          // Update cache with fresh content
          var responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseClone);
            });
          return response;
        })
        .catch(function() {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
  }
});

// Clean up old caches
self.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});