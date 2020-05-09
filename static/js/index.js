import { addModal } from './lib.js';
import { getRandomInt } from './lib.js';


function addNewExpenseModal() {
    let modal = document.getElementById("addModal");
    let btn = document.getElementById("btnAdd");
    let close = document.getElementsByClassName("close-add-expense-modal")[0];
    addModal(modal, btn, close);
}
addNewExpenseModal();


function addWhoPaidModal() {
    let modal = document.getElementById("who_paid");
    let openBtn = document.getElementById("a-who-paid");
    let closeBtn = document.getElementsByClassName("close-who-paid-modal")[0];
    addModal(modal, openBtn, closeBtn);
}
addWhoPaidModal();

function addHowSplitModal() {
    let modal = document.getElementById("split");
    let openBtn = document.getElementById("a-split");
    let closeBtn = document.getElementsByClassName("close-split-modal")[0];
    addModal(modal, openBtn, closeBtn);
}
addHowSplitModal();

function getCurrentDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    let dateBtn = document.getElementById("btn-date-paid");
    dateBtn.value = today;
    return today;
}
getCurrentDate();


function addFindFriendModal() {
    let modal = document.getElementById("addFriendModal");
    let openBtn = document.getElementById("btnAddFriend");
    let closeBtn = document.getElementsByClassName("close-friend-modal")[0];
    addModal(modal, openBtn, closeBtn);
}

