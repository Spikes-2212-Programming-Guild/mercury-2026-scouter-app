import {FormBuilder} from "./FormBuilder.js";
import appRouter from "../AppRouter.js";
import formData from "../data/formData.json" with {type: "json"};
import {FormNav} from "./FormNav.js";
import submissionManager from "./SubmissionManager.js";

export class FormApp {
    #appDiv;
    #formNav;
    #questions;

    constructor() {
        this.#appDiv = document.getElementById("form-app");

        this.#formNav = new FormNav(formData);
        this.#formNav.renderNavButtons()

        const builder = new FormBuilder(formData, this.#formNav);
        this.#questions = builder.buildForm()

        this.#attachEvents()
    }

    #attachEvents() {
        document.getElementById('back-button').onclick = () => appRouter.switchToMain();

        // TODO: move to FormNav
        document.getElementById('next-button').onclick = () => this.#formNav.nextPage();
        document.getElementById('previous-button').onclick = () => this.#formNav.previousPage();

        document.getElementById('clear-button').onclick = () => {
            if (confirm("Confirm Clear All")) this.clear()
        };
        document.getElementById('submit-button').onclick = () => {
            this.submit()
        };
    }

    mount() {
        this.#appDiv.hidden = false;
        this.#formNav.switchToPage(this.#formNav.getActivePageTitle()) // TODO: improve
        this.#formNav.attachSwipeListeners()
    }

    unmount() {
        this.#appDiv.hidden = true;
    }

    submit() {
        const answers = {}

        for (const q of Object.values(this.#questions)) {
            if (q.isValid()) {
                const answer = q.getAnswer();

                if (answer !== null && typeof answer === 'object' && !Array.isArray(answer)) {
                    for (const [key, val] of Object.entries(answer)) {
                        answers[`${q.id}-${key}`] = val;
                    }
                } else {
                    answers[q.id] = answer;
                }

                q.setOutline(true);
            } else {
                console.warn(`${q.id} invalid`);
                this.#formNav.switchToPage(q.pageTitle);
                q.focus();
                q.setOutline(false);
                return;
            }
        }

        if (!confirm("Confirm Submit")) return;

        console.log(answers)
        submissionManager.addSubmission(answers);
        this.reset()
        appRouter.switchToMain()
    }

    reset() {
        this.clear()
        this.#formNav.switchToPage('Pre')
    }

    clear() {
        Object.values(this.#questions).forEach(q => q.clear());
    }
}
