import {StorageModule} from "./util/StorageModule.js";

const FIELDS = {
    COLOR_THEME: 'color-theme',
};

class Settings extends StorageModule {

    COLOR_THEMES = [
        "spikes", "purple", "green", "forest", "orange",
        "pink", "teal", "dark", "frozen", "lavender",
        "sunset", "ocean", "cyberpunk", "luxury",
        "beach", "suit", "midnight", "slate", "ember",
    ]

    constructor() {
        super("settings");
    }

    applySettings() {
        this.applyColorTheme(this.getColorTheme());
    }

    applyColorTheme(theme) {
        if (!this.COLOR_THEMES.includes(theme)) {
            theme = this.COLOR_THEMES[0];
        }
        document.documentElement.setAttribute('data-theme', theme);
        this.setField(FIELDS.COLOR_THEME, theme);
    }

    getColorTheme() {
        return this.getFieldOrDefault(FIELDS.COLOR_THEME, this.COLOR_THEMES[0]);
    }
}

const settings = new Settings();
export default settings;