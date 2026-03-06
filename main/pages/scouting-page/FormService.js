import {getFromLocalStorage, LOCAL_STORAGE, setToLocalStorage} from "../../../Storage.js";
import {SERVER_URL} from "../../../config/Constants.js";

export class FormService {

    constructor() {
        this.isFetching = false;
    }

    getAllForms() {
        return getFromLocalStorage(LOCAL_STORAGE.SAVED_FORMS) || {};
    }

    getForm(formId) {
        const forms = this.getAllForms();
        return forms[formId] || null;
    }

    saveForm(formId, form, version) {
        const forms = this.getAllForms();
        forms[formId] = {form, version};
        setToLocalStorage(LOCAL_STORAGE.SAVED_FORMS, forms);
    }

    async fetchCurrentForm() {
        const formId = this.getCurrentFormId()
        const status = await this.fetchForm(formId)
        console.log(status) // debug

        const form = this.getForm(formId)

        if (form) {
            this.setCurrentFormVersion(form.version)
        }

        return {form, status};
    }

    getCurrentForm() {
        const formId = this.getCurrentFormId()
        return this.getForm(formId);
    }

    async fetchForm(formId) {
        if (this.isFetching) return "busy";
        if (!formId) return "Form ID required";

        this.isFetching = true;

        const existing = this.getForm(formId);
        const version = existing?.version ?? -1;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5 * 1000);

        try {
            const response = await fetch(
                `${SERVER_URL}/get-form/${formId}/${version}`,
                {signal: controller.signal}
            );

            clearTimeout(timeout);

            if (response.status === 304) {
                return "Form already up to date";
            }

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const {form, version: newVersion} = await response.json();
            this.saveForm(formId, form, newVersion);

            return "Successfully updated form";

        } catch (e) {
            console.error(e);
            if (existing) {
                return "Offline - using saved version"
            } else {
                return "Failed to load form"
            }
        } finally {
            this.isFetching = false;
        }
    }

    setCurrentFormId(newId) {
        setToLocalStorage(LOCAL_STORAGE.CURRENT_FORM_ICD, newId);
    }

    getCurrentFormId() {
        return getFromLocalStorage(LOCAL_STORAGE.CURRENT_FORM_ID);
    }

    setCurrentFormVersion(newVersion) {
        setToLocalStorage(LOCAL_STORAGE.CURRENT_FORM_VERSION, newVersion);
    }

    getCurrentFormVersion() {
        return getFromLocalStorage(LOCAL_STORAGE.CURRENT_FORM_VERSION);
    }
}