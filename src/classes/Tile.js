import GameObject from "./GameObject";
import GameSprite from "./GameSprite";

const tileSize = 100;
const renderSize = 64;
const renderOffset = { x: 2, y: 0 };
class Tile extends GameSprite {
  constructor(options) {
    super(options);
    this.contents = options.contents || [];

    this.postRender = this.renderContents;
    this.loadSprite();
  }

  // Add any additional methods or logic for the Tile class here
  //We should render above the tile its contents
  renderContents = (container) => { 
    this.contents.forEach((_object) => { 

      //If object isn't a bomb, let's render it
      if (_object != "bomb") {
        const pixiObject = new GameObject({
          x: this.x + renderOffset.x,
          y: this.y + renderOffset.y,
          type: _object,
          width: renderSize,
          height: renderSize,
        });
        pixiObject.render(container);
        return;
      } 
    });
  }
}

export default Tile;
