import React, { useEffect, useState, useContext } from "react";
import { client, room as roomInstance } from "./Colyseus";
const AppContext = React.createContext({});

export default AppContext;

export const AppContextProvider = (props) => {
  const [room, setRoom] = useState(null); //NOTE: ROOM IS ACTUALLY ROOM.STATE already
  const [player, setPlayer] = useState(null);
  const [players, setPlayers] = useState(null);
  const [game, setGame] = useState(null)
  const [container, setContainer] = useState(null);
  const [bombs, setBombs] = useState(null);
  const [map, setMap] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [playerName, setPlayerName] = useState("");
  const [layerManager, setLayerManager] = useState(null)


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
  
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        game, container, setContainer, setGame,
        room,
        player,
        setPlayer,
        players,
        playerName,
        setPlayerName,
        lastUpdate,
        map,
        bombs,
        layerManager,
        setLayerManager, 

      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
