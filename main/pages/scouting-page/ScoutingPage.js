import {FormService} from "./FormService.js";
import {navigateToForm} from "../../../Router.js";

export class ScoutingPage {

    constructor() {
        //TODO: maybe put it on "render()"
        this.formService = new FormService();
    }

    /*

    TODO:
        make the networking stuff not block everything,
        just what is needed

    TODO:
        add a checkmark if you're ready to start scouting
        or some other indicator

    TODO:
        when switching id, it doesn't update the version.
        should be: not available / the latest cached version

    TODO:
        switch the alerts to something better!

     */

    render(container) {

        container.append(this.renderStartButton());
    }

    renderStartButton() {
        const startButton = document.createElement('button');
        startButton.onclick = () => this.startScouting();
        startButton.textContent = "Start Scouting"
        return startButton;
    }

    // TODO: maybe turn it into an inner function
    startScouting() {
        // const form = this.formService.getCurrentForm()
        //
        // if (!form) {
        //     alert('Invalid form, please reload')
        //     return;
        // }

        navigateToForm();
    }

    /*
        disable sending another request until the former is returned
        maybe make it so if you press "start" it will cancel the sending
     */
    async reloadForm() {
        const {form, status} = await this.formService.fetchCurrentForm()

        if (!form) {
            alert(status)
        }

        const formVersion = this.formService.getCurrentFormVersion();
        this.updateVersionDisplay(formVersion)
    }

    renderNameInput() {

        const container = document.createElement('div')
        container.classList.add('field');
        container.id = 'name-field'

        const label = document.createElement('label');
        label.id = 'name-label'
        label.textContent = 'Form Name:'

        /*
        TODO:
         instead of a normal input, add a datalist
         to make it show the saved forms from local storage as options
         */

        const nameInput = document.createElement('input');
        nameInput.id = 'name-input';
        nameInput.placeholder = 'enter a form name'
        nameInput.value = this.formService.getCurrentFormId();
        nameInput.onchange = () => {
            this.formService.setCurrentFormId(nameInput.value)
        }

        container.append(label, nameInput)
        return container;
    }

    renderReloadButton() {
        const reloadButton = document.createElement('button');
        reloadButton.onclick = async () => await this.reloadForm();
        reloadButton.textContent = "Reload Form"
        return reloadButton;
    }

    renderVersionDisplay() {
        const container = document.createElement('div')
        container.id = 'version-field'
        container.classList.add('field');

        const label = document.createElement('label');
        label.textContent = 'Form Version:'
        label.id = 'version-label'

        const versionDisplay = document.createElement('span');
        versionDisplay.id = 'version-span'
        versionDisplay.textContent =
            this.formService.getCurrentFormVersion() ?? 'Not Available'

        this.updateVersionDisplay = (newVersion) => {
            versionDisplay.textContent = newVersion ?? 'Not Available'
        }

        container.append(label, versionDisplay)
        return container;
    }
}
