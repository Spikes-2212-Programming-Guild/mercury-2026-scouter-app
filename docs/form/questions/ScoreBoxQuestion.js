import {BaseQuestion} from "./BaseQuestion.js";

const FIELDS = {
    ANSWER: "answer"
};

export class ScoreBoxQuestion extends BaseQuestion {

    constructor(data, pageTitle) {
        super(data, pageTitle);
        const defaultValue = this.data.defaultValue ?? '';
        this.defineField(FIELDS.ANSWER, defaultValue)
        this.min = this.data.min || 0;
        this.max = this.data.max || 1000;
    }

    render() {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question', 'vertical', this.data.type);

        const label = document.createElement('label');
        label.htmlFor = this.id;
        label.textContent = this.title;

        const controlDiv = document.createElement('div');

        const minusBtn = document.createElement('button');
        minusBtn.textContent = '-';

        const input = document.createElement('input');
        input.type = 'number';
        input.id = this.id;
        input.min = this.min;
        input.max = this.max;

        const plusBtn = document.createElement('button');
        plusBtn.textContent = '+';

        this.input = input;

        minusBtn.onclick = () => {
            this.input.stepDown()
            this.setValue(this.input.value)
        };
        plusBtn.onclick = () => {
            this.input.stepUp()
            this.setValue(this.input.value)
        };

        this.input.oninput = () => {
            this.setValue(this.input.value);
            this.setOutline(this.isValid());
        };

        controlDiv.append(minusBtn, input, plusBtn);
        questionDiv.append(label, controlDiv)
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
        const raw = this.getAnswer();
        const value = Number(raw);
        const numberValid = raw !== "" && Number.isInteger(value) && value >= this.min && value <= this.max;
        return !(this.required && !numberValid);
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