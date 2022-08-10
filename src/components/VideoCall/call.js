import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./main.css";
import Camera from "../../assets/icons/camera.png";
import mic from "../../assets/icons/mic.png";
import phone from "../../assets/icons/phone.png";
import { FaceMesh } from "@mediapipe/face_mesh";
import * as Facemesh from "@mediapipe/face_mesh";

let APP_ID = "7d1754924930464fb10e4130707ee1d6";

let token = null;
let uid = String(Math.floor(Math.random() * 10000));

let client;
let channel;

let localStream;
let remoteStream;
let peerConnection;

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
};

let constraints = {
  video: {
    width: { min: 640, ideal: 1920, max: 1920 },
    height: { min: 480, ideal: 1080, max: 1080 },
  },
  audio: true,
};

const Call = () => {
  const { roomId } = useParams();
  const canvasRef = useRef(null);
  const connect = window.drawConnectors;

  useEffect(async () => {
    client = window.AgoraRTM.createInstance(APP_ID, {
      enableLogUpload: false,
    }); // Pass your App ID here.
    await client.login({ uid, token });

    channel = client.createChannel(roomId);
    await channel.join();

    channel.on("MemberJoined", handleUserJoined);
    channel.on("MemberLeft", handleUserLeft);

    client.on("MessageFromPeer", handleMessageFromPeer);

    localStream = await navigator.mediaDevices.getUserMedia(constraints);
    document.getElementById("user-1").srcObject = localStream;
  });

  const handleUserLeft = (MemberId) => {
    document.getElementById("user-2").style.display = "none";
    document.getElementById("user-1").classList.remove("smallFrame");
  };

  const handleMessageFromPeer = async (message, MemberId) => {
    message = JSON.parse(message.text);

    if (message.type === "offer") {
      createAnswer(MemberId, message.offer);
    }

    if (message.type === "answer") {
      addAnswer(message.answer);
    }

    if (message.type === "candidate") {
      if (peerConnection) {
        peerConnection.addIceCandidate(message.candidate);
      }
    }
  };

  const handleUserJoined = async (MemberId) => {
    console.log("A new user joined the channel:", MemberId);
    createOffer(MemberId);
  };

  const createPeerConnection = async (MemberId) => {
    peerConnection = new RTCPeerConnection(servers);

    remoteStream = new MediaStream();
    document.getElementById("user-2").srcObject = remoteStream;
    document.getElementById("user-2").style.display = "none";

    document.getElementById("user-1").classList.add("smallFrame");

    if (!localStream) {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      document.getElementById("user-1").srcObject = localStream;
    }

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });

      if (remoteStream.active) {
        const faceMesh = new FaceMesh({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
          },
        });
        faceMesh.setOptions({
          maxNumFaces: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        faceMesh.onResults(onResults);
        async function onFrame() {
          if (
            !document.getElementById("user-2").paused &&
            !document.getElementById("user-2").ended
          ) {
            await faceMesh.send({
              image: document.getElementById("user-2"),
            });
            // https://stackoverflow.com/questions/65144038/how-to-use-requestanimationframe-with-promise
            await new Promise(requestAnimationFrame);
            onFrame();
          } else setTimeout(onFrame, 500);
        }
        document.getElementById("user-2").play();
        onFrame();
      }
    };

    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        client.sendMessageToPeer(
          {
            text: JSON.stringify({
              type: "candidate",
              candidate: event.candidate,
            }),
          },
          MemberId
        );
      }
    };
  };

  const createOffer = async (MemberId) => {
    await createPeerConnection(MemberId);

    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    client.sendMessageToPeer(
      { text: JSON.stringify({ type: "offer", offer: offer }) },
      MemberId
    );
  };

  const createAnswer = async (MemberId, offer) => {
    await createPeerConnection(MemberId);

    await peerConnection.setRemoteDescription(offer);

    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    client.sendMessageToPeer(
      { text: JSON.stringify({ type: "answer", answer: answer }) },
      MemberId
    );
  };

  const addAnswer = async (answer) => {
    if (!peerConnection.currentRemoteDescription) {
      peerConnection.setRemoteDescription(answer);
    }
  };

  const leaveChannel = async () => {
    await channel.leave();
    await client.logout();
  };

  const toggleCamera = async () => {
    let videoTrack = localStream
      .getTracks()
      .find((track) => track.kind === "video");

    if (videoTrack.enabled) {
      videoTrack.enabled = false;
      document.getElementById("camera-btn").style.backgroundColor =
        "rgb(255, 80, 80)";
    } else {
      videoTrack.enabled = true;
      document.getElementById("camera-btn").style.backgroundColor =
        "rgb(179, 102, 249, .9)";
    }
  };

  const toggleMic = async () => {
    let audioTrack = localStream
      .getTracks()
      .find((track) => track.kind === "audio");

    if (audioTrack.enabled) {
      audioTrack.enabled = false;
      document.getElementById("mic-btn").style.backgroundColor =
        "rgb(255, 80, 80)";
    } else {
      audioTrack.enabled = true;
      document.getElementById("mic-btn").style.backgroundColor =
        "rgb(179, 102, 249, .9)";
    }
  };

  function onResults(results) {
    // const video = webcamRef.current.video;
    const videoWidth = document.getElementById("user-2").videoWidth;
    const videoHeight = document.getElementById("user-2").videoHeight;

    // Set canvas width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION, {
          color: "#C0C0C070",
          lineWidth: 1,
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, {
          color: "#FF3030",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYEBROW, {
          color: "#FF3030",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, {
          color: "#30FF30",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYEBROW, {
          color: "#30FF30",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, {
          color: "#E0E0E0",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {
          color: "#E0E0E0",
        });
      }
    }
    canvasCtx.restore();
  }

  return (
    <>
      <div id="videos">
        <video
          className="video-player"
          id="user-1"
          autoPlay
          playsInline
        ></video>
        <video
          className="video-player"
          id="user-2"
          autoPlay
          playsInline
        ></video>

        <canvas ref={canvasRef} className="video-player"></canvas>
      </div>
      <div id="controls">
        <div
          className="control-container"
          id="camera-btn"
          onClick={toggleCamera}
        >
          <img src={Camera} />
        </div>

        <div className="control-container" id="mic-btn" onClick={toggleMic}>
          <img src={mic} />
        </div>

        <a href="lobby.html">
          <div
            className="control-container"
            id="leave-btn"
            onClick={leaveChannel}
          >
            <img src={phone} />
          </div>
        </a>
      </div>
    </>
  );
};

export default Call;
