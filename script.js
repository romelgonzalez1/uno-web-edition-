// CLASES ---------------------------------------------------------------------------------------------------
class Card {
    constructor(id, color, type, value) {
        this.id = id;
        this.color = color;
        this.type = type;
        this.value = value;
    }
}

class Player {
    constructor(id, name, cards = [], points, saidUNO, isHuman) {
        this.id = id;
        this.name = name;
        this.cards = cards;
        this.points = points;
        this.saidUNO = saidUNO; 
        this.isHuman = isHuman; 
    }
}

class Game {
    constructor(players = [], deck = [], discardPile = [], turn, direction, currentColor, waitingForColor, roundWinner){
        this.players = players;
        this.deck = deck;
        this.discardPile = discardPile;
        this.turn = turn;
        this.direction = direction;
        this.currentColor = currentColor;
        this.waitingForColor = waitingForColor;
        this.roundWinner = roundWinner;
    }
}

// VARIABLES ------------------------------------------------------------------------------------------------

let deck = [];
let discardPile = [];
const colors = ["red", "green", "blue", "yellow"];
const specialCards = ["jump", "reverse", "drawTwo"];

let players = [];
let currentPlayerIndex = 0;
let direction = 1; 

let gameState = new Game(players, deck, discardPile, currentPlayerIndex, direction, null, false, null);

let buttonTest = document.getElementById("buttonTest");
let container = document.getElementById("container");

buttonTest.addEventListener("click", () => {
    console.log("Button clicked!");
    initializeDeck();
    console.log(deck);
    startGame(2); // Start game with 2 players for testing
});

function initializeDeck() {
    deck = [];
    for (let color of colors) {
        for (let i = 0; i <= 9; i++) {
            deck.push(new Card(color.charAt(0).toUpperCase() + "-" + i, color, "number", i));
        }
        for (let type of specialCards) {
            deck.push(new Card(color.charAt(0).toUpperCase() + "-" + type, color, type, 20));
        }
    }
    shuffle();
}

function shuffle() {
    for (let cartaActual = deck.length - 1; cartaActual > 0; cartaActual--) {
        const indiceRandom = Math.floor(Math.random() * (cartaActual + 1));
        [deck[cartaActual], deck[indiceRandom]] = [deck[indiceRandom], deck[cartaActual]];
    }
}

function startGame(numPlayers) {
    for(let p = 0; p < numPlayers; p++) {
        let playerName = prompt(`Enter name for Player ${p + 1}:`);
        let isHuman = confirm(`Is Player ${p + 1} a human?`);
        let player = new Player(p, playerName, [], 0, false, isHuman);
        players.push(player);
    }

    gameState.players = players;
    gameState.turn = 0;
    gameState.direction = 1;
    dealCards();
}

function dealCards() {
    for (let player of players) {
        for (let i = 0; i < 7; i++) {
            let card = deck.pop();
            player.cards.push(card);
        }
    }
    discardPile.push(deck.pop());
    gameState.discardPile = discardPile;
    gameState.currentColor = discardPile[discardPile.length - 1].color;

    console.log("Cards dealt to players:", players);
    console.log("Top card on discard pile:", discardPile[discardPile.length - 1]);
    console.log("Current color:", gameState.currentColor);
    console.log("Game state after dealing cards:", gameState);
}

function isValidPlay(card) {
    let currentCard = discardPile[discardPile.length - 1];
    if (card.color === gameState.currentColor || (card.type === currentCard.type && card.value === currentCard.value)) {
        return true;
    }
}

function playCard(playerIndex, cardIndex) {
    let player = players[playerIndex];
    let card = player.cards[cardIndex];

    if (isValidPlay(card)) {
        player.cards.splice(cardIndex, 1);
        discardPile.push(card);        
        gameState.currentColor = card.color;
        console.log(`${player.name} jugó ${card.id}`);
        
        

        nextTurn();
    } else {
        console.log("Invalid play.");
    }
}

function checkUNO(playerIndex) {
    let player = players[playerIndex];
    if (player.cards.length === 1 && !player.saidUNO) {
        player.saidUNO = true;  
        console.log(`${player.name} said UNO!`);
    } else if (player.cards.length === 0) {
        console.log(`${player.name} has no cards left!`);
        endGame(player);
    }
}