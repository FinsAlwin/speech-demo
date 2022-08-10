import React, { useState, useEffect } from "react";
import Call from "./call";
import Lobby from "./lobby";
import { useParams } from "react-router-dom";

const Main = () => {
  let { roomId } = useParams();

  return (
    <>
      {roomId && <Call />}
      {!roomId && <Lobby />}
    </>
  );
};

export default Main;
