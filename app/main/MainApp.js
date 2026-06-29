import {StorageModule} from "../util/StorageModule.js";
import {MainNav} from "./MainNav.js";

export class MainApp extends StorageModule {
    #appDiv;

    constructor() {
        super("mainApp")
        this.#appDiv = document.getElementById("main-app");
        this.mainNav = new MainNav();
        this.mainNav.createNavButtons()
    }

    mount() {
        this.#appDiv.hidden = false;
        this.mainNav.switchToPage(this.mainNav.getActivePageId());
        this.mainNav.attachSwipeListeners()
    }

    unmount() {
        this.#appDiv.hidden = true;
    }
}