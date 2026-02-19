import {getFromLocalStorage, LOCAL_STORAGE, setToLocalStorage} from "../../../Storage.js";
import {SERVER_URL} from "../Constants.js";
import {navigateToForm} from "../../../Router.js";

export class ScoutingPage {

    render(container) {
        const title = document.createElement('h1');
        title.textContent = 'Scouting';

        const versionTitle = document.createElement('h2');
        const updateVersionTitle = () => {
            const version = getFromLocalStorage(LOCAL_STORAGE.FORM_VERSION);
            versionTitle.textContent = version
                ? `Form Version: ${version}`
                : 'Form Version: Not loaded';
        };
        updateVersionTitle();

        const startButton = document.createElement('button');
        startButton.textContent = 'Start Scouting';
        startButton.addEventListener('click', () => {

            const formId = getFromLocalStorage(LOCAL_STORAGE.FORM_ID);
            const formData = getFromLocalStorage(LOCAL_STORAGE.FORM_DATA);
            const formVersion = getFromLocalStorage(LOCAL_STORAGE.FORM_VERSION);

            if (formVersion && formId && formData) {
                navigateToForm()
            } else {
                alert("invalid form, please update")
            }

        });

        const formIdInput = document.createElement('input');
        formIdInput.placeholder = "enter your team's form id";
        formIdInput.type = 'text';
        formIdInput.value = getFromLocalStorage(LOCAL_STORAGE.FORM_ID);
        formIdInput.addEventListener('change', () => {
            setToLocalStorage(LOCAL_STORAGE.FORM_ID, formIdInput.value);
        });

        const updateFormButton = document.createElement('button');
        updateFormButton.textContent = 'Load latest version';
        updateFormButton.addEventListener('click', async () => {
            await this.fetchForm();
            updateVersionTitle();
        });

        container.append(title, versionTitle, updateFormButton, startButton, formIdInput);
    }

    /*

        TODO:
         1. on startup try to fetch the form
         2. make it try to fetch every 5min
         3. instead of only saving only one form (e.g theSpikes2026)
            save in a map by id
     */

    async fetchForm() {

        const formId = getFromLocalStorage(LOCAL_STORAGE.FORM_ID);
        const formVersion = getFromLocalStorage(LOCAL_STORAGE.FORM_VERSION);

        if (!formId) {
            alert("Form ID is required");
            return;
        }

        const response = await fetch(`${SERVER_URL}/get-form/${formId}/${formVersion}`)
        console.log(response)

        if (response.status === 304) {
            console.log("No changes");
            return;
        }

        if (!response.ok) {
            console.error(response.statusText);
            return;
        }

        const { form, version } = await response.json();

        setToLocalStorage(LOCAL_STORAGE.FORM_DATA, form);
        setToLocalStorage(LOCAL_STORAGE.FORM_VERSION, version);
        console.log(`Loaded form version ${version}`);
    }
}
