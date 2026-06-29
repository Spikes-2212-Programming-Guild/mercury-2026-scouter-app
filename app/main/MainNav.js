import {StorageModule} from "../util/StorageModule.js";
import {RecordsPage} from "./pages/RecordsPage.js";
import {SettingsPage} from "./pages/SettingsPage.js";
import {MainPage} from "./pages/MainPage.js";

const FIELDS = {
    ACTIVE_PAGE_ID: "active-page-id",
}

const PAGES = [
    {id: 'main', label: 'Main', PageClass: MainPage},
    {id: 'records', label: 'Records', PageClass: RecordsPage},
    {id: 'settings', label: 'Settings', PageClass: SettingsPage},
];

export class MainNav extends StorageModule {
    #navDiv;
    #pageDiv;

    constructor() {
        super('mainNav')
        this.#navDiv = document.getElementById("main-nav");
        this.#pageDiv = document.getElementById("main-page");
    }

    createNavButtons() {
        for (const page of PAGES) {
            const navButton = document.createElement("button");
            navButton.classList.add("nav-button");
            navButton.id = page.id;
            navButton.textContent = page.label;
            navButton.onclick = () => this.switchToPage(page.id);
            this.#navDiv.appendChild(navButton);
        }
    }

    switchToPage(pageId) {
        const PageClass = PAGES.find(p => p.id === pageId).PageClass
        this.activePage = new PageClass(pageId);
        this.activePage.mount(this.#pageDiv);
        this.setField(FIELDS.ACTIVE_PAGE_ID, pageId);
        this.#setActiveNavButton(pageId);
    }

    #setActiveNavButton(pageId) {
        const old = this.#navDiv.querySelector('.nav-button.active');
        if (old) {
            old.classList.remove('active');
        }

        const button = this.#navDiv.querySelector(`.nav-button#${pageId}`);
        if (button) {
            button.classList.add('active');
        }
    }

    getActivePageId() {
        return this.getFieldOrDefault(FIELDS.ACTIVE_PAGE_ID, PAGES[0].id)
    }

    attachSwipeListeners() {
        let startX = 0, startY = 0;
        const V_THRESH = 0.2, H_THRESH = 0.25;

        this._touchStartHandler = ({touches: [t]}) => {
            startX = t.clientX;
            startY = t.clientY;
        };

        this._touchEndHandler = ({changedTouches: [t]}) => {
            const diffX = t.clientX - startX;
            const diffY = t.clientY - startY;

            if (Math.abs(diffY) > window.innerHeight * V_THRESH) return;
            if (Math.abs(diffX) <= window.innerWidth * H_THRESH) return;

            const currentId = this.getActivePageId();
            const currentIndex = PAGES.findIndex(p => p.id === currentId)

            let newIndex = currentIndex + (diffX > 0 ? -1 : 1) // prev or next
            newIndex = Math.max(0, Math.min(newIndex, PAGES.length - 1)); // clamp

            if (newIndex === currentIndex) return;
            this.switchToPage(PAGES[newIndex].id);
        };

        document.ontouchstart = this._touchStartHandler;
        document.ontouchend = this._touchEndHandler;
    }
}
