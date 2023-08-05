import React, { useEffect, useState, useContext } from "react";
import { client, room as roomInstance } from "./Colyseus";
const AppContext = React.createContext({});

export default AppContext;

export const AppContextProvider = (props) => {
  const [room, setRoom] = useState(null);
  const [player, setPlayer] = useState(null);
  const [players, setPlayers] = useState(null);
  const [bombs, setBombs] = useState(null);
  const [map, setMap] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [playerName, setPlayerName] = useState("");

  const [initializedRoom, setInitializedRoom] = useState(false);
  useEffect(() => {
    setRoom(roomInstance);

    if (roomInstance != null) {
      console.log({
        map: roomInstance.state.map,
      });

      roomInstance.onStateChange((state) => {
        console.log("roomStateChanged", { state });
        setRoom(state);
        setPlayers(state.players);
        setMap(state.map);
        setBombs(state.bombs); 
        setLastUpdate(new Date());
      });

      roomInstance.onMessage("game_over", (message) => {
        console.log("game_over", { message });
        alert(`Game Over: player ${message.winner} won!`);
      });
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        room,
        player,
        setPlayer,
        players,
        playerName,
        setPlayerName,
        lastUpdate,
        map,
        bombs,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
