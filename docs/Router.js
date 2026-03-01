import {FormApp} from "./form/scripts/App.js";
import {MainApp} from "./main/scripts/Main.js";
import {clearLocalStorage, getFromLocalStorage, LOCAL_STORAGE, setToLocalStorage} from "./Storage.js";

const formApp = new FormApp(document.body)
const mainApp = new MainApp(document.body)

const formCss = document.getElementById('form-css')
const appCss = document.getElementById('main-css')

export function navigateToForm() {
    document.body.innerHTML = ''
    formCss.disabled = false;
    appCss.disabled = true;
    formApp.render()
    setToLocalStorage(LOCAL_STORAGE.CURRENT_APP, 'form')
}

export function navigateToMain() {
    document.body.innerHTML = ''
    formCss.disabled = true;
    appCss.disabled = false;
    mainApp.render()
    setToLocalStorage(LOCAL_STORAGE.CURRENT_APP, 'main')
}

const currentApp = getFromLocalStorage(LOCAL_STORAGE.CURRENT_APP)
// setToLocalStorage(LOCAL_STORAGE.FORM_DATA, JSON.stringify(formData));

clearLocalStorage()

if (currentApp === 'form') {
    navigateToForm()
} else {
    navigateToMain()
}
