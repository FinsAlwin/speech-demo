import React, { useRef, useEffect } from "react";

import { Objectron } from "@mediapipe/objectron";
import * as Obj from "@mediapipe/objectron";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";

const ObjectronMap = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const drawConnectors = window.drawConnectors;
  const drawLandmarks = window.drawLandmarks;
  var camera = null;

  function onResults(results) {
    // const video = webcamRef.current.video;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

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

  // setInterval(())
  useEffect(() => {
    const objectron = new Objectron({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/objectron/${file}`;
      },
    });
    objectron.setOptions({
      modelName: "Cup",
      maxNumObjects: 3,
    });
    objectron.onResults(onResults);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await objectron.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
        transform: "scaleX(-1)",
      });
      camera.start();
    }
  }, []);

  return (
    <center>
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 480,
          transform: "scaleX(-1) ",
        }}
      />{" "}
      <canvas
        ref={canvasRef}
        className="output_canvas"
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 480,
          transform: "scaleX(-1) ",
        }}
      ></canvas>
    </center>
  );
};

export default ObjectronMap;
