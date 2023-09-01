import React, { useContext, useState } from "react";
import { useEffect } from "react";
import AppContext from "../AppContext";
import Bomb from "../classes/Bomb";
import Constants from "../Constants";
import * as PIXI from "pixi.js";

export default function UIHandler() {
  const { playerName, lastUpdate, players, room, container, layerManager } =
    useContext(AppContext);
  const [nameText, setNameText] = useState(null);
  const [bombsText, setBombsText] = useState(null);
  const [countdownText, setCountdownText] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [bgOverlay, setBgOverlay] = useState(null);

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

    updateStateText();
  }, [lastUpdate, initialized]);

  const updateStateText = () => {
    //update countdown state if state is in starting
    if (countdownText == null) return;

    if (room.gameState == "playing") {
      countdownText.text = "";
      bgOverlay.visible = false;
      return;
    }

    if (room.gameState == "waiting") {
      console.log("waiting");
      countdownText.text = "Waiting for players...";
      bgOverlay.visible = true;
      return;
    }

    if (room.gameState != "starting") return;

    const countdown = room.gameStart;

    if (countdown > 0) {
      countdownText.text = `${countdown.toFixed(0)}`;
      bgOverlay.visible = true;
    }
  };

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
    if (players == null) return;

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

    //add overlay to countdown
    const overlay = new PIXI.Graphics();
    overlay.beginFill(0x000000, 0.8);
    overlay.drawRect(
      0,
      0,
      Constants.SCREEN_SIZE.width,
      Constants.SCREEN_SIZE.height
    );
    overlay.endFill();

    uiLayer.addChild(overlay);
    setBgOverlay(overlay);

    //render countdown
    const countdownText = new PIXI.Text(``, {
      fontFamily: "Arial",
      fontSize: 30,
      fill: 0xffffff,
      align: "center",
    });

    //put countdownText in center
    countdownText.x = Constants.SCREEN_SIZE.width / 2 - countdownText.width / 2;
    countdownText.y =
      Constants.SCREEN_SIZE.height / 2 - countdownText.height / 2;
    // Set the anchor point to center the text
    countdownText.anchor.set(0.5); // Centered anchor
    //set pivot to center
    countdownText.pivot.x = countdownText.width / 2;

    setCountdownText(countdownText);
    uiLayer.addChild(countdownText);

    setInitialized(true);
  };

  return <></>;
}
