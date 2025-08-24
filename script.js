document.addEventListener('DOMContentLoaded', () => {
    
    const feedbackForm = document.getElementById('feedbackForm');
    const responseMessage = document.getElementById('responseMessage');
    const languageLinks = document.querySelectorAll('.language-switcher a');
    let currentTranslations = {};

    /**
     * NOU: Funcție pentru a genera efectul de litere zburătoare.
     */
    const createFlyingChars = () => {
        const container = document.querySelector('.flying-chars');
        if (!container) return;
        
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890*+@#&{}[]";
        const charCount = 50; // Numărul de caractere

        for (let i = 0; i < charCount; i++) {
            const li = document.createElement('li');
            
            li.style.left = `${Math.random() * 100}%`;
            li.style.fontSize = `${Math.random() * 1.5 + 0.5}em`;
            li.style.animationDuration = `${Math.random() * 20 + 15}s`; // între 15s și 35s
            li.style.animationDelay = `${Math.random() * 15}s`;
            
            li.textContent = chars.charAt(Math.floor(Math.random() * chars.length));
            container.appendChild(li);
        }
    };

    const changeLanguage = async (lang) => {
        try {
            const response = await fetch(`lang/${lang}.json`);
            if (!response.ok) throw new Error(`Fișierul de traducere lang/${lang}.json nu a fost găsit.`);
            const translations = await response.json();
            currentTranslations = translations;
            document.querySelectorAll('[data-lang-key]').forEach(element => {
                const key = element.getAttribute('data-lang-key');
                if (translations[key]) element.textContent = translations[key];
            });
            document.documentElement.lang = lang;
        } catch (error) { console.error('Eroare la schimbarea limbii:', error); }
    };

    languageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            changeLanguage(link.getAttribute('data-lang-code'));
        });
    });

    const validateForm = () => {
        let isValid = true;
        document.querySelectorAll('.error-message').forEach(msg => msg.classList.remove('visible'));
        document.querySelectorAll('.form-group .error').forEach(input => input.classList.remove('error'));
        const fieldsToValidate = { 'name': 'errorRequired', 'message': 'errorRequired', 'email': 'errorEmail' };

        for (const id in fieldsToValidate) {
            const input = document.getElementById(id);
            // Selectorul corect, care vizează elementul de după input
            const errorContainer = input.nextElementSibling;
            let hasError = false, errorKey = '';
            if (input.value.trim() === '') { hasError = true; errorKey = 'errorRequired'; }
            else if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) { hasError = true; errorKey = 'errorEmail'; }
            if (hasError) {
                isValid = false; input.classList.add('error');
                errorContainer.textContent = currentTranslations[errorKey]; errorContainer.classList.add('visible');
            }
        }
        
        const recaptchaResponse = typeof grecaptcha !== 'undefined' ? grecaptcha.getResponse() : '';
        if (recaptchaResponse.length === 0) {
            isValid = false;
            const recaptchaErrorContainer = document.querySelector('#recaptcha-container .error-message');
            if(recaptchaErrorContainer) {
                recaptchaErrorContainer.textContent = currentTranslations.errorCaptcha; recaptchaErrorContainer.classList.add('visible');
            }
        }
        return isValid;
    };

    feedbackForm.addEventListener('submit', (e) => {
        if (!validateForm()) {
            e.preventDefault();
            responseMessage.textContent = currentTranslations.errorForm;
            responseMessage.className = 'error';
        } else {
            responseMessage.textContent = ''; responseMessage.className = '';
        }
    });

    // --- Inițializare ---
    createFlyingChars(); // Apelăm funcția corectă
    changeLanguage('en');
});