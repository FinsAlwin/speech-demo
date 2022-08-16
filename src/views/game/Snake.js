import React, { useState, useEffect, useContext } from "react";
import {
  Row,
  Col,
  Card,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import { SocketContext } from "./socket";
const BG_COLOUR = "#231f20";
const SNAKE_COLOUR = "#c2c2c2";
const FOOD_COLOUR = "#e66916";

const Snake = (props) => {
  let canvas, ctx;
  const [playerNumber, setPlayerNumber] = useState(props.player);
  const [gameCode, setGameCode] = useState(props.game);
  const [gameActive, setGameActive] = useState(false);
  const [state, setState] = useState();
  const [gameOver, setGameOver] = useState(false);

  const socket = useContext(SocketContext);

  useEffect(() => {
    setPlayerNumber(props.player);
    setGameCode(props.game);

    if (playerNumber && gameCode) {
      init();
    }

    if (props.sessionId) {
      joinGame();
    }
  }, [playerNumber, gameCode]);

  useEffect(() => {
    init();
    socket.on("gameState", handleGameState);
    socket.on("gameOver", handleGameOver);
    socket.on("unknownCode", handleUnknownCode);
    socket.on("tooManyPlayers", handleTooManyPlayers);
    socket.on("reset", restartGame);
  }, [gameActive]);

  const init = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = canvas.height = 350;
    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.addEventListener("keydown", keydown);
    setGameActive(true);
  };

  const keydown = (e) => {
    socket.emit("keydown", e.keyCode);
  };

  const joinGame = () => {
    socket.emit("joinGame", gameCode);
    init();
  };

  const restartGame = (data) => {
    if (props.sessionId) {
      joinGame();
      window.location.reload();
    }
  };

  const paintGame = (state) => {
    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const food = state.food;
    const gridsize = state.gridsize;
    const size = canvas.width / gridsize;

    ctx.fillStyle = FOOD_COLOUR;
    ctx.fillRect(food.x * size, food.y * size, size, size);

    // paintPlayer(state.players[0], size, SNAKE_COLOUR);
    paintPlayer(state.players[1], size, "red");
  };

  const paintPlayer = (playerState, size, colour) => {
    const snake = playerState.snake;

    ctx.fillStyle = colour;
    for (let cell of snake) {
      ctx.fillRect(cell.x * size, cell.y * size, size, size);
    }
  };

  const handleGameState = (gameState) => {
    if (!gameActive) {
      return;
    }
    setState(JSON.parse(gameState));
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => paintGame(gameState));
  };

  const handleGameOver = async (data) => {
    if (!gameActive) {
      return;
    }
    data = JSON.parse(data);

    if (data.winner === 1) {
      setGameOver(true);
    }
  };

  const handleUnknownCode = () => {
    reset();
  };

  const handleTooManyPlayers = () => {
    reset();
  };

  const reset = () => {
    setPlayerNumber();
    setGameCode();
  };

  const resetGame = () => {
    socket.emit("gameReset", { gameCode });
    setGameOver(false);
    init();
  };

  return (
    <>
      <Container>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <h5>
            Total Points: <span>{state?.players[1]?.points}</span>
          </h5>
          <canvas id="canvas"></canvas>
          {gameOver && (
            <>
              {playerNumber === 1 && (
                <>
                  <Button onClick={resetGame}>Reset</Button>
                </>
              )}
            </>
          )}
        </div>
      </Container>
    </>
  );
};

export default Snake;
