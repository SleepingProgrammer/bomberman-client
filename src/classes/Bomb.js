import Constants from "../Constants";
import GameSprite from "./GameSprite";

class Bomb extends GameSprite {
  constructor(options) {
    super(options);
    this.state = options.state;
    this.blastContainer = options.blastContainer;
    this.blasts = [];
    this.hasExploded = false;
    console.log("bomb_created");
    this.update(options);
  }

  update = (data) => {
    console.log("bomb_updated", { data });
    this.loadSprite(
      data.state == "exploded" || data.state == "blast"
        ? "/assets/blast.png"
        : "/assets/bomb.png"
    );

    //If the bomb has exploded, we need to render to adjacent blasts as well
    if (data.state == "exploded" && !this.hasExploded) {
      //this.postRender = this.rerenderBomb;
      this.renderAdjacentBlasts(data);
      this.hasExploded = true;
    }
  };

  destroy = () => {
    try {
      this.clearBlasts();
      console.log({
        sprite: this.sprite,
      });
    } catch (error) {
      console.error({ error });
    }
  };

  clearBlasts() {
    console.log("clearBlasts");
    this.blasts.forEach((blast) => {
      console.log({ blast });

      if (blast && blast.sprite) {
        console.log({ blast });
        blast.sprite.destroy();
      }
    });
  }

  renderAdjacentBlasts(options) {
    this.sprite.destroy();

    let blastC = new Bomb({
      x: options.x,
      y: options.y,
      state: "blast",
      width: Constants.TILE_SIZE,
      height: Constants.TILE_SIZE,
    });
    blastC.render(options.blastContainer);
    this.blasts.push(blastC);
    
    //Render the blast to the right
    let blastR = new Bomb({
      x: options.x + Constants.TILE_SIZE,
      y: options.y,
      state: "blast",
      width: Constants.TILE_SIZE,
      height: Constants.TILE_SIZE,
    });
    blastR.render(options.blastContainer);
    this.blasts.push(blastR);


    //Render the blast to the left
    const blastL = new Bomb({
      x: options.x - Constants.TILE_SIZE,
      y: options.y,
      state: "blast",
      width: Constants.TILE_SIZE,
      height: Constants.TILE_SIZE,
    });
    blastL.render(options.blastContainer);

    this.blasts.push(blastL);

    //Render the blast to the top
    const blastT = new Bomb({
      x: options.x,

      y: options.y - Constants.TILE_SIZE,
      state: "blast",
      width: Constants.TILE_SIZE,
      height: Constants.TILE_SIZE,
    });

    blastT.render(options.blastContainer);
    this.blasts.push(blastT);

    //Render the blast to the bottom
    const blastB = new Bomb({
      x: options.x,
      y: options.y + Constants.TILE_SIZE,
      state: "blast",
      width: Constants.TILE_SIZE,
      height: Constants.TILE_SIZE,
    });
    blastB.render(options.blastContainer);
    this.blasts.push(blastB);
  }

  // Add any additional methods or logic for the Tile class here
}

export default Bomb;
