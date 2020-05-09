import { addModal } from './lib.js';



var modal = document.getElementById("confirmModal");
var btn = document.getElementById("saveChanges");
var close = document.getElementsByClassName("close")[0];

console.log(modal, btn, close);

addModal(modal, btn, close, true);

function saveData() {
    let saveBtn = document.getElementsByClassName('profile-confirm-submit-btn').item(0);
    saveBtn.onclick = async function () {
        let span =  document.getElementById('password-invalid-span');
        span.style.display = 'none';

        let pass = {
            pass: document.getElementsByName('cur_password').item(0).value
        };

        let result = await fetch('/is_password_valid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept': 'application/json'
            },
            body: JSON.stringify(pass)
        });

        let res = await result.json();

        if (!res['valid']) {
            span.style.display = 'block';
        } else {
            let submitBtn = document.getElementById('submit-btn');
            submitBtn.click();
        }


    };
}
saveData();