import { addModal } from './lib.js';
import { getRandomInt } from './lib.js';
import {setThemeColors} from "./lib.js";


function addNewExpenseModal() {
    const modal = document.getElementById("addModal");
    const btn = document.getElementById("btnAdd");
    const close = document.getElementsByClassName("close-add-expense-modal")[0];
    addModal(modal, btn, close);
}
addNewExpenseModal();


function addWhoPaidModal() {
    const modal = document.getElementById("who_paid");
    const openBtn = document.getElementById("a-who-paid");
    const closeBtn = document.getElementsByClassName("close-who-paid-modal")[0];
    addModal(modal, openBtn, closeBtn);
}
addWhoPaidModal();

function addHowSplitModal() {
    const modal = document.getElementById("split");
    const openBtn = document.getElementById("a-split");
    const closeBtn = document.getElementsByClassName("close-split-modal")[0];
    addModal(modal, openBtn, closeBtn);
}
addHowSplitModal();

function getCurrentDate() {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    const dateBtn = document.getElementById("btn-date-paid");
    dateBtn.value = today;
    return today;
}
getCurrentDate();


function addFindFriendModal() {
    const modal = document.getElementById("addFriendModal");
    const openBtn = document.getElementById("btnAddFriend");
    const closeBtn = document.getElementsByClassName("close-friend-modal")[0];
    addModal(modal, openBtn, closeBtn);
}

function sendInvitationToFriend() {
    const sendInvitationBtn = document.getElementById('send-friend-invitation');
    sendInvitationBtn.onclick = async function() {
        const friendUsername = document.getElementById('add-friend-username').value;

        if (friendUsername.length > 0) {
            const user = {
                username: friendUsername
            };



            await fetch('/send_friend_invitation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(user)
            });

            location.reload();

        }
    };

}

function addNotificationFriendModal() {
    const modal = document.getElementById("notificationModal");
    const openBtn = document.getElementById("btnOpenNotifications");
    const closeBtn = document.getElementsByClassName("close-notification-modal")[0];
    addModal(modal, openBtn, closeBtn);
}


function addThemeModal() {
    const modal = document.getElementById("themeModal");
    const openBtn = document.getElementById("btnChangeTheme");
    const closeBtn = document.getElementsByClassName("close-theme-modal")[0];
    addModal(modal, openBtn, closeBtn);
}

function adjust(color, amount) {
    return '#' + color.replace(/^#/, '').replace(
        /../g, color => (
            '0' + Math.min(
                255, Math.max(0, parseInt(color, 16) + amount)
            ).toString(16)).substr(-2)
    );
}

function hexToRgba(hex, alpha = 1) {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
}

function setTempProperties(bgColor, textColor, mainTextColor, hrefBgColor, logoSrc) {
    document.documentElement.style.setProperty("--background-color", bgColor);
    document.documentElement.style.setProperty("--text-color", textColor);
    document.documentElement.style.setProperty("--main-text-color", mainTextColor);
    document.documentElement.style.setProperty("--href-bg-color", hrefBgColor);
    document.getElementById('logo').src = logoSrc;
}

