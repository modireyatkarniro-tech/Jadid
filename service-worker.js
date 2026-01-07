// ==============================================
// 📁 service-worker.js - Service Worker v3.0
// ==============================================
// ✅ Progressive Web App Features
// ✅ Offline Support
// ✅ Background Sync
// ✅ Push Notifications
// ==============================================

'use strict';

// Service Worker Version
const SW_VERSION = '3.0.0';
const CACHE_NAME = `ems-cache-v${SW_VERSION}`;

// URLs to cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  
  // Core libraries
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://cdn.jsdelivr.net/npm/persian-datepicker@1.2.0/dist/css/persian-datepicker.min.css',
  
  // JavaScript libraries
  'https://cdn.jsdelivr.net/npm/persian-date@1.1.0/dist/persian-date.min.js',
  'https://cdn.jsdelivr.net/npm/persian-datepicker@1.2.0/dist/js/persian-datepicker.min.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  
  // Fallback pages
  '/offline.html',
  '/error.html',
  
  // App icons
  '/assets/icons/icon-72x72.png',
  '/assets/icons/icon-96x96.png',
  '/assets/icons/icon-128x128.png',
  '/assets/icons/icon-144x144.png',
  '/assets/icons/icon-152x152.png',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-384x384.png',
  '/assets/icons/icon-512x512.png',
  
  // Manifest
  '/manifest.json'
];

// Cache strategies
const STRATEGIES = {
  NETWORK_FIRST: 'network-first',
  CACHE_FIRST: 'cache-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  CACHE_ONLY: 'cache-only'
};

// Route patterns and their strategies
const ROUTE_STRATEGIES = [
  {
    pattern: /\.(?:html|css|js)$/,
    strategy: STRATEGIES.NETWORK_FIRST
  },
  {
    pattern: /\.(?:png|jpg|jpeg|gif|svg|ico|webp)$/,
    strategy: STRATEGIES.CACHE_FIRST
  },
  {
    pattern: /^https:\/\/cdnjs\.cloudflare\.com/,
    strategy: STRATEGIES.CACHE_FIRST
  },
  {
    pattern: /^https:\/\/unpkg\.com/,
    strategy: STRATEGIES.CACHE_FIRST
  },
  {
    pattern: /^https:\/\/cdn\.jsdelivr\.net/,
    strategy: STRATEGIES.CACHE_FIRST
  },
  {
    pattern: /\/api\//,
    strategy: STRATEGIES.NETWORK_FIRST
  },
  {
    pattern: /.*/,
    strategy: STRATEGIES.NETWORK_FIRST
  }
];

// ==================== INSTALL EVENT ====================
self.addEventListener('install', (event) => {
  console.log(`[Service Worker ${SW_VERSION}] Installing...`);
  
  event.waitUntil(
    (async () => {
      try {
        // Create and open cache
        const cache = await caches.open(CACHE_NAME);
        
        // Add all precache URLs to cache
        await cache.addAll(PRECACHE_URLS);
        
        // Skip waiting to activate immediately
        self.skipWaiting();
        
        console.log(`[Service Worker ${SW_VERSION}] Installed successfully`);
        
      } catch (error) {
        console.error(`[Service Worker ${SW_VERSION}] Install failed:`, error);
        throw error;
      }
    })()
  );
});

// ==================== ACTIVATE EVENT ====================
self.addEventListener('activate', (event) => {
  console.log(`[Service Worker ${SW_VERSION}] Activating...`);
  
  event.waitUntil(
    (async () => {
      try {
        // Clean up old caches
        const cacheKeys = await caches.keys();
        const oldCaches = cacheKeys.filter(key => key !== CACHE_NAME);
        
        await Promise.all(
          oldCaches.map(key => {
            console.log(`[Service Worker ${SW_VERSION}] Deleting old cache:`, key);
            return caches.delete(key);
          })
        );
        
        // Claim clients immediately
        await self.clients.claim();
        
        // Send activation message to all clients
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            version: SW_VERSION
          });
        });
        
        console.log(`[Service Worker ${SW_VERSION}] Activated successfully`);
        
      } catch (error) {
        console.error(`[Service Worker ${SW_VERSION}] Activation failed:`, error);
        throw error;
      }
    })()
  );
});

