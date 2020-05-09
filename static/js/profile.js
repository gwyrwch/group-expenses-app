import { addModal } from './lib.js';



var modal = document.getElementById("confirmModal");
var btn = document.getElementById("saveChanges");
var close = document.getElementsByClassName("close")[0];

console.log(modal, btn, close);

addModal(modal, btn, close, true);