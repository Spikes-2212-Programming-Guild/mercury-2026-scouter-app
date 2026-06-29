import {ShortTextQuestion} from "./questions/ShortTextQuestion.js";
import {CheckboxQuestion} from "./questions/CheckboxQuestion.js";
import {ListQuestion} from "./questions/ListQuestion.js";
import {AutoCompleteQuestion} from "./questions/AutoCompleteQuestion.js";
import {ScoreBoxQuestion} from "./questions/ScoreBoxQuestion.js";
import {LongTextQuestion} from "./questions/LongTextQuestion.js";
import {CycleQuestion} from "./questions/CycleQuestion.js";

const QUESTION_TYPES = {
    shortText: ShortTextQuestion,
    checkbox: CheckboxQuestion,
    list: ListQuestion,
    autoComplete: AutoCompleteQuestion,
    scoreBox: ScoreBoxQuestion,
    longText: LongTextQuestion,
    cycles: CycleQuestion,
};

export class FormBuilder {
    #pageDiv;
    #formData;
    #questions;
    #formNav;

    constructor(formData, formNav) {
        this.#formNav = formNav
        this.#pageDiv = document.getElementById('form-pages');
        this.#formData = formData
        this.#questions = {};
    }

    buildForm() {
        for (const pageData of this.#formData.pages) {
            this.#pageDiv.append(this.#createPage(pageData))
        }
        return this.#questions
    }

    #createPage(pageData) {
        const pageDiv = document.createElement('div');
        pageDiv.id = pageData.title;
        pageDiv.classList.add("page");
        pageDiv.hidden = true

        for (const questionData of pageData.questions) {

            if (questionData.type === "container") {
                pageDiv.append(this.#createContainer(questionData, pageData.title))
                continue
            }

            const question = this.#createQuestion(questionData, pageData.title);
            this.#questions[question.id] = question;
            pageDiv.append(question.render());
        }

        return pageDiv;
    }

    #createContainer(containerData, pageTitle) {
        const container = document.createElement('fieldset');
        container.classList.add('question-container');

        const title = document.createElement('legend');
        title.textContent = containerData.title;
        title.classList.add('container-title');
        container.appendChild(title);

        for (const questionData of containerData.questions) {
            const question = this.#createQuestion(questionData, pageTitle);
            this.#questions[question.id] = question;
            container.appendChild(question.render());
        }

        return container
    }

    #createQuestion(questionData, pageTitle) {
        const QuestionClass = QUESTION_TYPES[questionData.type];
        if (!QuestionClass) throw new Error(`Unknown question type: "${questionData.type}"`);
        return new QuestionClass(questionData, pageTitle);
    }
}
