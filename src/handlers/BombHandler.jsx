import React, { useContext, useState } from "react";
import { useEffect } from "react";
import AppContext from "../AppContext";
import Bomb from "../classes/Bomb";
import Constants from "../Constants";

export default function BombHandler(props) {
  const { container, layerManager, room } = useContext(AppContext);

  const [bombSprites, setBombSprites] = useState({});

  const [eventsBound, setEventsBound] = useState(false);

  useEffect(() => {
    if (room == null) return;

    if (layerManager == null) return;

    if (container == null) return;

    if (!eventsBound) bindEvents();
  }, [room, layerManager]);

  const bindEvents = () => {
    if (eventsBound) return;

    if (room == null) return;

    room.onMessage("bomb_cleared", (message) => {
      try {
        console.log("bomb_cleared", { message });
        onBombRemoved(message.bombId);
      } catch (error) {
        console.error("bomb_cleared", {
          error,
        });
      }
    });

    room.onMessage("bomb_planted", (message) => {
      try {
        console.log("bomb_planted", { message });
        onBombPlanted(message.bomb);
      } catch (error) {
        console.error("bomb_planted", {
          error,
        });
      }
    });

    room.onMessage("bomb_updated", (message) => {
      try {
        console.log("bomb_updated", { message });
        onBombUpdated(message.bomb);
      } catch (error) {
        console.error("bomb_updated", {
          error,
        });
      }
    });

    setEventsBound(true);
  };

  const onBombPlanted = (bomb) => {
    if (bomb == null) return;

    const { id, x, y } = bomb;

    console.log("bomb_planted", { bomb });

    const bombLayer = layerManager.getLayer("object");
    if (bombLayer == null) return;

    const _bombSprites = bombSprites;
    const _bombSprite = new Bomb({
      ...bomb,
      x: bomb.x * Constants.TILE_SIZE + Constants.RENDER_OFFSET.x,
      y: bomb.y * Constants.TILE_SIZE,
      state: bomb.state,
      width: Constants.TILE_SIZE - Constants.RENDER_OFFSET.x / 2,
      height: Constants.TILE_SIZE,
      blastContainer: layerManager.getLayer("blast"),
    });
    _bombSprite.render(bombLayer);

    console.log("bomb_planted 1", {
      bomb,
    });
    _bombSprites[bomb.id] = _bombSprite;
    setBombSprites(_bombSprites);
  };

  const onBombUpdated = (bomb) => {
    const bombSprite = bombSprites[bomb.id];

    if (bombSprite == null) return;

    console.log("bomb_updated 2", { bomb, bombSprite });
    bombSprite.update({
      x: bomb.x * Constants.TILE_SIZE + Constants.RENDER_OFFSET.x,
      y: bomb.y * Constants.TILE_SIZE,

      width: Constants.TILE_SIZE - Constants.RENDER_OFFSET.x / 2,
      height: Constants.TILE_SIZE,
      state: bomb.state,
      blastContainer: layerManager.getLayer("blast"),
    });
  };

  const onBombRemoved = (bombId) => {
    if (bombId == null) return;

    const bombSprite = bombSprites[bombId];
    console.log("bomb_cleared onBombRemoved", {
      bombId,
      bombSprite,
      bombSprites,
    });

    if (bombSprite != null) {
      bombSprite.destroy();
      const _bombSprites = bombSprites;
      delete _bombSprites[bombId];
      setBombSprites(_bombSprites);
    }
  };

  return <></>;
}
