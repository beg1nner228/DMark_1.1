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
                        access: "Quick Access",
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
                        access: "Швидкий Доступ",
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
                        access: "Быстрый Доступ",
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