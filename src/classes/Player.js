import GameSprite from "./GameSprite";

class Player extends GameSprite {
  constructor(options) {
    super(options);

    this.loadSprite(
      options.type == "player" ? "/assets/Bomber.png" : "/assets/Bomber-2.png"
    );
  }

  // Add any additional methods or logic for the Tile class here
}

export default Player;
