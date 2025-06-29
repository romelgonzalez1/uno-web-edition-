// CLASES ---------------------------------------------------------------------------------------------------
class Card {
    constructor(id, color, type, value) {
        this.id = id;
        this.color = color;
        this.type = type;
        this.value = value;
    }

    getDisplayText() {
        if (this.type === "drawTwo") {
            return "+2";
        }
        if (this.type === "reverse") {
            return `
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none" style="vertical-align:middle;" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" fill="white" fill-opacity="0.01"/>
                <path d="M34 6.67564C39.978 10.1337 44 16.5972 44 24M34 6.67564V14M34 6.67564H41.3244M41.3244 34C37.8663 39.978 31.4028 44 24 44M41.3244 34H34M41.3244 34V41.3244M14 41.3244C8.02199 37.8663 4 31.4028 4 24M14 41.3244V34M14 41.3244H6.67564M6.67564 14C10.1337 8.02199 16.5972 4 24 4M6.67564 14H14M6.67564 14V6.67564" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M41.3244 34C37.8663 39.978 31.4028 44 24 44M41.3244 34H34M41.3244 34V41.3244" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 41.3244C8.02199 37.8663 4 31.4028 4 24M14 41.3244V34M14 41.3244H6.67564" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.67566 14C10.1338 8.02199 16.5972 4 24 4M6.67566 14H14M6.67566 14V6.67564" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M34 6.67578C39.978 10.1339 44 16.5973 44 24.0001M34 6.67578V14.0001M34 6.67578H41.3244" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        }
        if (this.type === "jump" || this.type === "skip") {
            return `
                <svg width="32" height="32" viewBox="0 0 1920 1920" fill="none" style="vertical-align:middle;" xmlns="http://www.w3.org/2000/svg">
                <path d="M213.333 960c0-167.36 56-321.707 149.44-446.4L1406.4 1557.227c-124.693 93.44-279.04 149.44-446.4 149.44-411.627 0-746.667-335.04-746.667-746.667m1493.334 0c0 167.36-56 321.707-149.44 446.4L513.6 362.773c124.693-93.44 279.04-149.44 446.4-149.44 411.627 0 746.667 335.04 746.667 746.667M960 0C429.76 0 0 429.76 0 960s429.76 960 960 960 960-429.76 960-960S1490.24 0 960 0" fill="#fff" fill-rule="evenodd"/>
                </svg>
            `;
        }
        return this.type === "number" ? this.value : this.type.toUpperCase();
    }

    getCssClasses() {
        return `card ${this.color} ${this.type}`;
    }
}

class Player {
    constructor(id, name, cards = [], points = 0, saidUNO = false, isHuman = true) {
        this.id = id;
        this.name = name;
        this.cards = cards;
        this.points = points;
        this.saidUNO = saidUNO;
        this.isHuman = isHuman;
    }

    addCard(card) {
        this.cards.push(card);
    }

    removeCard(index) {
        return this.cards.splice(index, 1)[0];
    }
}

class Game {
    constructor(players = [], deck = [], discardPile = [], turn = 0, direction = 1, currentColor = null, waitingForColor = false, roundWinner = null) {
        this.players = players;
        this.deck = deck;
        this.discardPile = discardPile;
        this.turn = turn;
        this.direction = direction;
        this.currentColor = currentColor;
        this.waitingForColor = waitingForColor;
        this.roundWinner = roundWinner;
    }

    getCurrentPlayer() {
        return this.players[this.turn];
    }

    getNextPlayerIndex() {
        let nextPlayerIndex = this.turn + this.direction;
        if (nextPlayerIndex < 0) nextPlayerIndex = this.players.length - 1;
        if (nextPlayerIndex >= this.players.length) nextPlayerIndex = 0;
        return nextPlayerIndex;
    }

    getTopDiscard() {
        return this.discardPile[this.discardPile.length - 1];
    }
}

// VARIABLES ------------------------------------------------------------------------------------------------

let deck = [];
let discardPile = [];
const colors = ["red", "green", "blue", "yellow"];
const specialCards = ["jump", "reverse", "drawTwo"];

let players = [];
let gameState = new Game(players, deck, discardPile);

const player1 = new Player(0, "Tú", [], 0, false, true);
const player2 = new Player(1, "CPU 1", [], 0, false, false);
const player3 = new Player(2, "CPU 2", [], 0, false, false);
const player4 = new Player(3, "CPU 3", [], 0, false, false);

// FUNCIONES ------------------------------------------------------------------------------------------------

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
    shuffle(deck);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startGame(playerList) {
    players = playerList;
    gameState = new Game(players, deck, discardPile, 0, 1, null, false, null);
    dealCards();
}

function dealCards() {
    for (let player of gameState.players) {
        player.cards = [];
        for (let i = 0; i < 7; i++) {
            let card = gameState.deck.pop();
            player.addCard(card);
        }
    }
    gameState.discardPile = [];
    const firstCard = gameState.deck.pop();
    gameState.discardPile.push(firstCard);
    gameState.currentColor = firstCard.color;
}

function isValidPlay(card) {
    let currentCard = gameState.getTopDiscard();
    return card.color === gameState.currentColor || (card.type === currentCard.type && card.value === currentCard.value);
}

async function playCard(playerIndex, cardIndex) {
    let player = gameState.players[playerIndex];
    let card = player.cards[cardIndex];

    if (isValidPlay(card)) {
        player.removeCard(cardIndex);
        gameState.discardPile.push(card);
        gameState.currentColor = card.color;
        if (card.type === "reverse") {
            gameState.direction *= -1;
            console.log("Dirección cambiada: " + gameState.direction);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        if (card.type === "drawTwo") {
            console.log("Jugador " + players[playerIndex].name + " le lanzo un +2 a " + players[gameState.getNextPlayerIndex()].name);
            await new Promise(resolve => setTimeout(resolve, 1000));
            drawCard(gameState.getNextPlayerIndex());
            drawCard(gameState.getNextPlayerIndex());
            nextTurn();
        }
        if (card.type === "jump") {
            console.log("Jugador " + players[playerIndex].name + " le cancelo el turno a " + players[gameState.getNextPlayerIndex()].name);
            await new Promise(resolve => setTimeout(resolve, 1000));
            nextTurn();
        }

        if(!checkWinner(playerIndex)){
            nextTurn();
            cpuTurn();
        }

    }
}

function checkUNO(playerIndex) {
    let player = gameState.players[playerIndex];
    if (player.cards.length === 1 && !player.saidUNO) {
        player.saidUNO = true;
        alert("¡UNO!");
    } else {
        alert("Solo puedes decir UNO cuando te queda una carta.");
    }
}

function countPoints(winnerIndex){
    let totalPoints = 0
    for (let i = 0; i < gameState.players.length; i++) {
        for (let j = 0; j < players[i].cards.length; j++) {
            totalPoints += players[i].cards[j].value
        }
    }
    players[winnerIndex].points = totalPoints
    gameState.roundWinner = players[winnerIndex]
    console.log("El jugador: " + players[winnerIndex].name + " sumo " + totalPoints + " puntos")
}

function resetRound(){

    for (let player in players){
        player.cards = []
    }

    initializeDeck();
    startGame([player1, player2, player3, player4]);
}

function checkWinner(playerIndex){
    let player = gameState.players[playerIndex];
    if (player.cards.length ===0){
        countPoints(playerIndex);
        resetRound();
        alert("Felicidades! El jugador " + players[playerIndex].name + " Ganó!!")
        return true;
    }
    return false;
}

function drawCard(playerIndex) {
    let player = gameState.players[playerIndex];
    if (deck.length > 0) {
        let card = deck.pop();
        player.addCard(card);
    }
}

function nextTurn() {
    let nextPlayerIndex = gameState.turn + gameState.direction;
    if (nextPlayerIndex < 0) nextPlayerIndex = gameState.players.length - 1;
    if (nextPlayerIndex >= gameState.players.length) nextPlayerIndex = 0;
    gameState.turn = nextPlayerIndex;

    console.log("turno desde nextTurn: " + gameState.turn);
}

function renderPlayerHand() {
    const playerArea = document.getElementById("player-area");
    playerArea.querySelector("#player-name").textContent = gameState.players[0].name;

    // Renderiza la mano
    let handDiv = playerArea.querySelector(".hand");
    if (!handDiv) {
        handDiv = document.createElement("div");
        handDiv.className = "hand";
        playerArea.appendChild(handDiv);
    }
    handDiv.innerHTML = "";

    const player = gameState.players[0];
    player.cards.forEach((card, idx) => {
        const cardDiv = document.createElement("div");
        cardDiv.className = card.getCssClasses();
        cardDiv.innerHTML = card.getDisplayText();
        cardDiv.onclick = () => handlePlayerPlay(idx);
        handDiv.appendChild(cardDiv);
    });
}

function renderOpponentHands() {
    // Renderiza las manos de los 3 CPUs (índices 1, 2 y 3)
    for (let cpuIdx = 1; cpuIdx <= 3; cpuIdx++) {
        const area = document.getElementById(`opponent-area-${cpuIdx}`);
        area.innerHTML = "";
        const cpu = gameState.players[cpuIdx];
        if (!cpu) continue;
        // Nombre del CPU
        const nameDiv = document.createElement("div");
        nameDiv.className = "player-info";
        nameDiv.textContent = cpu.name;
        area.appendChild(nameDiv);
        // Mano del CPU
        const handDiv = document.createElement("div");
        handDiv.className = "hand";
        for (let j = 0; j < cpu.cards.length; j++) {
            const cardDiv = document.createElement("div");
            cardDiv.className = "card back";
            handDiv.appendChild(cardDiv);
        }
        area.appendChild(handDiv);
    }
}

function renderCenterArea() {
    // Mazo (deck)
    const deckDiv = document.getElementById("deck");
    deckDiv.innerHTML = ""; // Limpia el mazo

    if (gameState.deck.length > 0) {
        const deckCard = document.createElement("div");
        deckCard.className = "card back";
        deckCard.title = "Robar carta";
        deckCard.onclick = () => {
            if (gameState.getCurrentPlayer().isHuman) {
                drawCard(0);
                nextTurn();
                cpuTurn();
                // setTimeout(console.log(''), 500);  
                // setTimeout(cpuTurn, 500);   
                // setTimeout(console.log('turno: '+ gameState.turn), 500);            
                renderPlayerHand();
                renderCenterArea();
                renderOpponentHands();
            }
        };
        deckDiv.appendChild(deckCard);

        // Cantidad de cartas en el deck
        const deckCount = document.createElement("span");
        deckCount.id = "deck-count";
        deckCount.className = "deck-count";
        deckCount.textContent = gameState.deck.length;
        deckDiv.appendChild(deckCount);
    }

    // Descarte (discard pile)
    const discardDiv = document.getElementById("discard-pile");
    discardDiv.innerHTML = "";
    const topCard = gameState.getTopDiscard();
    if (topCard) {
        const discardCard = document.createElement("div");
        discardCard.className = topCard.getCssClasses();
        discardCard.innerHTML = topCard.getDisplayText();
        discardDiv.appendChild(discardCard);
    }
}

// Llama a renderPlayerHand() y renderCenterArea() después de cada jugada

function handlePlayerPlay(cardIndex) {
    const player = gameState.players[0];
    const card = player.cards[cardIndex];
    if (isValidPlay(card) && gameState.turn === 0) {
        playCard(0, cardIndex);
        renderPlayerHand();
        renderCenterArea();
        renderOpponentHands();
        // setTimeout(console.log(gameState.turn), 500);
    } else {
        alert("No puedes jugar esa carta.");
    }
}

async function cpuTurn() {

    for (let i = 0; i < gameState.players.length; i++) {

        await new Promise(resolve => setTimeout(resolve, 1000));

        let played = false;
        if (!players[i].isHuman && i === gameState.turn) {
            for (let j = 0; j < players[i].cards.length; j++) {
                if (isValidPlay(players[i].cards[j])) {
                    playCard(i, j);
                    played = true;
                    break;
                }
            }
            if (!played) {
                drawCard(i);
                nextTurn();
            }
            renderPlayerHand();
            renderCenterArea();
            renderOpponentHands();
        }
    }
}

// EVENTOS --------------------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function() {
    const singleBtn = document.getElementById("singleplayer-btn");
    const multiBtn = document.getElementById("multiplayer-btn");
    const multiOptions = document.getElementById("multiplayer-options");

    singleBtn.addEventListener("click", () => {
        document.getElementById("welcome-screen").classList.add("hidden");
        document.getElementById("game-board").classList.remove("hidden");
        initializeDeck();
        startGame([player1, player2, player3, player4]);
        renderPlayerHand();
        renderCenterArea();
        renderOpponentHands();
    });

    multiBtn.addEventListener("click", () => {
        multiOptions.classList.remove("hidden");
    });

    const startMultiplayerBtn = document.getElementById("start-multiplayer-btn");
    const playerSetupModal = document.getElementById("player-setup-modal");
    const playerInputsDiv = document.getElementById("player-inputs");
    const playerSetupForm = document.getElementById("player-setup-form");
    const cancelSetupBtn = document.getElementById("cancel-setup");

    startMultiplayerBtn.addEventListener("click", () => {
        const numPlayers = parseInt(document.getElementById("player-count").value, 10);
        playerInputsDiv.innerHTML = "";
        for (let i = 0; i < numPlayers; i++) {
            const playerDiv = document.createElement("div");
            playerDiv.className = "player-input-row";
            playerDiv.innerHTML = `
                <label class="player-label">Jugador ${i + 1}:
                    <input type="text" class="player-name-input" name="playerName${i}" placeholder="Nombre" required>
                </label>
                <label class="toggle-label">
                    <input type="checkbox" class="toggle-human" name="isHuman${i}" checked data-index="${i}">
                    <span class="toggle-status" id="toggle-status-${i}">Humano</span>
                </label>
            `;
            playerInputsDiv.appendChild(playerDiv);
        }
        playerSetupModal.classList.remove("hidden");

        const toggles = playerInputsDiv.querySelectorAll('.toggle-human');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', function() {
                const idx = this.getAttribute('data-index');
                const statusSpan = document.getElementById(`toggle-status-${idx}`);
                statusSpan.textContent = this.checked ? 'Humano' : 'CPU';
            });
        });
    });

    cancelSetupBtn.addEventListener("click", () => {
        playerSetupModal.classList.add("hidden");
    });

    playerSetupForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const numPlayers = playerInputsDiv.children.length;
        const playerList = [];
        for (let i = 0; i < numPlayers; i++) {
            const name = playerSetupForm[`playerName${i}`].value || `Jugador ${i+1}`;
            const isHuman = playerSetupForm[`isHuman${i}`].checked;
            playerList.push(new Player(i, name, [], 0, false, isHuman));
        }
        playerSetupModal.classList.add("hidden");
        document.getElementById("welcome-screen").classList.add("hidden");
        document.getElementById("game-board").classList.remove("hidden");
        initializeDeck();
        startGame(playerList);
        renderPlayerHand();
        renderCenterArea();
        renderOpponentHands();
    });

    document.getElementById("uno-btn").addEventListener("click", () => {
        checkUNO(0)
        const player = gameState.players[0];
        if (player.cards.length === 1 && !player.saidUNO) {
            player.saidUNO = true;
            alert("¡UNO!");
        } else {
            alert("Solo puedes decir UNO cuando te queda una carta.");
        }
    });
});