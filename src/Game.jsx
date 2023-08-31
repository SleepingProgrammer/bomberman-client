import React, { useContext, useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import AppContext from "./AppContext";
import Tile from "./classes/Tile";
import Player from "./classes/Player";
import Bomb from "./classes/Bomb";
import LayerManager from "./classes/managers/LayerManager";
import BombHandler from "./handlers/BombHandler";
import UIHandler from "./handlers/UIHandler";

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
    layerManager,
    setLayerManager,
  } = useContext(AppContext);

  const [playerChanges, setPlayerChanges] = useState([]);
  const [playerSprites, setPlayerSprites] = useState({});
  const [bombSprites, setBombSprites] = useState({});

  const [eventsBound, setEventsBound] = useState(false);

  useEffect(() => {
    // Create a Pixi.js application
    const _app = new PIXI.Application({
      width: 576,
      height: 576,
      backgroundColor: 0xaaaaaa,
    });

    const _layerManager = new LayerManager(_app);
    // Append the Pixi.js canvas to the component's DOM element
    document.getElementById("pixi-container").appendChild(_app.view);

    // Create a rotating sprite
    // const sprite = PIXI.Sprite.from("/assets/wall.png");
    // sprite.anchor.set(0.5);
    // sprite.x = _app.screen.width / 2;
    // sprite.y = _app.screen.height / 2;
    // _app.stage.addChild(sprite);

    // // Animation loop
    // _app.ticker.add(() => {
    //   sprite.rotation += 0.01;
    // });

    //Create the layers
    _app.ticker.add(() => {
      _layerManager.renderLayers(_app.stage);
      _app.renderer.render(_app.stage);
    });

    //Floor layer
    _layerManager.createLayer("floor", 0);
    //Object layer
    _layerManager.createLayer("object", 1);
    //Player layer
    _layerManager.createLayer("player", 2);
    //Blast layer
    _layerManager.createLayer("blast", 5);
    //Wall layer
    _layerManager.createLayer("wall", 10);
    //UI layer
    _layerManager.createLayer("ui", 100);

    //render layers
    _layerManager.renderLayers(_app.stage);

    // Save app and container to state
    setGame(_app);
    setContainer(_app.stage);
    setLayerManager(_layerManager);

    // Clean up when component unmounts
    return () => {
      game.destroy();
    };
  }, []);

  useEffect(() => {
    if (room == null) return;

    if (!eventsBound) {
      bindEvents();
      initialRender();
    }
  }, [room]);

  useEffect(() => {
    if (layerManager != null) updateLoop();
  }, [lastUpdate, layerManager]);

  useEffect(() => {
    if (layerManager != null) renderChanges();
  }, [playerChanges, layerManager]);

  const initialRender = () => {
    renderMap(); 
  };

  const updateLoop = () => {
    console.log("updateLoop");
    //clearLayers();
    initialRender();
    renderPlayers();
  };

  const bindEvents = () => {
    if (eventsBound) return;

    if (room == null) return;

    room.onMessage("game_over", (message) => {
      console.log("game_over", { message });
      alert(`Game Over: player ${message.winner} won!`);
    });

    setEventsBound(true);
  };

  const renderChanges = () => {
    if (layerManager == null) return;

    const playerLayer = layerManager.getLayer("player");
    if (playerLayer == null) return;

    //render player changes
    playerChanges.forEach((_playerChange) => {
      const playerSprite = playerSprites[_playerChange.name];
      if (playerSprite == null) {
        const _playerSprites = playerSprites;
        const _playerSprite = new Player(_playerChange);
        _playerSprite.render(playerLayer);
        _playerSprites[_playerChange.name] = _playerSprite;
        setPlayerSprites(_playerSprites);
      } else {
        playerSprite.update(_playerChange);
      }
    });
  };

  const clearLayers = () => {
    if (layerManager == null) return;

    layerManager.clearLayers();
  };
 
  const renderLayers = () => {
    if (layerManager == null) return;
  };

  const renderMap = () => {
    if (map == null) return;

    console.log({ room });
    container.removeChildren();

    const rows = 9;
    const cols = 9;

    const floorLayer = layerManager.getLayer("floor");

    console.log({ floorLayer });
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tile = map.get(`${col},${row}`);
        if (tile == null) continue;
        let tileContents = tile.contents.map((_c) => _c.type); 
        const x = col * renderSize;
        const y = row * renderSize;

        const tileInstance = new Tile({
          x,
          y,
          type: "floor",
          width: renderSize,
          height: renderSize,
          contents: tileContents,
        });
        tileInstance.render(floorLayer);
        // tileInstance.render(container);
      }
    }
  };

  const renderPlayers = () => {
    if (players == null) return;
    const _playerChanges = [];

    players.forEach((_player) => {
      // Process player changes and push to playerChanges array
      const playerType = playerName == _player.name ? "player" : "enemy";
      const playerChange = {
        name: _player.name,
        x: _player.x * renderSize + renderOffset.x,
        y: _player.y * renderSize,
        type: playerType,
        width: renderSize - renderOffset.x / 2,
        height: renderSize,
      };
      _playerChanges.push(playerChange);
    });

    console.log({
      _playerChanges,
    });

    setPlayerChanges(_playerChanges);
  };
  return (
    <div> 
      <UIHandler />
      <BombHandler />
      <div id="pixi-container"></div>
    </div>
  );
};

export default Game;
