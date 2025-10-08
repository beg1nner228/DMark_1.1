import { applyAndSaveTheme } from './theme.js'; 

document.addEventListener('DOMContentLoaded', () => {
    const settingsBackdrop = document.querySelector('.js-settings-modal-backdrop');
    const openSettingsBtn = document.querySelector('.js-open-settings-btn');
    const closeSettingsBtn = document.querySelector('.js-settings-close-btn');
    const settingsNavItems = document.querySelectorAll('.settings-nav-item');
    const settingsSections = document.querySelectorAll('.settings-section');

    // General Settings
    const startPageSelect = document.getElementById('startPage');
    const searchEngineSelect = document.getElementById('searchEngine');

    // Appearance Settings
    const fontSizeInput = document.getElementById('fontSize');
    const fontSizeValueSpan = document.getElementById('fontSizeValue');
    const accentColorInput = document.getElementById('accentColor');

    // Data Management 
    const clearHistoryButton = document.querySelector('.js-clear-history-btn');
    const resetAllBtn = document.querySelector('.js-reset-all-btn');

    const saveBtn = document.querySelector('.js-settings-save-btn');
    const cancelBtn = document.querySelector('.js-settings-cancel-btn');

    // header
    const mainSearchInput = document.querySelector('.top-header .search-input');

    // keys
    const FONT_SIZE_STORAGE_KEY = 'userFontSizePreference';
    const ACCENT_COLOR_STORAGE_KEY = 'userAccentColorPreference';
    const START_PAGE_STORAGE_KEY = 'userStartPagePreference';
    const SEARCH_ENGINE_STORAGE_KEY = 'userSearchEnginePreference';
    const BOOKMARKS_STORAGE_KEY = 'dashMarkBookmarks';
    const HISTORY_STORAGE_KEY = 'dashMarkHistory';

    /**
     * @param {string} fontSize 
     */
    function applyFontSize(fontSize) {
        if (fontSizeInput && fontSizeValueSpan) {
            fontSizeInput.value = parseInt(fontSize);
            fontSizeValueSpan.textContent = `${fontSize}px`;
            document.documentElement.style.setProperty('--user-font-size', `${fontSize}px`); 
        }
    }

    /**
     * @param {string} color 
     */
    function applyAccentColor(color) {
        document.documentElement.style.setProperty('--user-accent-color', color);
        if (accentColorInput) {
            accentColorInput.value = color;
        }
    }

    /**
     * @param {string} page - 'dashboard', 'last-session' или 'new-tab'.
     */
    function applyStartPage(page) {
        if (startPageSelect) {
            startPageSelect.value = page;
        }
    }

    /**
     * @param {string} engine 
     */
    function applySearchEngine(engine) {
        if (searchEngineSelect) {
            searchEngineSelect.value = engine;
        }
    }

    function clearAllHistoryInternal() {
        if (confirm('Are you sure you want to clear your entire browsing history? This action cannot be undone.')) {
            localStorage.removeItem(HISTORY_STORAGE_KEY);
            alert('Browsing history cleared!');
            window.dispatchEvent(new Event('historyUpdated'));
        }
    }

    function initializeSettings() {

        const savedThemePreference = localStorage.getItem('userThemePreference') || 'system';
        applyAndSaveTheme(savedThemePreference, false); 

        const savedFontSize = localStorage.getItem(FONT_SIZE_STORAGE_KEY) || (fontSizeInput ? fontSizeInput.value : '16');
        applyFontSize(savedFontSize);

        const savedAccentColor = localStorage.getItem(ACCENT_COLOR_STORAGE_KEY) || (accentColorInput ? accentColorInput.value : '#5a67d8');
        applyAccentColor(savedAccentColor);

        const savedStartPage = localStorage.getItem(START_PAGE_STORAGE_KEY) || 'dashboard';
        applyStartPage(savedStartPage);

        const savedSearchEngine = localStorage.getItem(SEARCH_ENGINE_STORAGE_KEY) || 'google';
        applySearchEngine(savedSearchEngine);

        const initialActiveNavItem = document.querySelector('.settings-nav-item.active') || settingsNavItems[0];
        if (initialActiveNavItem) {
            settingsNavItems.forEach(nav => nav.classList.remove('active'));
            initialActiveNavItem.classList.add('active');

            const initialTargetSectionId = initialActiveNavItem.dataset.section;
            settingsSections.forEach(section => section.classList.remove('active'));
            const targetSection = document.getElementById(`settings-${initialTargetSectionId}`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        }
    }

    function openSettingsModal() {
        if (settingsBackdrop) {
            initializeSettings();

            settingsBackdrop.classList.add('is-open');
            settingsBackdrop.setAttribute('aria-hidden', 'false');
        }
    }

    function closeSettingsModal() {
        if (settingsBackdrop) {
            settingsBackdrop.classList.remove('is-open');
            settingsBackdrop.setAttribute('aria-hidden', 'true');
        }
    }

    if (openSettingsBtn) {
        openSettingsBtn.addEventListener('click', openSettingsModal);
    }

    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', closeSettingsModal);
    }
    if (settingsBackdrop) {
        settingsBackdrop.addEventListener('click', (event) => {
            if (event.target === settingsBackdrop) {
                closeSettingsModal();
            }
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && settingsBackdrop.classList.contains('is-open')) {
                closeSettingsModal();
            }
        });
    }

    settingsNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            settingsNavItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            const targetSectionId = this.dataset.section;
            settingsSections.forEach(section => section.classList.remove('active'));
            const targetSection = document.getElementById(`settings-${targetSectionId}`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    if (fontSizeInput && fontSizeValueSpan) {
        fontSizeInput.addEventListener('input', function() {
            const newFontSize = this.value;
            applyFontSize(newFontSize);
            localStorage.setItem(FONT_SIZE_STORAGE_KEY, newFontSize);
        });
    }

    if (accentColorInput) {
        accentColorInput.addEventListener('input', function() {
            const newAccentColor = this.value;
            applyAccentColor(newAccentColor);
            localStorage.setItem(ACCENT_COLOR_STORAGE_KEY, newAccentColor);
        });
    }

    if (startPageSelect) {
        startPageSelect.addEventListener('change', function() {
            const newStartPage = this.value;
            applyStartPage(newStartPage);
            localStorage.setItem(START_PAGE_STORAGE_KEY, newStartPage);
        });
    }

    if (searchEngineSelect) {
        searchEngineSelect.addEventListener('change', function() {
            const newSearchEngine = this.value;
            applySearchEngine(newSearchEngine);
            localStorage.setItem(SEARCH_ENGINE_STORAGE_KEY, newSearchEngine);
        });
    }

    if (clearHistoryButton) {
        clearHistoryButton.addEventListener('click', clearAllHistoryInternal);
    }

    if (resetAllBtn) {
        resetAllBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset ALL settings and bookmarks to default? This action cannot be undone.')) {
                localStorage.clear();
                alert('All data has been reset to default. The page will now reload.');
                window.location.reload();
            }
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            alert('Settings saved successfully!');
            closeSettingsModal();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            alert('Changes discarded (already saved to localStorage if modified).');
            closeSettingsModal();
        });
    }

    function initializeStartPageLoad() {
        const storedStartPage = localStorage.getItem(START_PAGE_STORAGE_KEY) || 'dashboard';

        if (sessionStorage.getItem('redirectedToStartPage')) {
            sessionStorage.removeItem('redirectedToStartPage');
            return;
        }

        switch (storedStartPage) {
            case 'dashboard':
                // if (window.location.pathname !== '/bookmark.html') {
                //     window.location.href = '/bookmark.html';
                //     sessionStorage.setItem('redirectedToStartPage', 'true');
                // }
                break;
            case 'last-session':
                console.log('Last Session option selected. Implement your "load last session" logic here.');
                // alert('Loading last session is not yet implemented.');
                break;
            case 'start-page':
                console.log('Start Page option selected. Implement your "open start page" logic here.');
                // if (window.location.pathname !== '/index.html') {
                //     window.location.href = '/index.html';
                //     sessionStorage.setItem('redirectedToStartPage', 'true');
                // }
                break;
            default:
                break;
        }
    }

    if (mainSearchInput) {
        mainSearchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const query = mainSearchInput.value.trim();
                if (query) {
                    const selectedSearchEngine = localStorage.getItem(SEARCH_ENGINE_STORAGE_KEY) || 'google';
                    let searchUrl = '';

                    switch (selectedSearchEngine) {
                        case 'google':
                            searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                            break;
                        case 'duckduckgo':
                            searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
                            break;
                        case 'firefox':
                            searchUrl = `https://firefox.com/?q=${encodeURIComponent(query)}`;
                            break;
                        case 'bing':
                            searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
                            break;
                        case 'yandex':
                            searchUrl = `https://yandex.ru/search/?text=${encodeURIComponent(query)}`;
                            break;
                        default:
                            searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                            break;
                    }

                    window.open(searchUrl, '_blank');
                    mainSearchInput.value = '';
                }
            }
        });
    }

    initializeSettings();
    initializeStartPageLoad();
});