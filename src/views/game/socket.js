import React from "react";

// export const socket = window.io.connect("http://localhost:8000/");
export const socket = window.io.connect(
  "https://hungry-snake101.herokuapp.com/"
);
export const SocketContext = React.createContext();
