import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./lobby.css";
const Lobby = () => {
  const navigate = useNavigate();
  const [room, setRoom] = useState("");

  const handleRoom = (e) => {
    setRoom(e.target.value);
  };

  const handleJoinRoom = () => {
    if (room) navigate(`/call/${room}`);
  };
  return (
    <main id="lobby-container">
      <div id="form-container">
        <div id="form__container__header">
          <p>Create OR Join a Room</p>
        </div>

        <div id="form__content__wrapper">
          <form id="join-form">
            <input
              type="text"
              name="invite_link"
              required
              value={room}
              onChange={handleRoom}
            />
            <input type="submit" value="Join Room" onClick={handleJoinRoom} />
          </form>
        </div>
      </div>
    </main>
  );
};

export default Lobby;
