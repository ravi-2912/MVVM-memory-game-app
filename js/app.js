
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
            let target = event.target;
            if(target.nodeName === 'DIV' && target.classList.contains('front')) {
                View.cardClicked = ViewModel.getCard(target.parentElement.getAttribute('id'));
                View.renderCardUpdate();
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
        let model = ViewModel.getModel(), inHtml = '';
        for(let modelItem of model) {
            inHtml +=  `<div class="card" id="${modelItem.id}">
                            <div class="front"></div>
                            <div class="fa ${modelItem.icon} back"></div>
                        </div>`;
        }
        this.deck.innerHTML = inHtml;
        this.movesSpan.textContent = this.totalClicks;
    },
    renderCardUpdate: function() {
        let ti = performance.now();
        if(this.cardClicked) {
            let card = this.cardClicked;
            let cardEl = this.cards.find(function(el){
                return el.getAttribute('id') == ViewModel.getCardID(card);
            });
            let cardElFront = cardEl.querySelector('.front'),
                cardElBack = cardEl.querySelector('.back');

            if(!ViewModel.openCard) {
                ViewModel.openCard = card;
                cardEl.classList.add('flipped');
                card.clicked = true;
                this.openCardEl = cardEl;
                this.openCardElFront = cardEl.querySelector('.front');
                this.openCardElBack = cardEl.querySelector('.back');
            }

            if(!card.clicked ) {
                cardEl.classList.add('flipped');
                this.totalClicks++;
                card.clicked = true;
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
                    ViewModel.matchedCards++;
                    ViewModel.openCard = undefined;
                } else {
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
                        card.clicked = false;
                    },1200);
                    setTimeout(() => {
                        cardEl.classList.remove('flipped');
                    }, 1300);
                }
                switch(this.totalClicks) {
                    case 12:
                    case 20:
                    case 26:
                        this.stars--;
                        break;
                }
                this.movesSpan.textContent = this.totalClicks;
            }
        }
        let to = performance.now();
        //console.log(to-ti);
    },
    renderResults: function(won) {
        let cards = document.querySelectorAll('.card');
        for(let card of cards) {
            card.classList.add('animated', 'zoomOut');
        }
        setTimeout(() => {
            while(this.deck.firstChild){
                this.deck.removeChild(this.deck.firstChild);
            }
        },500);
        this.result.classList.remove('hidden');
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
    renderAllCardsOpen: function(open) {
        let cards = document.querySelectorAll('.card');
        console.log(cards);
        if(open) {
            for(let card of cards) {
                card.classList.add('flipped');
                console.log();
            }
        } else {
            for(let card of cards) {
                card.classList.remove('flipped');
            }
        }
    },
};

ViewModel = {
    init: function() {
        this.openCard = undefined;
        this.matchedCards = 0;
        Model.init();
        this.totalCards = Model.model.length;
        View.init();
        this.timeNow = Date.now();

        let interval = setInterval(()=>{
            let dt = 121 - (Date.now() - this.timeNow)/1000;
            let minutes = Math.floor(dt / 60);
            let seconds = Math.floor(dt - minutes * 60);
            seconds = seconds<10 ? '0' + seconds.toString() : seconds;
            minutes = '0' + minutes.toString();
            let displayTime = `${minutes}:${seconds}`;
            View.timeText.textContent = displayTime;
            
            if(dt.toFixed(1) == 120)
            {
                View.renderAllCardsOpen(true);
            }
            if(dt.toFixed(1) == 116 )
            {
                View.renderAllCardsOpen(false);
            }
            if(this.matchedCards == this.totalCards/2) {
                clearInterval(interval);
                View.renderResults(true);
            }
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
        return (this.openCard.icon === card.icon) && (this.openCard.id != card.id);
    },
    restart: function() {
        this.openCards = undefined;
        this.matchedCards = 0;
        Model.init();
        View.renderInit();
    },
    
};