import {BaseQuestion} from "./BaseQuestion.js";

export class CheckboxQuestion extends BaseQuestion {

    static #FIELDS = {ANSWER: "answer"};

    #defaultValue;

    constructor(data, pageTitle) {
        super(data, pageTitle);
        this.#defaultValue = this.data.defaultValue ?? false;
        this.defineField(CheckboxQuestion.#FIELDS.ANSWER, this.#defaultValue);
    }

    render() {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question', 'horizontal', this.data.type);
        questionDiv.innerHTML = `
            <label for="${this.id}">${this.title}</label>
            <input type="checkbox" id="${this.id}">
        `;
        this.checkbox = questionDiv.querySelector('input');
        this.checkbox.onchange = () => this.setValue(this.checkbox.checked);

        this.updateUI();
        return questionDiv;
    }

    updateUI() {
        if (!this.checkbox) return;
        this.checkbox.checked = this.getField(CheckboxQuestion.#FIELDS.ANSWER);
    }

    getAnswer() {
        return this.getField(CheckboxQuestion.#FIELDS.ANSWER);
    }

    setValue(value) {
        this.setField(CheckboxQuestion.#FIELDS.ANSWER, Boolean(value));
    }

    isValid() {
        return true;
    }

    clear() {
        this.setValue(this.#defaultValue);
        this.updateUI();
    }

    focus() {
        this.checkbox?.scrollIntoView({block: 'center', inline: 'nearest'});
    }
}