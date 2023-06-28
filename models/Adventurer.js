class Adventurer {

    constructor(name, orientation, sequence, x, y) {
        // Nom
        this.name = name;
        // Orientation : N, S, E, O
        this.orientation = orientation
        // Séquence
        this.sequence = sequence
        // Coordonnées
        this.x = x
        this.y = y
        // Nombre de trésor
        this.treasures = 0
    }

    // Change les coordonnées d'un aventurier
    changeCoord(x, y) {
        this.x = x
        this.y = y
    }

    // Ajoute un trésor à un aventurier
    obtainTreasure() {
        this.treasures++
    }

    // Fais tourner à droite un aventurier, selon son orientation
    turnRight() {
        switch (this.orientation) {
            case 'N':
                this.orientation = 'E'
                break;
            case 'S':
                this.orientation = 'O'
                break;
            case 'E':
                this.orientation = 'S'
                break;
            case 'O':
                this.orientation = 'N'
                break;
        }
    }

    // Fais tourner à gauche un aventurier, selon son orientation
    turnLeft() {
        switch (this.orientation) {
            case 'N':
                this.orientation = 'O'
                break;
            case 'S':
                this.orientation = 'E'
                break;
            case 'E':
                this.orientation = 'N'
                break;
            case 'O':
                this.orientation = 'S'
                break;
        }
    }

}

module.exports = Adventurer