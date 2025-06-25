// CLASES ---------------------------------------------------------------------------------------------------
class card {
    constructor(id, color, type, value) {
        this.id = id;
        this.color = color;
        this.type = type;
        this.value = value;
    }
}

class player {
    constructor(id, name, cards = [], points, saidUNO, isHuman) {
        this.id = id;
        this.name = name;
        this.cards = cards;
        this.points = points;
        this.saidUNO = saidUNO; 
        this.isHuman = isHuman; 
    }
}

class game {
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

let buttonTest = document.getElementById("buttonTest");

buttonTest.addEventListener("click", () => {
    console.log("Button clicked!");
    initializeDeck();
    console.log(deck);
});

function initializeDeck() {
    deck = [];
    for (let color of colors) {
        for (let i = 0; i <= 9; i++) {
            deck.push(new card(color.charAt(0).toUpperCase() + "-" + i, color, "number", i));
        }
        for (let type of specialCards) {
            deck.push(new card(color.charAt(0).toUpperCase() + "-" + type, color, type, 20));
        }
    }
}