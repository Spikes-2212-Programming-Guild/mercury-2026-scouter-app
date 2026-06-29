import {BaseQuestion} from "./BaseQuestion.js";

const FIELDS = {CYCLES: "cycles"};

const ACCURACY_OPTIONS = [
    {label: "40–0%", value: "40-0", midpoint: 20},
    {label: "60–40%", value: "60-40", midpoint: 50},
    {label: "80–60%", value: "80-60", midpoint: 70},
    {label: "100–80%", value: "100-80", midpoint: 90},
];

export class CycleQuestion extends BaseQuestion {

    constructor(data, pageTitle) {
        super(data, pageTitle);
        this.defineField(FIELDS.CYCLES, []);
        this.activeCycleIndex = null;
    }

    render() {
        this.questionDiv = document.createElement('div');
        this.questionDiv.classList.add('question', 'vertical', this.data.type);

        this.cycleList = document.createElement('div');
        this.cycleList.classList.add('cycleList');
        this.cycleList.id = this.id;

        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.textContent = '+ Add Cycle';
        addBtn.classList.add('cycleAddButton');
        addBtn.onclick = () => this.addCycle();

        this.questionDiv.append(this.cycleList, addBtn);
        this.updateUI();
        return this.questionDiv;
    }

    // ── cycle mutations ──────────────────────────────────────────────────────

    addCycle() {
        const cycles = this.getCycles();
        cycles.push({score: 0, pass: 0, accuracy: ACCURACY_OPTIONS[0].value});
        this.activeCycleIndex = cycles.length - 1;
        this.setCycles(cycles);
        this.updateUI();
    }

    removeCycle(index) {
        const cycles = this.getCycles();
        cycles.splice(index, 1);
        if (this.activeCycleIndex === index) this.activeCycleIndex = null;
        else if (this.activeCycleIndex > index) this.activeCycleIndex--;
        this.setCycles(cycles);
        this.updateUI();
    }

    toggleCycle(index) {
        this.activeCycleIndex = this.activeCycleIndex === index ? null : index;
        this.updateUI();
    }

    // ── builders ─────────────────────────────────────────────────────────────

    buildCycleElement(cycle, index) {
        const isActive = this.activeCycleIndex === index;

        const item = document.createElement('div');
        item.classList.add('cycleItem');
        item.classList.toggle('collapsed', !isActive);

        const header = document.createElement('div');
        header.classList.add('cycleItemHeader');
        header.onclick = (e) => {
            if (!e.target.closest('.cycleRemoveButton')) this.toggleCycle(index);
        };

        const cycleLabel = document.createElement('span');
        cycleLabel.classList.add('cycleItemLabel');
        cycleLabel.textContent = index + 1;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.textContent = 'X';
        removeBtn.classList.add('cycleRemoveButton');
        removeBtn.onclick = () => {
            if (confirm("Confirm Remove")) this.removeCycle(index);
        };

        header.append(removeBtn, cycleLabel);

        const fields = document.createElement('div');
        fields.classList.add('cycleFields');
        fields.append(
            this.buildNumberField('Score', cycle.score, (val) => {
                const cycles = this.getCycles();
                cycles[index].score = val;
                this.setCycles(cycles);
            }),
            this.buildNumberField('Passes', cycle.pass, (val) => {
                const cycles = this.getCycles();
                cycles[index].pass = val;
                this.setCycles(cycles);
            }),
            this.buildAccuracyField(cycle.accuracy, (val) => {
                const cycles = this.getCycles();
                cycles[index].accuracy = val;
                this.setCycles(cycles);
            }),
        );

        item.append(header, fields);
        return item;
    }

    buildNumberField(labelText, value, onChange) {
        const container = document.createElement('div');
        container.classList.add('cycleNumber');

        const label = document.createElement('label');
        label.classList.add('cycleNumberLabel');
        label.textContent = labelText;

        const group = document.createElement('div');
        group.classList.add('cycleNumberGroup');

        const input = document.createElement('input');
        input.type = 'number';
        input.classList.add('cycleNumberInput');
        input.min = 0;
        input.max = 1000;
        input.value = value;
        input.oninput = () => onChange(Number(input.value));

        const makeStepBtn = (step) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = step > 0 ? `+${step}` : String(step);
            btn.classList.add('cycleNumberStep');
            btn.onclick = () => {
                input.value = Math.max(0, Math.min(1000, Number(input.value) + step));
                onChange(Number(input.value));
            };
            return btn;
        };

        group.append(makeStepBtn(-10), makeStepBtn(-5), input, makeStepBtn(5), makeStepBtn(10));
        container.append(label, group);
        return container;
    }

    buildAccuracyField(value, onChange) {
        const container = document.createElement('div');
        container.classList.add('cycleAccuracy');

        const label = document.createElement('label');
        label.textContent = 'Accuracy';

        const select = document.createElement('select');
        ACCURACY_OPTIONS.forEach(({label: text, value: val}) => {
            const option = document.createElement('option');
            option.value = val;
            option.textContent = text;
            option.selected = val === value;
            select.append(option);
        });
        select.onchange = () => onChange(select.value);

        container.append(label, select);
        return container;
    }

    // ── BaseQuestion interface ────────────────────────────────────────────────

    updateUI() {
        this.cycleList.replaceChildren(
            ...this.getCycles().map((cycle, i) => this.buildCycleElement(cycle, i))
        );
        this.setOutline(this.isValid());
    }

    getAnswer() {
        const cycles = this.getCycles();
        if (!cycles.length) return { // default
            "avgAccuracy": 0,
            "avgPasses": 0,
            "avgScore": 0,
            "totalPasses": 0,
            "totalScore": 0,
        };

        const scores = cycles.map(c => c.score);
        const passes = cycles.map(c => c.pass);
        const accuracies = cycles.map(c =>
            ACCURACY_OPTIONS.find(o => o.value === c.accuracy)?.midpoint ?? 0
        );

        const sum = arr => arr.reduce((a, b) => a + b, 0);
        const avgSkipZero = arr => {
            const nonZero = arr.filter(v => v !== 0);
            return nonZero.length ? sum(nonZero) / nonZero.length : 0;
        };

        return {
            totalScore: sum(scores),
            totalPasses: sum(passes),
            avgScore: avgSkipZero(scores),
            avgPasses: avgSkipZero(passes),
            avgAccuracy: sum(accuracies) / accuracies.length,
        };
    }

    getCycles() {
        return this.getField(FIELDS.CYCLES) ?? [];
    }

    setCycles(cycles) {
        this.setField(FIELDS.CYCLES, cycles);
    }

    isValid() {
        return !(this.required && !this.getCycles().length);
    }

    clear() {
        this.setCycles([]);
        this.activeCycleIndex = null;
        this.updateUI();
    }

    focus() {
        this.questionDiv?.scrollIntoView({block: 'center', inline: 'nearest'});
    }

    setOutline(isValid) {
        this.questionDiv?.classList.toggle('invalid', !isValid);
    }
}