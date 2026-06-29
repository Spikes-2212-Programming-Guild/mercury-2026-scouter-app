import {BasePage} from "./BasePage.js";
import settings from "../../Settings.js";

export class SettingsPage extends BasePage {
    #themeSelect;

    _render() {
        this.container.innerHTML = `
            <div class="settings">
                <div id="theme" class="field">
                    <label for="theme-select">Color theme</label>
                    ${this._generateColorSelect()}
                </div>
            </div>
        `;
    }

    _generateColorSelect() {
        return `
            <select id="theme-select">
                ${settings.COLOR_THEMES
            .map(theme => `<option value="${theme}">${theme}</option>`)
            .join('')}
            </select>
        `
    }

    _queryElements() {
        this.#themeSelect = this.container.querySelector('#theme-select');
    }

    _attachEvents() {
        this.#themeSelect.addEventListener('change', (e) => {
            settings.applyColorTheme(e.target.value);
        });
    }

    _loadData() {
        this.#themeSelect.value = settings.getColorTheme();
    }
}