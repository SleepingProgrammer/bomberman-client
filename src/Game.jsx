import React, { useContext, useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import AppContext from "./AppContext";
import Tile from "./classes/Tile";
import Player from "./classes/Player";
import Bomb from "./classes/Bomb";

const tileSize = 100;
const renderSize = 64;
const renderOffset = { x: 2, y: 0 };

const Game = () => {
  const {
    game,
    container,
    players,
    setContainer,
    playerName,
    bombs,
    lastUpdate,
    setGame,
    room,
    map,
  } = useContext(AppContext);

  useEffect(() => {
    // Create a Pixi.js application
    const _app = new PIXI.Application({
      width: 576,
      height: 576,
      backgroundColor: 0xaaaaaa,
    });

    // Append the Pixi.js canvas to the component's DOM element
    document.getElementById("pixi-container").appendChild(_app.view);

    // Create a rotating sprite
    const sprite = PIXI.Sprite.from("/assets/wall.png");
    sprite.anchor.set(0.5);
    sprite.x = _app.screen.width / 2;
    sprite.y = _app.screen.height / 2;
    _app.stage.addChild(sprite);

    // Animation loop
    _app.ticker.add(() => {
      sprite.rotation += 0.01;
    });

    // Save app and container to state
    setGame(_app);
    setContainer(_app.stage);

    // Clean up when component unmounts
    return () => {
      game.destroy();
    };
  }, []);

  useEffect(() => {
    updateLoop();
  }, [lastUpdate]);

  const updateLoop = () => {
    console.log("updateLoop");
    initializeMap();
    renderBombs();
    renderPlayers();
  };

  const initializeMap = () => {
    if (map == null) return;

    console.log({ room });
    container.removeChildren();

    const rows = 9;
    const cols = 9;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tile = map.get(`${col},${row}`);
        if (tile == null) continue;
        let tileContents = tile.contents.map((_c) => _c.type);
        console.log(`${col},${row}`, { tile, tileContents });
        const tileValue = tileContents.includes("wall") ? 1 : 0;
        const x = col * renderSize;
        const y = row * renderSize;
        console.log({ tileValue });

        // Create a Tile instance and add it to the container
        const tileType = tileValue === 1 ? "wall" : "floor";

        const tileInstance = new Tile({
          x,
          y,
          type: tileType,
          width: renderSize,
          height: renderSize,
        });

        tileInstance.render(container);
      }
    }
  };

  const renderPlayers = () => {
    if (players == null) return;

    players.forEach((_player) => {
      // Create a Tile instance and add it to the container
      const playerType = playerName == _player.name ? "player" : "enemy";

      const _playerInstance = new Player({
        x: _player.x * renderSize + renderOffset.x,
        y: _player.y * renderSize,
        type: playerType,
        width: renderSize - renderOffset.x / 2,
        height: renderSize,
      });

      _playerInstance.render(container);
    });
  };

  const renderBombs = () => {
    if (bombs == null) return;

    bombs.forEach((_bomb) => {
      console.log({ _bomb });
      // Create a Tile instance and add it to the container
      const _bombInstance = new Bomb({
        x: _bomb.x * renderSize + renderOffset.x,
        y: _bomb.y * renderSize,
        state: _bomb.state,
        width: renderSize - renderOffset.x / 2,
        height: renderSize,
        container,
      });

      _bombInstance.render(container);
    });
  };

  return <div id="pixi-container"></div>;
};

export default Game;
