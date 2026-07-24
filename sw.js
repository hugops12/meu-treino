const CACHE_NAME =
    "meu-treino-v6-1";


const FILES_TO_CACHE = [

    "./",

    "./index.html",

    "./manifest.json",

    "./sw.js",

    "./icons/icon-192.png",

    "./icons/icon-512.png",

    "./icons/icon-maskable-512.png",

    "./icons/splash.png"

];


self.addEventListener(

    "install",

    event => {

        event.waitUntil(

            caches.open(

                CACHE_NAME

            )

            .then(

                cache =>

                    cache.addAll(

                        FILES_TO_CACHE

                    )

            )

        );


        self.skipWaiting();

    }

);


self.addEventListener(

    "activate",

    event => {

        event.waitUntil(

            caches.keys()

            .then(

                keys =>

                    Promise.all(

                        keys

                        .filter(

                            key =>

                                key !==
                                CACHE_NAME

                        )

                        .map(

                            key =>

                                caches.delete(
                                    key
                                )

                        )

                    )

            )

        );


        self.clients.claim();

    }

);


self.addEventListener(

    "fetch",

    event => {

        event.respondWith(

            caches.match(
                event.request
            )

            .then(

                cachedResponse => {

                    if (
                        cachedResponse
                    ) {

                        return cachedResponse;

                    }


                    return fetch(
                        event.request
                    )

                    .then(

                        response => {

                            if (

                                !response
                                ||
                                response.status !== 200
                                ||
                                response.type === "opaque"

                            ) {

                                return response;

                            }


                            const cloned =
                                response.clone();


                            caches.open(
                                CACHE_NAME
                            )

                            .then(

                                cache =>

                                    cache.put(

                                        event.request,

                                        cloned

                                    )

                            );


                            return response;

                        }

                    );

                }

            )

        );

    }

);