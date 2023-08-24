import GameSprite from "./GameSprite";

class GameObject extends GameSprite {
  constructor(options) {
    super(options);
    this.type = options.type;

    this.loadSprite();
  }

  // Add any additional methods or logic for the Tile class here
}

export default GameObject;
