import React from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardGroup,
  Button,
  Row,
  Col,
} from "reactstrap";

const SpeechRecognitionA = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <>
      <Row>
        <h5 className="mb-3 mt-3">Microphone: {listening ? "on" : "off"}</h5>

        <Card body>
          <div className="d-flex">
            <Button color="primary" onClick={SpeechRecognition.startListening}>
              Start
            </Button>
            &nbsp;
            <Button color="danger" onClick={SpeechRecognition.stopListening}>
              Stop
            </Button>
            &nbsp;
            <Button color="warning" onClick={resetTranscript}>
              Reset
            </Button>
          </div>
          <p>{transcript.toLowerCase()}</p>
        </Card>
      </Row>
    </>
  );
};

export default SpeechRecognitionA;
