import GameSprite from "./GameSprite";
import * as PIXI from "pixi.js";

const unitSprites = {
  zombie: {
    walk: "/assets/Zombie/Walk.png",
  },
  monster: {
    walk: "/assets/Zombie/Walk.png",
    frames: 8,
    animationSpeed: 0.2,
  },
};

const frameWidth = 32;
const frameHeight = 32;
const directionRows = ["front", "back", "right", "left"];
class Monster extends GameSprite {
  constructor(options) {
    super(options);

    this.animationSprites = {}; // Store animation sprites here
    this.currentDirection = "front"; // Default direction

    // Load sprite sheet for different directions
    directionRows.forEach((direction) => {
      this.animationSprites[direction] = this.createAnimatedSprite(
        direction,
        options.type
      );
    });

    // Start with the front animation
    this.sprite = this.animationSprites[this.currentDirection];
    this.configureSprite();
  }

  // Create an AnimatedSprite for a specific direction
  createAnimatedSprite(direction, type) {
    const frames = [];
    for (let col = 0; col < unitSprites[type].frames; col++) {
      const x = col * frameWidth;
      const y = directionRows.indexOf(direction) * frameHeight;
      console.log({type})
      const spritesheet = unitSprites[type].walk;

      const frameTexture = new PIXI.Texture(
        PIXI.BaseTexture.from(spritesheet),
        new PIXI.Rectangle(x, y, frameWidth, frameHeight)
      );
      frames.push(frameTexture);
    }

    const animatedSprite = new PIXI.AnimatedSprite(frames);
    animatedSprite.animationSpeed = unitSprites[type].animationSpeed || .1;
    animatedSprite.loop = true;

    animatedSprite.play(); // Start playing the animation

    return animatedSprite;
  }

  update(data) {
    // Update the position
    this.x = data.x;
    this.y = data.y;

    // Update the animation
    this.updateAnimation();

  }

  // Update the animation based on the direction
  updateAnimation() {
    this.sprite.anchor.set(0);

    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite = this.animationSprites[this.currentDirection];

    if (this.width > 0 && this.height > 0) {
      this.sprite.width = this.width;
      this.sprite.height = this.height;
    }
  }
}

export default Monster;
