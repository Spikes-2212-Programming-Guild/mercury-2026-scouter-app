import {StorageModule} from "../../util/StorageModule.js";

export class BaseQuestion extends StorageModule {

    constructor(data, pageTitle) {
        super(data.id);
        this.data = data;
        this.pageTitle = pageTitle;
        this.id = data.id;
        this.title = data.title;
        this.required = data.required ?? false;
    }

    render() {
    }

    getAnswer() {
    }

    clear() {
    }

    isValid() {
    }

    focus() {
    }

    setOutline(isValid) {
    }
}