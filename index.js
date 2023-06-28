// ##### Fichier principal ######

// Import de la classe Game
// contenant les différentes fonctions liées aux déroulement du jeu
const Game = require('./models/Game')


// Lance le jeu : Carte aux trésors
async function carteAuxTresors() {
    let game = new Game()
    await game.getGameData() // Obtention des informations de jeu
    await game.createGame() // Création du jeu, de la carte, des aventuriers, trésors etc...
    await game.startGame() // Lancement du jeu
    await game.sendResults() // Ecriture des résultats dans un fichier
}

carteAuxTresors()