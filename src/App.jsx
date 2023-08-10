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

  const [floor, setFloor] = useState([]);
  const [playersDisplay, setPlayersDisplay] = useState([]);
  const [bombsDisplay, setBombsDisplay] = useState([]);

  useEffect(() => {
    setPlayerName(props.name);
  }, []);

  //Scrap phaser, let's try rendering the game itself without it
  useEffect(() => {
    if (room != null)
      setTimeout(() => {
        initializeMap();
      }, 1);
  }, [room]);

  useEffect(() => {
    // update();
  }, [lastUpdate]);

  const update = () => {
    initializeMap();
    renderBombs();
    renderPlayers();
  };

  const initializeMap = () => {
    if (map == null) return;

    console.log({ room });
    const _floor = [];

    const rows = 9;
    const cols = 9;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tile = map.get(`${col},${row}`);
        if (tile == null) continue;
        let tileContents = tile.contents.map((_c) => _c.type);
        console.log(`${col},${row}`, { tile, tileContents });
        const tileValue = tileContents.includes("wall") ? 1 : 0;
        const x = col * renderSize + renderOffset.x;
        const y = row * renderSize + renderOffset.y;
        console.log({ tileValue });
        if (tileValue === 1) {
          _floor.push(
            <Tile key={`${x}-${y}`} tile={`/assets/wall.png`} x={x} y={y}>
              {tileContents.join(",")}
            </Tile>
          );
        } else if (tileValue === 0) {
          _floor.push(
            <Tile key={`${x}-${y}`} tile={`/assets/floor.png`} x={x} y={y}>
              {tileContents.join(",")}
            </Tile>
          );
        } else {
          _floor.push(
            <Tile key={`${x}-${y}`} tile={`/assets/floor.png`} x={x} y={y}>
              {tileContents.join(",")}
            </Tile>
          );
        }
      }
    }

    setFloor(_floor);
  };

  const renderPlayers = () => {
    console.log({ players });
    if (players == null) return;

    const _players = [];
    players.forEach((_player) => {
      console.log({ _player });
      _players.push(
        <Player
          name={_player.name}
          key={_player.name}
          hp={_player.hp}
          x={_player.x * renderSize + renderOffset.x}
          y={_player.y * renderSize + renderOffset.y}
        />
      );
    });

    setPlayersDisplay(_players);
  };

  const renderBombs = () => {
    console.log({ players });
    if (bombs == null) return;

    const _bombs = [];
    bombs.forEach((_bomb) => {
      console.log({ _bomb });
      _bombs.push(
        <Bomb
          key={_bomb.id}
          timer={_bomb.timer}
          exploding={_bomb.state == "exploded"}
          x={_bomb.x * renderSize + renderOffset.x}
          y={_bomb.y * renderSize + renderOffset.y}
        />
      );
    });

    setBombsDisplay(_bombs);
  };
  if (room == null) return <div>Loading...</div>;

  console.log({
    room,
    roomState: room?.state,
  });

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
