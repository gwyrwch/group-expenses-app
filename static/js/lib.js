export function add_modal(modal, open_btn, close_btn) {
    open_btn.onclick = function() {
        modal.style.display = "block";
    };

    close_btn.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}
