import { addModal } from './lib.js';



const modal = document.getElementById("confirmModal");
const btn = document.getElementById("saveChanges");
const close = document.getElementsByClassName("close")[0];
addModal(modal, btn, close, true);


function saveData() {
    const saveBtn = document.getElementsByClassName('profile-confirm-submit-btn').item(0);
    saveBtn.onclick = async function () {
        const span =  document.getElementById('password-invalid-span');
        span.style.display = 'none';

        const pass = {
            pass: document.getElementsByName('cur_password').item(0).value
        };

        const result = await fetch('/is_password_valid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept': 'application/json'
            },
            body: JSON.stringify(pass)
        });

        const res = await result.json();

        if (!res['valid']) {
            span.style.display = 'block';
        } else {
            const submitBtn = document.getElementById('submit-btn');
            submitBtn.click();
        }


    };
}
saveData();

function handleProfileImage() {
    const btn = document.getElementsByClassName('profile-photo-button').item(0);
    btn.onclick = function () {
        const file_input = document.getElementById('photo');
        file_input.click();

        file_input.onchange = (event) => {
            if (event.target.files) {
                if (event.target.files[0]) {
                    const objectURL = window.URL.createObjectURL(event.target.files[0]);

                    const photo  = document.getElementsByClassName('profile-photo').item(0);
                    photo.src = objectURL;
                }
            }
        };

    };

}

handleProfileImage();