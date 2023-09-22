//Change the cache version each time you want to force the service worker to create new cache
const staticCacheName = "site-static-v0.2";
const dynamicCacheName = "site-dynamic-v0.2";
let assets = self.__WB_MANIFEST;

assets.push({ url: "/manifest.webmanifest", revision: "1" });

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      assets.forEach((asset) => cache.add(asset.url));
    })
  );
});

// activate service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
        //TODO: modify this line to delete the old cache any time you create a new cache by changing the ends with statement
          .filter((key) => key !== staticCacheName && 
          key !== dynamicCacheName && 
          !key.startsWith("site-static-v") && // Filter out old static caches
          !key.startsWith("site-dynamic-v"))  // Filter out old dynamic caches
          .map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method === "GET") {
    const requestURL = new URL(event.request.url);

    //Check if the request is for the manifest file
    if (requestURL.pathname === "/manifest.webmanifest") {
      // Respond with the manifest file
      event.respondWith(
        fetch(event.request)
          .catch(async function (err) {
            // Return page if it exists in cache
            const pageResponse = await caches.match(event.request);
            if (pageResponse) return pageResponse;
          })
      )
    } else if (requestURL.pathname.startsWith('/en/') || requestURL.pathname.startsWith('/es/') || requestURL.pathname.startsWith('/fr/')) {
      return;
      //Do not cache Post images
    } else if (requestURL.pathname.startsWith('/storage/v1/object/post.image/')) {
      event.respondWith(
        fetch(event.request)
      );
      //Do not cache providerposts
    } else if (requestURL.pathname.startsWith('/rest/v1/providerposts')) {
      event.respondWith(
        fetch(event.request)
      );
    } else {
      event.respondWith(
        caches.open(staticCacheName).then((cache) => cache.match(event.request))
          .then((cacheRes) => {
            return (cacheRes ||
              fetch(event.request)
                .then((fetchRes) => {
                  return caches.open(dynamicCacheName).then((dynamicCache) => {
                    dynamicCache.put(event.request.url, fetchRes.clone());
                    // check cached items size
                    limitCacheSize(dynamicCacheName, 100);
                    return fetchRes;
                  });
                })
            );
          })
          .catch(async function (err) {
            // Return page if it exists in cache
            const pageResponse = await caches.match(event.request);
            if (pageResponse) return pageResponse;
            // if not, return fallback page
            const errorResponse = await caches.match("/offline.html");
            return errorResponse;
          })
      );
    }
  }
});