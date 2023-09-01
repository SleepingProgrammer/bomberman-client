import React, { useContext, useState } from "react";
import { useEffect } from "react";
import AppContext from "../AppContext";
import Bomb from "../classes/Bomb";
import Constants from "../Constants";
import * as PIXI from "pixi.js";
import Player from "../classes/Player";
import Tile from "../classes/Tile";

export default function MapHandler() {
  const { playerName, lastUpdate, map, room, container, layerManager } =
    useContext(AppContext);

  const [mapTiles, setMapTiles] = useState(new Map());
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    // if (layerManager != null) updateLoop();

    if (!mapInitialized) renderMap();

    if (mapInitialized) renderContents();
  }, [map, lastUpdate, mapTiles, mapInitialized]);

  const renderMap = () => {
    console.log("start render map", { map });
    if (map == null) return;

    container.removeChildren();

    const rows = 9;
    const cols = 9;

    const floorLayer = layerManager.getLayer("floor");

    const _mapTiles = new Map();
    console.log({ floorLayer });
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tile = map.get(`${col},${row}`);
        if (tile == null) continue;
        const x = col * Constants.TILE_SIZE;
        const y = row * Constants.TILE_SIZE;

        const tileInstance = new Tile({
          x,
          y,
          type: "floor",
          width: Constants.TILE_SIZE,
          height: Constants.TILE_SIZE,
        });
        tileInstance.render(floorLayer);

        _mapTiles.set(`${col},${row}`, tileInstance);
      }
    }

    setMapTiles(_mapTiles);
    setMapInitialized(true);

    console.log("map rendered");
  };

  const renderContents = () => {
    const objectLayer = layerManager.getLayer("object");
    if (objectLayer == null) return;

    //render objects on object layer unless wall
    console.log({
      mapTiles,
    });

    for (const [coords, tile] of mapTiles) {
        console.log({ coords, tile });
  
      if (tile == null) return;

      const { x, y } = tile;
      const tileData = map.get(coords);
      if (tileData == null) return;

      console.log({ tileData });

      tile.renderContents(objectLayer, tileData.contents);
    }
  };

  return <></>;
}
