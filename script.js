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
        if (this.type === "wild" || this.type === "wildDrawFour") {
            return `
                <div style="display:flex;flex-direction:column;align-items:center;">
                    <svg width="32" height="32" viewBox="0 0 32 32">
                        <defs>
                            <linearGradient id="uno-wild" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stop-color="#e53935"/>
                                <stop offset="25%" stop-color="#43a047"/>
                                <stop offset="50%" stop-color="#1e88e5"/>
                                <stop offset="75%" stop-color="#fbc02d"/>
                            </linearGradient>
                        </defs>
                        <circle cx="16" cy="16" r="14" fill="url(#uno-wild)" stroke="#fff" stroke-width="2"/>
                    </svg>
                    <span style="font-weight:bold;color:#fff;font-size:18px;">
                        ${this.type === "wildDrawFour" ? "+4" : "WILD"}
                    </span>
                </div>
            `;
        }
        return this.type === "number" ? this.value : this.type.toUpperCase();
    }

    getCssClasses() {
        let classes = `card ${this.color} ${this.type}`;
        if ((this.type === "wild" || this.type === "wildDrawFour") && this.chosenColor) {
            classes += ` wild-chosen-${this.chosenColor}`;
        }
        return classes;
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

// Sistema de cola para notificaciones
let notificationQueue = [];
let isShowingNotification = false;

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
    // Agregar cartas comodín
    for (let i = 0; i < 4; i++) {
        deck.push(new Card("WILD-" + i, "black", "wild", 50));
        deck.push(new Card("WILD4-" + i, "black", "wildDrawFour", 50));
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
    updateTurnIndicator();
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
    let firstCard;
    // Buscar la primera carta válida
    do {
        firstCard = gameState.deck.pop();
        // Si la carta no es número, la ponemos al final del mazo
        if (firstCard.type !== "number") {
            gameState.deck.unshift(firstCard);
        }
    } while (firstCard.type !== "number");
    gameState.discardPile.push(firstCard);
    gameState.currentColor = firstCard.color;
}

function isValidPlay(card) {
    let currentCard = gameState.getTopDiscard();
    
    // Para cartas WILD +4, verificar que no tenga cartas del color actual
    if (card.type === "wildDrawFour") {
        const player = gameState.getCurrentPlayer();
        // Verificar si la CPU tiene cartas del color actual
        for (let c of player.cards) {
            if (c.color === gameState.currentColor) {
                return false; // No juega WILD +4 si tiene cartas del color actual
            }
        }
        return true; // Solo juega WILD +4 si no tiene cartas del color actual
    }
    
    // Las cartas wild normales siempre se pueden jugar
    if (card.type === "wild") {
        return true;
    }
    
    return card.color === gameState.currentColor || (card.type === currentCard.type && card.value === currentCard.value);
}

async function playCard(playerIndex, cardIndex) {
    let player = gameState.players[playerIndex];
    let card = player.cards[cardIndex];
    
    console.log(`🎮 ${player.name} jugó: ${card.type === "number" ? card.value : card.type} ${card.color} - Turno: ${gameState.turn}`);

    if (isValidPlay(card)) {
        player.removeCard(cardIndex);
        gameState.discardPile.push(card);

        if (card.type === "wild" || card.type === "wildDrawFour") {
            let chosenColor;
            if (player.isHuman) {
                chosenColor = await showColorSelector();
            } else {
                let colorCount = {red:0, green:0, blue:0, yellow:0};
                for (let c of player.cards) {
                    if (colorCount[c.color] !== undefined) colorCount[c.color]++;
                }
                chosenColor = Object.keys(colorCount).reduce((a, b) => colorCount[a] > colorCount[b] ? a : b);
            }
            gameState.currentColor = chosenColor;
            card.chosenColor = chosenColor;
            
            if (!player.isHuman) {
                showCpuNotification(player.name, card.type, card.color, card.value, chosenColor);
            }

            if (card.type === "wildDrawFour") {
                let nextIdx = gameState.getNextPlayerIndex();
                for (let i = 0; i < 4; i++) {
                    drawCard(nextIdx);
                }
                nextTurn();
            }
        } else {
            gameState.currentColor = card.color;
            
            if (!player.isHuman) {
                showCpuNotification(player.name, card.type, card.color, card.value, card.chosenColor);
            }
        }

        // Penalización por no decir UNO
        if (
            player.isHuman &&
            player.cards.length === 1 &&
            !player.saidUNO
        ) {
            alert("¡Olvidaste decir UNO! Robas 2 cartas.");
            drawCard(playerIndex);
            drawCard(playerIndex);
        }
        player.saidUNO = false; 

        if (card.type === "reverse") {
            gameState.direction *= -1;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        if (card.type === "drawTwo") {
            const nextPlayer = gameState.players[gameState.getNextPlayerIndex()];
            await new Promise(resolve => setTimeout(resolve, 1000));
            drawCard(gameState.getNextPlayerIndex());
            drawCard(gameState.getNextPlayerIndex());
            if (!nextPlayer.isHuman) {
                showCpuDrawNotification(nextPlayer.name, 2);
            }
            nextTurn();
        }
        if (card.type === "jump") {
            const nextPlayer = gameState.players[gameState.getNextPlayerIndex()];
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (!checkWinner(playerIndex)) {
            let specialCardPlayed = card.type === "drawTwo" || card.type === "wildDrawFour";
            
            if (!specialCardPlayed) {
                if (card.type === "jump") {
                    nextTurn();
                    nextTurn();
                } else {
                    nextTurn();
                }
            }
            
            if (!gameState.players[gameState.turn].isHuman) {
                cpuTurn();
            }
        } else {
            console.log(`${player.name} ha ganado!`);
        }
    } else {
        console.log(`Carta no válida`);
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
        for (let j = 0; j < gameState.players[i].cards.length; j++) {
            totalPoints += gameState.players[i].cards[j].value
        }
    }
    gameState.players[winnerIndex].points = totalPoints
    gameState.roundWinner = gameState.players[winnerIndex]
    console.log("El jugador: " + gameState.players[winnerIndex].name + " sumo " + totalPoints + " puntos")
}

function resetRound(){
    for (let player of gameState.players){
        player.cards = []
    }

    initializeDeck();
    startGame(gameState.players);
}

function checkWinner(playerIndex){
    let player = gameState.players[playerIndex];
    if (player.cards.length === 0){
        countPoints(playerIndex);
        showVictoryModal(player.name);
        return true;
    }
    return false;
}

function showVictoryModal(winnerName) {
    const modal = document.getElementById("victory-modal");
    const msg = document.getElementById("victory-message");
    msg.textContent = `¡${winnerName} ha ganado la partida!`;
    modal.classList.remove("hidden");
}

function drawCard(playerIndex) {
    let player = gameState.players[playerIndex];
    // Si el mazo está vacío, recarga desde el descarte
    if (gameState.deck.length === 0 && gameState.discardPile.length > 1) {
        // Toma todas menos la última carta del descarte
        const lastDiscard = gameState.discardPile.pop();
        gameState.deck = gameState.discardPile;
        shuffle(gameState.deck);
        gameState.discardPile = [lastDiscard];
    }
    if (gameState.deck.length > 0) {
        let card = gameState.deck.pop();
        player.addCard(card);
    }
}

function nextTurn() {
    let nextPlayerIndex = gameState.turn + gameState.direction;
    if (nextPlayerIndex < 0) nextPlayerIndex = gameState.players.length - 1;
    if (nextPlayerIndex >= gameState.players.length) nextPlayerIndex = 0;
    
    gameState.turn = nextPlayerIndex;

    updateTurnIndicator();
    const player = gameState.players[gameState.turn];
    console.log(`Turno: ${player.name}`);
}

function updateTurnIndicator() {
    const indicator = document.getElementById("turn-indicator");
    const player = gameState.players[gameState.turn];
    if (player.isHuman) {
        indicator.textContent = "¡Tu turno!";
    } else {
        indicator.textContent = `Turno de: ${player.name}`;
    }
}

function renderPlayerHand() {
    const playerArea = document.getElementById("player-area");
    playerArea.querySelector("#player-name").textContent = gameState.players[0].name;

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

    const unoBtn = document.getElementById("uno-button");
    if (
        player.isHuman &&
        player.cards.length === 2 &&
        !player.saidUNO
    ) {
        unoBtn.style.display = "block";
        unoBtn.disabled = false;
    } else {
        unoBtn.style.display = "none";
    }
}

function renderOpponentHands() {
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
    const deckDiv = document.getElementById("deck");
    deckDiv.innerHTML = "";

    if (gameState.deck.length > 0) {
        const deckCard = document.createElement("div");
        deckCard.className = "card back";
        deckCard.title = "Robar carta";
        deckCard.onclick = () => {
            if (gameState.getCurrentPlayer().isHuman) {
                drawCard(0);
                nextTurn();
                if (!gameState.players[gameState.turn].isHuman) {
                    cpuTurn();
                }
                renderPlayerHand();
                renderCenterArea();
                renderOpponentHands();
            }
        };
        deckDiv.appendChild(deckCard);

        const deckCount = document.createElement("span");
        deckCount.id = "deck-count";
        deckCount.className = "deck-count";
        deckCount.textContent = gameState.deck.length;
        deckDiv.appendChild(deckCount);
    }

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

function handlePlayerPlay(cardIndex) {
    const player = gameState.players[0];
    const card = player.cards[cardIndex];
    
    if (isValidPlay(card) && gameState.turn === 0) {
        playCard(0, cardIndex);
        renderPlayerHand();
        renderCenterArea();
        renderOpponentHands();
    }
}

async function cpuTurn() {
    const cpu = gameState.players[gameState.turn];
    
    if (!cpu.isHuman) {
        await new Promise(resolve => setTimeout(resolve, 2500)); // Espera 2.5 segundos
        let played = false;
        
        for (let j = 0; j < cpu.cards.length; j++) {
            const card = cpu.cards[j];
            if (card && card.type !== "wildDrawFour" && isValidPlay(card)) {
                await playCard(gameState.turn, j);
                played = true;
                break;
            }
        }
        
        if (!played) {
            for (let j = 0; j < cpu.cards.length; j++) {
                const card = cpu.cards[j];
                if (card && card.type === "wildDrawFour" && isValidPlay(card)) {
                    await playCard(gameState.turn, j);
                    played = true;
                    break;
                }
            }
        }
        
        if (!played) {
            for (let j = 0; j < cpu.cards.length; j++) {
                const card = cpu.cards[j];
                if (card && card.type === "wild" && isValidPlay(card)) {
                    await playCard(gameState.turn, j);
                    played = true;
                    break;
                }
            }
        }
        
        if (!played) {
            console.log(`${cpu.name} robó carta`);
            drawCard(gameState.turn);
            showCpuDrawNotification(cpu.name, 1);
            nextTurn();
        }
        
        renderPlayerHand();
        renderCenterArea();
        renderOpponentHands();
        
        if (!played && !gameState.players[gameState.turn].isHuman) {
            cpuTurn();
        }
    }
}

function showColorSelector() {
    return new Promise(resolve => {
        const selector = document.getElementById("color-selector");
        selector.innerHTML = `
            <button class="color-btn red" data-color="red"></button>
            <button class="color-btn green" data-color="green"></button>
            <button class="color-btn blue" data-color="blue"></button>
            <button class="color-btn yellow" data-color="yellow"></button>
        `;
        selector.classList.remove("hidden");
        const buttons = selector.querySelectorAll(".color-btn");
        buttons.forEach(btn => {
            btn.onclick = () => {
                selector.classList.add("hidden");
                resolve(btn.getAttribute("data-color"));
            };
        });
    });
}

function showCpuNotification(cpuName, cardType, cardColor, cardValue, chosenColor = null) {
    const notification = {
        cpuName, cardType, cardColor, cardValue, chosenColor
    };
    
    notificationQueue.push(notification);
    
    if (!isShowingNotification) {
        showNextNotification();
    }
}

function showNextNotification() {
    if (notificationQueue.length === 0) {
        isShowingNotification = false;
        return;
    }
    
    isShowingNotification = true;
    const notification = notificationQueue.shift();
    
    const notificationElement = document.getElementById("cpu-notification");
    const notificationText = document.getElementById("notification-text");
    
    const colorNames = {
        'red': 'ROJO',
        'green': 'VERDE', 
        'blue': 'AZUL',
        'yellow': 'AMARILLO'
    };
    
    let message = `${notification.cpuName} jugó: `;
    
    if (notification.cardType === "number") {
        message += `${notification.cardValue} ${colorNames[notification.cardColor]}`;
    } else if (notification.cardType === "drawTwo") {
        message += `+2 ${colorNames[notification.cardColor]}`;
    } else if (notification.cardType === "reverse") {
        message += `REVERSE ${colorNames[notification.cardColor]}`;
    } else if (notification.cardType === "jump") {
        message += `SALTO ${colorNames[notification.cardColor]}`;
    } else if (notification.cardType === "wild") {
        if (notification.chosenColor && colorNames[notification.chosenColor]) {
            message += `WILD - Cambió color a: ${colorNames[notification.chosenColor]}`;
        } else {
            message += `WILD`;
        }
    } else if (notification.cardType === "wildDrawFour") {
        if (notification.chosenColor && colorNames[notification.chosenColor]) {
            message += `WILD +4 - Cambió color a: ${colorNames[notification.chosenColor]}`;
        } else {
            message += `WILD +4`;
        }
    } else if (notification.cardType === "draw") {
        if (notification.cardValue === 1) {
            message = `${notification.cpuName} agarró 1 carta`;
        } else {
            message = `${notification.cpuName} agarró ${notification.cardValue} cartas`;
        }
    }
    
    notificationText.textContent = message;
    notificationElement.classList.remove("hidden", "fade-out");
    
    setTimeout(() => {
        notificationElement.classList.add("fade-out");
        setTimeout(() => {
            notificationElement.classList.add("hidden");
            showNextNotification();
        }, 300);
    }, 2500);
}

function showCpuDrawNotification(cpuName, cardsDrawn) {
    const notification = {
        cpuName, cardType: "draw", cardColor: null, cardValue: cardsDrawn, chosenColor: null
    };
    
    notificationQueue.push(notification);
    
    if (!isShowingNotification) {
        showNextNotification();
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
        updateTurnIndicator();
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

    const unoBtn = document.getElementById("uno-button");
    if (unoBtn) {
        unoBtn.addEventListener("click", () => {
            const player = gameState.players[0];
            if (
                player.isHuman &&
                player.cards.length === 2 &&
                !player.saidUNO
            ) {
                player.saidUNO = true;
                alert("¡UNO!");
                renderPlayerHand();
            } else {
                alert("Solo puedes decir UNO cuando te queda una carta.");
            }
        });
    }

    const playAgainBtn = document.getElementById("play-again-btn");
    if (playAgainBtn) {
        playAgainBtn.addEventListener("click", () => {
            document.getElementById("victory-modal").classList.add("hidden");
            initializeDeck();
            startGame(gameState.players);
            renderPlayerHand();
            renderCenterArea();
            renderOpponentHands();
        });
    }
});