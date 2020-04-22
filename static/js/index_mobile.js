if(! /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    window.location.replace("/");
}

import { add_modal } from './lib.js';

var modal_settle = document.getElementById("settleModal");
var btn_settle = document.getElementById("btn-settle-up");
var close_btn = document.getElementsByClassName("close")[0];
add_modal(modal_settle, btn_settle, close_btn);

var modal = document.getElementById("addModal");
var btn = document.getElementById("btn-add-new");
var close = document.getElementsByClassName("close")[1];
add_modal(modal, btn, close);