import {BasePage} from "./BasePage.js";
import router from "../../AppRouter.js";

export class MainPage extends BasePage {

    _render() {
        this.container.innerHTML = `
            <div id="main" class="field">
                <h1>Mercury 2026</h1>
                <h2>The Spikes 2212#</h2>
                <button id="start-button">start form</button>
            </div>
        `
    }

    _queryElements() {
        this.startButton = document.getElementById("start-button");
    }

    _attachEvents() {
        this.startButton.onclick = () => router.switchToForm();
    }

    _loadData() {

    }
}