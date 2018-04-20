$(document).ready(function(){
    var bankroll, dealer, player;
    var decks = [];

// constructor to make cards 
    function Card(suit, value) {
        this.suit = suit;
        this.name = value;
        if (value == 'jack' || value == 'queen' || value == 'king') {
            this.value = 10;
        } else if (value == 'ace') {
            this.value = [1, 11];
        } else {
        this.value = value;
    }
    }
// make a deck of 52 cards    
    function makeDeck() {
        var deck = [];
        const suits = ['spades', 'hearts', 'clubs', 'diamonds'];
        const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king', 'ace'];
        for (let i = 0; i < 4; i ++) {
            for (let j = 0; j < 13; j ++) {
                deck.push(new Card(suits[i], values[j]));
            }
        }
        return deck;
    }
// draw random card from deck    
    function draw(deck) {
        var dice = Math.floor(Math.random() * deck.length);
        return deck.splice(dice, 1)[0];
    }
// player constructor
    function Player(name, bank, deck) {
        this.name = name;
        this.bank = bank;
        this.hands = [];
        this.win = false;
        this.wins = 0;
        this.loses = 0;
        this.bjs = 0;
        this.bust = false;
        this.bj = false;
        this.bet = 0;
        this.drawCard = function(){
            this.hands.push(draw(deck));
        };
        this.showCard = function(){
            var newCard = this.hands[this.hands.length-1];
            var cardImagesSrc = `images/${newCard.name}_of_${newCard.suit}.png`;
            var cardImagePanel = `#${this.name}-card-panel`;
            $(cardImagePanel).append(`<img src=${cardImagesSrc}>`);
        };
        this.hideCard = function() {
            var cardImagesSrc = `images/card_back.png`;
            var cardImagePanel = `#${this.name}-card-panel`;
            $(cardImagePanel).append(`<img src=${cardImagesSrc}>`);
        };
        this.handPoints = function(){
            var points1 = 0;
            var points2 = 0;
            for (let i = 0; i < this.hands.length; i ++) {
                if (this.hands[i].name == 'ace') {
                    points1 += 1;
                    points2 += 11;
                } else {
                    points1 += this.hands[i].value;
                    points2 += this.hands[i].value;
                }
            }
            return [points1, points2];
            };
        this.results = function(){
            if (this.hands.length ==2 && (this.handPoints[0] == 21 || this.handPoints[1] == 21)) {
                this.bj = true;
            } else if (this.handPoints[0] > 21) {
                this.bust = true;
         }   // } else if (this.handPoints)
        };
        this.startbet = function(amount) {
            this.bet = amount;
        };
        this.double = function() {
            this.bet *= 2;
        };
        this.reset = function() {
            this.hands = [];
            this.bet = 0;
            this.win = false;
            this.bust = false;
            this.bj = false;
        };
        }
//bet button
    function betButton() {
        $('#bet-button').click(function(){
            if (parseInt($('#bet-input').val()) > 0 && parseInt($('#bet-input').val()) <= player.bank) {
                $('.bet-panel').css('visibility', 'hidden');
                $('#message').text('Game starts!');
                player.startbet($('#bet-input').val());
                $('#bet').text(player.bet);
                $('#warning').empty();
                gameBegin();
            } else {
                $('#warning').html('<h5 style="color: red;">Please bet a correct number!</h5>');
        }
    });
    }    
// showpoints
    function showPoints(p) {
        var currentPoints = p.handPoints();
        var pointsRef = "#" + p.name + "P";
        console.log(pointsRef);
        console.log(p.hands);
        console.log(currentPoints);
        if (currentPoints[0] == currentPoints [1]) {
            $(pointsRef).html(`<p>Points: ${currentPoints[0]}</p>`);
        } else {
            $(pointsRef).html(`<p>Points: ${currentPoints[0]} or ${currentPoints[1]}</p>`);
        }
    }
// results conclusion
    function conclusion(p,d) {
        if (p.bj) {
            if (!d.bj) {
            p.win = true;
            p.wins ++;
            $('#message').text("It's a Blackjack!");
            p.bank  += p.bet;
        } else {$('#message').text("It's a draw!");}
    } else if ()
    }
// info panel update
    function infoPanel() {
        $('#account').text(player.bank);
        $('#bet').text(player.bet);
        $('#win').text(player.wins);
        $('#lose').text(player.loses);
        $('#bj').text(player.bjs);
    }

// game process
    function gameBegin() {
        dealer.drawCard();
        dealer.showCard();
        player.drawCard();
        player.showCard();
        dealer.drawCard();
        dealer.hideCard();
        player.drawCard();
        player.showCard();
        showPoints(player);
        player.results();
    }

// game start    
    $("#modal-button").click(function(){
        if (parseInt($('#bank').val()) > 0 && parseInt($('#bank').val()) <= 1000000) {
        $(".modal-back").css("display","none");
        bankroll = parseInt($('#bank').val());
        decks = makeDeck();
        dealer = new Player('dealer', Number.MAX_SAFE_INTEGER, decks);
        player = new Player('player', bankroll, decks);
        betButton();
        infoPanel();    
        }
        });  
    
}); 