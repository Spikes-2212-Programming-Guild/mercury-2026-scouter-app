import {
    AUTO_DURATION_MS,
    AUTO_PAGE_INDEX,
    PRESENT_TOP_NAVIGATION_BUTTONS,
    SWIPE_HORIZONTAL_THRESHOLD,
    SWIPE_VERTICAL_THRESHOLD,
    TELEOP_PAGE_INDEX,
    TRIGGER_ID
} from "../config/Constants.js";
import {getFromLocalStorage, LOCAL_STORAGE, removeFromLocalStorage, setToLocalStorage} from "../../Storage.js";
import {renderRadio} from "../questions/radio/Radio.js";
import {renderList} from "../questions/list/List.js";
import {renderAutoComplete} from "../questions/autocomplete/AutoComplete.js";
import {renderScoreBox} from "../questions/scorebox/ScoreBox.js";
import {renderRangeBox} from "../questions/rangebox/RangeBox.js";
import {renderTextArea} from "../questions/textarea/TextArea.js";
import {renderInputBox} from "../questions/inputbox/InputBox.js";

const questionRenderers = {
    'InputBox': renderInputBox,
    'Radio': renderRadio,
    'List': renderList,
    'AutoComplete': renderAutoComplete,
    'ScoreBox': renderScoreBox,
    'TextArea': renderTextArea,
    'RangeBox': renderRangeBox,
};

/*
   TODO:
    1. maybe make it so instead of +/-5 it will be 1/5/10
    2. try to find a way to prevent people scouting to the same robot
    3. make all question inputs the same size for a more concrete app
    4. make misses for 1-3 or verbal description
    5. make the top navigation bar a slider!

 */

export class FormApp {

    constructor(appContainer) {
        this.appContainer = appContainer;
    }

    render() {

        const formData = getFromLocalStorage(LOCAL_STORAGE.FORM_DATA);

        if (!formData) return;

        this.form = JSON.parse(formData)

        this.pageQuestions = this.indexAllPages()
        this.renderTopNavigationBar()
        this.renderAllPages();
        this.renderClearAllButton();
        this.renderBottomNavigationBar()

        this.autoStartTeleop();
        this.setUpSwipeListeners();

        this.displayPage(Number(getFromLocalStorage(LOCAL_STORAGE.PAGE_INDEX) || 0));
    }

    traverseRecursively(node, visit) {
        if (node.type === "container") {
            for (const child of node.questions) {
                this.traverseRecursively(child, visit);
            }
        } else {
            visit(node)
        }
    }

    indexAllPages() {
        let questionMap = new Map();
        for (const pageData of this.form.pages) {
            questionMap.set(pageData.title, this.indexPage(pageData.questions))
        }
        return questionMap;
    }

    indexPage(pageQuestions) {
        let questions = new Map()
        for (const node of pageQuestions) {
            this.traverseRecursively(node, questionData => {
                questions.set(questionData.id, questionData);
            });
        }
        return questions;
    }

    clearAllQuestions() {
        for (const pageData of this.form.pages) {
            for (const questionData of this.pageQuestions.get(pageData.title).values()) {

                removeFromLocalStorage(questionData.id);

                const renderer = questionRenderers[questionData.type];
                if (!renderer) {
                    throw new Error(`Unknown question type: ${questionData.type}`);
                }

                renderer(questionData);
            }
        }
    }

    displayPage(pageIndex) {
        const buttons = document.getElementById('top-navigation').children;
        const pages = document.getElementById('page-container').children;

        document.documentElement.setAttribute('data-theme', this.form.pages[pageIndex].color_theme);

        const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
        const max = PRESENT_TOP_NAVIGATION_BUTTONS;
        const total = this.form.pages.length;
        const half = Math.floor(max / 2);

        for (let i = 0; i < this.form.pages.length; i++) {
            pages[i].hidden = pageIndex !== i;
            buttons[i].classList.toggle('active', pageIndex === i);

            // only show a specific amount of buttons each time
            const start = clamp(pageIndex - half, 0, Math.max(0, total - max));
            const end = Math.min(total - 1, start + max - 1);
            buttons[i].hidden = i < start || i > end;
        }

        window.scrollTo(0, 0);
        setToLocalStorage(LOCAL_STORAGE.PAGE_INDEX, pageIndex);
    }

    renderAllPages() {
        const container = document.createElement('div');
        container.id = 'page-container';

        for (const pageData of this.form.pages) {
            const page = this.renderPage(pageData);
            page.hidden = true;
            container.appendChild(page);
        }

        this.appContainer.appendChild(container);
    }

    renderPage(pageData) {
        const page = document.createElement('div');

        page.appendChild(document.createElement('br')); // TODO - remove this shit

        for (const questionData of pageData.questions) {
            page.appendChild(this.renderNode(questionData))
        }

        return page;
    }

