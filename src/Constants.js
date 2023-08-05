const Constants = {};

const buildMode = import.meta.env.VITE_BUILD_ENVIRONMENT;

//LOCAL is default
Constants.COLYSEUS_SERVER = "ws://localhost:8080";
Constants.COLYSEUS_SERVER = "ws://192.81.132.252:8080";
Constants.ROOM_NAME = "bomberman_room";

if (buildMode === "STAGE") {
  Constants.COLYSEUS_SERVER = "ws://192.81.132.252:8080";
}

export default Constants;
