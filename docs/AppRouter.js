import {FormApp} from "./form/FormApp.js";
import {StorageModule} from "./util/StorageModule.js";
import settings from "./Settings.js";
import {MainApp} from "./main/MainApp.js";

const FIELDS = {
    ACTIVE_APP: "active-docs",
    FORM_APP: "form",
    MAIN_APP: "main",
};

export class AppRouter extends StorageModule {

    constructor() {
        super("appRouter")
        this.formApp = new FormApp();
        this.mainApp = new MainApp();
        settings.applySettings();

        if (this.getField(FIELDS.ACTIVE_APP) === FIELDS.FORM_APP) {
            this.switchToForm()
        } else {
            this.switchToMain()
        }
    }

    switchToForm() {
        this.mainApp.unmount();
        this.formApp.mount();
        this.setField(FIELDS.ACTIVE_APP, FIELDS.FORM_APP);
    }

    switchToMain() {
        this.formApp.unmount()
        this.mainApp.mount()
        this.setField(FIELDS.ACTIVE_APP, FIELDS.MAIN_APP);
    }
}

const router = new AppRouter();
export default router;
