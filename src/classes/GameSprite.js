import * as PIXI from "pixi.js";

const contentImages = {
  wall: "/assets/wall.png",
  floor: "/assets/floor.png",
  brick: "/assets/brick.png",
  player: "/assets/player.png",
  enemy: "/assets/enemy.png",
  weapon: "/assets/weapon.png",
  health: "/assets/health.png",
  stairs: "/assets/stairs.png",
  boss: "/assets/boss.png",
  bomb: "/assets/bomb.png",
  powerup: "/assets/apple.png",
};

class GameSprite {
  //Required parameters
  /**
   *
   * @param {Object} parameters
   * @param {Number} parameters.x
   * @param {Number} parameters.y
   * @param {String} parameters.texturePath
   * @param {Number} parameters.width
   * @param {Number} parameters.height
   * @param {String} parameters.type
   */
  constructor({
    x,
    y,
    texturePath = null,
    width = 0,
    height = 0,
    type = "floor", //we default to floor sprites
  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.postRender = null;

    if (texturePath) {
      this.loadSprite(texturePath);
    }
  }

  //We can specify a texture path but we default to its type
  loadSprite(texturePath = null) {
    if (texturePath == null) texturePath = contentImages[this.type];

    console.log({texturePath})
    this.texture = PIXI.Texture.from(texturePath);

    this.sprite = new PIXI.Sprite(this.texture);
    this.sprite.anchor.set(0);
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    if (this.width > 0 && this.height > 0) {
      this.sprite.width = this.width;
      this.sprite.height = this.height;
    }
  }

  render = (container) => {
    console.log("render-bug inner");
    if(this.sprite == null) this.loadSprite(
      contentImages[this.type]
    );

    console.log("d1,", {container, sprite: this.sprite})

    container.addChild(this.sprite);

    this.postRender?.(container);
  }

  // Add any additional methods or logic for the Tile class here
}

export default GameSprite;