// ==================== FETCH EVENT ====================
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip browser extensions and chrome:// URLs
  if (event.request.url.startsWith('chrome-extension://') || 
      event.request.url.startsWith('chrome://')) {
    return;
  }
  
  // Determine strategy based on URL
  const strategy = getStrategyForURL(event.request.url);
  
  // Handle fetch based on strategy
  switch (strategy) {
    case STRATEGIES.CACHE_FIRST:
      event.respondWith(cacheFirst(event.request));
      break;
      
    case STRATEGIES.NETWORK_FIRST:
      event.respondWith(networkFirst(event.request));
      break;
      
    case STRATEGIES.STALE_WHILE_REVALIDATE:
      event.respondWith(staleWhileRevalidate(event.request));
      break;
      
    case STRATEGIES.CACHE_ONLY:
      event.respondWith(cacheOnly(event.request));
      break;
      
    default:
      event.respondWith(networkFirst(event.request));
  }
});

// ==================== CACHE STRATEGIES ====================
async function cacheFirst(request) {
  try {
    // Try to get from cache first
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      // Update cache in background
      updateCacheInBackground(request);
      return cachedResponse;
    }
    
    // If not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    // Cache the new response for future use
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('Cache First strategy failed:', error);
    
    // Return offline page for HTML requests
    if (request.headers.get('Accept')?.includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

async function networkFirst(request) {
  try {
    // Try to fetch from network first
    const networkResponse = await fetch(request);
    
    // Cache the successful response
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log('Network failed, trying cache:', request.url);
    
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for HTML requests
    if (request.headers.get('Accept')?.includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    // Return error response
    return new Response('Network error', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

async function staleWhileRevalidate(request) {
  try {
    // Try to get from cache first
    const cachedResponse = await caches.match(request);
    
    // Always fetch from network in background
    const fetchPromise = fetch(request).then(async (networkResponse) => {
      if (networkResponse.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    }).catch(() => {
      // Ignore network errors for background update
    });
    
    // Return cached response immediately, then update
    if (cachedResponse) {
      // Don't wait for network response
      event.waitUntil(fetchPromise);
      return cachedResponse;
    }
    
    // If no cache, wait for network
    return await fetchPromise;
    
  } catch (error) {
    console.error('Stale While Revalidate failed:', error);
    
    // Return offline page for HTML requests
    if (request.headers.get('Accept')?.includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

async function cacheOnly(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Return offline page for HTML requests
  if (request.headers.get('Accept')?.includes('text/html')) {
    return caches.match('/offline.html');
  }
  
  return new Response('Not available offline', {
    status: 404,
    headers: { 'Content-Type': 'text/plain' }
  });
}

async function updateCacheInBackground(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    // Silently fail - we have cached version
  }
}

function getStrategyForURL(url) {
  for (const route of ROUTE_STRATEGIES) {
    if (route.pattern.test(url)) {
      return route.strategy;
    }
  }
  return STRATEGIES.NETWORK_FIRST;
}

// ==================== BACKGROUND SYNC ====================
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-attendance') {
    event.waitUntil(syncAttendanceData());
  } else if (event.tag === 'sync-tasks') {
    event.waitUntil(syncTaskData());
  } else if (event.tag === 'sync-requests') {
    event.waitUntil(syncRequestData());
  }
});

async function syncAttendanceData() {
  try {
    const attendanceData = await getStoredData('attendance_queue');
    
    if (attendanceData && attendanceData.length > 0) {
      const results = await Promise.allSettled(
        attendanceData.map(record => syncAttendanceRecord(record))
      );
      
      // Remove successfully synced records
      const failedRecords = attendanceData.filter((_, index) => 
        results[index].status === 'rejected'
      );
      
      await storeData('attendance_queue', failedRecords);
      
      // Notify clients
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETE',
          data: {
            type: 'attendance',
            success: results.filter(r => r.status === 'fulfilled').length,
            failed: failedRecords.length
          }
        });
      });
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function syncAttendanceRecord(record) {
  const response = await fetch('/api/attendance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': record._csrf
    },
    body: JSON.stringify(record)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response.json();
}

async function syncTaskData() {
  // Similar implementation for tasks
}

async function syncRequestData() {
  // Similar implementation for requests
}

// ==================== PUSH NOTIFICATIONS ====================
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received:', event);
  
  let data = {};
  
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (error) {
    console.error('Failed to parse push data:', error);
    data = {
      title: 'اعلان جدید',
      body: 'شما یک اعلان جدید دارید',
      icon: '/assets/icons/icon-192x192.png'
    };
  }
  
  const options = {
    body: data.body || 'اعلان جدید',
    icon: data.icon || '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    },
    actions: data.actions || [
      {
        action: 'view',
        title: 'مشاهده'
      },
      {
        action: 'dismiss',
        title: 'بستن'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'سیستم مدیریت کارکنان', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event);
  
  event.notification.close();
  
  const notificationData = event.notification.data || {};
  
  if (event.action === 'view') {
    // Open the app to the relevant page
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clientList) => {
        // If a window is already open, focus it
        for (const client of clientList) {
          if (client.url === notificationData.url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise open a new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(notificationData.url || '/');
        }
      })
    );
  }
  
  // Send message to all clients
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      clients.forEach(client => {
        client.postMessage({
          type: 'NOTIFICATION_CLICKED',
          action: event.action,
          data: notificationData
        });
      });
    })
  );
});

