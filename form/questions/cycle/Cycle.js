import {getFromLocalStorage, isInLocalStorage, setToLocalStorage} from "../../../Storage.js";

export function renderCycle(jsonQuestionData, questionContainer) {

    const questionId = jsonQuestionData.id;

    const STORAGE_KEYS = {
        cycles: questionId,
        expanded: questionId + ":expanded"
    };

    const LIMITS = {
        MIN: 0,
        MAX: 1000
    };

    const ACCURACY_OPTIONS = [
        "100-80%",
        "80-60%",
        "60-40%",
        "40-0%"
    ];

    const state = loadState();
    saveCycles();
    let container = document.getElementById(questionId);

    if (!container) {
        questionContainer.innerHTML = "";

        container = document.createElement("div");
        container.id = questionId;
        container.className = "cycleList";

        questionContainer.append(container, createAddButton());
    }

    render();

    function render() {

        const fragment = document.createDocumentFragment();

        state.cycles.forEach((cycle, index) => {
            fragment.append(createCycleItem(cycle, index));
        });

        container.replaceChildren(fragment);
    }

    function createCycleItem(cycle, index) {

        const cycleElement = document.createElement("div");
        cycleElement.className = "cycleItem";

        if (state.expandedIndex !== index) {
            cycleElement.classList.add("cycleItemCollapsed");
        }

        cycleElement.onclick = () => {
            state.expandedIndex = index;
            saveExpandedIndex();
            render();
        };

        cycleElement.append(
            createRemoveButton(index),
            createNumberControl("Score", cycle.score, v => update(index, "score", v)),
            createNumberControl("Passes", cycle.passes, v => update(index, "passes", v)),
            createAccuracySelect(cycle, index)
        );

        return cycleElement;
    }

    function createNumberControl(label, value, onChange) {

        const wrapper = document.createElement("div");
        wrapper.className = "cycleNumber";

        const title = document.createElement("label");
        title.className = "cycleNumberLabel";
        title.textContent = label;

        const group = document.createElement("div");
        group.className = "cycleNumberGroup";

        const input = document.createElement("input");
        input.type = "number";
        input.className = "cycleNumberInput";
        input.min = LIMITS.MIN;
        input.max = LIMITS.MAX;
        input.value = value ?? 0;

        input.onclick = e => e.stopPropagation();
        input.oninput = () => save();

        function save() {
            const v = Number(input.value);

            if (!Number.isInteger(v) || v < LIMITS.MIN || v > LIMITS.MAX) {
                input.classList.add("invalid");
                return;
            }

            input.classList.remove("invalid");
            onChange(v);
        }

        function step(amount) {
            let value = Number(input.value || 0) + amount;
            input.value = clamp(value, LIMITS.MIN, LIMITS.MAX);
            save();
        }

        group.append(
            stepButton("-10", () => step(-10)),
            stepButton("-5", () => step(-5)),
            input,
            stepButton("+5", () => step(5)),
            stepButton("+10", () => step(10))
        );
        wrapper.append(title, group);
        return wrapper;
    }

    function createAccuracySelect(cycle, index) {

        const wrapper = document.createElement("div");
        wrapper.className = "cycleAccuracy";

        const title = document.createElement("label");
        title.textContent = "Accuracy";

        const select = document.createElement("select");

        select.onclick = e => e.stopPropagation();

        ACCURACY_OPTIONS.forEach(choice => {

            const option = document.createElement("option");
            option.value = choice;
            option.textContent = choice;

            select.append(option);
        });

        select.value = cycle.accuracy || "";

        select.onchange = () => {
            update(index, "accuracy", select.value);
        };

        wrapper.append(title, select);

        return wrapper;
    }

    function createRemoveButton(index) {

        const button = document.createElement("button");
        button.className = "cycleRemoveButton";
        button.textContent = "X";

        button.onclick = (e) => {
            e.stopPropagation();
            removeCycle(index);
        };

        return button;
    }

    function createAddButton() {

        const icon = document.createElement("span");
        icon.className = "cycleAddIcon";
        icon.textContent = "+";

        const text = document.createElement("span");
        text.className = "cycleAddText";
        text.textContent = "add cycle";

        const button = document.createElement("button");
        button.className = "cycleAddButton";
        button.append(icon, text);

        button.onclick = () => {
            addCycle();
        };

        return button;
    }

    function stepButton(label, action) {

        const button = document.createElement("button");
        button.className = "cycleNumberStep";
        button.textContent = label;

        button.onclick = (e) => {
            e.stopPropagation();
            action();
        };

        return button;
    }

    function update(index, key, value) {
        state.cycles[index][key] = value;
        saveCycles();
    }

    function removeCycle(index) {
        if (index === 0 || state.cycles.length === 1) return;
        if (!confirm("are you sure you want to remove cycle?")) return;

        state.cycles.splice(index, 1);
        state.expandedIndex = clamp(state.expandedIndex - 1, 0, state.cycles.length - 1);

        saveCycles();
        saveExpandedIndex();
        render();
    }

    function addCycle() {
        state.cycles.push(createEmptyCycleState());
        state.expandedIndex = state.cycles.length - 1;

        saveCycles();
        saveExpandedIndex();
        render();
    }

    function createEmptyCycleState() {
        return {
            score: 0,
            passes: 0,
            accuracy: ""
        };
    }

    function loadState() {
        const cycles = loadCycles();
        const expandedIndex = loadExpandedIndex();

        if (cycles.length === 0) {

            cycles.push(createEmptyCycleState());
            return {
                cycles,
                expandedIndex: 0
            };
        }

        return {
            cycles,
            expandedIndex: clamp(expandedIndex, 0, cycles.length - 1),
        };
    }

    function saveCycles() {
        setToLocalStorage(STORAGE_KEYS.cycles, state.cycles);
    }

    function loadCycles() {

        if (isInLocalStorage(STORAGE_KEYS.cycles)) {
            return getFromLocalStorage(STORAGE_KEYS.cycles);
        }

        return [];
    }

    function saveExpandedIndex() {
        setToLocalStorage(STORAGE_KEYS.expanded, state.expandedIndex);
    }

    function loadExpandedIndex() {

        if (isInLocalStorage(STORAGE_KEYS.expanded)) {
            return getFromLocalStorage(STORAGE_KEYS.expanded);
        }

        return 0;
    }

    function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }
}