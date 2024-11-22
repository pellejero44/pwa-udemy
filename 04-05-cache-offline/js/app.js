

if ( navigator.serviceWorker ) {
    navigator.serviceWorker.register('/sw.js');
}

// if(window.caches) {
//     caches.open('prueba')
//         .then(cache => {
//             cache.addAll([
//                 '/index.html',
//                 '/css/style.css',
//                 '/img/main.jpg',
//                 '/js/app.js'
//             ]);
//         });
// }