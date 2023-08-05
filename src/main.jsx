window.global ||= window;
import React, { StrictMode } from "react";
import { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AppContextProvider } from "./AppContext.jsx";
import CacheHelper from "./CacheHelper.js";
import { joinServer } from "./Colyseus.js";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

function MenuScreen() {
  const [name, setName] = useState(CacheHelper.loadFromSession("USERNAME", ""));

  return (
    <div>
      <input
        type={"text"}
        placeholder={"Enter your name"}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          CacheHelper.saveToSession("USERNAME", e.target.value);
        }}
      />
      <button
        onClick={() => {
          console.log("Joining server");
          root.render(
            <div>
              <div>Connecting to the server...</div>
            </div>
          );
          joinServer(name)
            .then(() => {
              console.log("Successfully joined");
              root.render(
                <AppContextProvider>
                  <App name={name}/>
                </AppContextProvider>
              );
            })
            .catch((e) => {
              console.error(e);
              root.render(
                <div style={errorStyle}>
                  <h2>Network failure!</h2>
                  <h3>Is your server running?</h3>
                </div>
              );
            });
        }}
      >
        Join
      </button>
    </div>
  );
}

root.render(
  <div>
    <MenuScreen />
  </div>
);