self.addEventListener('notificationclose', (event) => {
  console.log('[Service Worker] Notification closed:', event);
});

// ==================== MESSAGE HANDLING ====================
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CLEAR_CACHE':
      clearCache();
      break;
      
    case 'GET_CACHE_INFO':
      getCacheInfo().then(info => {
        event.ports[0].postMessage(info);
      });
      break;
      
    case 'QUEUE_SYNC':
      queueBackgroundSync(data);
      break;
      
    case 'STORE_DATA':
      storeData(data.key, data.value);
      break;
      
    case 'GET_DATA':
      getStoredData(data.key).then(value => {
        event.ports[0].postMessage(value);
      });
      break;
  }
});

// ==================== UTILITY FUNCTIONS ====================
async function getStoredData(key) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(`/data/${key}`);
    
    if (response) {
      return await response.json();
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get stored data:', error);
    return null;
  }
}

async function storeData(key, value) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const url = `/data/${key}`;
    const response = new Response(JSON.stringify(value), {
      headers: { 'Content-Type': 'application/json' }
    });
    
    await cache.put(url, response);
    return true;
  } catch (error) {
    console.error('Failed to store data:', error);
    return false;
  }
}

async function clearCache() {
  try {
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys.map(key => caches.delete(key)));
    
    // Notify clients
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'CACHE_CLEARED'
      });
    });
    
    return true;
  } catch (error) {
    console.error('Failed to clear cache:', error);
    return false;
  }
}

async function getCacheInfo() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    
    let totalSize = 0;
    const entries = [];
    
    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
        
        entries.push({
          url: request.url,
          size: blob.size,
          type: response.headers.get('content-type')
        });
      }
    }
    
    return {
      name: CACHE_NAME,
      version: SW_VERSION,
      totalEntries: keys.length,
      totalSize: formatBytes(totalSize),
      entries: entries.slice(0, 10) // Return first 10 entries
    };
  } catch (error) {
    console.error('Failed to get cache info:', error);
    return {
      error: error.message
    };
  }
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function queueBackgroundSync(data) {
  if ('sync' in self.registration) {
    self.registration.sync.register(data.tag || 'default-sync')
      .then(() => {
        console.log('Background sync registered:', data.tag);
      })
      .catch(error => {
        console.error('Failed to register background sync:', error);
      });
  }
}

// ==================== PERIODIC SYNC (for background updates) ====================
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-content') {
      console.log('[Service Worker] Periodic sync triggered');
      event.waitUntil(updateContent());
    }
  });
}

