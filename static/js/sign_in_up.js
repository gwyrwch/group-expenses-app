function validate_sign_in() {
    var btn = document.getElementById('btn-sign-in');

    btn.onclick = async function () {
        var invalid_pass = document.getElementById('password-in-invalid-span');
        invalid_pass.style.display = 'none';

        var invalid_username = document.getElementById('username-in-invalid-span');
        invalid_username.style.display = 'none';

        var username = document.getElementsByName('sign-in-username').item(0).value;
        var password = document.getElementsByName('sign-in-password').item(0).value;
        console.log(username, password);

        if (!username  || username.length === 0) {
            invalid_username.style.display = 'block';
            return;
        }

        if (!password || password.length === 0) {
            invalid_pass.style.display = 'block';
            return;
        }

        document.getElementById('btn-sign-in-user').click();

    }
}

validate_sign_in();

if ( window.history.replaceState ) {
    window.history.replaceState( null, null, window.location.href );
}


function validate_sign_up() {
    var btn = document.getElementById('btn-sign-up');

    btn.onclick = async function () {
        var invalid_pass = document.getElementById('password-up-invalid-span');
        invalid_pass.style.display = 'none';
        var invalid_pass_empty = document.getElementById('password-empty-up-invalid-span');
        invalid_pass_empty.style.display = 'none';

        var invalid_username = document.getElementById('username-up-invalid-span');
        invalid_username.style.display = 'none';
        var invalid_username_empty = document.getElementById('username-empty-up-invalid-span');
        invalid_username_empty.style.display = 'none';


        var invalid_email_empty = document.getElementById('email-empty-up-invalid-span');
        var invalid_email = document.getElementById('email-up-invalid-span');
        invalid_email.style.display = 'none';
        invalid_email_empty.style.display = 'none';

        var username = document.getElementsByName('sign-up-username').item(0).value;
        var password = document.getElementsByName('sign-up-password').item(0).value;
        var email = document.getElementsByName('sign-up-email').item(0).value;
        console.log(username, password, email);

        var ret = false;
        if (!username  || username.length === 0) {
            invalid_username_empty.style.display = 'block';
            ret = true;
        }

        if (!password || password.length === 0) {
            invalid_pass_empty.style.display = 'block';
            ret = true;
        }

        if (!email || email.length === 0) {
            invalid_email.style.display = 'block';
            ret = true;
        }

        if (ret)
            return;

        let user = {
            username: username,
            email: email
        };

        let response = await fetch('/check_user_is_valid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept': 'application/json'
            },
            body: JSON.stringify(user)
        });

        let result = await response.json();
        console.log(result);
        var is_valid_username = result['username'];
        var is_valid_email = result['email'];


        if (!is_valid_email) {
            invalid_email.style.display = 'block';
            ret = true;
        }

        if (!is_valid_username) {
            invalid_username.style.display = 'block';
            ret = true;
        }

        if (password.length < 5) {
            invalid_pass.style.display = 'block';
            ret = true;
        }

        if (ret)
            return;

        console.log('kek');
        document.getElementById('btn-sign-up-user').click();

    }
}

validate_sign_up();
