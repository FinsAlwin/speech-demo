import React, { useRef, useEffect, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import * as Facemesh from "@mediapipe/face_mesh";
import { Card, Button, Row, Col } from "reactstrap";

const FMesh = () => {
  const [camera, setCamera] = useState(false);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const connect = window.drawConnectors;

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
      if (!webcamRef?.current?.paused && !webcamRef?.current?.ended) {
        await faceMesh.send({
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

export default FMesh;
