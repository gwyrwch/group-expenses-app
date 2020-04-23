if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    window.location.replace("index_mobile");
}

import { add_modal } from './lib.js';

function hover_image(id) {
    return function () {
        var sidebar_el = document.getElementById(id);
        var a_el = sidebar_el.firstElementChild;
        var img_el = a_el.firstElementChild;
        if (id.includes("gr"))
            img_el.src = "static/img/group_hover.png";
        else if (id.includes("fr")) {
            img_el.src = "static/img/friend_hover.png";
        }
    }
}

function unhover_image(id) {
    return function () {
        var sidebar_el = document.getElementById(id);
        var a_el = sidebar_el.firstElementChild;
        var img_el = a_el.firstElementChild;
        if (id.includes("gr"))
            img_el.src = "static/img/group2.png";
        else if (id.includes("fr"))
            img_el.src = "static/img/friend.png";
    }
}

var  all_sidebar_elements = document.getElementsByClassName("li-sidebar-hover");
var  save_sidebar_elements = document.getElementsByClassName("li-sidebar-hover");
for (var i = 0; i < all_sidebar_elements.length; i++) {
    all_sidebar_elements[i].onmouseover = hover_image(all_sidebar_elements[i].id);
    all_sidebar_elements[i].onmouseout = unhover_image(all_sidebar_elements[i].id);
}


// modal

var modal = document.getElementById("addModal");
var btn = document.getElementById("btnAdd");
var close = document.getElementsByClassName("close")[3];
add_modal(modal, btn, close, true);

var modal_settle = document.getElementById("settleModal");
var btn_settle = document.getElementById("btnSet");
var close_btn = document.getElementsByClassName("close")[0];
add_modal(modal_settle, btn_settle, close_btn, true);


function add_who_settle_modal() {
    var modal = document.getElementById("who_settle");
    var open_btn = document.getElementById("a-who-settle");
    var close_btn = document.getElementsByClassName("close")[1];
    add_modal(modal, open_btn, close_btn);
}

add_who_settle_modal();

function add_who_recipient_modal() {
    var modal = document.getElementById("who_recipient");
    var open_btn = document.getElementById("a-who-recipient");
    var close_btn = document.getElementsByClassName("close")[2];
    add_modal(modal, open_btn, close_btn);
}
add_who_recipient_modal();

function add_who_paid_modal() {
    var modal = document.getElementById("who_paid");
    var open_btn = document.getElementById("a-who-paid");
    var close_btn = document.getElementsByClassName("close")[4];
    add_modal(modal, open_btn, close_btn);
}
add_who_paid_modal();

function add_how_split_modal() {
    var modal = document.getElementById("split");
    var open_btn = document.getElementById("a-split");
    var close_btn = document.getElementsByClassName("close")[5];
    add_modal(modal, open_btn, close_btn);
}
add_how_split_modal();