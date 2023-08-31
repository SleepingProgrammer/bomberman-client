class BombManager {
    //only manages changing the states of the bombs not holding them
    constructor( setBombSprites) { 
        this.setBombSprites = setBombSprites;
    }

    plantBomb(bombSprites, bomb) {

    }

    explodeBomb(bombStates, bomb) {
        //change the state of the bomb to exploded
        bombStates[bomb.id] = "exploded";
    } 
}