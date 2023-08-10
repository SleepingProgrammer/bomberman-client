import Constants from "../Constants";
import GameSprite from "./GameSprite";

class Bomb extends GameSprite {
  constructor(options) {
    super(options);
    this.state = options.state;

    console.log({
      state: options.state,
    });
    this.loadSprite(
      options.state == "exploded" || options.state == "blast" ? "/assets/blast.png" : "/assets/bomb.png"
    );

    //If the bomb has exploded, we need to render to adjacent blasts as well
    if (options.state == "exploded") {
      this.renderAdjacentBlasts(options);
    }
  }

  renderAdjacentBlasts(options) {
    //Render the blast to the right
    let blast = new Bomb({
      x: options.x + Constants.TILE_SIZE,
      y: options.y,
      state: "blast",
      width: Constants.TILE_SIZE,
      height: Constants.TILE_SIZE,
    });
    blast.render(options.container);

    //Render the blast to the left
    blast = new Bomb({
      x: options.x - Constants.TILE_SIZE,
      y: options.y,
      state: "blast",
      width: Constants.TILE_SIZE,
      height: Constants.TILE_SIZE,
    });
    blast.render(options.container);

    //Render the blast to the top
    blast = new Bomb({
      x: options.x,

      y: options.y - Constants.TILE_SIZE,
      state: "blast",
      width: Constants.TILE_SIZE,
      height: Constants.TILE_SIZE,
    });

    blast.render(options.container);

    //Render the blast to the bottom
    blast = new Bomb({
      x: options.x,
      y: options.y + Constants.TILE_SIZE,
      state: "blast",
      width: Constants.TILE_SIZE,
      height: Constants.TILE_SIZE,
    });
    blast.render(options.container);
  }

  // Add any additional methods or logic for the Tile class here
}

export default Bomb;
