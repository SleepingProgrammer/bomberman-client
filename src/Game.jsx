import React, { useContext, useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import AppContext from "./AppContext";
import Tile from "./classes/Tile";
import Player from "./classes/Player";
import Bomb from "./classes/Bomb";
import LayerManager from "./classes/managers/LayerManager";
import BombHandler from "./handlers/BombHandler";
import UIHandler from "./handlers/UIHandler";
import PlayerHandler from "./handlers/PlayerHandler";
import MapHandler from "./handlers/MapHandler";
import Constants from "./Constants";

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
  const [mapRendered, setMapRendered] = useState(false);

  useEffect(() => {
    // Create a Pixi.js application
    const _app = new PIXI.Application({
      width: Constants.SCREEN_SIZE.width,
      height: Constants.SCREEN_SIZE.height,
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
    }
  }, [room]);

  useEffect(() => { 
  }, [lastUpdate, layerManager]);
 
 
  const updateLoop = () => { 
    //clearLayers();
    initialRender(); 
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

  return (
    <div> 
      <UIHandler />
      <BombHandler />
      <PlayerHandler />
      <MapHandler />
      <div id="pixi-container"></div>
    </div>
  );
};

export default Game;
