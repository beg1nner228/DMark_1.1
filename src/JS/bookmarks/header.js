import i18next, { updateContent } from '../i18n.js'; 


const TRANSLATE_BUTTONS = document.querySelectorAll(".chooseLanguageJS > .lang-switch-btn");
console.log(TRANSLATE_BUTTONS);

TRANSLATE_BUTTONS.forEach(button => 
    button.addEventListener("click", (e) => {
        const newLang = button.dataset.lang;
        
        if (newLang && newLang !== i18next.language) {
            
            i18next.changeLanguage(newLang, (err, t) => {
                if (err) return console.error('Error changing language:', err);
                
                updateContent();
                
                TRANSLATE_BUTTONS.forEach(btn => btn.classList.remove('active-lang'));
                button.classList.add('active-lang');
            });
        }
    })
);