async function updateContent() {
  try {
    // Update critical resources
    const resourcesToUpdate = [
      '/',
      '/index.html',
      '/css/style.css',
      '/js/main.js'
    ];
    
    const cache = await caches.open(CACHE_NAME);
    
    for (const url of resourcesToUpdate) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch (error) {
        console.log(`Failed to update ${url}:`, error);
      }
    }
    
    // Check for new version
    const manifestResponse = await fetch('/manifest.json');
    if (manifestResponse.ok) {
      const manifest = await manifestResponse.json();
      const currentVersion = SW_VERSION;
      
      if (manifest.version !== currentVersion) {
        // Notify about new version
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'NEW_VERSION_AVAILABLE',
            version: manifest.version
          });
        });
      }
    }
    
  } catch (error) {
    console.error('Periodic sync failed:', error);
  }
}

// ==================== OFFLINE ANALYTICS ====================
async function queueAnalyticsEvent(event) {
  try {
    const events = await getStoredData('analytics_queue') || [];
    events.push({
      ...event,
      timestamp: Date.now(),
      offline: true
    });
    
    await storeData('analytics_queue', events);
    
    // Try to send immediately if online
    if (navigator.onLine) {
      sendQueuedAnalytics();
    }
    
  } catch (error) {
    console.error('Failed to queue analytics event:', error);
  }
}

async function sendQueuedAnalytics() {
  try {
    const events = await getStoredData('analytics_queue') || [];
    
    if (events.length === 0) return;
    
    const response = await fetch('/api/analytics/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ events })
    });
    
    if (response.ok) {
      // Clear queue on success
      await storeData('analytics_queue', []);
    }
    
  } catch (error) {
    console.error('Failed to send queued analytics:', error);
  }
}

// ==================== ERROR HANDLING ====================
self.addEventListener('error', (event) => {
  console.error('[Service Worker] Error:', event.error);
  
  // Log error to analytics
  queueAnalyticsEvent({
    type: 'service_worker_error',
    error: {
      message: event.error?.message,
      stack: event.error?.stack
    },
    timestamp: Date.now()
  });
});

// ==================== CACHE CLEANUP ====================
async function cleanupOldCacheEntries() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const dateHeader = response.headers.get('date');
        if (dateHeader) {
          const cachedDate = new Date(dateHeader).getTime();
          if (now - cachedDate > maxAge) {
            await cache.delete(request);
          }
        }
      }
    }
  } catch (error) {
    console.error('Cache cleanup failed:', error);
  }
}

// Run cleanup once a day
setInterval(cleanupOldCacheEntries, 24 * 60 * 60 * 1000);

// ==================== HEALTH CHECK ====================
async function healthCheck() {
  try {
    // Check cache health
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    
    // Check critical resources
    const criticalResources = ['/', '/index.html', '/css/style.css'];
    const missingResources = [];
    
    for (const resource of criticalResources) {
      const response = await cache.match(resource);
      if (!response) {
        missingResources.push(resource);
      }
    }
    
    if (missingResources.length > 0) {
      console.warn('Missing critical resources:', missingResources);
      
      // Try to refetch missing resources
      for (const resource of missingResources) {
        try {
          const response = await fetch(resource);
          if (response.ok) {
            await cache.put(resource, response);
          }
        } catch (error) {
          console.error(`Failed to refetch ${resource}:`, error);
        }
      }
    }
    
    return {
      status: 'healthy',
      cacheSize: keys.length,
      missingResources: missingResources.length
    };
    
  } catch (error) {
    console.error('Health check failed:', error);
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
}

// Run health check every hour
setInterval(healthCheck, 60 * 60 * 1000);

// ==================== EXPORT FUNCTIONS (for testing) ====================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    STRATEGIES,
    cacheFirst,
    networkFirst,
    staleWhileRevalidate,
    cacheOnly,
    getStrategyForURL,
    formatBytes
  };
}

// ==============================================
// 📦 END OF SERVICE WORKER
// ==============================================