import {getFromLocalStorage, LOCAL_STORAGE, setToLocalStorage} from "../../../../Storage.js";
import {FormService} from "./FormService.js";
import {navigateToForm} from "../../../../Router.js";

export class ScoutingPage {

    constructor() {
        this.formService = new FormService();
        this.saveTimeout = null;
    }

    /*

    disable the buttons visually when no id

     */

    render(container) {
        const title = document.createElement('h1');
        title.textContent = 'Scouting';

        this.versionTitle = document.createElement('h2');
        this.status = document.createElement("h2");

        this.formIdInput = document.createElement("input");
        this.formIdInput.placeholder = "Enter your team's form ID";
        this.formIdInput.type = "text";
        this.formIdInput.value = getFromLocalStorage(LOCAL_STORAGE.FORM_ID) || "";
        this.formIdInput.addEventListener("input", () => {
            clearTimeout(this.saveTimeout);
            this.saveTimeout = setTimeout(() => {
                setToLocalStorage(LOCAL_STORAGE.FORM_ID, this.formIdInput.value);
                this.updateVersionTitle();
            }, 300); // too low
        });

        const updateButton = document.createElement("button");
        updateButton.textContent = "Load Latest Version";
        updateButton.addEventListener("click", () => this.loadLatest());

        const startButton = document.createElement("button");
        startButton.textContent = "Start Scouting";
        startButton.addEventListener("click", () => this.startScouting());

        container.append(
            title,
            this.versionTitle,
            updateButton,
            startButton,
            this.formIdInput,
            this.status
        );

        container.append(
            title, this.versionTitle, updateButton,
            startButton, this.formIdInput, this.status
        );

        this.updateVersionTitle();

        // Auto-fetch on startup
        const formId = this.formIdInput.value;
        if (formId && navigator.onLine) {
            this.loadLatest(false);
        }
    }

    updateVersionTitle() {
        const formId = this.formIdInput.value;
        const existing = this.formService.getForm(formId);

        this.versionTitle.textContent = existing
            ? `Form Version: ${existing.version}`
            : "Form Version: Not loaded";
    }

    setStatus(message, isError = false) {
        this.status.textContent = message;
        this.status.style.color = isError ? "red" : "inherit";
    }

    async loadLatest(showStatus = true) {
        const formId = this.formIdInput.value;

        if (showStatus) this.setStatus("Checking for updates...");

        const result = await this.formService.fetchForm(formId);
        this.setStatus(result.status)
        this.updateVersionTitle();
    }

    startScouting() {
        const formId = this.formIdInput.value;
        const existing = this.formService.getForm(formId);

        if (!existing) {
            this.setStatus("Invalid form — please load it first", true);
            return;
        }

        navigateToForm();
    }
}