setThemeColors();
function changeTheme() {
    const mainInput = document.getElementById('mainColorInput');
    mainInput.value = getComputedStyle(document.documentElement).getPropertyValue('--main-color');

    mainInput.addEventListener("change", function() {
        document.documentElement.style.setProperty("--main-color", this.value);
        document.documentElement.style.setProperty("--main-dark-color", adjust(this.value, -20));
        document.documentElement.style.setProperty("--main-light-color", hexToRgba(this.value, 0.2));
        localStorage.setItem("tempMainColor", this.value);
    });

    const lightColor = '#ffffff';
    const darkColor = '#272933';
    const lightColorBtn = document.getElementById('lightThemeBtn');
    const darkColorBtn = document.getElementById('darkThemeBtn');

    const hrefBgLight = '#f1f1f1';
    const hrefBgDark = '#1b1b1b';

    const bgColor = localStorage.getItem('backgroundColor');
    if (!bgColor || bgColor === lightColor) {
        lightColorBtn.classList.add("selected-theme-btn");
    } else {
        darkColorBtn.classList.add("selected-theme-btn");
    }

    lightColorBtn.onclick = function () {
        this.classList.add("selected-theme-btn");
        darkColorBtn.classList.remove("selected-theme-btn");

        const newLogoSrc = document.getElementById('logo').src.replace(/logowhite.png/gi, 'logo.png');

        setTempProperties(lightColor, lightColor, darkColor, hrefBgLight, newLogoSrc);

        localStorage.setItem("tempBackgroundColor", lightColor);
        localStorage.setItem("tempLogoSrc", newLogoSrc);
    };

    darkColorBtn.onclick = function () {
        this.classList.add("selected-theme-btn");
        lightColorBtn.classList.remove("selected-theme-btn");
        const newLogoSrc = document.getElementById('logo').src.replace(/logo.png/gi, 'logowhite.png');

        setTempProperties(darkColor, darkColor, lightColor, hrefBgDark, newLogoSrc);

        localStorage.setItem("tempBackgroundColor", darkColor);
        localStorage.setItem("tempLogoSrc", newLogoSrc);
    };


    const saveBtn = document.getElementById('saveThemeBtn');
    saveBtn.onclick = function () {
        const newMainColor = localStorage.getItem("tempMainColor");
        localStorage.setItem("mainColor", newMainColor);
        localStorage.setItem("mainDarkColor", adjust(newMainColor, -20));
        localStorage.setItem("mainLightColor", hexToRgba(newMainColor, 0.2));
        const newBgColor = localStorage.getItem("tempBackgroundColor");
        localStorage.setItem("textColor", newBgColor);
        localStorage.setItem("backgroundColor", newBgColor);
        localStorage.setItem("mainTextColor", newBgColor === lightColor ? darkColor : lightColor);
        localStorage.setItem("hrefBgColor", newBgColor === lightColor ? hrefBgLight : hrefBgDark);
        localStorage.setItem("logoSrc", localStorage.getItem("tempLogoSrc"));

        location.reload();
    };
}


function replyToNotificationRequest() {
    const acceptBtns = document.getElementsByClassName('button-accept');
    const declineBtns = document.getElementsByClassName('button-decline');
    const okBtns = document.getElementsByClassName('button-seen');

    for (let i = 0; i < acceptBtns.length; i++) {
        acceptBtns[i].onclick = async function() {
            const tokens = this.id.split('-');
            const res = {
                accept: 'accept',
                n_type: this.dataset.type,
                n_sender_id: this.dataset.sender
            };


            await fetch('/reply_to_notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(res)
            });

            location.reload();
        }
    }

    for (let i = 0; i < declineBtns.length; i++) {
        declineBtns[i].onclick = async function() {
            const tokens = this.id.split('-');
            const res = {
                accept: 'decline',
                n_type: this.dataset.type,
                n_sender_id: this.dataset.sender
            };


            await fetch('/reply_to_notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(res)
            });

            location.reload();
        }
    }

    for (let i = 0; i < okBtns.length; i++) {
        okBtns[i].onclick = async function() {

            const res = {
                accept: 'seen',
                n_type: this.dataset.type,
                n_sender_id: this.dataset.sender
            };

            await fetch('/reply_to_notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(res)
            });

            location.reload();
        }
    }
}

function createGroupModal() {
    const modal = document.getElementById("createGroupModal");
    const openBtn = document.getElementById("btnCreateGroup");
    const closeBtn = document.getElementsByClassName("close-create-group-modal")[0];
    addModal(modal, openBtn, closeBtn);
}


