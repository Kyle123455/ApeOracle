const CACHE_NAME = 'prime-sstrs-v1';
const REPO_NAME = '/Prime-SSTRs'; // Change this to your repository name

const urlsToCache = [
  REPO_NAME + '/',
  REPO_NAME + '/index.html',
  REPO_NAME + '/manifest.json',
  REPO_NAME + '/icons/icon-72.png',
  REPO_NAME + '/icons/icon-96.png',
  REPO_NAME + '/icons/icon-128.png',
  REPO_NAME + '/icons/icon-144.png',
  REPO_NAME + '/icons/icon-152.png',
  REPO_NAME + '/icons/icon-167.png',
  REPO_NAME + '/icons/icon-180.png',
  REPO_NAME + '/icons/icon-192.png',
  REPO_NAME + '/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,400&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install service worker
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate service worker
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event handler
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.includes('fonts.googleapis.com') && 
      !event.request.url.includes('cdnjs.cloudflare.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        // Clone the request because it's a one-time use
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response because it's a one-time use
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              // Don't cache if it's a GitHub Pages 404
              if (response.status !== 404) {
                cache.put(event.request, responseToCache);
              }
            });

          return response;
        }).catch(error => {
          console.log('Fetch failed:', error);
          // You could return a custom offline page here
        });
      })
  );
});

// Handle messages from the client
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});