import React, { Component, useContext } from "react";
import { useEffect } from "react";
import AppContext from "./AppContext";
import KeyBindings from "./KeyBindings";
import { room } from "./Colyseus";
function GlobalInputListener() {

  useEffect(() => {
      document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleKeyPress = (event) => {
    // Handle your input event here
    console.log({room})
    console.log("Key pressed:", event.key);
    let action = KeyBindings[event.key.toLowerCase()];
    console.log({ action });
    if (action) {
      room.send("action", action);
    }
  };

  return <></>;
}

export default GlobalInputListener;
