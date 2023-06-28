class Map {

    constructor(x, y) {
        // Génération des lignes
        this.map = new Array(y)
        // Génération des colonnes
        for (let i = 0; i < y; i++) {
            this.map[i] = new Array(x)
        }
        // Place des plaines partout sur la carte ('carte vide')
        this.generateGround()
        // Liste des aventuriers présent sur la carte
        this.adventurers = []
    }

    // Place des plaines partout sur la carte ('carte vide')
    generateGround() {
        for (let y in this.map) {
            for (let i = 0; i < this.map[y].length; i++) {
                this.map[y][i] = {type: "plaine", adventurer: null}
            }
        }
    }

    // Place un élément sur une case
    placeElement(x, y, element) {
        if (this.getElement(x, y) === undefined) throw Error("La case n'existe pas, vérifiez le fichier de jeu")
        this.map[y][x] = element
    }

    // Place un aventurier sur une case
    placeAdventurer(x, y, adventurer) {
        if (this.getElement(x, y) === undefined) throw Error("La case n'existe pas, vérifiez le fichier de jeu")
        this.map[y][x].adventurer = adventurer
    }

    // Enlève un aventurier d'une case
    removeAdventurer(x, y) {
        this.map[y][x].adventurer = null
    }

    // Retourne l'élément d'une case
    getElement(x, y) {
        return this.map[y][x]
    }

    // Permet de connaître la case suivante, lorsqu'un joueur avance, en foncion de son orientation
    // retourne l'élément et ses coordonnées
    getNextElement(x, y, orientation) {
        switch (orientation) {
            case 'N':
                //console.log('Nord')
                return {element: this.getElement(x, y - 1), x: x, y: y - 1}
            case 'S':
                //console.log('Sud')
                return {element: this.getElement(x, y + 1), x: x, y: y + 1}
            case 'E':
                //console.log('Est')
                return {element: this.getElement(x + 1, y), x: x + 1, y: y}
            case 'O':
                //console.log('Ouest')
                return {element: this.getElement(x - 1, y), x: x - 1, y: y}
        }
    }

    // Déplace un aventurier (ou non) en fonction de la case suivante
    moveAdventurer(adventurer) {
        // La case suivante
        let nextElement = this.getNextElement(adventurer.x, adventurer.y, adventurer.orientation)
        //console.log(nextElement)
        // Si la case suivante n'est pas hors-carte
        if (nextElement.element !== undefined) {
            // Si aucun aventurier est présent sur la carte suivante
            if (nextElement.element.adventurer === null) {
                // Si la case suivante est une plaine
                if (nextElement.element.type === 'plaine') {
                    // On enlève l'aventurier de sa case actuelle
                    // On change ses coordonnées puis on le place à la case suivante
                    this.removeAdventurer(adventurer.x, adventurer.y)
                    adventurer.changeCoord(nextElement.x, nextElement.y)
                    this.placeAdventurer(nextElement.x, nextElement.y, adventurer)
                }
                // Si la case suivante est un trésor
                else if (nextElement.element.type === 'treasure') {
                    // On enlève l'aventurier de sa case actuelle
                    // On lui ajoute un trésor, et enlève un trésor de la case suivante
                    // On change ses coordonnées puis on le place à la case suivante
                    this.removeAdventurer(adventurer.x, adventurer.y)
                    adventurer.obtainTreasure()
                    adventurer.changeCoord(nextElement.x, nextElement.y)
                    this.map[nextElement.y][nextElement.x].number--
                    this.placeAdventurer(nextElement.x, nextElement.y, adventurer)
                }
            }
        }
        // On retourne l'aventurier qui à été modifié
        return adventurer
    }

    // Permet d'afficher la carte
    printMap() {
        for (let y in this.map) {
            let elementIcon;
            for (let x in this.map[y]) {
                //console.log(this.map[y][x])
                let element = this.map[y][x]
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
                    //else elementIcon = `A(${element.name})`
                }
                // On print d'abord les cases puis les espaces entre celle ci
                process.stdout.write(elementIcon)
                process.stdout.write('        '.slice(elementIcon.length))
            }
            process.stdout.write('\n')
        }
    }

    // Déplacement de tous les aventuriers sur la carte
    movePlayers(maxRound) {
        // Pour chaque round de la partie
        for (let round = 0; round < maxRound; round++) {
            // Pour chaque aventurier de la partie
            for (let index in this.adventurers) {
                let adventurer = this.adventurers[index]
                // Avance l'aventurier
                if (adventurer.sequence[round] === 'A') {
                    //console.log('Avancer')
                    adventurer = this.moveAdventurer(adventurer)
                } else if (adventurer.sequence[round] === 'G') {
                    //console.log('Gauche')
                    adventurer.turnLeft()
                } else if (adventurer.sequence[round] === 'D') {
                    //console.log('Droite')
                    adventurer.turnRight()
                }
                // Actualisation de l'aventurier dans la liste
                this.adventurers[index] = adventurer
            }
        }
    }

}

module.exports = Map