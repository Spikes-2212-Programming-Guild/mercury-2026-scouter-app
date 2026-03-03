import {ScoutingPage} from '../pages/scouting-page/ScoutingPage.js';
import {RecordsPage} from '../pages/RecordsPage.js';
import {SettingsPage} from '../pages/SettingsPage.js';
import {getFromLocalStorage, LOCAL_STORAGE, setToLocalStorage} from "../../Storage.js";

export class MainApp {

    constructor(appContainer) {
        this.appContainer = appContainer;
        this.pages = {
            Scouting: new ScoutingPage(),
            Records: new RecordsPage(),
            Settings: new SettingsPage(),
        };
    }

    render() {
        this.renderNavigation();
        this.renderAllPages();
        const pageId = getFromLocalStorage(LOCAL_STORAGE.PAGE_ID) || Object.keys(this.pages)[0]
        this.displayPage(pageId)
    }

    renderNavigation() {
        this.navContainer = document.createElement('div');
        this.navContainer.id = 'top-navigation';
        this.appContainer.appendChild(this.navContainer);

        for (const pageId of Object.keys(this.pages)) {
            this.navContainer.appendChild(this.renderNavButton(pageId));
        }
    }

    renderNavButton(pageId) {
        const button = document.createElement('button');
        button.textContent = pageId;
        button.addEventListener('click', () => this.displayPage(pageId));
        return button;
    }

    renderAllPages() {
        this.pageContainer = document.createElement('div');
        this.pageContainer.id = 'page-container';
        this.appContainer.appendChild(this.pageContainer);

        for (const [pageId, pageObject] of Object.entries(this.pages)) {
            const pageDiv = document.createElement('div');
            pageDiv.id = pageId;

            this.pageContainer.appendChild(pageDiv);
            pageObject.render(pageDiv);
        }
    }

    displayPage(pageId) {
        setToLocalStorage(LOCAL_STORAGE.PAGE_ID, pageId);

        for (const page of this.pageContainer.children) {

            if (page.id === pageId) {
                page.classList.remove("hidden");
            } else {
                page.classList.add("hidden");
            }
        }

        for (const button of this.navContainer.children) {
            button.classList.toggle('active', button.textContent === pageId);
        }
    }
}