    renderNode(node, depth = 0) {
        if (node.type !== "container") {
            return this.createQuestion(node);
        }

        const container = document.createElement('fieldset');
        container.classList.add(
            'question-container',
            'depth',
            `depth-${depth}`
        );

        container.style.flexDirection = node.align === "horizontal" ? "row" : "column";

        const title = document.createElement('legend');
        title.textContent = node.title;
        title.classList.add('container-title', `depth-${depth}`);
        container.appendChild(title);

        for (const child of node.questions) {
            container.appendChild(this.renderNode(child, depth + 1));
        }

        return container
    }

    createQuestion(questionData) {
        const container = document.createElement('div');
        container.classList.add("question", questionData.type);
        if (questionData.align === "horizontal") {
            container.classList.add('horizontal')
        }

        const title = document.createElement('h1');
        title.textContent = questionData.title;
        container.appendChild(title);

        const renderer = questionRenderers[questionData.type];
        if (!renderer) {
            throw new Error(`Unknown question type: ${questionData.type}`);
        }

        renderer(questionData, container);
        return container;
    }

    renderClearAllButton() {
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Clear All';
        resetButton.id = 'clear-all-button';
        resetButton.onclick = () => {
            if (!confirm("Confirm Clear")) return;
            this.clearAllQuestions()
            this.displayPage(0);
        }
        this.appContainer.appendChild(resetButton);
    }

    renderTopNavigationBar() {
        const topNavContainer = document.createElement('div')
        topNavContainer.id = 'top-navigation'

        this.form.pages.forEach((p, i) => {
            const button = document.createElement('button');
            button.textContent = p.title;
            button.onclick = () => this.displayPage(i);
            topNavContainer.appendChild(button);
        });

        this.appContainer.appendChild(topNavContainer);
    }


    renderBottomNavigationBar() {
        const bottomNavContainer = document.createElement('div');
        bottomNavContainer.id = 'bottom-navigation';

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.id = 'next-button';
        nextButton.onclick = () => this.nextPage();

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.id = 'submit-button';
        submitButton.onclick = () => this.submitAllAnswers();

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.id = 'previous-button';
        prevButton.onclick = () => this.previousPage();

        bottomNavContainer.appendChild(prevButton);
        bottomNavContainer.appendChild(submitButton);
        bottomNavContainer.appendChild(nextButton);
        this.appContainer.appendChild(bottomNavContainer);
    }

    nextPage() {
        let cur = getFromLocalStorage(LOCAL_STORAGE.PAGE_INDEX ?? 0);
        cur++;
        if (this.form.pages.length === cur) return;
        this.displayPage(cur);
    }

    previousPage() {
        let cur = getFromLocalStorage(LOCAL_STORAGE.PAGE_INDEX ?? 0);
        cur--;
        if (cur < 0) return;
        this.displayPage(cur);
    }

    submitAllAnswers() {
        let answers = {}

        for (let pageIndex = 0; pageIndex < this.form.pages.length; pageIndex++) {
            const pageData = this.form.pages[pageIndex];

            for (const questionId of this.pageQuestions.get(pageData.title).keys()) {

                let value = getFromLocalStorage(questionId)
                const question = document.getElementById(questionId);
                question.classList.remove("invalid")

                if (value === null || value === undefined) {
                    this.displayPage(pageIndex);
                    question.classList.toggle("invalid")
                    question.scrollIntoView({block: 'center', inline: 'nearest'});
                    return // if invalid
                }

                answers[questionId] = value;
            }
        }

        console.log(answers);
    }

    /*
        Automatically transitions to the teleop page once the autonomous phase ends.
        When the user answers the first autonomous question (TRIGGER_ID),
        a timer begins, and after AUTO_DURATION_MS, the page switches to teleop
        ensuring the scouter doesn't forget to move page after auto.
    */
    autoStartTeleop() {
        const triggerQuestion = document.getElementById(TRIGGER_ID);
        if (!triggerQuestion) return console.warn(`Trigger Element '${TRIGGER_ID}' not found`);

        const handleClick = () => {
            if (getFromLocalStorage(triggerQuestion.id)) return;

            setTimeout(() => {
                if (Number(getFromLocalStorage(LOCAL_STORAGE.PAGE_INDEX)) === AUTO_PAGE_INDEX) {
                    this.displayPage(TELEOP_PAGE_INDEX);
                }
            }, AUTO_DURATION_MS)
        }
        // capture to make it the first event to be handled
        triggerQuestion.addEventListener('click', handleClick, {capture: true});
    }

    setUpSwipeListeners() {
        let startX = 0, startY = 0;

        document.addEventListener("touchstart", e => {
            const t = e.touches[0];
            startX = t.clientX;
            startY = t.clientY;
        });

        document.addEventListener("touchend", e => {
            const t = e.changedTouches[0];
            const endX = t.clientX;
            const endY = t.clientY;

            const diffX = endX - startX;
            const diffY = endY - startY;

            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            if (Math.abs(diffY) > screenHeight * SWIPE_VERTICAL_THRESHOLD) return;

            if (diffX > screenWidth * SWIPE_HORIZONTAL_THRESHOLD) {
                this.previousPage();
            } else if (diffX < -screenWidth * SWIPE_HORIZONTAL_THRESHOLD) {
                this.nextPage();
            }
        });
    }
}

// window.onload = () => {
//     const app = new FormApp();
//     app.setup();
// };
