import React, { useRef, useState } from "react";

import { Holistic } from "@mediapipe/holistic";
import * as Hol from "@mediapipe/holistic";
import { Card, Button, Row, Col } from "reactstrap";

const HolisticMap = () => {
  const [camera, setCamera] = useState(false);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const drawConnectors = window.drawConnectors;
  const drawLandmarks = window.drawLandmarks;

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

    if (results.segmentationMask) {
      // canvasCtx.drawImage(
      //   results.segmentationMask,
      //   0,
      //   0,
      //   canvasElement.width,
      //   canvasElement.height
      // );

      // Only overwrite existing pixels.
      canvasCtx.globalCompositeOperation = "source-in";
      // canvasCtx.fillStyle = "#00FFFF";
      // canvasCtx.opacity = 0.5;
      canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

      // Only overwrite missing pixels.
      canvasCtx.globalCompositeOperation = "destination-atop";
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      canvasCtx.globalCompositeOperation = "source-over";

      drawConnectors(canvasCtx, results?.poseLandmarks, Hol.POSE_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 4,
      });
      drawLandmarks(canvasCtx, results?.poseLandmarks, {
        color: "#FF0000",
        lineWidth: 2,
      });
      drawConnectors(
        canvasCtx,
        results?.faceLandmarks,
        Hol.FACEMESH_TESSELATION,
        {
          color: "#C0C0C070",
          lineWidth: 1,
        }
      );
      drawConnectors(
        canvasCtx,
        results?.leftHandLandmarks,
        Hol.HAND_CONNECTIONS,
        {
          color: "#CC0000",
          lineWidth: 5,
        }
      );
      drawLandmarks(canvasCtx, results?.leftHandLandmarks, {
        color: "#00FF00",
        lineWidth: 2,
      });
      drawConnectors(
        canvasCtx,
        results?.rightHandLandmarks,
        Hol.HAND_CONNECTIONS,
        {
          color: "#00CC00",
          lineWidth: 5,
        }
      );
      drawLandmarks(canvasCtx, results.rightHandLandmarks, {
        color: "#FF0000",
        lineWidth: 2,
      });
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
    const holistic = new Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      },
    });

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      refineFaceLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    holistic.onResults(onResults);

    async function onFrame() {
      if (!webcamRef?.current?.paused && !webcamRef?.current?.ended) {
        await holistic.send({
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

export default HolisticMap;
