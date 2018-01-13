// data for font-awesome
const gameIconList = ['diamond', 'anchor', 'bolt', 'paper-plane-o', 'cube', 'leaf', 'bicycle', 'bomb'];

var clicks = 0;

// initialize function to do prep wors
function init() {
    // shuffle the icons array, note array has 8 unique icons and each is repeated
    let icons = shuffle([...gameIconList,...gameIconList]);
    const ulElem = document.querySelector('ul.deck');
    // TODO: clear the deck in the html
    while (ulElem.firstChild) {
        ulElem.removeChild(ulElem.firstChild);
    }

    // loop through all icons and add them to the deck
    for(let icon of icons) {
        let liTemplate =    `<li class="card">
                                <i class="fa fa-${icon}"></i>
                            </li>`;
        ulElem.innerHTML += liTemplate;
    }

    // add an event listener for the deck
    ulElem.addEventListener('click', function(evt){
        evt.preventDefault();
        const target =  evt.target;
        if(target.nodeName == 'LI') {
            target.classList.add('open', 'show');
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

}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
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