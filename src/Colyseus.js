import * as Colyseus from "colyseus.js"; // not necessary if included via <script> tag.
import CacheHelper from "./CacheHelper";

let client = new Colyseus.Client("ws://localhost:8080");
window.client = client;
console.log({ client });
let room = null;

export const joinGame = async (username) => {
  let existingRoom = CacheHelper.loadFromSession("ROOM_ID", null);
  if (existingRoom) {
    try {
      room = await client.reconnect(existingRoom);
      console.log("Rejoin done", {
        client,
        room,
      });
    } catch (error) {
      console.log("Rejoin failed", error);
      CacheHelper.removeFromSession("ROOM_ID");
      return await joinGame(username);
    }
  } else {
    try {
      console.log("No existing room to rejoin");
      room = await client.joinOrCreate("bomberman_room", {
        username,
        autoDispose: true,
      });
      console.log("Join mid");
      CacheHelper.saveToSession("ROOM_ID", room.sessionId);
    } catch (error) {
      console.log("join failed", error);
    }
  }
  return room;
};

export const joinServer = function (username) {
  return new Promise((resolve, reject) => {
    console.log("Join started");
    joinGame(username)
      .then((_room) => {
        room = _room;

        resolve(room);
        console.log("Join done", {
          client,
          room,
        });
      })
      .catch((err) => reject(err));
  });
};

export { client, room };
