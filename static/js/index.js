if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    window.location.replace("index_mobile");
}

import { add_modal } from './lib.js';
import { getRandomInt } from './lib.js';

// function hover_image(id) {
//     return function () {
//         var sidebar_el = document.getElementById(id);
//         var a_el = sidebar_el.firstElementChild;
//         var img_el = a_el.firstElementChild;
//         if (id.includes("gr"))
//             img_el.src = "static/img/group_hover.png";
//     }
// }
//
// function unhover_image(id) {
//     return function () {
//         var sidebar_el = document.getElementById(id);
//         var a_el = sidebar_el.firstElementChild;
//         var img_el = a_el.firstElementChild;
//         if (id.includes("gr"))
//             img_el.src = "static/img/group2.png";
//     }
// }

// var  all_sidebar_elements = document.getElementsByClassName("li-sidebar-hover");
// var  save_sidebar_elements = document.getElementsByClassName("li-sidebar-hover");
// for (var i = 0; i < all_sidebar_elements.length; i++) {
//     all_sidebar_elements[i].onmouseover = hover_image(all_sidebar_elements[i].id);
//     all_sidebar_elements[i].onmouseout = unhover_image(all_sidebar_elements[i].id);
// }

// todo: color image border on hover


// modal

var modal = document.getElementById("addModal");
var btn = document.getElementById("btnAdd");
var close = document.getElementsByClassName("close-add-expense-modal")[0];
add_modal(modal, btn, close, true);

var modal_settle = document.getElementById("settleModal");
var btn_settle = document.getElementById("btnSet");
var close_btn = document.getElementsByClassName("close-settle-modal")[0];
add_modal(modal_settle, btn_settle, close_btn, true);


function add_who_settle_modal() {
    var modal = document.getElementById("who_settle");
    var open_btn = document.getElementById("a-who-settle");
    var close_btn = document.getElementsByClassName("close-who-settle-modal")[0];
    add_modal(modal, open_btn, close_btn);
}

add_who_settle_modal();

function add_who_recipient_modal() {
    var modal = document.getElementById("who_recipient");
    var open_btn = document.getElementById("a-who-recipient");
    var close_btn = document.getElementsByClassName("close-who-recipient-modal")[0];
    add_modal(modal, open_btn, close_btn);
}
add_who_recipient_modal();

function add_who_paid_modal() {
    var modal = document.getElementById("who_paid");
    var open_btn = document.getElementById("a-who-paid");
    var close_btn = document.getElementsByClassName("close-who-paid-modal")[0];
    add_modal(modal, open_btn, close_btn);
}
add_who_paid_modal();

function add_how_split_modal() {
    var modal = document.getElementById("split");
    var open_btn = document.getElementById("a-split");
    var close_btn = document.getElementsByClassName("close-split-modal")[0];
    add_modal(modal, open_btn, close_btn);
}
add_how_split_modal();


function get_current_date() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' +  mm + '-' + dd;

    var date_btn = document.getElementById("btn-date-paid");
    date_btn.value = today;

    return today;
}
get_current_date();


function add_find_friend_modal() {
    var modal = document.getElementById("addFriendModal");
    var open_btn = document.getElementById("btnAddFriend");
    var close_btn = document.getElementsByClassName("close-friend-modal")[0];
    add_modal(modal, open_btn, close_btn);
}
add_find_friend_modal();


function send_invitation_to_friend() {
    var sendInvitationBtn = document.getElementById('send-friend-invitation');
    sendInvitationBtn.onclick = async function() {
        var friendUsername = document.getElementById('add-friend-username').value;
        // console.log(friendUsername);

        if (friendUsername.length > 0) {
            let user = {
                username: friendUsername
            };

            let response = await fetch('/send_friend_invitation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(user)
            });

            location.reload();
            //
            // let result = await response.json();
            // console.log(result);
        }
    };

}

send_invitation_to_friend();

function add_notification_friend_modal() {
    var modal = document.getElementById("notificationModal");
    var open_btn = document.getElementById("btnOpenNotifications");
    var close_btn = document.getElementsByClassName("close-notification-modal")[0];
    add_modal(modal, open_btn, close_btn);
}
add_notification_friend_modal();


