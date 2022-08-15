import React, { useRef, useEffect, useState } from "react";
import { SocketContext, socket } from "./socket";
import { useParams } from "react-router-dom";
import CreateSession from "./CreateSession";
import VideoCall from "../videoCall/videoCall";
import Snake from "./Snake";
import { Row, Col, Card, FormGroup, Label, Input } from "reactstrap";
import Analysis from "../videoCall/analysis";

const GameSession = () => {
  const { sessionId, roomId } = useParams();
  const [playerNumber, setPlayerNumber] = useState();
  const [room, setRoomId] = useState();
  const [gameCode, setGameCode] = useState();
  const [stream, setStream] = useState(false);

  const handlePlayer = (e) => {
    setPlayerNumber(e);
  };

  const handleGameCode = (e) => {
    setGameCode(e);
  };

  const handleRoom = (e) => {
    setRoomId(e);
  };

  const handleRemoteStream = (e) => {
    setStream(e);
  };

  return (
    <SocketContext.Provider value={socket}>
      {!sessionId && (
        <>
          {!gameCode && (
            <>
              <CreateSession
                playerNumber={handlePlayer}
                gameCode={handleGameCode}
                roomId={handleRoom}
              />
            </>
          )}
          {gameCode && (
            <>
              <Row>
                <Col md="6" lg="6">
                  <VideoCall roomId={room} s={handleRemoteStream} />
                </Col>
              </Row>
              <hr />
              &nbsp;
              <Row>
                <Col md="6" lg="6">
                  <Card body color="danger" inverse>
                    <Snake player={playerNumber} game={gameCode} />
                    <FormGroup>
                      <Label for="exampleEmail">Game Link</Label>
                      <Input
                        id="exampleEmail"
                        name="email"
                        value={`${window.location.href}/${gameCode}/${room}`}
                        placeholder="with a placeholder"
                        type="text"
                      />
                    </FormGroup>
                  </Card>

                  {/* <span>{`${window.location.href}/${gameCode}`}</span> */}
                </Col>

                <Col md="6" lg="6">
                  {stream && <Analysis rs={stream} />}
                </Col>
              </Row>
            </>
          )}
        </>
      )}
      {sessionId && roomId && (
        <>
          <Row>
            <VideoCall roomId={roomId} s={handleRemoteStream} />
          </Row>
          <hr />
          &nbsp;
          <Row>
            <Card body color="success" inverse>
              <Snake
                player={playerNumber}
                game={sessionId}
                sessionId={sessionId}
              />
            </Card>
          </Row>
        </>
      )}
    </SocketContext.Provider>
  );
};

export default GameSession;
