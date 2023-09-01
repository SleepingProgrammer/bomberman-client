import Constants from "../Constants";
import GameObject from "./GameObject";
import GameSprite from "./GameSprite";
import Monster from "./Monster";

const tileSize = 100;
const renderSize = 64;
const renderOffset = { x: 2, y: 0 };
class Tile extends GameSprite {
  constructor(options) {
    super(options);
    this.sprites = {};

    this.loadSprite();
  }

  // Add any additional methods or logic for the Tile class here
  //We should render above the tile its contents
  renderContents = (container, contents) => {
    console.log({
      container,
      contents,
    });

    contents.forEach((_object) => {
      if (this.sprites[_object.id]) return;

      if (_object.type != "bomb") {
        if (_object.type != "monster") {
          const pixiObject = new GameObject({
            x:
              this.x +
              Constants.RENDER_OFFSET.x +
              (_object.type == "wall" ? 16 : 0),
            y:
              this.y +
              Constants.RENDER_OFFSET.y +
              (_object.type == "wall" ? 16 : 0),
            type: _object.type,
            width: _object.type == "wall" ? 32 : Constants.TILE_SIZE,
            height: _object.type == "wall" ? 32 : Constants.TILE_SIZE,
          });
          pixiObject.render(container);

          this.sprites[_object.id] = pixiObject;
          return;
        } else {
          const pixiObject = new Monster({
            x: this.x + renderOffset.x,
            y: this.y + renderOffset.y,
            type: _object.type,
            width: renderSize,
            height: renderSize,
          });
          pixiObject.render(container);

          this.sprites[_object.id] = pixiObject;
          return;
        }
      }
    });

    //cleanup objects not in contents anymore
    Object.keys(this.sprites).forEach((key) => {
      if (!contents.find((o) => o.id == key)) {
        this.sprites[key].destroy();
        delete this.sprites[key];
      }
    });
  };
}

export default Tile;
