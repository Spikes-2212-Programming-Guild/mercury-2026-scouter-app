export const LOCAL_STORAGE = {
    SAVED_FORMS: 'savedForms',
    CURRENT_FORM_ID: 'currentFormId',
    CURRENT_FORM_VERSION: 'currentFormVersion',
    CURRENT_FORM_PAGE_INDEX: 'currentFormPageIndex',
    CURRENT_MAIN_PAGE_INDEX: 'currentMainPageIndex',
    CURRENT_APP: 'currentApp',
    SUBMISSION_QUEUE: 'submissionQueue',
    LIFETIME_SUBMISSIONS: 'lifetimeSubmissions',
    COLOR_THEME_INDEX: 'colorThemeIndex',
};

export function setToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getFromLocalStorage(key) {
    const value = localStorage.getItem(key);
    if (!value) return null;

    try {
        return JSON.parse(value);
    } catch {
        localStorage.removeItem(key)
        return null;
    }
}

export function isInLocalStorage(key) {
    return localStorage.getItem(key);
}

export function removeFromLocalStorage(key) {
    return localStorage.removeItem(key);
}

export function clearLocalStorage() {
    localStorage.clear();
}