"use strict";var precacheConfig=[["/crystal-dashboard/index.html","7ac4c21f4c2b6dbcc0091951834344dc"],["/crystal-dashboard/static/css/main.1dcd122c.css","6a6f33fd5e2ae14b539274db892e1e9f"],["/crystal-dashboard/static/media/Pe-icon-7-stroke.01798bc1.ttf","01798bc13e33afc36a52f2826638d386"],["/crystal-dashboard/static/media/Pe-icon-7-stroke.71394c0c.eot","71394c0c7ad6c1e7d5c77e8ac292fba5"],["/crystal-dashboard/static/media/Pe-icon-7-stroke.b38ef310.woff","b38ef310874bdd008ac14ef3db939032"],["/crystal-dashboard/static/media/Pe-icon-7-stroke.c45f7de0.svg","c45f7de008ab976a8e817e3c0e5095ca"],["/crystal-dashboard/static/media/checkbox-1.94a3225c.svg","94a3225c9cfaf8990486dc58a28e33ae"],["/crystal-dashboard/static/media/checkbox-2.37b21b36.svg","37b21b36215d35b3d07c8efe200f89e0"],["/crystal-dashboard/static/media/checkbox-check.27fcc532.svg","27fcc532b1d62c32c20ed2d15c73557e"],["/crystal-dashboard/static/media/checkbox-uncheck.47f0d924.svg","47f0d924490997a37a446a8a30f713f0"],["/crystal-dashboard/static/media/face-3.ce7a6b79.jpg","ce7a6b79aa55041f7ae36f6ce22231fe"],["/crystal-dashboard/static/media/radio-1.814ee3f0.svg","814ee3f03e6a8f4d82ba8098097ab324"],["/crystal-dashboard/static/media/radio-2.43810451.svg","43810451826ac2f7870b091eb9a29390"],["/crystal-dashboard/static/media/sidebar-1.6be21e8a.jpg","6be21e8a1b7d63048728851c6003e189"],["/crystal-dashboard/static/media/sidebar-3.cd253e23.jpg","cd253e23ed052deeb80b42d2ed772183"],["/crystal-dashboard/static/media/sidebar-4.897b4cf9.jpg","897b4cf909210560a84398d36da51983"],["/crystal-dashboard/static/media/sidebar-5.08efb632.jpg","08efb632143669f82b09b39ce641a4d4"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,a){var t=new URL(e);return"/"===t.pathname.slice(-1)&&(t.pathname+=a),t.toString()},cleanResponse=function(a){return a.redirected?("body"in a?Promise.resolve(a.body):a.blob()).then(function(e){return new Response(e,{headers:a.headers,status:a.status,statusText:a.statusText})}):Promise.resolve(a)},createCacheKey=function(e,a,t,r){var c=new URL(e);return r&&c.pathname.match(r)||(c.search+=(c.search?"&":"")+encodeURIComponent(a)+"="+encodeURIComponent(t)),c.toString()},isPathWhitelisted=function(e,a){if(0===e.length)return!0;var t=new URL(a).pathname;return e.some(function(e){return t.match(e)})},stripIgnoredUrlParameters=function(e,t){var a=new URL(e);return a.hash="",a.search=a.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(a){return t.every(function(e){return!e.test(a[0])})}).map(function(e){return e.join("=")}).join("&"),a.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var a=e[0],t=e[1],r=new URL(a,self.location),c=createCacheKey(r,hashParamName,t,/\.\w{8}\./);return[r.toString(),c]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(r){return setOfCachedUrls(r).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(a){if(!t.has(a)){var e=new Request(a,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+a+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return r.put(a,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(a){return a.keys().then(function(e){return Promise.all(e.map(function(e){if(!t.has(e.url))return a.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(a){if("GET"===a.request.method){var e,t=stripIgnoredUrlParameters(a.request.url,ignoreUrlParametersMatching),r="index.html";(e=urlsToCacheKeys.has(t))||(t=addDirectoryIndex(t,r),e=urlsToCacheKeys.has(t));var c="/crystal-dashboard/index.html";!e&&"navigate"===a.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],a.request.url)&&(t=new URL(c,self.location).toString(),e=urlsToCacheKeys.has(t)),e&&a.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(t)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',a.request.url,e),fetch(a.request)}))}});