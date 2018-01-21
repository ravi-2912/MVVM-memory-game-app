
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
        this.matchCount = this.dataArray/2;
        for(let i = 0 ; i < this.dataArray.length; i++) {
            this.model.push({
                icon: 'fa-' + this.dataArray[i],
                id: i,
                clicked: false,
                matchId: 0
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
        this.cardCliced = undefined;
        this.totalClicks = 0;
        this.stars = 3;
        this.clickDisable = true;
        this.openCardEl = this.openCardElBack = this. openCardElFront = undefined;

        this.deck = document.querySelector('.deck');
        this.movesSpan = document.querySelector('.moves');
        this.restartBtn = document.querySelector('.restart');
        this.timeText = document.querySelector('.time');
        this.status = document.querySelector('.status');
        this.subStatus = document.querySelector('.sub-status');
        this.statusIco = document.querySelector('.status-icon');
        this.result = document.querySelector('.result');

        this.result.classList.add('hidden');
        this.result.querySelector('button').classList.add('hidden');

        this.renderInit();
        this.cards = Array.prototype.slice.call(document.querySelectorAll('.card'));

        this.deck.addEventListener('click', function(event) {
            event.preventDefault();
            if(target.nodeName === 'DIV' && target.classList.contains('front')) {
                let card = ViewModel.getCard(target.parentElement.getAttribute('id'));
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
            let liTemplate =   `<div class="card" id="${modelItem.id}">
                                    <div class="front"></div>
                                    <div class="fa ${modelItem.icon} back"></div>
                                </div>`;
            this.deck.innerHTML += liTemplate;
        }
    },
    renderCardUpdate: function(card) {
        let cardEl = this.cards.find(function(el){
            return el.getAttribute('id') == card.id;
        });

        if(!card.clicked) {
            cardEl.classList.add('flipped');
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

ViewModel = {
    init: function() {
        this.openCards = [];
        Model.init();
        View.init();
    },
    getModel: function() {
        return Model.model;
    },
    getCard: function(id) {
        var md = Model.model;
        return md.find(function(el) {
            return el.id == id;
        });
    },
    getCardIcon: function(card) {
        return card.icon;
    },
    getCardID: function(card) {
        return card.id;
    },
    getCardClicked: function(card) {
        return card.clicked;
    },
    cardClicked: function(card) {
        if(!card.clicked){
            card.clicked = true;
        }
    },
    checkCardMatch: function(card) {
        return this.openCards.find(function(el){
            return el.icon === card.icon;
        });
    }

};


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
    ViewModel.init();
});        return (this.openCard.icon === card.icon) && (this.openCard.id != card.id);
    },
    restart: function() {
        this.openCards = undefined;
        this.matchedCards = 0;
        Model.init();
        View.renderInit();
    },
    
};