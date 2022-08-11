import React, { useRef, useState } from "react";

import { Objectron } from "@mediapipe/objectron";
import * as Obj from "@mediapipe/objectron";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import { Card, Button, Row, Col } from "reactstrap";

const ObjectronMap = () => {
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
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    if (!!results.objectDetections) {
      for (const detectedObject of results.objectDetections) {
        const landmarks: mpObjectron.Point2D[] = detectedObject.keypoints.map(
          (x) => x.point2d
        );
        // Draw bounding box.
        drawConnectors(canvasCtx, landmarks, Obj.BOX_CONNECTIONS, {
          color: "#FF0000",
        });

        drawLandmarks(canvasCtx, [landmarks[0]], {
          color: "#FFFFFF",
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
    const objectron = new Objectron({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/objectron/${file}`;
      },
    });
    objectron.setOptions({
      modelName: "Bottle",
      maxNumObjects: 3,
    });
    objectron.onResults(onResults);

    async function onFrame() {
      if (!webcamRef?.current?.paused && !webcamRef?.current?.ended) {
        await objectron.send({
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

export default ObjectronMap;
