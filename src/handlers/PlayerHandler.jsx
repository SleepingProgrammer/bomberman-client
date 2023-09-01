import React, { useContext, useState } from "react";
import { useEffect } from "react";
import AppContext from "../AppContext";
import Bomb from "../classes/Bomb";
import Constants from "../Constants";
import * as PIXI from "pixi.js";
import Player from "../classes/Player";

export default function PlayerHandler() {
  const { playerName, lastUpdate, players, room, container, layerManager } =
    useContext(AppContext);

  const [playerChanges, setPlayerChanges] = useState([]);
  const [playerSprites, setPlayerSprites] = useState({});

  useEffect(() => {
    if (layerManager != null) updateLoop();
  }, [lastUpdate, layerManager]);

  useEffect(() => {
    if (layerManager != null) renderChanges();
  }, [playerChanges, layerManager]);

  const updateLoop = () => {
    renderPlayers();
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

  const renderPlayers = () => {
    if (players == null) return;
    const _playerChanges = [];

    players.forEach((_player) => {
      // Process player changes and push to playerChanges array
      const playerType = playerName == _player.name ? "player" : "enemy";
      const playerChange = {
        name: _player.name,
        x: _player.x * Constants.TILE_SIZE + Constants.RENDER_OFFSET.x,
        y: _player.y * Constants.TILE_SIZE,
        type: playerType,
        width: Constants.TILE_SIZE - Constants.RENDER_OFFSET.x / 2,
        height: Constants.TILE_SIZE,
      };
      _playerChanges.push(playerChange);
    });

    console.log({
      _playerChanges,
    });

    setPlayerChanges(_playerChanges);
  };

  return <></>;
}
