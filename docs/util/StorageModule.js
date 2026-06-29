/*
maybe add the fields directly in the constructors, along with a default value
and then reload all on startup
 */
export class StorageModule {
    #id;
    #data;
    #defaults;

    constructor(id) {
        this.#id = id;
        this.#data = {}
        this.#defaults = {};
    }

    defineField(key, defaultValue) {
        this.#defaults[key] = defaultValue;
    }

    resetField(key) {
        this.setField(key, this.#defaults[key])
    }

    setField(key, value) {
        if (value === undefined) {
            value = this.#defaults[key]
        }
        this.#data[key] = value;
        localStorage.setItem(`${this.#id}-${key}`, JSON.stringify(value));
    }

    getFieldOrDefault(key, defaultValue) {
        if (this.#data[key] === undefined) {
            const stored = localStorage.getItem(`${this.#id}-${key}`);
            if (stored) {
                try {
                    this.#data[key] = JSON.parse(stored);
                } catch {
                    this.#data[key] = stored;
                }
            } else {
                this.#data[key] = defaultValue;
            }
        }

        return this.#data[key];
    }

    getField(key) {
        return this.getFieldOrDefault(key, this.#defaults[key])
    }

    clearStorage() {
        localStorage.clear();
    }
}
