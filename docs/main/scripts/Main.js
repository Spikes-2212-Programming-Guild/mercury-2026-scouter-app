import {AboutPage} from './pages/AboutPage.js';
import {ScoutingPage} from './pages/ScoutingPage.js';
import {RecordingsPage} from './pages/RecordingsPage.js';
import {SettingsPage} from './pages/SettingsPage.js';
import {getFromLocalStorage, LOCAL_STORAGE, setToLocalStorage} from "../../Storage.js";

export class MainApp {

    constructor(appContainer) {
        this.appContainer = appContainer;
        this.pages = {
            Scouting: new ScoutingPage(),
            Recordings: new RecordingsPage(),
            Settings: new SettingsPage(),
            About: new AboutPage(),
        };
    }

    render() {
        this.renderNavigation();
        this.renderAllPages();
        const pageId = getFromLocalStorage(LOCAL_STORAGE.PAGE_ID) || Object.keys(this.pages)[0]
        this.displayPage(pageId)
    }

    renderNavigation() {
        const container = document.createElement('div');
        container.id = 'bottom-navigation';
        this.appContainer.appendChild(container);

        for (const pageId of Object.keys(this.pages)) {
            container.appendChild(this.renderNavButton(pageId));
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
            pageDiv.hidden = true;
            this.pageContainer.appendChild(pageDiv);

            pageObject.render(pageDiv);
        }
    }

    displayPage(pageId) {
        setToLocalStorage(LOCAL_STORAGE.PAGE_ID, pageId);
        for (const page of this.pageContainer.children) {
            page.hidden = page.id !== pageId;
        }
    }
}
