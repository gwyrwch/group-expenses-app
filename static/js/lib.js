export function add_modal(modal, open_btn, close_btn, animate_top=false) {
    open_btn.onclick = function() {
        modal.style.display = "block";

        setTimeout(() => {
            var content = modal.firstElementChild;
            content.classList.add("modal-content-activate");
        }, 1);
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
