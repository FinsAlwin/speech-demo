import React, { useRef, useEffect, useState } from "react";

import { Card, Button, Row, Col } from "reactstrap";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import * as Selfiesegmentation from "@mediapipe/selfie_segmentation";
import img from "../assets/images/bg/bg1.jpg";

const SelfieSegmentationA = () => {
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

    if (results.segmentationMask) {
      canvasCtx.drawImage(
        results.segmentationMask,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      // Only overwrite existing pixels.
      canvasCtx.globalCompositeOperation = "source-out";
      canvasCtx.fillStyle = "#00FF00";
      //   canvasCtx.createPattern(img, "repeat");
      canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

      // Only overwrite missing pixels.
      canvasCtx.globalCompositeOperation = "lighter";
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );
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
    const selfieSegmentation = new SelfieSegmentation({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
      },
    });
    selfieSegmentation.setOptions({
      modelSelection: 1,
    });
    selfieSegmentation.onResults(onResults);

    async function onFrame() {
      if (!webcamRef?.current?.paused && !webcamRef?.current?.ended) {
        await selfieSegmentation.send({
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

export default SelfieSegmentationA;
