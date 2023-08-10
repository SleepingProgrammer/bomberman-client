import GameSprite from "./GameSprite"; 
class Tile extends GameSprite {
  constructor(options) {
    super(options);
    this.type = options.type;

    this.loadSprite(
      options.type == "wall" ? "/assets/wall.png" : "/assets/floor.png"
    );
  }

  // Add any additional methods or logic for the Tile class here
}

export default Tile;
