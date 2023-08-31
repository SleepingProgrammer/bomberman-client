import React, { useContext, useState } from "react";
import { useEffect } from "react";
import AppContext from "../AppContext";
import Bomb from "../classes/Bomb";
import Constants from "../Constants";
import * as PIXI from "pixi.js";

export default function UIHandler() {
  const { playerName, 
    lastUpdate, players, room, container, layerManager } =
    useContext(AppContext);
  const [nameText, setNameText] = useState(null);
  const [bombsText, setBombsText] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (room == null) return;

    if (layerManager == null) return;

    if (container == null) return;

    if (initialized) return;

    initialize();
  }, [room, layerManager]);

  useEffect(() => {
    if (players == null) return;

    const player = players.get(playerName);
    if (player == null) return;

    console.log({ player });

    const bombCount = player.maxBombs;
    updateBombs(bombCount);
  }, [lastUpdate]);

  const updateBombs = (bombCount) => {
    if (bombsText == null) return;

    bombsText.text = `Bombs: ${bombCount}`;
  };

  const initialize = () => {
    const uiLayer = layerManager.getLayer("ui");
    if (uiLayer == null) return;

    //render name
    const _nameText = new PIXI.Text(playerName, {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xff0000,
      align: "center",
    });
    _nameText.x = 5;
    _nameText.y = 5;

    setNameText(_nameText);

    uiLayer.addChild(_nameText);

    //get player
    if(players == null) return;

    const player = players.get(playerName);
    if (player == null) return;

    console.log({ player });

    const bombCount = player.maxBombs;
    const bombText = new PIXI.Text(`Bombs: ${bombCount}`, {
      fontFamily: "Arial",
      fontSize: 18,
      fill: 0xff0000,
      align: "center",
    });

    bombText.x = 5;
    bombText.y = 30;

    setBombsText(bombText);
    uiLayer.addChild(bombText);

    setInitialized(true);
  };
 
  return <></>;
}
