import React, { useRef, useState } from "react";

import { Hands } from "@mediapipe/hands";
import * as Handy from "@mediapipe/hands";
import { Card, Button, Row, Col } from "reactstrap";

const HandD = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const drawConnectors = window.drawConnectors;
  const drawLandmarks = window.drawLandmarks;
  const [camera, setCamera] = useState(false);

  function onResults(results) {
    // const video = webcamRef.current.video;
    const videoWidth = webcamRef?.current?.videoWidth;
    const videoHeight = webcamRef?.current?.videoHeight;

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

    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, Handy.HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 5,
      });

      drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
    }
    canvasCtx.restore();
  }

  const toggleCamera = async () => {
    if (webcamRef?.current?.srcObject) {
      setCamera(false);
      webcamRef.current.srcObject.getTracks().forEach(function (track) {
        track.stop();
      });
    } else {
      await setCamera(true);
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then(async function (stream) {
          webcamRef.current.srcObject = stream;
          webcamRef.current.play();
        })
        .then(async function () {
          runNN();
        })
        .catch(function (err) {
          console.log("An error occurred! " + err);
        });
    }
  };

  const runNN = () => {
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidene: 0.8,
      minTrackingConfidence: 0.5,
    });
    hands.onResults(onResults);

    async function onFrame() {
      if (!webcamRef?.current?.paused && !webcamRef?.current?.ended) {
        await hands.send({
          image: webcamRef.current,
        });
        // https://stackoverflow.com/questions/65144038/how-to-use-requestanimationframe-with-promise
        await new Promise(requestAnimationFrame);
        onFrame();
      } else setTimeout(onFrame, 500);
    }

    webcamRef?.current.play();
    onFrame();
  };

  return (
    <>
      <Row>
        <Button color="primary" onClick={toggleCamera}>
          Camera {camera ? "On" : "Off"}
        </Button>
      </Row>
      <br />
      <Row>
        {camera && (
          <>
            <Col md="6" lg="6">
              <Card>
                <video ref={webcamRef}></video>
              </Card>
            </Col>
            <Col md="6" lg="6">
              <Card>
                <canvas ref={canvasRef}></canvas>
              </Card>
            </Col>
          </>
        )}
      </Row>
    </>
  );
};

export default HandD;
