function setOnClickOnCards() {
    const cards = document.getElementsByClassName('friend-group-cards');

    for (let i = 0; i < cards.length; i++) {
        cards.item(i).onclick = function () {
            const tokens = this.id.split('-');
            let type = this.dataset.type.toLowerCase();

            type = type.substring(0, type.length - 1);
            location.replace(`/index_mobile?${type}=${this.dataset.card}`);
        }
    }
}

setOnClickOnCards();