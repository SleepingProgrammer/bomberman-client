import * as PIXI from "pixi.js";

class GameSprite {
  constructor({x, y, texturePath = null, width = 0, height = 0}) {
    this.x = x;
    this.y = y; 
    this.width = width;
    this.height = height;
   
    if(texturePath) {
      this.loadSprite(texturePath);
    }
  }

  loadSprite(texturePath) {
    
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
  
  render(container) {
    container.addChild(this.sprite);
  }

  // Add any additional methods or logic for the Tile class here
}

export default GameSprite;
