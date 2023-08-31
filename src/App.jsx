import { useState } from "react";
import "./App.css";
import { useEffect } from "react";
import "colyseus.js";
import GlobalInputListener from "./GlobalInputListener";
import { useContext } from "react";
import AppContext from "./AppContext";
import { room as colyseusRoom } from "./Colyseus";
import Game from "./Game";

const tileSize = 64;
const renderSize = 64;
const renderOffset = { x: 2, y: 2 };

function Cell(props) {
  return (
    <div
      style={{
        width: tileSize,
        height: tileSize,
        backgroundColor: "black",
        position: "absolute",
        left: props.x,
        top: props.y,
        ...props.style,
      }}
    >
      {props.children}
    </div>
  );
}

function Bomb(props) {
  const explosionColor = "rgba(255,0,0,0.5)";

  return (
    <Cell
      x={props.x}
      y={props.y}
      style={{
        border: "solid 1px red",
        borderRadius: 10,
      }}
    >
      {props.exploding && (
        <>
          <Cell
            x={0}
            y={tileSize}
            style={{
              backgroundColor: explosionColor,
            }}
          />
          <Cell
            x={0}
            y={-tileSize}
            style={{
              backgroundColor: explosionColor,
            }}
          />
          <Cell
            x={tileSize}
            y={0}
            style={{
              backgroundColor: explosionColor,
            }}
          />
          <Cell
            x={-tileSize}
            y={0}
            style={{
              backgroundColor: explosionColor,
            }}
          />
        </>
      )}
      {props.timer}
    </Cell>
  );
}

function Tile(props) {
  return (
    <div
      style={{
        width: tileSize,
        height: tileSize,
        backgroundImage: `url(${props.tile})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        position: "absolute",
        left: props.x,
        top: props.y,
        wordWrap: "break-word",
      }}
    >
      {Math.floor(props.x / tileSize)},{Math.floor(props.y / tileSize)}
      <br />
      {props.children}
    </div>
  );
}

function Player(props) {
  const { playerName } = useContext(AppContext);
  return (
    <div
      style={{
        width: tileSize,
        height: tileSize,
        backgroundColor:
          playerName == props.name ? "rgba(0,255,0,.8)" : "rgba(255,0,0,.8)",
        position: "absolute",
        left: props.x,
        top: props.y,
      }}
    >
      {props.name}➕{props.hp}
    </div>
  );
}
function App(props) {
  const { room, players, map, bombs, lastUpdate, setPlayerName } =
    useContext(AppContext);
 
  useEffect(() => {
    setPlayerName(props.name);
  }, []); 

  return (
    <div>
      <GlobalInputListener /> <Game />
      <h1> State: {room?.gameState}</h1>
      <button
        type="button"
        onClick={() => {
          colyseusRoom.send("restart");
        }}
      >
        Restart
      </button>
    </div>
  );
}

export default App;
