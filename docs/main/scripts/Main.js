import {ScoutingPage} from '../pages/scouting-page/ScoutingPage.js';
import {RecordsPage} from '../pages/records-page/RecordsPage.js';
import {SettingsPage} from '../pages/settings-page/SettingsPage.js';
import {getFromLocalStorage, LOCAL_STORAGE, setToLocalStorage} from "../../Storage.js";
import {SWIPE_HORIZONTAL_THRESHOLD, SWIPE_VERTICAL_THRESHOLD} from "../../config/Constants.js";

export class MainApp {


    /*
    todo:
        maybe render the objects in the constructor, and make the "pages" map
        be "page id" : "page DOM"
     */

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
        const currentPageIndex = getFromLocalStorage(LOCAL_STORAGE.CURRENT_MAIN_PAGE_INDEX) || 0;
        this.displayPage(currentPageIndex)
        this.addSwipeListeners()
    }

    renderNavigation() {
        this.navContainer = document.createElement('div');
        this.navContainer.id = 'top-navigation';
        this.appContainer.appendChild(this.navContainer);

        Object.keys(this.pages).forEach((pageName, pageIndex) => {
            this.navContainer.appendChild(this.renderNavButton(pageName, pageIndex));
        });
    }

    renderNavButton(pageName, pageIndex) {
        const button = document.createElement('button');
        button.textContent = pageName;
        button.addEventListener('click', () => this.displayPage(pageIndex));
        return button;
    }

    renderAllPages() {
        this.pageContainer = document.createElement('div');
        this.pageContainer.id = 'page-container';
        this.appContainer.appendChild(this.pageContainer);

        for (const [pageId, pageObject] of Object.entries(this.pages)) {
            const pageDiv = document.createElement('div');
            pageDiv.id = pageId;
            pageDiv.classList.add('page');

            this.pageContainer.appendChild(pageDiv);
            pageObject.render(pageDiv);
        }
    }

    displayPage(pageIndex) {
        setToLocalStorage(LOCAL_STORAGE.CURRENT_MAIN_PAGE_INDEX, pageIndex);
        Object.values(this.pageContainer.children).forEach((page, index) => {

            if (index === pageIndex) {
                page.classList.remove("hidden");
            } else {
                page.classList.add("hidden");
            }

        });

        Object.values(this.navContainer.children).forEach((button, index) => {
            button.classList.toggle('active', index === pageIndex);
        });
    }

    removeSwipeListeners() {
        if (this._touchStartHandler) {
            document.removeEventListener("touchstart", this._touchStartHandler);
            document.removeEventListener("touchend", this._touchEndHandler);
        }
    }

    addSwipeListeners() {
        let startX = 0, startY = 0;

        if (this._touchStartHandler) {
            document.removeEventListener("touchstart", this._touchStartHandler);
            document.removeEventListener("touchend", this._touchEndHandler);
        }

        this._touchStartHandler = e => {
            const t = e.touches[0];
            startX = t.clientX;
            startY = t.clientY;
        };

        const movePage = (direction) => {
            const currentPageIndex = getFromLocalStorage(LOCAL_STORAGE.CURRENT_MAIN_PAGE_INDEX);
            const pageAmount = Object.keys(this.pages).length;
            const newPageIndex =
                Math.max(0, Math.min(currentPageIndex + direction, pageAmount - 1));
            this.displayPage(newPageIndex);
        }

        this._touchEndHandler = e => {
            const t = e.changedTouches[0];
            const endX = t.clientX;
            const endY = t.clientY;

            const diffX = endX - startX;
            const diffY = endY - startY;

            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            if (Math.abs(diffY) > screenHeight * SWIPE_VERTICAL_THRESHOLD) return;

            if (diffX > screenWidth * SWIPE_HORIZONTAL_THRESHOLD) {
                movePage(-1);
            } else if (diffX < -screenWidth * SWIPE_HORIZONTAL_THRESHOLD) {
                movePage(1);
            }
        };

        document.addEventListener("touchstart", this._touchStartHandler);
        document.addEventListener("touchend", this._touchEndHandler);
    }
}
