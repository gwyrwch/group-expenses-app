if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    window.location.replace("index_mobile");
}

import { add_modal } from './lib.js';

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

    today = mm + '.' + dd + '.' + yyyy;

    var date_btn = document.getElementById("btn-date-paid");
    date_btn.innerText = today;

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
        console.log(friendUsername);

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

    // todo: do it after groupPhotoBtn onclick

    // var groupFile = document.getElementById('add_group_photo').files[0];
    document.getElementById('add_group_photo').onchange = function () {
        console.log(groupPhotoBtn);
        groupPhotoBtn.style.color = '#4cd964';
    };



    var createGroupBtn = document.getElementById('create-group');

    createGroupBtn.onclick = async function() {
        var groupName = document.getElementById('create-group-name').value;
        var groupFile = document.getElementById('add_group_photo').files[0];

        // if (groupFile.type.startsWith('image'))

        console.log(groupName, groupFile);

        if (groupName.length > 0) {
            var fd = new FormData();

            fd.append('group_name', groupName);
            fd.append('group_photo', groupFile, groupFile.name);

            let response = await fetch('/create_new_group', {
                method: 'POST',
                body: fd
            });

            let result = await response.json();
            console.log(result);

            location.reload();
        }
    };
}
create_new_group();



function edit_group_modal() {
    var modals = document.getElementsByClassName("groupSettingsModal");
    var open_btns = document.getElementsByClassName("btnEditGroup");
    var close_btns = document.getElementsByClassName("close-edit-group-modal");

    console.log(modals.length,open_btns.length,close_btns.length);

    for (var i = 0; i < modals.length; i++) {
        add_modal(modals.item(i), open_btns.item(i), close_btns.item(i));
    }
}

edit_group_modal();