function createNewGroup() {
    const groupPhotoBtn = document.getElementById('add-group-photo-button');
    groupPhotoBtn.onclick = function () {
        const fileInput = document.getElementById('add_group_photo');
        fileInput.click();
    };


    document.getElementById('add_group_photo').onchange = function () {
        groupPhotoBtn.style.color = '#4cd964';
    };

    const createGroupBtn = document.getElementById('create-group');

    createGroupBtn.onclick = async function() {
        const groupName = document.getElementById('create-group-name').value;
        const groupFile = document.getElementById('add_group_photo').files[0];

        if (groupName.length > 0) {
            let fd = new FormData();

            fd.append('group_name', groupName);
            if (groupFile)
                fd.append('group_photo', groupFile, groupFile.name);

            await fetch('/create_new_group', {
                method: 'POST',
                body: fd
            });

            location.reload();
        }
    };
}

const isMobile = () => /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (!isMobile()) {
    addFindFriendModal();
    sendInvitationToFriend();
    addNotificationFriendModal();
    addThemeModal();
    changeTheme();
    replyToNotificationRequest();
    createGroupModal();
    createNewGroup();

}

function editGroupModal() {
    const modals = document.getElementsByClassName("groupSettingsModal");
    const openBtns = document.getElementsByClassName("btnEditGroup");
    const closeBtns = document.getElementsByClassName("close-edit-group-modal");

    for (let i = 0; i < modals.length; i++) {
        addModal(modals.item(i), openBtns.item(i), closeBtns.item(i));
    }
}

if(!isMobile()) {
    editGroupModal();
}


function deleteMemberFromGroup() {
    const deleteBtns = document.getElementsByClassName('close-delete-member');

    for (let i = 0; i < deleteBtns.length; i++) {
        deleteBtns.item(i).onclick = async function () {
            const tokens = this.id.split('-');
            const res = {
                id_group: tokens[2],
                username: tokens[1],
            };

            await fetch('/delete_member_from_group', {
                method: 'POST',
                body: JSON.stringify(res)
            });

            location.reload();
        };
    }
}

if(!isMobile()) {
    deleteMemberFromGroup();
}

function inviteMember() {
    const buttons = document.getElementsByClassName('invite-group-member');
    const membersDiv = document.getElementsByClassName('add-members-div');

    for (let i = 0; i < buttons.length; i++) {
        buttons.item(i).onclick = function (i) {
            return function() {
                const idInput = getRandomInt(1,10000);
                const idClose = idInput + '_close';

                const members = membersDiv.item(i);
                const input = document.createElement('input');
                input.classList.add("modal-invite-input");
                input.id = idInput;

                members.appendChild(input);

                const icon = document.createElement('i');
                icon.classList.add("close-delete-new-member", "material-icons", "close");
                icon.id = idClose;
                icon.innerText = 'close';

                icon.onclick = function () {
                    const input = document.getElementById(this.id.split('_')[0]);
                    input.style.display = 'none';
                    this.style.display = 'none';
                };
                members.append(icon);
            }
        }(i);
    }
}


if(!isMobile()) {
    inviteMember();
}

function editGroup() {
    const editGroupBtns = document.getElementsByClassName('edit-group-save');
    const modals = document.getElementsByClassName("groupSettingsModal");

    const groupPhotoBtns = document.getElementsByClassName('edit-group-photo-button');
    for (let i = 0; i < groupPhotoBtns.length; i++) {
        groupPhotoBtns[i].onclick = function () {
            const fileInput = document.getElementById('edit_group_photo');
            fileInput.click();
        };


        document.getElementById('edit_group_photo').onchange = function(i) {
            return function () {
                groupPhotoBtns[i].style.color = '#4cd964';
            };
        }(i);
    }


    for (let j = 0; j < editGroupBtns.length; j++) {
        editGroupBtns[j].onclick = function(j) {
            return async function () {
                const groupName = modals[j].getElementsByClassName("edit-group-name")[0].value;
                const idGroup = modals[j].getElementsByClassName("edit-group-name")[0].id;
                const newMembers = modals[j].getElementsByClassName("modal-invite-input");
                let members = [];
                for (let i =  0; i < newMembers.length; i++) {
                    members.push(newMembers[i].value);
                }

                const newGroupFile = document.getElementById('edit_group_photo').files[0];

                let fd = new FormData();

                if (newGroupFile)
                    fd.append('group_photo', newGroupFile, newGroupFile.name);
                fd.append('group_name', groupName);
                fd.append('group_members', JSON.stringify(members));
                fd.append('id_group', JSON.stringify(+idGroup));

                const response = await fetch('/edit_group', {
                    method: 'POST',
                    body: fd
                });

                const result = await response.json();
                location.reload();
            }
        }(j);

    }

}

