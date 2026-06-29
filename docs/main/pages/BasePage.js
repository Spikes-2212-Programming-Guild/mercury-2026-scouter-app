import {StorageModule} from "../../util/StorageModule.js";

export class BasePage extends StorageModule {
    constructor(id) {
        super(id);
        this.id = id;
        this.data = {};
        this.container = null;
    }

    mount(container) {
        this.container = container;
        this._init()
        this._render();
        this._queryElements();
        this._loadData();
        this._attachEvents();
    }

    _init() {

    }

    _render() {
    }

    _queryElements() {

    }

    _attachEvents() {
    }

    _loadData() {
    }
}