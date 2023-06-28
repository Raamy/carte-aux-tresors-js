const fs = require('fs/promises')
const Map = require('./Map')
const Adventurer = require('./Adventurer')

class Game {

    constructor() {
        // Données de jeu
        this.fileData = null
        // Données de la carte
        this.mapData = null
        // Nombre de tours maximum
        this.maxRound = 0
    }

    // Obtention des données de jeu via la lecture du fichier d'entrée
    async getGameData() {
        // Lecture du dossier du fichier
        await fs.readdir('./entry/')
            .then(async fileName => {
                // Si le fichier est détecté
                if (fileName) {
                    process.stdout.write('# Fichier détecté !\n\n')
                    // Alors on lis le fichier et on traite les données
                    await fs.readFile('./entry/' + fileName[0], 'utf8')
                        .then(fileData => {
                            // Séparation de chaque ligne du fichier dans un tableau
                            fileData = fileData.replace(/ /g, '').split('\n')
                            // Séparation des données de chaque ligne
                            for (let data in fileData) {
                                fileData[data] = fileData[data].split('-')
                            }
                            this.fileData = fileData
                        })
                }
            })
    }

    // Création de la carte, des différents éléments et des aventuriers
    async createGame() {
        for (let data in this.fileData) {
            if (this.fileData[data][0] === 'C') {
                // Vérification des données : Carte
                if (this.fileData[data].length !== 3) throw Error('Mauvaise données renseignées')
                // Initialisation de la carte
                this.mapData = new Map(parseInt(this.fileData[data][1]), parseInt(this.fileData[data][2]))
            } else if (this.fileData[data][0] === 'M') {
                // Vérification des données : Montagne
                if (this.fileData[data].length !== 3) throw Error('Mauvaise données renseignées')
                // Ajout des montagnes sur la carte
                this.mapData.placeElement(parseInt(this.fileData[data][1]), parseInt(this.fileData[data][2]), {type: 'montagne'})
            } else if (this.fileData[data][0] === 'T') {
                // Vérification des données : Trésor
                if (this.fileData[data].length !== 4) throw Error('Mauvaise données renseignées')
                // Ajout des trésors sur la carte
                this.mapData.placeElement(parseInt(this.fileData[data][1]), parseInt(this.fileData[data][2]), {
                    type: 'treasure',
                    number: this.fileData[data][3],
                    adventurer: null
                })

            } else if (this.fileData[data][0] === 'A') {
                // Vérification des données : Aventurier
                if (this.fileData[data].length !== 6) throw Error('Mauvaise données renseignées')
                // Création d'un aventurier
                let adventurer = new Adventurer(this.fileData[data][1], this.fileData[data][4],
                    this.fileData[data][5], parseInt(this.fileData[data][2]), parseInt(this.fileData[data][3]))
                // On ajoute l'aventurier dans la liste des aventuriers présent sur la carte
                this.mapData.adventurers.push(adventurer)
                // Puis on le place sur la carte
                this.mapData.placeAdventurer(parseInt(this.fileData[data][2]), parseInt(this.fileData[data][3]), adventurer)
                // Permet de connaître le nombre de round maximum, c'est-à-dire
                // le nombre max de séquence entre tous les aventuriers de la partie
                if (this.fileData[data][5].length > this.maxRound) this.maxRound = this.fileData[data][5].length
            }
        }
        //console.log(this.mapData.map)
    }

    // Lancement du jeu : Déplace les différents aventuriers
    async startGame() {
        // Affiche la carte de départ, avant tous les déplacements
        console.log('### Carte de départ ###\n\n')
        this.mapData.printMap()

        this.mapData.movePlayers(this.maxRound)

        // Affiche la carte de fin, après tous les déplacements
        console.log('\n\n### Carte de fin ###\n\n')
        this.mapData.printMap()
    }

    // Envoie des résultats (carte de fin) dans un fichier 'result.txt'
    async sendResults() {
        let map = this.mapData.map
        for (let y in map) {
            let elementIcon;
            for (let x in map[y]) {
                let element = map[y][x]
                // Si la case est une plaine
                if (element.type === 'plaine') {
                    if (element.adventurer) {
                        // On affiche l'aventurier sur cette case
                        elementIcon = `A(${element.adventurer.name})`
                    } else {
                        // Ou on affiche la plaine
                        elementIcon = '.'
                    }
                }
                // Si la case est une montagne
                if (element.type === 'montagne') {
                    elementIcon = 'M'
                }
                // Si la case est un trésor
                if (element.type === 'treasure') {
                    //console.log(element.adventurer)
                    if (element.adventurer) {
                        // On affiche l'aventurier sur cette case
                        elementIcon = `A(${element.adventurer.name})`
                    } else {
                        // Ou on affiche le trésor avec le nombre de trésor(s) restant(s)
                        elementIcon = `T(${element.number})`
                    }
                }
                // Ecriture de la carte dans le fichier
                // On print d'abord les cases puis les espaces entre celle ci
                await fs.appendFile('result.txt', elementIcon, 'utf8');
                await fs.appendFile('result.txt', '        '.slice(elementIcon.length), 'utf8');
            }
            await fs.appendFile('result.txt', '\n', 'utf8');
        }
    }

}

module.exports = Game