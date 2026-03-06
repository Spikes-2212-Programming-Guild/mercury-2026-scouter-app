const CACHE_NAME = 'Mercury2026';

const FILES_TO_CACHE = [
    './',
    './index.html',
    './form.json',
    './Router.js',
    './Storage.js',
    './config/constants.css',
    './config/Constants.js',
    './config/colorThemes.css',
    './main/style/main.css',
    './main/style/pages.css',
    './main/style/top-navigation.css',
    './main/scripts/Main.js',
    './main/pages/records-page/RecordsPage.js',
    './main/pages/scouting-page/FormService.js',
    './main/pages/scouting-page/scouting-page.css',
    './main/pages/scouting-page/ScoutingPage.js',
    './main/pages/settings-page/SettingsPage.js',
    './form/style/top-navigation.css',
    './form/style/form.css',
    './form/style/bottom-navigation.css',
    './form/scripts/App.js',
    './form/scripts/SubmissionManager.js',
    './form/questions/question.css',
    './form/questions/autocomplete/AutoComplete.js',
    './form/questions/checkbox/checkbox.css',
    './form/questions/checkbox/CheckBox.js',
    './form/questions/inputbox/inputbox.css',
    './form/questions/inputbox/InputBox.js',
    './form/questions/list/list.css',
    './form/questions/list/List.js',
    './form/questions/radio/radio.css',
    './form/questions/radio/Radio.js',
    './form/questions/scorebox/scorebox.css',
    './form/questions/scorebox/ScoreBox.js',
    './form/questions/test/test.css',
    './form/questions/test/Test.js',
    './form/questions/textarea/textarea.css',
    './form/questions/textarea/TextArea.js',
    './form/questions/tripleScoreBox/triplescorebox.css',
    './form/questions/tripleScoreBox/TripleScoreBox.js',
];

self.addEventListener("install", event => {

    console.log("SW install");

    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Caching files");
            return cache.addAll(FILES_TO_CACHE);
        })
    );

});

self.addEventListener("activate", event => {

    console.log("SW activate");

    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        console.log("Deleting old cache:", key);
                        return caches.delete(key);
                    }
                })
            )
        )
    );

});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.open(CACHE_NAME).then(cache =>
            cache.match(event.request).then(cachedResponse => {
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    // Update cache with new response
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(() => {
                    // If offline and not in cache, just fail
                });

                // Return cached response immediately if available, else wait for network
                return cachedResponse || fetchPromise;
            })
        )
    );
});