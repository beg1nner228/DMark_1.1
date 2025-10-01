// src/i18n.js

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');

        el.textContent = i18next.t(key); 
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
                        home: "home",
                        bookmarks: "bookmarkS"
                    },
                    footer: {
                        information: "Information",
                        project: "About the Project",
                        help: "help / FAQ",
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
                      url: "URL Links:",
                      linkTitle: "Title References:",
                      icon: "Icon (optional):",
                      accept: "Confirm"
                    }
                } 
            }, 
            uk: {
                translation: {
                    nav: {
                        "home": "головна",
                        "bookmarks": "закладки"
                    },
                    footer: {
                        information: "Інформація",
                        project: "Про Проект",
                        help: "допомога / FAQ",
                        contact: "Контакт",
                        command: "Управління",
                        policy: "Політика конфіденційності",
                        conditionals: "Умови використання",
                        follow: "Слідкуй за нами",
                        creator: "Розробник @Blazequiz",
                        privacy: "© 2024. Всі права захищені"
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