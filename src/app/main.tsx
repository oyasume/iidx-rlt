import React from "react";
import ReactDOM from "react-dom/client";
import Tool from "../Tool";
import { LocalStorage } from "../storage/localStorage";

const storage = new LocalStorage();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Tool tickets={[]} storage={storage} songsJsonUrl="data/songs.json" />
  </React.StrictMode>
);
