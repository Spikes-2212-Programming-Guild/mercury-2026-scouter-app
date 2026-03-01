import {getFromLocalStorage, LOCAL_STORAGE, setToLocalStorage} from "../../../Storage.js";

const COLOR_THEMES = [
    "purple", "green", "forest", "orange",
    "pink", "teal", "dark", "frozen", "lavender",
    "sunset", "ocean", "cyberpunk", "luxury",
    "beach", "suit"
]

export class SettingsPage {

    render(container) {

        container.append(this.renderThemeChooser())
    }

    renderThemeChooser() {

        const container = document.createElement('div');
        container.classList.add('settings-component');

        const title = document.createElement('label');
        title.innerHTML = "Color theme";

        const select = document.createElement('select');
        for (const color of COLOR_THEMES) {
            const option = document.createElement('option')
            option.value = color;
            option.text = color;
            select.append(option)
        }

        select.onchange = () => {
            this.setColorTheme(select.selectedIndex)
        };

        this.setSavedColorTheme()
        // update the selected option button
        select.selectedIndex = getFromLocalStorage(LOCAL_STORAGE.COLOR_THEME_INDEX) ?? -1;

        container.append(title, select)
        return container;
    }

    setSavedColorTheme() {
        const savedColorIndex = getFromLocalStorage(LOCAL_STORAGE.COLOR_THEME_INDEX)
        this.setColorTheme(savedColorIndex)
    }

    setColorTheme(colorIndex) {
        if (colorIndex < 0 || colorIndex >= COLOR_THEMES.length) return;
        const color = COLOR_THEMES[colorIndex]
        document.documentElement.setAttribute('data-theme', color);
        setToLocalStorage(LOCAL_STORAGE.COLOR_THEME_INDEX, colorIndex)
    }
}
