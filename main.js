$(document).ready(function() {
  var bankroll, dealer, player;
  var currentDeck = [];
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
    let deck = [];
    const suits = ['spades', 'hearts', 'clubs', 'diamonds'];
    const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king', 'ace'];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 13; j++) {
        deck.push(new Card(suits[i], values[j]));
      }
    }
    return deck;
  }
  // draw random card from deck
  function draw(deck) {
    let dice = Math.floor(Math.random() * deck.length);
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
    // player draw a card
    this.drawCard = function() {
      this.hands.push(draw(currentDeck));
    };
    // player faceup the card
    this.showCard = function() {
      let newCard = this.hands[this.hands.length - 1];
      let cardImagesSrc = `images/${newCard.name}_of_${newCard.suit}.png`;
      let cardImagePanel = `#${this.name}-card-panel`;
      $(cardImagePanel).append(`<img src=${cardImagesSrc}>`);
    };
    // player facedown the card
    this.hideCard = function() {
      let newCard = this.hands[this.hands.length - 1];
      let cardImagesSrc = `images/card_back.png`;
      let cardImagePanel = `#${this.name}-card-panel`;
      $(cardImagePanel).append(`<img src=${cardImagesSrc}>`);
      newCard.facedown = true;
    };
    // calculate the player's handpoints
    this.handPoints = function() {
      let points1 = 0;
      let points2 = 0;
      for (let i = 0; i < this.hands.length; i++) {
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
    // player's bet action
    this.startbet = function(amount) {
      this.bet = amount;
    };
    // player's double action
    this.double = function() {
      this.bet *= 2;
    };
    // reset player's status
    this.reSet = function() {
      this.hands = [];
      this.bet = 0;
      this.win = false;
      this.bust = false;
      this.bj = false;
    };
  }
  //bet button
  // updated
  function betButton() {
// changed here~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    $('.bet-panel').html('<button id="bet-button-1" type="button" class="bet-button btn btn-success">$1</button><button type="button" id="bet-button-5" class="bet-button btn btn-success">$5</button>')
    $('.bet-button').click(function(event) {
          $('#message').text('Game starts!');
          player.startbet(parseInt($(this).text()[1]));
          // console.log(parseInt($(this).text()[1]))
          $('#bet').text(player.bet);
          $('.bet-panel').empty();

          // console.log("betted");
          // console.log(player.bet);
          playerTurn();
        });
      }
  // display points on page
  function showPoints(currentPlayer) {
    let currentPoints = currentPlayer.handPoints();
    let pointsRef = "#" + currentPlayer.name + "P";
    if (currentPoints[0] == currentPoints[1]) {
      $(pointsRef).html(`<p>Points: ${currentPoints[0]}</p>`);
    } else {
      $(pointsRef).html(`<p>Points: ${currentPoints[0]} or ${currentPoints[1]}</p>`);
    }
  }
  // info panel update
  function infoPanel() {
    $('#account').text(player.bank);
    // changed here~~~~~~~~~~~~~~~~~~~~~~~~
    $('#win').text(player.wins);
    $('#lose').text(player.loses);
    $('#bj').text(player.bjs);
  }
  //hit a card
  // updated
  function hit(currentPlayer) {
    currentPlayer.drawCard();
    currentPlayer.showCard();
    showPoints(currentPlayer);
    if (currentPlayer.handPoints()[0] > 21) {
      currentPlayer.bust = true;
    } else if (currentPlayer.handPoints().includes(21)) {
      currentPlayer.win = true;
    }
    // console.log("hit once");
  }
  // hit button action
  function hitButton() {
    $('#button_hit').click(function() {
      hit(player);
      if (player.bust) {
        conclusion(player, dealer);
      }
    });
  }
  //double button action
  function doubleButton() {
    $('#button_double').click(function() {
      player.double();
      hit(player);
      // console.log("doubled");
      if (!player.bust) {
        dealerTurn();
      } else {
        conclusion(player, dealer);
      }
    });
  }
  // stand button action
  function standButton() {
    $('#button_stand').click(function() {
      // console.log("stand");
      dealerTurn();
    });
  }
  // surrender button action
  function surrenderButton() {
    $('#button_surrender').click(function() {
      player.bet /= 2;
      dealer.win = true;
      dealer.bet /= 2;
      // console.log("surrended");
      conclusion(player, dealer);
    });
  }
  // results conclusion
  function conclusion(currentPlayer, currentDealer) {
    // console.log("concluded");
    // Condition 1: someone has BJ
    if (currentPlayer.bj && currentDealer.bj) {
      $('#message').text("It's a draw! Take your bet back.");
      // console.log("1");
      currentPlayer.bjs++;
    } else if (currentPlayer.bj && !currentDealer.bj) {
      $('#message').text("You got the Blackjack!");
      // console.log("2");
      currentPlayer.bjs++;
      currentPlayer.wins++;
      currentPlayer.bank += currentPlayer.bet * 1.5;
    } else if (currentDealer.bj && !currentPlayer.bj) {
      $('#message').text("You got Blackjacked!");
      // console.log("3");
      currentPlayer.bank -= currentPlayer.bet * 1.5;
      currentPlayer.loses++;
    } else {
      // Condition 2: No one has BJ
      if (currentPlayer.win && currentDealer.win) {
        $('#message').text("It's a draw! Take your bet back.");
        // console.log("4");
      } else if (currentPlayer.win && !currentDealer.win) {
        $('#message').text("Congratulations, you win!");
        // console.log("5");
        currentPlayer.bank += currentPlayer.bet;
        currentDealer.bank -= currentDealer.bet;
        currentPlayer.wins++;
      } else if (currentDealer.win && !currentPlayer.win) {
        $('#message').text("Sorry, you lose.");
        // console.log("6");
        currentPlayer.bank -= currentPlayer.bet;
        currentPlayer.loses++;
      } else {
        if (currentPlayer.bust) {
          $('#message').text("Sorry, you are busted.");
          // console.log("7");
          currentPlayer.bank -= currentPlayer.bet;
          currentPlayer.loses++;
        } else if (currentDealer.bust && !currentPlayer.bust) {
          $('#message').text("Congratulations, dealer is busted, you win!");
          // console.log("8");
          currentPlayer.bank += currentPlayer.bet;
          currentDealer.bank -= currentDealer.bet;
          currentPlayer.wins++;
        } else {
          $('#message').text("It's a draw! Take your bet back.");
          // console.log("draw-01");
        }
      }
    }
    // replay option panel showup
    infoPanel();
    $("#bet-button").off("click");
    $('#button_hit').off("click");
    $('#button_double').off("click");
    $('#button_stand').off("click");
    $('#button_surrender').off("click");
    setTimeout(function() {
      $('.replay-back').css("display", "flex");
    }, 1600);
  }
  // replay
  function replay() {
    currentDeck = makeDeck();
    dealer.reSet();
    player.reSet();
    // changed here !!~~~~~~~~~~~~~~~~~
    $('#bet').text("0");
    $(".points").empty();
    $('#message').text("How much do you want to bet?");
    $(".card-panel").empty();
    betButton();
    infoPanel();
    // console.log("replay begins!");
  }
  // dealer's turn
  function dealerTurn() {
    // console.log("dealer's turn");
    $('#button_hit').off("click");
    $('#button_double').off("click");
    $('#button_stand').off("click");
    $('#button_surrender').off("click");
    dealer.hands.forEach(function(card) {
      if (card.facedown) {
        card.facedown = false;
        let cardImagesSrc = `images/${card.name}_of_${card.suit}.png`;
        $('img[src="images/card_back.png"]').attr('src', cardImagesSrc);
      }
    });
    showPoints(dealer);
    // big updated!!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (dealer.handPoints()[1] == 21) {
      dealer.bj = true;
    } else {
      if (!player.bj) {
        playerCurrentPoints = player.handPoints().filter(num => {
          return num < 21
        })
        if (Math.max(...dealer.handPoints()) >= 17) {
          if (Math.max(...playerCurrentPoints) > Math.max(...dealer.handPoints())) {
            player.win = true;
          } else if (Math.max(...playerCurrentPoints) < Math.max(...dealer.handPoints())) {
            dealer.win = true;
          }
        } else {
          while (Math.max(...dealer.handPoints()) < 17) {
            hit(dealer);
          }
          if (!dealer.bust) {
            dealerCurrentPoints = dealer.handPoints().filter(num => {
              return num <= 21
            })
            if (Math.max(...playerCurrentPoints) < Math.max(...dealerCurrentPoints)) {
              dealer.win = true;
            } else if (Math.max(...playerCurrentPoints) > Math.max(...dealerCurrentPoints)) {
              player.win = true;
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
    // console.log("playerturn");
  }

  // game start
  $("#modal-button").click(function() {
    if (parseInt($('#bank').val()) > 0 && parseInt($('#bank').val()) <= 1000000) {
      $(".modal-back").css("display", "none");
      bankroll = parseInt($('#bank').val());
      currentDeck = makeDeck();
      dealer = new Player('dealer', Number.MAX_SAFE_INTEGER);
      player = new Player('player', bankroll);
      betButton();
      infoPanel();
    } else if (parseInt($('#bank').val()) > 1000000) {
      $("#bankroll-warning").text("No need to play so big (amount < 1,000,000)");
      $('#bank').val('');
    } else {
      $("#bankroll-warning").text("Sorry, it has to be real money");
      $('#bank').val('');
    }
  });
  // replay options
  $("#replay_yes").click(function() {
    $('.replay-back').css("display", "none");
    replay();
  });
  $("#replay_no").click(function() {
    $(".replay-form").css("display", "block");
    $(".replay-form").html("<h6 class='text-center'>Thank you for playing my game!</h6>");
  });

  $('.tutorial-title').popover({
    trigger: 'focus'
  })
});