function sendInvitationToFriend() {
    let sendInvitationBtn = document.getElementById('send-friend-invitation');
    sendInvitationBtn.onclick = async function() {
        let friendUsername = document.getElementById('add-friend-username').value;

        if (friendUsername.length > 0) {
            let user = {
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
    let modal = document.getElementById("notificationModal");
    let openBtn = document.getElementById("btnOpenNotifications");
    let closeBtn = document.getElementsByClassName("close-notification-modal")[0];
    addModal(modal, openBtn, closeBtn);
}

function replyToNotificationRequest() {
    let acceptBtns = document.getElementsByClassName('button-accept');
    let declineBtns = document.getElementsByClassName('button-decline');
    let okBtns = document.getElementsByClassName('button-seen');

    for (let i = 0; i < acceptBtns.length; i++) {
        acceptBtns[i].onclick = async function() {
            let tokens = this.id.split('-');
            let res = {
                accept: tokens[0],
                n_type: tokens[1],
                n_sender_id: tokens[2]
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
            let tokens = this.id.split('-');
            let res = {
                accept: tokens[0],
                n_type: tokens[1],
                n_sender_id: tokens[2]
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
            let tokens = this.id.split('-');

            let res = {
                accept: tokens[0],
                n_type: tokens[1],
                n_sender_id: tokens[2]
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
    let modal = document.getElementById("createGroupModal");
    let openBtn = document.getElementById("btnCreateGroup");
    let closeBtn = document.getElementsByClassName("close-create-group-modal")[0];
    addModal(modal, openBtn, closeBtn);
}


function createNewGroup() {
    let groupPhotoBtn = document.getElementById('add-group-photo-button');
    groupPhotoBtn.onclick = function () {
        let fileInput = document.getElementById('add_group_photo');
        fileInput.click();
    };


    document.getElementById('add_group_photo').onchange = function () {
        groupPhotoBtn.style.color = '#4cd964';
    };

    let createGroupBtn = document.getElementById('create-group');

    createGroupBtn.onclick = async function() {
        let groupName = document.getElementById('create-group-name').value;
        let groupFile = document.getElementById('add_group_photo').files[0];

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

if(! (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ) {
    addFindFriendModal();
    sendInvitationToFriend();
    addNotificationFriendModal();
    replyToNotificationRequest();
    createGroupModal();
    createNewGroup();

}

function editGroupModal() {
    let modals = document.getElementsByClassName("groupSettingsModal");
    let openBtns = document.getElementsByClassName("btnEditGroup");
    let closeBtns = document.getElementsByClassName("close-edit-group-modal");

    for (let i = 0; i < modals.length; i++) {
        addModal(modals.item(i), openBtns.item(i), closeBtns.item(i));
    }
}

if(! (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ) {
    editGroupModal();
}


function deleteMemberFromGroup() {
    let deleteBtns = document.getElementsByClassName('close-delete-member');

    for (let i = 0; i < deleteBtns.length; i++) {
        deleteBtns.item(i).onclick = async function () {
            let tokens = this.id.split('-');
            let res = {
                id_group: tokens[2],
                username: tokens[1],
            };

            let response = await fetch('/delete_member_from_group', {
                method: 'POST',
                body: JSON.stringify(res)
            });

            let result = await response.json();

            location.reload();
        };
    }
}

if(! (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ) {
    deleteMemberFromGroup();
}

function inviteMember() {
    let buttons = document.getElementsByClassName('invite-group-member');
    let membersDiv = document.getElementsByClassName('add-members-div');

    for (let i = 0; i < buttons.length; i++) {
        buttons.item(i).onclick = function (i) {
            return function() {
                let idInput = getRandomInt(1,10000);
                let idClose = idInput + '_close';

                let members = membersDiv.item(i);
                let input = document.createElement('input');
                input.classList.add("modal-invite-input");
                input.id = idInput;

                members.appendChild(input);

                let icon = document.createElement('i');
                icon.classList.add("close-delete-new-member", "material-icons", "close");
                icon.id = idClose;
                icon.innerText = 'close';

                icon.onclick = function () {
                    let input = document.getElementById(this.id.split('_')[0]);
                    input.style.display = 'none';
                    this.style.display = 'none';
                };
                members.append(icon);
            }
        }(i);
    }
}


if(! (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ) {
    inviteMember();
}

function editGroup() {
    let editGroupBtns = document.getElementsByClassName('edit-group-save');
    let modals = document.getElementsByClassName("groupSettingsModal");

    let groupPhotoBtns = document.getElementsByClassName('edit-group-photo-button');
    for (let i = 0; i < groupPhotoBtns.length; i++) {
        groupPhotoBtns[i].onclick = function () {
            let fileInput = document.getElementById('edit_group_photo');
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
                let groupName = modals[j].getElementsByClassName("edit-group-name")[0].value;
                let idGroup = modals[j].getElementsByClassName("edit-group-name")[0].id;
                let newMembers = modals[j].getElementsByClassName("modal-invite-input");
                let members = [];
                for (let i =  0; i < newMembers.length; i++) {
                    members.push(newMembers[i].value);
                }

                let newGroupFile = document.getElementById('edit_group_photo').files[0];

                let fd = new FormData();

                if (newGroupFile)
                    fd.append('group_photo', newGroupFile, newGroupFile.name);
                fd.append('group_name', groupName);
                fd.append('group_members', JSON.stringify(members));
                fd.append('id_group', JSON.stringify(+idGroup));

                let response = await fetch('/edit_group', {
                    method: 'POST',
                    body: fd
                });

                let result = await response.json();
                location.reload();
            }
        }(j);

    }

}

if(! (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ) {
    editGroup();
}

function addOnclickToPhotoButton(idAddPhotoBtn, fileInputId) {
    let groupPhotoBtn = document.getElementById(idAddPhotoBtn);
    groupPhotoBtn.onclick = function () {
        let fileInput = document.getElementById(fileInputId);
        fileInput.click();
    };

    document.getElementById(fileInputId).onchange = function () {
        groupPhotoBtn.style.color = '#4cd964';
    };
}

function createExpense() {
    let createBtn = document.getElementsByClassName('btn-create_expense').item(0);
    addOnclickToPhotoButton('expense-photo-btn', 'expense-photo-input-file');

    createBtn.onclick = async function () {
        let invalid = document.getElementById('amount-invalid-span');
        invalid.style.display = 'none';

        let idGroup = createBtn.id.split('-')[2];
        let isFriend = createBtn.id.split('-')[3] === 'friend';
        let desc = document.getElementById('expense-description').value;
        let amount = document.getElementById('expense-amount').value;
        let photo = document.getElementById('expense-photo-input-file').files[0];
        let date = document.getElementById('btn-date-paid').value;
        let paidUsername = document.getElementById('a-who-paid').innerText;

        let percentageLi = document.getElementsByClassName('percentage');
        let percentUsers = [];
        for (let i = 0; i < percentageLi.length; i++) {
            let p = percentageLi[i];

            let username = p.getElementsByTagName('span')[0].innerText;
            let val = p.getElementsByClassName('input-percent-append')[0].value;

            let percentUser = {
                username: username,
                percent: parseFloat(val)
            };
            percentUsers.push(percentUser);
        }

        let equally = document.getElementById('a-split').innerHTML;
        equally = equally === 'equally';

        console.log(equally);

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


            let response = await fetch('/create_new_expense', {
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
    let whoBtns = document.getElementsByClassName('who-settle-li');

    for (let i = 0; i < whoBtns.length; i++) {
        whoBtns[i].onclick = function () {
            let openBtn = document.getElementById("a-who-paid");
            openBtn.innerText = this.id;
            let closeModalBtn = document.getElementsByClassName('close-who-paid-modal').item(0);
            closeModalBtn.click();
        };
    }
}

addWhoSettleToNewExpense();

function savePercents() {
    let percentSave = document.getElementById('save-percents-btn');

    percentSave.onclick = function () {
        let invalid = document.getElementById('percent-invalid-span');
        invalid.style.display = 'none';
        let percents = document.getElementsByClassName('input-percent-append');
        let sm = 0.0;
        for (let i = 0; i < percents.length; i++) {
            let val = parseFloat(percents.item(i).value);
            if (isNaN(val))
                val = 0;
            sm += val;
        }
        let eps = 1e-10;

        // sm nan
        if (isNaN(sm)) {
            return;
        }

        if (Math.abs(sm - 100.0) > eps) {
            invalid.style.display = 'block';
            return;
        }

        let equallyBtn = document.getElementById("a-split");
        equallyBtn.innerText = 'by percentage';
        let closeModalBtn = document.getElementsByClassName('close-split-modal').item(0);
        closeModalBtn.click();
    }
}
savePercents();


var expenseId = null;
function setOnclickToExpensesCards() {
    let cards = document.getElementsByClassName('expenses-card');

    for (let i = 0; i < cards.length; i++) {
        cards[i].onclick = function () {
            let selected = this.style.boxShadow === 'rgb(0, 126, 255) 0px 0px 3px';

            for (let j = 0; j < cards.length; j++) {
                cards[j].style.boxShadow = '0 0 3px rgba(0, 0, 0, 0.28)';
            }

            if (!selected) {
                this.style.boxShadow = '0 0 3px rgb(0, 126, 255)';
                expenseId = this.id.split('-')[0]
            } else {
                expenseId = null;
            }
        };
    }
}
setOnclickToExpensesCards();


function addSettleUp(modal, openBtn, closeBtn) {
    let modalNoExp  = document.getElementById('noExpenseChooseModal');

    addModal(
        modalNoExp,
        null,
        document.getElementsByClassName('close-no-expense-modal').item(0)
    );

    openBtn.onclick = async function () {
        if (expenseId == null) {
            modalNoExp.style.display = "block";
            setTimeout(() => {
                let content = modalNoExp.firstElementChild;
                content.classList.add("modal-content-activate");
            }, 1);
            return;
        }

        modal.style.display = "block";

        setTimeout(() => {
            let content = modal.firstElementChild;
            content.classList.add("modal-content-activate");
        }, 1);


        let response = await fetch('/get_expense_info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept': 'application/json'
            },
            body: expenseId
        });

        let result = await response.json();
        let pay = result['username_pay'];
        let get = result['username_get'];
        let amount = result['amount'];

        document.getElementById('a-who-settle').innerText = pay;
        document.getElementById('a-who-recipient').innerHTML = get;
        document.getElementById('settle-expense-amount').value = amount;
    };

    closeBtn.onclick = function() {
        let content = modal.firstElementChild;
        content.classList.remove("modal-content-activate");
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
            let content = modal.firstElementChild;
            content.classList.remove("modal-content-activate");
        }
    };
}


let modalSettle = document.getElementById("settleModal");
let btnSettle = document.getElementById("btnSet");
let closeBtn = document.getElementsByClassName("close-settle-modal")[0];
addSettleUp(modalSettle, btnSettle, closeBtn);


function settleUp() {
    let btnSettleUp = document.getElementById('btn-settle-up-confirm');
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
    let dropDown = document.getElementsByClassName('dropdown').item(0);
    let content = document.getElementsByClassName('dropdown-content').item(0);
    dropDown.onclick = function () {
        console.log(content);
        console.log(content.style.display);
        if (content.style.display === 'block')
            content.style.display = 'none';
        else
            content.style.display = 'block';
    };

    window.onclick = function(event) {
        console.log(event.target);
        if (!dropDown.contains(event.target)) {

            content.style.display = "none";
        }
    };
}

addDropDown();