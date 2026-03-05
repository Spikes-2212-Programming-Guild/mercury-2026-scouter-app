import {FormApp} from "./form/scripts/App.js";
import {MainApp} from "./main/scripts/Main.js";
import {getFromLocalStorage, LOCAL_STORAGE, setToLocalStorage} from "./Storage.js";

// clearLocalStorage()


if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js");
}

function removeService() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
                registration.unregister().then(success => {
                    if (success) {
                        console.log('Service worker unregistered');
                    }
                });
            });
        });
    }
    caches.keys().then(keys => {
        keys.forEach(key => caches.delete(key));
    });
}

setToLocalStorage(LOCAL_STORAGE.CURRENT_FORM_ID, "matchDis2")
setToLocalStorage(LOCAL_STORAGE.CURRENT_FORM_VERSION, "69")

const formApp = new FormApp(document.body)
const mainApp = new MainApp(document.body)

const formCss = document.getElementById('form-css')
const appCss = document.getElementById('main-css')

export function navigateToForm() {
    mainApp.removeSwipeListeners();
    document.body.innerHTML = ''
    formCss.disabled = false;
    appCss.disabled = true;
    formApp.render()
    setToLocalStorage(LOCAL_STORAGE.CURRENT_APP, 'form')
}

export function navigateToMain() {
    formApp.removeSwipeListeners();
    document.body.innerHTML = ''
    formCss.disabled = true;
    appCss.disabled = false;
    mainApp.render()
    setToLocalStorage(LOCAL_STORAGE.CURRENT_APP, 'main')
}

const currentApp = getFromLocalStorage(LOCAL_STORAGE.CURRENT_APP)

if (currentApp === 'form') {
    navigateToForm()
} else {
    navigateToMain()
}
