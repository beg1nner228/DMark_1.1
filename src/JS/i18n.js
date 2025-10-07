import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export function updateContent() {
    document.querySelectorAll('[data-i18n], [data-i18n-placeholder]').forEach(el => {
        const t = i18next.t; 

        const textKey = el.getAttribute('data-i18n');
        if (textKey) {
            if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') {
                el.textContent = t(textKey);
            }
            if (el.type === 'submit') {
                el.textContent = t(textKey);
            }
        }

        const placeholderKey = el.getAttribute('data-i18n-placeholder');
        if (placeholderKey) {
            el.setAttribute('placeholder', t(placeholderKey));
        }
    });
}


function setupLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-switch-btn'); 
    
    langButtons.forEach(button => {
        const langCode = button.dataset.lang;

        if (langCode === i18next.language) {
            button.classList.add('active-lang');
        } else {
            button.classList.remove('active-lang');
        }

        button.addEventListener('click', () => {
            if (langCode && langCode !== i18next.language) {

                i18next.changeLanguage(langCode, (err, t) => {
                    if (err) return console.error('Error changing language:', err);
                    
                    updateContent(); 
                    
                    langButtons.forEach(btn => btn.classList.remove('active-lang'));
                    button.classList.add('active-lang');
                });
            }
        });
    });
}

