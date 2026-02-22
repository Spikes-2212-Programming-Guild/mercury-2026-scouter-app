import {FormApp} from "./form/scripts/App.js";
import {MainApp} from "./main/scripts/Main.js";
import formData from './form.json' with {type: 'json'}
import {LOCAL_STORAGE, setToLocalStorage} from "./Storage.js";

const formApp = new FormApp(document.body)
const mainApp = new MainApp(document.body)

const formCss = document.getElementById('form-css')
const appCss = document.getElementById('main-css')

export function navigateToForm() {
    document.body.innerHTML = ''
    formCss.disabled = false;
    appCss.disabled = true;
    formApp.render()
}

export function navigateToMain() {
    document.body.innerHTML = ''
    formCss.disabled = true;
    appCss.disabled = false;
    mainApp.render()
}

const DEBUG = false;

if (DEBUG) {
    setToLocalStorage(LOCAL_STORAGE.FORM_DATA, JSON.stringify(formData));
    navigateToForm()
} else {
    navigateToMain();
}
