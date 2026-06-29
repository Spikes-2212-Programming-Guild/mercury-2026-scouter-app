import {StorageModule} from "../util/StorageModule.js";

const FIELDS = {
    ACTIVE_PAGE_TITLE: "active-page-title"
}

export class FormNav extends StorageModule {
    #navDiv;
    #formData;

    constructor(formData) {
        super('formNav')
        this.#formData = formData
        this.#navDiv = document.getElementById("form-nav");
    }

    renderNavButtons() {
        for (const pageData of this.#formData.pages) {
            const pageTitle = pageData.title;

            const button = document.createElement('button');
            button.classList.add('nav-button');
            button.id = pageTitle;
            button.textContent = pageTitle;
            button.onclick = () => this.switchToPage(pageTitle);

            this.#navDiv.append(button)
        }
    }

    switchToPage(pageTitle) {
        const old = document.querySelector('.page:not([hidden])');
        if (old) old.hidden = true

        const active = document.querySelector(`.page#${pageTitle}`)
        if (active) active.hidden = false

        this.#setActiveNavButton(pageTitle);
        this.setField(FIELDS.ACTIVE_PAGE_TITLE, pageTitle);
        this.resetViewHeight();
    }

    #setActiveNavButton(pageTitle) {
        const old = this.#navDiv.querySelector('.nav-button.active');
        old?.classList.remove('active');

        const active = this.#navDiv.querySelector(`.nav-button#${pageTitle}`);
        active?.classList.add('active');
    }

    getActivePageTitle() {
        return this.getFieldOrDefault(FIELDS.ACTIVE_PAGE_TITLE, this.#formData.pages[0].title)
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

            if (diffX > window.innerWidth * H_THRESH) {
                this.previousPage()
            } else if (diffX < -window.innerWidth * H_THRESH) {
                this.nextPage()
            }
        };

        document.ontouchstart = this._touchStartHandler;
        document.ontouchend = this._touchEndHandler;
    }

    resetViewHeight() {
        window.scrollTo(0, 0);
    }

    nextPage() {
        const current = document.querySelector('.page:not([hidden])');
        const next = current?.nextElementSibling;
        if (!next) return;
        next.hidden = false;
        current.hidden = true;
        this.setField(FIELDS.ACTIVE_PAGE_TITLE, next.id);
        this.#setActiveNavButton(next.id)
        this.resetViewHeight();
    }

    previousPage() {
        const current = document.querySelector('.page:not([hidden])');
        const prev = current?.previousElementSibling;
        if (!prev) return;
        prev.hidden = false;
        current.hidden = true;
        this.setField(FIELDS.ACTIVE_PAGE_TITLE, prev.id);
        this.#setActiveNavButton(prev.id)
        this.resetViewHeight();
    }
}
