class LocalStorage {
    constructor() {}

    static save(key, value) {
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
        window.localStorage.setItem(key, stringValue);
    }

    static load(key) {
        const value = window.localStorage.getItem(key);
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }

    static remove(key) {
        window.localStorage.removeItem(key);
    }

    static clear() {
        window.localStorage.clear();
    }
}

export default LocalStorage;