import {getFromLocalStorage, LOCAL_STORAGE, setToLocalStorage} from "../../../../Storage.js";
import {SERVER_URL} from "../../../../config/Constants.js";

export class FormService {

    constructor() {
        this.isFetching = false;
    }

    getAllForms() {
        return getFromLocalStorage(LOCAL_STORAGE.FORMS) || {};
    }

    getForm(formId) {
        const forms = this.getAllForms();
        return forms[formId] || null;
    }

    saveForm(formId, form, version) {
        const forms = this.getAllForms();
        forms[formId] = { form, version };
        setToLocalStorage(LOCAL_STORAGE.FORMS, forms);
    }

    async fetchForm(formId) {
        if (this.isFetching) return { status: "busy" };
        if (!formId) return { status: "Form ID required" };

        this.isFetching = true;

        const existing = this.getForm(formId);
        const version = existing?.version ?? -1;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5 * 1000);

        try {
            const response = await fetch(
                `${SERVER_URL}/get-form/${formId}/${version}`,
                { signal: controller.signal }
            );

            clearTimeout(timeout);

            if (response.status === 304) {
                return { status: "Form already up to date" };
            }

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const { form, version: newVersion } = await response.json();
            this.saveForm(formId, form, newVersion);

            return { status: "Successfully updated form", version: newVersion };

        } catch (e) {
            console.error(e);
            if (existing) {
                return { status: "Offline - using saved version" }
            } else {
                return { status: "Failed to load form" };
            }
        } finally {
            this.isFetching = false;
        }
    }
}