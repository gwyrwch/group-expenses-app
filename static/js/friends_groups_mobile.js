function setOnClickOnCards() {
    let cards = document.getElementsByClassName('friend-group-cards');
    console.log(cards);

    for (let i = 0; i < cards.length; i++) {
        cards.item(i).onclick = function () {
            let tokens = this.id.split('-');
            console.log(tokens);
            let type = tokens[0].toLowerCase();
            type = type.substring(0, type.length - 1);
            console.log(tokens, type);
            console.log('tokens');
            location.replace(`/index_mobile?${type}=${tokens[1]}`);
        }
    }
}

setOnClickOnCards();