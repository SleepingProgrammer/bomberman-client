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
    console.log({
      renderingContents: this.contents,
    })
    this.contents.forEach((_object) => { 
      console.log({
        _object
      })
      const pixiObject = new GameObject({
        x: this.x,
        y: this.y,
        type: _object,
        width: renderSize,
        height: renderSize, 
      });
      pixiObject.render(container);
    });
  }
}

export default Tile;
