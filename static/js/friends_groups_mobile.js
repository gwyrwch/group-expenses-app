function setOnClickOnCards() {
    let cards = document.getElementsByClassName('friend-group-cards');
    console.log(cards);

    for (let i = 0; i < cards.length; i++) {
        cards.item(i).onclick = function () {
            let tokens = this.id.split('-');
            let type = tokens[0].toLowerCase();
            location.replace(`/index_mobile?${type}=${tokens[1]}`);
            console.log(this.id.split('-')[1]);
        }
    }
}

setOnClickOnCards();