if(!isMobile()) {
    editGroup();
}

function addOnclickToPhotoButton(idAddPhotoBtn, fileInputId) {
    const groupPhotoBtn = document.getElementById(idAddPhotoBtn);
    groupPhotoBtn.onclick = function () {
        const fileInput = document.getElementById(fileInputId);
        fileInput.click();
    };

    document.getElementById(fileInputId).onchange = function () {
        groupPhotoBtn.style.color = '#4cd964';
    };
}

function createExpense() {
    const createBtn = document.getElementsByClassName('btn-create_expense').item(0);

    if (!createBtn)
        return;

    addOnclickToPhotoButton('expense-photo-btn', 'expense-photo-input-file');

    createBtn.onclick = async function () {
        const invalid = document.getElementById('amount-invalid-span');
        invalid.style.display = 'none';

        const idGroup = this.dataset.idGroup;
        const isFriend = this.dataset.isFriend === '1';
        const desc = document.getElementById('expense-description').value;
        const amount = document.getElementById('expense-amount').value;
        const photo = document.getElementById('expense-photo-input-file').files[0];
        const date = document.getElementById('btn-date-paid').value;
        const paidUsername = document.getElementById('a-who-paid').innerText;

        const percentageLi = document.getElementsByClassName('percentage');
        let percentUsers = [];
        for (let i = 0; i < percentageLi.length; i++) {
            const p = percentageLi[i];

            const username = p.getElementsByTagName('span')[0].innerText;
            const val = p.getElementsByClassName('input-percent-append')[0].value;

            const percentUser = {
                username: username,
                percent: parseFloat(val)
            };
            percentUsers.push(percentUser);
        }

        let equally = document.getElementById('a-split').innerHTML;
        equally = equally === 'equally' || equally === 'поровну';

        if (amount.length !== 0) {
            let fd = new FormData();

            fd.append('id_group', idGroup);
            if (photo)
                fd.append('photo', photo, photo.name);
            fd.append('desc', desc);
            fd.append('amount', amount);
            fd.append('date', date);
            fd.append('percent_users', JSON.stringify(percentUsers));
            fd.append('paid_username', paidUsername);
            fd.append('equally', equally);
            fd.append('is_friend', isFriend);


            const response = await fetch('/create_new_expense', {
                method: 'POST',
                body: fd
            });
            location.reload();
        }  else {
            if (amount.length === 0) {
                invalid.style.display = 'block';
            }
        }

    };
}

createExpense();


function addWhoSettleToNewExpense() {
    const whoBtns = document.getElementsByClassName('who-settle-li');

    for (let i = 0; i < whoBtns.length; i++) {
        whoBtns[i].onclick = function () {
            const openBtn = document.getElementById("a-who-paid");
            openBtn.innerText = this.id;
            const closeModalBtn = document.getElementsByClassName('close-who-paid-modal').item(0);
            closeModalBtn.click();
        };
    }
}

addWhoSettleToNewExpense();