i18next
    .use(LanguageDetector) 
    .init({
        resources: {
            en: {
                translation: { 
                    nav: {
                        home: "Home",
                        bookmarks: "Bookmarks"
                    },
                    form: {
                        title: "Add new folder / link",
                        name: "Folder name (or existing):",
                        url: "URL Link:",
                        linkTitle: "Link Title:",
                        icon: "Icon (optional):",
                        accept: "Confirm"
                    },
                    main: {
                        recentlyAdded: "Recently Added",
                        folderTitle: "All Folders"
                    },
                    dashboardSection: {
                        recent: "Recent Bookmarks"
                    },                    
                    sidebar: {
                        history: "History",
                        settings: "Settings"
                    },                    
                    input: {
                        folder_name: "Example, 'Work'",
                        link_name: "Example, 'YouTube'"
                    },
                    notifications: {
                        errorTitle: "Error",                          
                        error: "This function is not available yet.",
                        success: "Operation completed successfully!",
                        warning: "Please try again later."
                    },    
                    modal: {
                        history: {
                            title: "History",
                            searchPlaceholder: "Search history...",
                            notfound: "History is empty or nothing was found."
                        },
                        settings: {
                            title: "Settings",
                            nav: { 
                                general: "General",
                                appearance: "Appearance",
                                dataManagement: "Data Management",
                                about: "About"
                            },
                            general: { 
                                title: "General Settings",
                                startPageLabel: "Default Start Page:",
                                startPageOptions: {
                                    dashboard: "Dashboard",
                                    lastSession: "Last Session",
                                    startPage: "Start Page"
                                },
                                searchEngineLabel: "Default Search Engine:",
                                searchEngineOptions: {
                                    google: "Google",
                                    duckduckgo: "DuckDuckGo",
                                    bing: "Bing",
                                    yandex: "Yandex",
                                    firefox: "Firefox"
                                }
                            },
                            appearance: { 
                                title: "Appearance",
                                themeLabel: "Theme:",
                                themeOptions: {
                                    light: "Light",
                                    dark: "Dark",
                                    system: "System Default"
                                },
                                fontSizeLabel: "Font Size:",
                                accentColorLabel: "Accent Color:"
                            },
                            dataManagement: { 
                                title: "Data Management",
                                exportDescription: "Export your bookmarks and settings. (is not accessible yet)",
                                exportBtn: "Export Data",
                                importDescription: "Import bookmarks and settings from a file. (is not accessible yet)",
                                importBtn: "Import Data",
                                clearHistoryDescription: "Clear all browsing history.",
                                clearHistoryBtn: "Clear History",
                                resetAllDescription: "Reset all settings and bookmarks to default.",
                                resetAllBtn: "Reset All"
                            },
                            about: { 
                                title: "About",
                                version: "DashMark v2.2.0",
                                developer: "Developed by @Blazequiz",
                                privacyPolicy: "Privacy Policy",
                                termsOfService: "Terms of Service"
                            },
                            footer: { 
                                saveChangesBtn: "Save Changes",
                                cancelBtn: "Cancel"
                            }
                        }
                    }
                } 
            }, 
            uk: {
                translation: {
                    nav: {
                        "home": "Головна",
                        "bookmarks": "Закладки"
                    },
                    form: {
                        title: "Додати нову папку / посилання",
                        name: "Назва папки (або існуюча):",
                        url: "URL посилання:",
                        linkTitle: "Назва посилання:",
                        icon: "Іконка (опціонально):",
                        accept: "Підтвердити"
                    },
                    main: {
                        recentlyAdded: "Нещодавно Додані",
                        folderTitle: "Всі Папки"                        
                    },
                    dashboardSection: {
                        recent: "Останні Закладки"
                    },
                    sidebar: {
                        history: "Історія",
                        settings: "Налаштування"
                    },
                    input: {
                        folder_name: "Наприклад, 'Робота'",
                        link_name: "Наприклад, 'Цікаве Відео'"
                    }, 
                    notifications: {
                        errorTitle: "Помлика",                        
                        error: "Ця функція поки недоступна.",
                        success: "Операцію виконано успішно!",
                        warning: "Будь ласка, спробуйте пізніше."
                    },
                    modal: {
                            history: {
                                title: "Історія",
                                searchPlaceholder: "Пошук в історії...",
                                notfound: "Історія порожня або нічого не знайдено."
                            },
                            settings: {
                                title: "Налаштування",
                                nav: {
                                    general: "Загальні",
                                    appearance: "Зовнішній вигляд",
                                    dataManagement: "Керування даними",
                                    about: "Про програму"
                                },
                                general: {
                                    title: "Загальні Налаштування",
                                    startPageLabel: "Стартова сторінка за замовчуванням:",
                                    startPageOptions: {
                                        dashboard: "Панель управління",
                                        lastSession: "Остання сесія",
                                        startPage: "Стартова сторінка"
                                    },
                                    searchEngineLabel: "Пошукова система за замовчуванням:",
                                    searchEngineOptions: {
                                        google: "Google",
                                        duckduckgo: "DuckDuckGo",
                                        bing: "Bing",
                                        yandex: "Яндекс",
                                        firefox: "Firefox"
                                    }
                                },
                                appearance: {
                                    title: "Зовнішній вигляд",
                                    themeLabel: "Тема:",
                                    themeOptions: {
                                        light: "Світла",
                                        dark: "Темна",
                                        system: "Системна за замовчуванням"
                                    },
                                    fontSizeLabel: "Розмір шрифту:",
                                    accentColorLabel: "Акцентний колір:"
                                },
                                dataManagement: {
                                    title: "Керування даними",
                                    exportDescription: "Експортуйте ваші закладки та налаштування. (поки що недоступно)",
                                    exportBtn: "Експортувати дані",
                                    importDescription: "Імпортуйте закладки та налаштування з файлу. (поки що недоступно)",
                                    importBtn: "Імпортувати дані",
                                    clearHistoryDescription: "Очистити всю історію переглядів.",
                                    clearHistoryBtn: "Очистити історію",
                                    resetAllDescription: "Скинути всі налаштування та закладки до стандартних.",
                                    resetAllBtn: "Скинути все"
                                },
                                about: {
                                    title: "Про програму",
                                    version: "DashMark v2.2.0",
                                    developer: "Розроблено @Blazequiz",
                                    privacyPolicy: "Політика конфіденційності",
                                    termsOfService: "Умови використання"
                                },
                                footer: {
                                    saveChangesBtn: "Зберегти Зміни",
                                    cancelBtn: "Скасувати"
                            }
                        }
                    }                    
                } 
            },
            ru: {
                translation: { 
                    nav: {
                        home: "Главная",
                        bookmarks: "Закладки"
                    },
                    form: {
                        title: "Добавить папку / ссылку",
                        name: "Имя папки (или существующая):",
                        url: "URL Ссылки:",
                        linkTitle: "Заголовок Ссылки:",
                        icon: "Иконка (опционально):",
                        accept: "Потвердить"
                    },
                    main: {
                        recentlyAdded: "Недавно Добавленные",
                        folderTitle: "Все Папки"                        
                    },
                    dashboardSection: {
                        recent: "Недавние Закладки"
                    },                    
                    sidebar: {
                        history: "История",
                        settings: "Настройки"
                    },                    
                    input: {
                        folder_name: "Пример, 'Работа'",
                        link_name: "Пример, 'Интересное Видео'"
                    },
                    notifications: {
                        errorTitle: "Ошибка",
                        error: "Эта функция пока недоступна.",
                        success: "Операция выполнена успешно!",
                        warning: "Попробуйте позже."
                    },
                    modal: {
                        history: {
                            title: "История",
                            searchPlaceholder: "Поиск в истории...",
                            notfound: "История пуста или ничего не найдено."
                        },
                        settings: {
                            title: "Настройки",
                            nav: {
                                general: "Общие",
                                appearance: "Внешний вид",
                                dataManagement: "Управление данными",
                                about: "О программе"
                            },
                            general: {
                                title: "Общие Настройки",
                                startPageLabel: "Стартовая страница по умолчанию:",
                                startPageOptions: {
                                    dashboard: "Панель управления",
                                    lastSession: "Последняя сессия",
                                    startPage: "Стартовая страница"
                                },
                                searchEngineLabel: "Поисковая система по умолчанию:",
                                searchEngineOptions: {
                                    google: "Google",
                                    duckduckgo: "DuckDuckGo",
                                    bing: "Bing",
                                    yandex: "Яндекс",
                                    firefox: "Firefox"
                                }
                            },
                            appearance: {
                                title: "Внешний вид",
                                themeLabel: "Тема:",
                                themeOptions: {
                                    light: "Светлая",
                                    dark: "Темная",
                                    system: "Системная по умолчанию"
                                },
                                fontSizeLabel: "Размер шрифта:",
                                accentColorLabel: "Акцентный цвет:"
                            },
                            dataManagement: {
                                title: "Управление данными",
                                exportDescription: "Экспортируйте ваши закладки и настройки. (пока недоступно)",
                                exportBtn: "Экспортировать данные",
                                importDescription: "Импортируйте закладки и настройки из файла. (пока недоступно)",
                                importBtn: "Импортировать данные",
                                clearHistoryDescription: "Очистить всю историю просмотров.",
                                clearHistoryBtn: "Очистить историю",
                                resetAllDescription: "Сбросить все настройки и закладки до стандартных.",
                                resetAllBtn: "Сбросить все"
                            },
                            about: {
                                title: "О программе",
                                version: "DashMark v2.2.0",
                                developer: "Разработано @Blazequiz",
                                privacyPolicy: "Политика конфиденциальности",
                                termsOfService: "Условия использования"
                            },
                            footer: {
                                saveChangesBtn: "Сохранить Изменения",
                                cancelBtn: "Отмена"
                            }
                        }
                    }
                }                         
            }         
        }, 
        fallbackLng: 'en', 
        ns: ['translation'],
        defaultNS: 'translation',
        debug: true
    }, (err, t) => {
        if (err) return console.error('i18next loading error', err);
        
        updateContent(); 
        setupLanguageSwitcher(); 
        console.log("i18next initialized successfully.");
    });


export default i18next;