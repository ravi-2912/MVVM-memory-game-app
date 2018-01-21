
// Variables for MVW for sepration of concerns
var Model, View, ViewModel;

// Model
Model = {
    getData: function() {
        // data for font-awesome
        const gameIconList = ['diamond', 'anchor', 'bolt', 'paper-plane-o', 'cube', 'leaf', 'bicycle', 'bomb'];
        return gameIconList;
    },
    init: function() {
        // initialize the Model properties
        this.data = this.getData();
        this.model = [];
        this.dataArray = this.shuffle([...this.data, ...this.data]);
        this.matchCount = this.dataArray/2;
        // generate the model that will be used in ViewModel
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

// View
View = {
    init: function() {
        // initialize card properties
        this.cardCliced = undefined;
        this.totalClicks = 0;
        this.stars = 3;
        this.clickDisable = true;
        this.openCardEl = this.openCardElBack = this. openCardElFront = undefined;

        // initialize the dom queries
        this.deck = document.querySelector('.deck');
        this.movesSpan = document.querySelector('.moves');
        this.restartBtn = document.querySelector('.restart');
        this.timeText = document.querySelector('.time');
        this.status = document.querySelector('.status');
        this.subStatus = document.querySelector('.sub-status');
        this.statusIco = document.querySelector('.status-icon');
        this.result = document.querySelector('.result');
        this.starsDisplay = document.querySelector('.stars');
        this.starsDisplayItem = Array.prototype.slice.call(this.starsDisplay.getElementsByTagName('li'));

        // hide the result div
        this.result.classList.add('hidden');
        this.result.querySelector('button').classList.add('hidden');

        // render the cards and store in an array
        this.renderInit();
        this.cards = Array.prototype.slice.call(document.querySelectorAll('.card'));

        // event listner for mouse click binded to card's deck
        this.deck.addEventListener('click', function(event) {
            event.preventDefault();
            let target = event.target;
            // check if card is clicked with front class
            if(target.nodeName === 'DIV' && target.classList.contains('front')) {
                View.cardClicked = ViewModel.getCard(target.parentElement.getAttribute('id'));
                View.renderCardUpdate();
            }
        });

        // event listener for restart button
        this.restartBtn.addEventListener('click', function(event){
            event.preventDefault();
            ViewModel.init();
        });
    },
    // initial render function to render all cards
    renderInit: function() {
        // remove cards if present
        while(this.deck.firstChild){
            this.deck.removeChild(this.deck.firstChild);
        }
        // get model and update the inHtml var
        let model = ViewModel.getModel(), inHtml = '';
        for(let modelItem of model) {
            inHtml +=  `<div class="card" id="${modelItem.id}">
                            <div class="front"></div>
                            <div class="fa ${modelItem.icon} back"></div>
                        </div>`;
        }
        // write to decl
        this.deck.innerHTML = inHtml;
        // update the total mouse clicks i.e. 0
        this.movesSpan.textContent = this.totalClicks;
    },
    // render updated status of cards after click event
    renderCardUpdate: function() {
        let ti = performance.now();
        // make sure that a card is cliced first
        if(this.cardClicked) {
            // store card, car element and its front and bac
            let card = this.cardClicked;
            let cardEl = this.cards.find(function(el){
                return el.getAttribute('id') == ViewModel.getCardID(card);
            });
            let cardElFront = cardEl.querySelector('.front'),
                cardElBack = cardEl.querySelector('.back');

            // If not already having an opened card then add an open card and update the qeurries
            if(!ViewModel.openCard) {
                ViewModel.openCard = card;
                cardEl.classList.add('flipped');
                card.clicked = true;
                this.openCardEl = cardEl;
                this.openCardElFront = cardEl.querySelector('.front');
                this.openCardElBack = cardEl.querySelector('.back');
            }

            // if card is clicked then flip and check for match or not match
            if(!card.clicked ) {
                cardEl.classList.add('flipped');
                this.totalClicks++;
                // set card clicked flag to true
                card.clicked = true;
                // check if card matches with the open card and perform some chain animation
                if ( ViewModel.checkCardMatch(card)) {
                    setTimeout(() => {
                        this.openCardEl.classList.add('animated', 'rubberBand');
                        cardEl.classList.add('animated', 'rubberBand');
                        this.openCardElFront.classList.add('front-hidden');
                        cardElFront.classList.add('front-hidden');
                        this.openCardElBack.classList.add('match', 'animated', 'rubberBand');
                        cardElBack.classList.add('match', 'animated', 'rubberBand');
                    }, 700);
                    setTimeout(() => {
                        this.openCardEl.classList.remove('animated', 'rubberBand');
                        cardEl.classList.remove('animated', 'rubberBand');
                        this.openCardElBack.classList.remove('animated', 'rubberBand');
                        cardElBack.classList.remove('animated', 'rubberBand');
                    },1200);
                    // update the matchedCards counter
                    ViewModel.matchedCards++;
                    // reset the open card to undefined so that next time this gets updated on user click
                    ViewModel.openCard = undefined;
                } else { // do chain aimataion if cards are not matched
                    setTimeout(() => {
                        this.openCardEl.classList.add('animated', 'shake');
                        cardEl.classList.add('animated', 'shake');
                        this.openCardElFront.classList.add('front-hidden');
                        cardElFront.classList.add('front-hidden');
                        this.openCardElBack.classList.add('not-match', 'animated', 'shake');
                        cardElBack.classList.add('not-match', 'animated', 'shake');
                    }, 700);
                    setTimeout(() => {
                        this.openCardEl.classList.remove('animated', 'shake');
                        cardEl.classList.remove('animated', 'shake');
                        this.openCardElFront.classList.remove('front-hidden');
                        cardElFront.classList.remove('front-hidden');
                        this.openCardElBack.classList.remove('not-match', 'animated', 'shake');
                        cardElBack.classList.remove('not-match', 'animated', 'shake');
                        // reset the card cliced flag
                        card.clicked = false;
                    },1200);
                    setTimeout(() => {
                        cardEl.classList.remove('flipped');
                    }, 1300);
                }
                // update stars based on total mouse clicks
                switch(this.totalClicks) {
                    case 12:
                    case 20:
                    case 26:
                        this.stars--;
                        let iEl = this.starsDisplayItem[this.stars].firstChild;
                        iEl.classList.remove('fa-star');
                        iEl.classList.add('fa-star-o');
                        break;
                }
                // update the clics move text
                this.movesSpan.textContent = this.totalClicks;
            }
        }
        let to = performance.now();
        //console.log(to-ti);
    },
    // render the results function once game finished
    renderResults: function(won) {
        // remove all cards
        let cards = document.querySelectorAll('.card');
        for(let card of cards) {
            card.classList.add('animated', 'zoomOut');
        }
        setTimeout(() => {
            while(this.deck.firstChild){
                this.deck.removeChild(this.deck.firstChild);
            }
        },500);
        // show the result div
        this.result.classList.remove('hidden');
        // update the text content of the results
        if(won) {
            this.status.textContent = 'Congratulations! You won, yay!!';
            this.subStatus.textContent = `You won in ${this.totalClicks} moves and have won ${this.stars} stars.`;
            this.statusIco.classList.add('fa', 'fa-check-circle', 'fa-4x', 'ico-won');
        } else {
            this.status.textContent = 'Sorry! You lost, try again!!';
            this.subStatus.textContent = `You used all the time, please try again to win.`;
            this.statusIco.classList.add('fa', 'fa-times-circle', 'fa-4x', 'ico-lost');
        }
        this.result.classList.add('animated', 'zoomIn');
        this.result.querySelector('button').classList.remove('hidden');
    },
    // function to show all cards at the start of the game
    renderAllCardsOpen: function(open) {
        let cards = document.querySelectorAll('.card');
        if(open) {
            for(let card of cards) {
                card.classList.add('flipped');
            }
        } else {
            for(let card of cards) {
                card.classList.remove('flipped');
            }
        }
    },
};

// Whatever ViewModel
ViewModel = {
    init: function() {
        // initialize some properties and run Model and View init function
        this.openCard = undefined;
        this.matchedCards = 0;
        Model.init();
        this.totalCards = Model.model.length;
        View.init();
        this.timeNow = Date.now();

        // run code every 500 ms to update the time remaining as well as check
        // when to show results and when to show all cards when game starts
        let interval = setInterval(()=>{
            // total allocated time is 121 seconds
            let dt = 121 - (Date.now() - this.timeNow)/1000;
            let minutes = Math.floor(dt / 60);
            let seconds = Math.floor(dt - minutes * 60);
            seconds = seconds<10 ? '0' + seconds.toString() : seconds;
            minutes = '0' + minutes.toString();
            let displayTime = `${minutes}:${seconds}`;
            // display time in mm:ss format
            View.timeText.textContent = displayTime;

            // when game starts render flip all cards visible
            if(dt.toFixed(1) == 120)
            {
                View.renderAllCardsOpen(true);
            }
            // when 5 seconds elapse render flip all cards hidden
            if(dt.toFixed(1) == 115 )
            {
                View.renderAllCardsOpen(false);
            }
            // if all cards matched then proceed to showing the results
            if(this.matchedCards == this.totalCards/2) {
                clearInterval(interval);
                View.renderResults(true);
            }
            // if time is up proceed to showing results
            if (dt.toFixed(1) == 0.0) {
                clearInterval(interval);
                View.renderResults(false);

            }
        },500);
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
    setCardClicked: function(card) {

    },
    checkCardMatch: function(card) {
        // ensure that open card and the new card opened have same icon but diferent id
        return (this.openCard.icon === card.icon) && (this.openCard.id != card.id);
    },
    restart: function() {
        this.openCards = undefined;
        this.matchedCards = 0;
        Model.init();
        View.renderInit();
    },
};