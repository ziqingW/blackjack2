$(document).ready(function(){
    var bankroll, dealer, player;
    var decks = [];
    $("#replay_yes").click(function(){
        $('.replay-back').css("display", "none");
        replay();
    });
    $("#replay_no").click(function(){
        $(".replay-form").html("<h6>Thank you for playing!</h6><p>Find more games at <span><a href='http://tornado.bukarle.com'>tornado.bukarle.com</a></span></p>");
    });
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
        this.facedown = false;
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
    function Player(name, bank) {
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
            this.hands.push(draw(decks));
        };
        this.showCard = function(){
            var newCard = this.hands[this.hands.length-1];
            var cardImagesSrc = `images/${newCard.name}_of_${newCard.suit}.png`;
            var cardImagePanel = `#${this.name}-card-panel`;
            console.log("show a card");
            $(cardImagePanel).append(`<img src=${cardImagesSrc}>`);
            
            console.log($(".card-panel img").css("visibility"));
        };    
        this.hideCard = function() {
            var newCard = this.hands[this.hands.length-1];
            var cardImagesSrc = `images/card_back.png`;
            var cardImagePanel = `#${this.name}-card-panel`;
            $(cardImagePanel).append(`<img src=${cardImagesSrc}>`);
            newCard.facedown = true;
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
        this.startbet = function(amount) {
            this.bet = amount;
        };
        this.double = function() {
            this.bet *= 2;
        };
        this.reSet = function() {
            this.hands = [];
            this.bet = 0;
            this.win = false;
            this.bust = false;
            this.bj = false;
        };
        }
//bet button
    function betButton() {
        $('.bet-panel').html('<input type="number" id="bet-input" placeholder="Your bet" required><button id="bet-button">OK</button>');
        $('#bet-button').click(function(){
            if (parseInt($('#bet-input').val()) > 0 && parseInt($('#bet-input').val()) <= player.bank) {
                $('#message').text('Game starts!');
                player.startbet(parseInt($('#bet-input').val()));
                $('.bet-panel').empty();
                $('#warning').empty();
                console.log("betted");
                console.log(player.bet);
                playerTurn();
            } else {
                $('#warning').html('<h5 style="color: red;">Please bet a correct number!</h5>');
        }
    });
    }    
// showpoints
    function showPoints(p) {
        var currentPoints = p.handPoints();
        var pointsRef = "#" + p.name + "P";
        if (currentPoints[0] == currentPoints [1]) {
            $(pointsRef).html(`<p>Points: ${currentPoints[0]}</p>`);
        } else {
            $(pointsRef).html(`<p>Points: ${currentPoints[0]} or ${currentPoints[1]}</p>`);
        }
    }
// info panel update
    function infoPanel() {
        $('#account').text(player.bank);
        $('#bet').text(player.bet);
        $('#win').text(player.wins);
        $('#lose').text(player.loses);
        $('#bj').text(player.bjs);
    }
//hit a card
    function hit(p) {
        p.drawCard();
        p.showCard();
        showPoints(p);
        if (p.handPoints()[0] > 21) {
            p.bust = true;
            
        } else if (p.handPoints()[0] == 21 || p.handPoints()[1] == 21) {
            p.win = true;
        }
        console.log("hit once");
    }
// hit button
    function hitButton() {
        $('#button_hit').click(function() {
            hit(player);
            if (player.bust) {
                conclusion(player, dealer);
            } 
        });
    }
//double button
    function doubleButton () {
        $('#button_double').click(function() {
            player.double();
            hit(player);
            console.log("doubled");
            if (!player.bust) {
            dealerTurn();
            } else {
                conclusion(player, dealer);
            }
        });
        
    }
// stand button
    function standButton () {
        $('#button_stand').click(function() {
            console.log("stand");
            dealerTurn();
        });
        
    }
// surrender button
    function surrenderButton () {
        $('#button_surrender').click(function() {
            player.bet /= 2;
            dealer.win = true;
            dealer.bet /= 2;
            console.log("surrended");
            conclusion(player, dealer);
        });
        
    }
// results conclusion
    function conclusion(p, d) {
        console.log("concluded");
        if (p.bj && d.bj) {
                $('#message').text("It's a draw! Take your bet back.");
                console.log("1");
                p.bjs ++;
            } else if (p.bj && !d.bj) {
                $('#message').text("You got the Blackjack!");
                console.log("2");
                p.bjs ++;
                p.wins ++;
                p.bank += p.bet * 1.5;
                
            } else if (d.bj && !p.bj) {
                $('#message').text("You got Blackjacked!");
                console.log("3");
                p.bank -= p.bet * 1.5;
                p.loses ++;
        } else {
            if (p.win && d.win) {
                $('#message').text("It's a draw! Take your bet back.");
                console.log("4");
            } else if (p.win && !d.win) {
                $('#message').text("Congratulations, you win!");
                console.log("5");
                p.bank += p.bet;
                d.bank -= d.bet;
                p.wins ++;
            } else if (d.win && !p.win) {
                $('#message').text("Sorry, you lose.");
                console.log("6");
                p.bank -= p.bet;
                p.loses ++;
            }  else {
                if (p.bust) {
                    $('#message').text("Sorry, you lose.");
                    console.log("7");
                    p.bank -= p.bet;
                    p.loses ++;
                } else if (d.bust && !p.bust) {
                    $('#message').text("Congratulations, you win!");
                    console.log("8");
                    p.bank += p.bet;
                    d.bank -= d.bet;
                    p.wins ++;
                } else {
                $('#message').text("It's a draw! Take your bet back.");
                console.log("draw-01");
            }
            }
        }
        infoPanel();
        $("#bet-button").off("click");
        $('#button_hit').off("click");
        $('#button_double').off("click");
        $('#button_stand').off("click");
        $('#button_surrender').off("click");
        setTimeout(function(){
            $('.replay-back').css("display", "flex");    
        }, 1000);
        
        // replay(); 
    }
// replay
    function replay() {
        decks = makeDeck();
        dealer.reSet();
        player.reSet();
        $("#bet-input").val("");
        $(".points").empty();
        $('#message').text("How much do you want to bet?");
        $(".card-panel").empty();
        betButton();
        infoPanel();
        console.log("replay begins!");
    }
// dealer's turn
    function dealerTurn() {
        console.log("dealer's turn");
        $('#button_hit').off("click");
        $('#button_double').off("click");
        $('#button_stand').off("click");
        $('#button_surrender').off("click");
        dealer.hands.forEach(function(card) {
            if (card.facedown) {
                card.facedown = false;
                var cardImagesSrc = `images/${card.name}_of_${card.suit}.png`;
                $('img[src="images/card_back.png"]').attr('src', cardImagesSrc);
            }
        });
        showPoints(dealer);
        if (!player.bj){
            if (dealer.handPoints()[1] == 21) {
                dealer.bj = true;
                console.log("d-1")
            } else if (dealer.handPoints()[1] >= 17) {
                console.log("d-2")
            } else {
                while(dealer.handPoints()[1] < 17) {
                    console.log("d-3")
                    hit(dealer);
                }
            }
            if (!dealer.bust && !player.bust) {
                if (dealer.handPoints()[1] < 21) {
                    if (player.handPoints()[1] < 21) {
                        if (player.handPoints()[1] < dealer.handPoints()[1]) {
                            console.log("d-4")
                            dealer.win = true;
                        } else if (dealer.handPoints()[1] < player.handPoints()[1]) {
                            player.win = true;
                            console.log("d-5")
                        } 
                    } else {
                        if (player.handPoints()[0] < dealer.handPoints()[1]) {
                            dealer.win = true;
                            console.log("d-6")
                        } else if (dealer.handPoints()[1] < player.handPoints()[0]) {
                            player.win = true;
                            console.log("d-7")
                        }
                    }
                } else {
                    if (player.handPoints()[1] < 21) {
                        if (player.handPoints()[1] < dealer.handPoints()[0]) {
                            dealer.win = true;
                            console.log("d-8")
                        } else if (dealer.handPoints()[0] < player.handPoints()[1]) {
                            player.win = true;
                            console.log("d-9")
                        }
                    } else {
                        if (player.handPoints()[0] < dealer.handPoints()[0]) {
                            dealer.win = true;
                            console.log("d-10")
                        } else if (dealer.handPoints()[0] < player.handPoints()[0]) {
                            player.win = true;
                            console.log("d-11")
                        }
                    }
                }
            }
        }
    conclusion(player, dealer);
    }
// game process
    function playerTurn() {
        dealer.drawCard();
        dealer.showCard();
        player.drawCard();
        player.showCard();
        dealer.drawCard();
        dealer.hideCard();
        player.drawCard();
        player.showCard();
        showPoints(player);
        hitButton();
        doubleButton();
        standButton();
        surrenderButton();

        if (player.hands.length == 2 && player.handPoints()[1] == 21) {
            player.bj = true;
            player.win = true;
            dealerTurn();
        }
        console.log("playerturn");
        
    }

// game start    
    $("#modal-button").click(function(){
        if (parseInt($('#bank').val()) > 0 && parseInt($('#bank').val()) <= 1000000) {
        $(".modal-back").css("display","none");
        bankroll = parseInt($('#bank').val());
        decks = makeDeck();
        dealer = new Player('dealer', Number.MAX_SAFE_INTEGER);
        player = new Player('player', bankroll);
        betButton();
        infoPanel();    
        }
        });  
}); 