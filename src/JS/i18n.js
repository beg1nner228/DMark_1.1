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
                    footer: {
                        information: "Information",
                        project: "About the Project",
                        help: "Help / FAQ",
                        "contact": "Contact",
                        command: "Administration",
                        policy: "Privacy Policy",
                        conditionals: "Terms of Use",
                        follow: "Follow Us",
                        creator: "Developer @Blazequiz",
                        privacy: "© 2024. All rights reserved" 
                    },
                    form: {
                        title: "Add new folder / link",
                        name: "Folder name (or existing):",
                        url: "URL Link:",
                        linkTitle: "Link Title:",
                        icon: "Icon (optional):",
                        accept: "Confirm"
                    },
                    input: {
                        folder_name: "Example, 'Work'",
                        link_name: "Example, 'YouTube'"
                    } 
                } 
            }, 
            uk: {
                translation: {
                    nav: {
                        "home": "Головна",
                        "bookmarks": "Закладки"
                    },
                    footer: {
                        information: "Інформація",
                        project: "Про Проект",
                        help: "Допомога / FAQ",
                        contact: "Контакт",
                        command: "Управління",
                        policy: "Політика конфіденційності",
                        conditionals: "Умови використання",
                        follow: "Слідкуй за нами",
                        creator: "Розробник @Blazequiz",
                        privacy: "© 2024. Всі права захищені"
                    },
                    form: {
                        title: "Додати нову папку / посилання",
                        name: "Назва папки (або існуюча):",
                        url: "URL посилання:",
                        linkTitle: "Назва посилання:",
                        icon: "Іконка (опціонально):",
                        accept: "Підтвердити"
                    },
                    input: {
                        folder_name: "Наприклад, 'Робота'",
                        link_name: "Наприклад, 'Цікаве Відео'"
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