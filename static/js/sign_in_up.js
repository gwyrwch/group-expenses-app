function validate_sign_in() {
    const btn = document.getElementById('btn-sign-in');

    btn.onclick = async function () {
        const invalid_pass = document.getElementById('password-in-invalid-span');
        invalid_pass.style.opacity = '0';

        const invalid_username = document.getElementById('username-in-invalid-span');
        invalid_username.style.opacity = '0';

        const username = document.getElementsByName('sign-in-username').item(0).value;
        const password = document.getElementsByName('sign-in-password').item(0).value;

        let ret = false;
        if (!username  || username.length === 0) {
            invalid_username.style.opacity = '1';
            ret = true;
        }

        if (!password || password.length === 0) {
            invalid_pass.style.opacity = '1';
            ret = true;
        }

        if (ret)
            return false;

        document.getElementById('btn-sign-in-user').click();

    }
}

validate_sign_in();

if ( window.history.replaceState ) {
    window.history.replaceState( null, null, window.location.href );
}

let isUsernameCorrect = false;
let isEmailCorrect = false;

function validateInputOnSignUp(
    inputName, spanId, url, divId, errorText,
    spinnerIndex, {invalidEmailText = null, lengthSpanText = null}
) {
    const input =  document.getElementsByName(inputName).item(0);
    const span = document.getElementById(spanId);

    const div = document.getElementById(divId);

    input.oninput = async function () {
        const val = this.value;
        span.style.opacity = '0';

        if (lengthSpanText && val.length < 3) {
            input.classList.remove('valid-input-value');
            input.classList.add('invalid-input-value');
            span.style.opacity = '1';
            span.innerText = lengthSpanText;
            return;
        }

        const spinner = document.getElementsByClassName('ispinner')[spinnerIndex];
        spinner.style.display = "block";
        div.classList.add('neg-margin');
        this.classList.remove('invalid-input-value');
        this.classList.remove('valid-input-value');

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept': 'application/json'
            },
            body: JSON.stringify(this.value)
        });

        setTimeout(async function () {
            const result = await response.json();
            const valid = result['valid'];
            const incorrect_email = result['incorrect_email'];

            if (invalidEmailText && incorrect_email) {
                span.style.opacity = '1';
                span.innerText = invalidEmailText;
                input.classList.add('invalid-input-value');
            } else {
                if (invalidEmailText)
                    span.style.opacity = '0';

                if (valid) {
                    if (inputName.includes('email')) {
                        isEmailCorrect = true;
                    } else {
                        isUsernameCorrect = true;
                    }

                    input.classList.add('valid-input-value');
                    span.style.opacity = '0';
                } else {
                    if (inputName.includes('email')) {
                        isEmailCorrect = false;
                    } else {
                        isUsernameCorrect = false;
                    }
                    input.classList.remove('valid-input-value');
                    input.classList.add('invalid-input-value');
                    span.style.opacity = '1';
                    span.innerText = errorText;
                }
            }

            spinner.style.display = "none";
            div.classList.remove('neg-margin');

            const btn = document.getElementById('btn-sign-up');
            btn.disabled = !(isEmailCorrect && isUsernameCorrect && passwordStrength(document.getElementsByName('sign-up-password').item(0).value) > 1);
        }, 1000);

    }

}

validateInputOnSignUp(
    'sign-up-username',
    'username-up-invalid-span',
    '/check_username_used',
    'username-spinner',
    'User with such username already exists',
    0,
    {invalidEmailText:null, lengthSpanText:'Length should be at least 3 symbols'}
);

validateInputOnSignUp(
    'sign-up-email',
    'email-up-invalid-span',
    '/check_email_used',
    'email-spinner',
    'User with such username already exists',
    1,
    {invalidEmailText:'This should be email address', lengthSpanText:null}
);

function isUppercase(symbol) {
    return symbol === symbol.toUpperCase();
}

function isNumber(symbol) {
    return symbol >= '0' && symbol <= '9';
}

function isSpecialSymbol(symbol) {
    return symbol === '$' || symbol === '%' || symbol === '#' || symbol === '!' || symbol === '_' || symbol === '(' ||
        symbol === ')' || symbol === '+' || symbol === '=';
}

function passwordStrength(password) {
    let strength = 0;

    if (password.length > 4)
        strength += 1;

    for (let i = 0; i < password.length; i++) {
        if (!isSpecialSymbol(password[i]) && !isNumber(password[i]) && isUppercase(password[i])) {
            strength += 1;
            break;
        }
    }

    for (let i = 0; i < password.length; i++) {
        if (isNumber(password[i])) {
            strength += 1;
            break;
        }
    }

    for (let i = 0; i < password.length; i++) {
        if (isSpecialSymbol(password[i])) {
            strength += 1;
            break;
        }
    }

    return strength;
}

function validatePasswordOnSignUp() {
    const inputPassword = document.getElementsByName('sign-up-password').item(0);
    const colorClasses = ['indicator-darkred', 'indicator-red', 'indicator-orange', 'indicator-yellow', 'indicator-green'];
    const indicators = document.getElementsByClassName('indicator');
    let passwordInvalidSpan = document.getElementById('password-up-invalid-span');

    inputPassword.oninput  = function () {
        const password = this.value;
        const strength = passwordStrength(password);

        passwordInvalidSpan.style.opacity = '0';
        if (strength <= 1)
            passwordInvalidSpan.style.opacity = '1';

        for (let i = 0; i < indicators.length; i++) {
            for (const c in colorClasses) {
                indicators[i].classList.remove(colorClasses[c]);
            }
        }

        for (let i = 0; i < strength + 1; i++) {
            indicators[i].classList.add(colorClasses[strength]);
        }

        const btn = document.getElementById('btn-sign-up');
        btn.disabled = !(isEmailCorrect && isUsernameCorrect && strength > 1);
    }
}

validatePasswordOnSignUp();


function sign_up_user() {
    const btn = document.getElementById('btn-sign-up');

    btn.onclick = async function () {
        document.getElementById('btn-sign-up-user').click();
    }
}

sign_up_user();
