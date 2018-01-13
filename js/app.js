
var Model, View, ViewModel;

Model = {
    getData: function() {
        // data for font-awesome
        const gameIconList = ['diamond', 'anchor', 'bolt', 'paper-plane-o', 'cube', 'leaf', 'bicycle', 'bomb'];
        return gameIconList;
    },
    init: function() {
        this.data = this.getData();
        this.model = [];
        this.dataArray = this.shuffle([...this.data, ...this.data]);
        for(let i = 0 ; i < this.dataArray.length; i++) {
            this.model.push({
                icon: 'fa-' + this.dataArray[i],
                id: i,
                clicked: false
            });
        }
    },
    // Shuffle function from http://stackoverflow.com/a/2450976
    shuffle: function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
};

View = {
    init: function() {
        this.totalClicks = 0;
        this.deck = document.querySelector('ul.deck');
        this.renderInit();
        this.cards = Array.prototype.slice.call(document.querySelectorAll('li.card'))
        this.restartBtn = document.querySelector('div.restart');

        this.deck.addEventListener('click', function(event) {
            event.preventDefault();
            let target = event.target;
            if(target.nodeName == 'LI') {
                let card = ViewModel.getCard(target.getAttribute('id'));
                View.renderCardUpdate(card);
            }
        });

        this.restartBtn.addEventListener('click', function(event){
            event.preventDefault();
            ViewModel.init();
        });
    },
    renderInit: function() {
        while(this.deck.firstChild){
            this.deck.removeChild(this.deck.firstChild);
        }
        let model = ViewModel.getModel();
        for(let modelItem of model) {
            let liTemplate =   `<li class="card" id="${modelItem.id}">
                                    <i class="fa ${modelItem.icon}"></i>
                                </li>`;
            this.deck.innerHTML += liTemplate;
        }
    },
    renderCardUpdate: function(card) {
        let cardEl = this.cards.find(function(el){
            return el.getAttribute('id') == card.id;
        });

        if(!card.clicked) {
            cardEl.classList.add('open', 'show');
            card.clicked = true;
        }
        let openCard = ViewModel.checkCardMatch(card);
        if(openCard == undefined) {
            ViewModel.openCards.push(card);
        } else {
            let openCardEl = this.cards.find(function(el){
                return el.getAttribute('id') == openCard.id;
            });
            openCardEl.classList.add('match');
            cardEl.classList.add('match');
        }
    },
};

    }
    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
document.addEventListener("DOMContentLoaded", function(){
    init();
});