import {BaseQuestion} from "./BaseQuestion.js";

const FIELDS = {
    ANSWER: "answer"
};

export class ShortTextQuestion extends BaseQuestion {

    constructor(data, pageTitle) {
        super(data, pageTitle);
        const defaultValue = this.data.defaultValue ?? '';
        this.defineField(FIELDS.ANSWER, defaultValue)
    }

    render() {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question', "vertical", this.data.type);
        questionDiv.innerHTML = `
            <label for="${this.id}">${this.title}</label>
            <input type="text" id="${this.id}">
        `;
        this.input = questionDiv.querySelector('input')
        this.input.oninput = () => {
            this.setValue(this.input.value)
            this.setOutline(this.isValid())
        };

        this.updateUI();
        return questionDiv;
    }

    updateUI() {
        this.input.value = this.getAnswer();
    }

    getAnswer() {
        return this.getField(FIELDS.ANSWER);
    }

    setValue(value) {
        this.setField(FIELDS.ANSWER, value);
    }

    isValid() {
        const value = this.getAnswer()?.trim();
        return !(this.required && !value);
    }

    clear() {
        this.setValue();
        this.updateUI();
    }

    focus() {
        this.input.scrollIntoView({block: 'center', inline: 'nearest'});
    }

    setOutline(isValid) {
        if (isValid) {
            this.input.classList.remove('invalid')
        } else {
            this.input.classList.add('invalid')
        }
    }
}