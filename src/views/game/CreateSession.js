import React, { useContext, useState, useEffect } from "react";
import { SocketContext } from "./socket";
import { Button } from "reactstrap";

const CreateSession = (props) => {
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on("init", handleInit);
    socket.on("gameCode", handleGameCode);
  }, []);

  const handleInit = (number) => {
    console.log(number);
    props.playerNumber(number);
  };

  const handleGameCode = (gameCode) => {
    props.gameCode(gameCode);
    props.roomId(makeid);
  };

  const newGame = () => {
    socket.emit("newGame");
  };

  const makeid = () => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center">
        <Button className="btn" color="primary" size="lg" onClick={newGame}>
          Create Sessions
        </Button>
      </div>
    </>
  );
};

export default CreateSession;
