export function addModal(modal, openBtn, closeBtn) {
    if (openBtn) {
        openBtn.onclick = function () {
            modal.style.display = "block";

            setTimeout(() => {
                const content = modal.firstElementChild;
                content.classList.add("modal-content-activate");
            }, 1);
        };
    }

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

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


export function setLogo(idLogo) {
    const logoSrc = localStorage.getItem("logoSrc");
    if (logoSrc) {
        document.getElementById(idLogo).src = logoSrc;
    } else {
        localStorage.setItem("logoSrc", document.getElementById(idLogo).src);
    }
}