function savePercents() {
    const percentSave = document.getElementById('save-percents-btn');

    percentSave.onclick = function () {
        const invalid = document.getElementById('percent-invalid-span');
        invalid.style.display = 'none';
        const percents = document.getElementsByClassName('input-percent-append');
        let sm = 0.0;
        for (let i = 0; i < percents.length; i++) {
            let val = parseFloat(percents.item(i).value);
            if (isNaN(val))
                val = 0;
            sm += val;
        }
        const eps = 1e-10;

        // sm nan
        if (isNaN(sm)) {
            return;
        }

        if (Math.abs(sm - 100.0) > eps) {
            invalid.style.display = 'block';
            return;
        }

        const equallyBtn = document.getElementById("a-split");
        equallyBtn.innerText = gettext('by percentage');
        const closeModalBtn = document.getElementsByClassName('close-split-modal').item(0);
        closeModalBtn.click();
    }
}
savePercents();


var expenseId = null;
function setOnclickToExpensesCards() {
    const cards = document.getElementsByClassName('expenses-card');

    for (let i = 0; i < cards.length; i++) {
        cards[i].onfocus = function () {
            const selected = this.classList.contains('expenses-card-selected');

            for (let j = 0; j < cards.length; j++) {
                cards[j].classList.remove('expenses-card-selected');
            }

            if (!selected) {
                this.classList.add('expenses-card-selected');
                const selected1 = this.classList.contains('expenses-card-selected');
                expenseId = this.id.split('-')[0];
            } else {
                expenseId = null;
            }
        };
    }
}
setOnclickToExpensesCards();


function addSettleUp(modal, openBtn, closeBtn) {
    if (!openBtn)
        return;

    const modalNoExp  = document.getElementById('noExpenseChooseModal');

    addModal(
        modalNoExp,
        null,
        document.getElementsByClassName('close-no-expense-modal').item(0)
    );

    openBtn.onclick = async function () {
        if (expenseId == null) {
            modalNoExp.style.display = "block";
            setTimeout(() => {
                const content = modalNoExp.firstElementChild;
                content.classList.add("modal-content-activate");
            }, 1);
            return;
        }

        modal.style.display = "block";

        setTimeout(() => {
            const content = modal.firstElementChild;
            content.classList.add("modal-content-activate");
        }, 1);


        console.log(expenseId);
        const response = await fetch('/get_expense_info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept': 'application/json'
            },
            body: expenseId
        });

        const result = await response.json();

        let pay = result['username_pay'];
        let get = result['username_get'];
        const amount = result['amount'];

        if (pay === 'You') {
            pay = gettext('You')
        }
        if (get === 'you') {
            get = gettext('you')
        }

        document.getElementById('a-who-settle').innerText = pay;
        document.getElementById('a-who-recipient').innerHTML = get;
        document.getElementById('settle-expense-amount').value = amount;
    };

    closeBtn.onclick = function() {
        const content = modal.firstElementChild;
        content.classList.remove("modal-content-activate");
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
            const content = modal.firstElementChild;
            content.classList.remove("modal-content-activate");
        }
    };
}


const modalSettle = document.getElementById("settleModal");
const btnSettle = document.getElementById("btnSet");
const closeBtn = document.getElementsByClassName("close-settle-modal")[0];
addSettleUp(modalSettle, btnSettle, closeBtn);


function settleUp() {
    const btnSettleUp = document.getElementById('btn-settle-up-confirm');
    btnSettleUp.onclick = async function () {
        await fetch('/settle_up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept': 'application/json'
            },
            body: expenseId
        });

         location.reload();

    }
}

settleUp();


function addDropDown() {
    const dropDown = document.getElementsByClassName('dropdown').item(0);
    const content = document.getElementsByClassName('dropdown-content').item(0);
    dropDown.onclick = function () {
        if (content.style.display === 'block')
            content.style.display = 'none';
        else
            content.style.display = 'block';
    };

    window.onclick = function(event) {
        if (!dropDown.contains(event.target)) {
            content.style.display = "none";
        }
    };
}

addDropDown();