import {add_modal} from "./lib.js";

if(! /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    window.location.replace("/");
}

var modal = document.getElementById("addModal");
var btn = document.getElementById("btnAdd");
var close = document.getElementsByClassName("close-add-expense-modal")[0];
add_modal(modal, btn, close, true);



function add_who_did_action_to_modal_button(liBtnsClass, modalBtnId, closeBtnClass) {
    var whoBtns = document.getElementsByClassName(liBtnsClass);

    for (var i = 0; i < whoBtns.length; i++) {
        whoBtns[i].onclick = function () {
            var open_btn = document.getElementById(modalBtnId);
            open_btn.innerText = this.id.split('-')[1];
            var closeModalBtn = document.getElementsByClassName(closeBtnClass).item(0);
            closeModalBtn.click();
        };
    }
}

add_who_did_action_to_modal_button(
    'who-paid-li',
    'a-who-settle',
    'close-who-settle-modal');

add_who_did_action_to_modal_button(
    'who-recipient-li',
    'a-who-recipient',
    'close-who-recipient-modal');


var expenseId = null;
function set_onclick_to_expenses_cards() {
    var cards = document.getElementsByClassName('expenses-card');

    for (var i = 0; i < cards.length; i++) {
        cards[i].onclick = function () {
            var selected = this.style.boxShadow === 'rgb(0, 126, 255) 0px 0px 3px';

            for (var j = 0; j < cards.length; j++) {
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
set_onclick_to_expenses_cards();



function add_settle_up(modal, open_btn, close_btn) {
    var modal_no_exp  = document.getElementById('noExpenseChooseModal');

    add_modal(
        modal_no_exp,
        null,
        document.getElementsByClassName('close-no-expense-modal').item(0)
    );

    open_btn.onclick = async function () {
        if (expenseId == null) {
            modal_no_exp.style.display = "block";
            setTimeout(() => {
                var content = modal_no_exp.firstElementChild;
                content.classList.add("modal-content-activate");
            }, 1);
            return;
        }

        modal.style.display = "block";

        setTimeout(() => {
            var content = modal.firstElementChild;
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
        var pay = result['username_pay'];
        var get = result['username_get'];
        var amount = result['amount'];

        document.getElementById('a-who-settle').innerText = pay;
        document.getElementById('a-who-recipient').innerHTML = get;
        document.getElementById('settle-expense-amount').value = amount;

        console.log(result);


    };

    close_btn.onclick = function() {
        var content = modal.firstElementChild;
        content.classList.remove("modal-content-activate");

        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
            var content = modal.firstElementChild;
            content.classList.remove("modal-content-activate");
        }
    };
}
var modal_settle = document.getElementById("settleModal");
var btn_settle = document.getElementById("btnSet");
var close_btn = document.getElementsByClassName("close-settle-modal")[0];
add_settle_up(modal_settle, btn_settle, close_btn);


function settle_up() {
    var btnSettleUp = document.getElementById('btn-settle-up-confirm');
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

settle_up();