function reply_to_notification_request() {
    var acceptBtns = document.getElementsByClassName('button-accept');
    var declineBtns = document.getElementsByClassName('button-decline');
    var okBtns = document.getElementsByClassName('button-seen');

    for (let i = 0; i < acceptBtns.length; i++) {
        acceptBtns[i].onclick = async function() {
            let tokens = this.id.split('-');
            let res = {
                accept: tokens[0],
                n_type: tokens[1],
                n_sender_id: tokens[2]
            };


            let response = await fetch('/reply_to_notification', {
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


            let response = await fetch('/reply_to_notification', {
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

            let response = await fetch('/reply_to_notification', {
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

reply_to_notification_request();


function create_group_modal() {
    var modal = document.getElementById("createGroupModal");
    var open_btn = document.getElementById("btnCreateGroup");
    var close_btn = document.getElementsByClassName("close-create-group-modal")[0];
    add_modal(modal, open_btn, close_btn);
}
create_group_modal();


function create_new_group() {
    var groupPhotoBtn = document.getElementById('add-group-photo-button');
    groupPhotoBtn.onclick = function () {
        var file_input = document.getElementById('add_group_photo');
        file_input.click();
    };


    document.getElementById('add_group_photo').onchange = function () {
        // console.log(groupPhotoBtn);
        groupPhotoBtn.style.color = '#4cd964';
    };

    var createGroupBtn = document.getElementById('create-group');

    createGroupBtn.onclick = async function() {
        var groupName = document.getElementById('create-group-name').value;
        var groupFile = document.getElementById('add_group_photo').files[0];

        // if (groupFile.type.startsWith('image'))

        // console.log(groupName, groupFile);

        if (groupName.length > 0) {
            var fd = new FormData();

            fd.append('group_name', groupName);
            if (groupFile)
                fd.append('group_photo', groupFile, groupFile.name);


            let response = await fetch('/create_new_group', {
                method: 'POST',
                body: fd
            });

            let result = await response.json();
            // console.log(result);

            location.reload();
        }
    };
}
create_new_group();



function edit_group_modal() {
    var modals = document.getElementsByClassName("groupSettingsModal");
    var open_btns = document.getElementsByClassName("btnEditGroup");
    var close_btns = document.getElementsByClassName("close-edit-group-modal");

    // console.log(modals.length,open_btns.length,close_btns.length);

    for (var i = 0; i < modals.length; i++) {
        add_modal(modals.item(i), open_btns.item(i), close_btns.item(i));
    }
}

edit_group_modal();


function delete_member_from_group() {
    var deleteBtns = document.getElementsByClassName('close-delete-member');
    // console.log(deleteBtns);

    for (var i = 0; i < deleteBtns.length; i++) {
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
            // console.log(result);

            location.reload();
        };
    }
}
delete_member_from_group();


function invite_member() {
    var buttons = document.getElementsByClassName('invite-group-member');
    var members_div = document.getElementsByClassName('add-members-div');

    for (var i = 0; i < buttons.length; i++) {
        buttons.item(i).onclick = function (i) {
            return function() {
                var id_input = getRandomInt(1,10000);
                var id_close = id_input + '_close';
                // любой айдишник рандомный

                var members = members_div.item(i);
                var input = document.createElement('input');
                input.classList.add("modal-invite-input");
                input.id = id_input;

                members.appendChild(input);

                var icon = document.createElement('i');
                icon.classList.add("close-delete-new-member", "material-icons", "close");
                icon.id = id_close;
                icon.innerText = 'close';


                icon.onclick = function () {
                    var input = document.getElementById(this.id.split('_')[0]);
                    input.style.display = 'none';
                    this.style.display = 'none';
                };
                members.append(icon);
            }
        }(i);
    }
}

invite_member();



function edit_group() {
    var editGroupBtns = document.getElementsByClassName('edit-group-save');
    var modals = document.getElementsByClassName("groupSettingsModal");

    var groupPhotoBtns = document.getElementsByClassName('edit-group-photo-button');
    for (var i = 0; i < groupPhotoBtns.length; i++) {
        groupPhotoBtns[i].onclick = function () {
            var file_input = document.getElementById('edit_group_photo');
            file_input.click();
        };


        document.getElementById('edit_group_photo').onchange = function(i) {
            return function () {
                groupPhotoBtns[i].style.color = '#4cd964';
            };
        }(i);
    }


    for (var j = 0; j < editGroupBtns.length; j++) {
        editGroupBtns[j].onclick = function(j) {
            return async  function () {
                var groupName = modals[j].getElementsByClassName("edit-group-name")[0].value;
                var id_group = modals[j].getElementsByClassName("edit-group-name")[0].id;
                var newMembers = modals[j].getElementsByClassName("modal-invite-input");
                var members = [];
                for (var i =  0; i < newMembers.length; i++) {
                    members.push(newMembers[i].value);
                }

                var newGroupFile = document.getElementById('edit_group_photo').files[0];

                var fd = new FormData();

                if (newGroupFile)
                    fd.append('group_photo', newGroupFile, newGroupFile.name);
                fd.append('group_name', groupName);
                fd.append('group_members', JSON.stringify(members));
                fd.append('id_group', JSON.stringify(+id_group));

                let response = await fetch('/edit_group', {
                    method: 'POST',
                    body: fd
                });

                let result = await response.json();
                console.log(result);
                location.reload();
            }
        }(j);

    }

}

edit_group();


function addOnclickToPhotoButton(idAddPhotoBtn, fileInputId) {
    var groupPhotoBtn = document.getElementById(idAddPhotoBtn);
    groupPhotoBtn.onclick = function () {
        var file_input = document.getElementById(fileInputId);
        file_input.click();
    };


    document.getElementById(fileInputId).onchange = function () {
        console.log(groupPhotoBtn);
        groupPhotoBtn.style.color = '#4cd964';
    };
}

function create_expense() {
    var createBtn = document.getElementsByClassName('btn-create_expense').item(0);
    addOnclickToPhotoButton('expense-photo-btn', 'expense-photo-input-file');

    createBtn.onclick = async function () {
        var invalid = document.getElementById('amount-invalid-span');
        invalid.style.display = 'none';

        var id_group = createBtn.id.split('-')[2];
        var desc = document.getElementById('expense-description').value;
        var amount = document.getElementById('expense-amount').value;
        var photo = document.getElementById('expense-photo-input-file').files[0];
        var date = document.getElementById('btn-date-paid').value;
        var paid_username = document.getElementById('a-who-paid').innerText;

        var percentage_li = document.getElementsByClassName('percentage');
        var percent_users = [];
        for (var i = 0; i < percentage_li.length; i++) {
            var p = percentage_li[i];
            var username = p.getElementsByTagName('span')[0].innerText;
            var val = p.getElementsByClassName('input-percent-append')[0].value;

            // console.log(username, val); // insert into dict
            var percent_user = {
                username: username,
                percent: parseFloat(val)
            };
            percent_users.push(percent_user);
        }

        var equally = document.getElementById('a-split').innerHTML;
        equally = equally === 'equally';
        console.log(equally);


        if (amount.length !== 0) {
            var fd = new FormData();

            fd.append('id_group', id_group);
            if (photo)
                fd.append('photo', photo, photo.name);
            fd.append('desc', desc);
            fd.append('amount', amount);
            fd.append('date', date);
            fd.append('percent_users', JSON.stringify(percent_users));
            fd.append('paid_username', paid_username);
            fd.append('equally', equally);


            let response = await fetch('/create_new_expense', {
                method: 'POST',
                body: fd
            });
        }  else {
            if (amount.length === 0) {
                invalid.style.display = 'block';
            }

        }


        // console.log(id_group, desc, amount, photo);

    };
}

create_expense();


function add_who_settle_to_new_expense() {
    var whoBtns = document.getElementsByClassName('who-settle-li');
    console.log(whoBtns);

    for (var i = 0; i < whoBtns.length; i++) {
        console.log(whoBtns.item(i));
        whoBtns[i].onclick = function () {
            var open_btn = document.getElementById("a-who-paid");
            open_btn.innerText = this.id;
            var closeModalBtn = document.getElementsByClassName('close-who-paid-modal').item(0);
            closeModalBtn.click();
        };
    }
}

add_who_settle_to_new_expense();

function save_percents() {
    var percentSave = document.getElementById('save-percents-btn');

    percentSave.onclick = function () {
        var percents = document.getElementsByClassName('input-percent-append');
        var sm = 0.0;
        for (var i = 0; i < percents.length; i++) {
            var val = parseFloat(percents.item(i).value);
            if (isNaN(val))
                val = 0;
            sm += val;
        }
        var eps = 1e-10;

        // sm nan
        if (isNaN(sm)) {
            return;
        }

        if (Math.abs(sm - 100.0) > eps) {
            var invalid = document.getElementById('percent-invalid-span');
            invalid.style.display = 'block';
            return;
        }

        var equally_btn = document.getElementById("a-split");
        equally_btn.innerText = 'by percentage';
        var closeModalBtn = document.getElementsByClassName('close-split-modal').item(0);
        closeModalBtn.click();
    }
}
save_percents();


