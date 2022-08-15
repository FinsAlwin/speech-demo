import React from "react";
import { Row, Col } from "reactstrap";
import Blog from "../components/dashboard/Blog";
import bg1 from "../assets/images/bg/bg1.jpg";
import bg2 from "../assets/images/bg/bg2.jpg";
import bg3 from "../assets/images/bg/bg3.jpg";
import bg4 from "../assets/images/bg/bg4.jpg";

const BlogData = [
  {
    image: bg1,
    title: "Snake Game",
    subtitle: "game share",
    description: "Game share",
    btnbg: "primary",
    link: "/snake",
  },
  {
    image: bg1,
    title: "Video Call",
    subtitle: "Peer to peer demo",
    description:
      "Custom video calling application, build using Webrtc, agora real-time chat SDK as signaling server. Build Custom app cause, need access to a localstream and remotestream video and audio. This might not be possible using the third-party provider.",
    btnbg: "primary",
    link: "/call",
  },
  {
    image: bg2,
    title: "Speech Recognition",
    subtitle: "Speech to text demo",
    description:
      "Using build in Speech Recognition libray from browers, can Convert speech to text. Currently working in chrome, edge, firefox. Use goole speech ML modles, Current Language is English",
    btnbg: "primary",
    link: "/speechrecognition",
  },
  {
    image: bg2,
    title: "Face Mesh",
    subtitle: "Mapping face feature demo",
    description:
      "Using MediaPipe a Deep learing & ML library by google, we can map features of face in realtime. We can use to make AR face mask ,which makes therapy session very intresting.",
    btnbg: "primary",
    link: "/faceMesh",
  },
  {
    image: bg3,
    title: "Hand Mapping",
    subtitle: "Mapping Hands demo",
    description:
      "Using MediaPipe a Deep learing & ML library by google, we can map users hands in realtime. We can use to make interactive session/games/sign language to speak apps etc",
    btnbg: "primary",
    link: "/hands",
  },
  {
    image: bg4,
    title: "Holistic",
    subtitle: "Mapping body and Face demo",
    description:
      "Using MediaPipe a Deep learing & ML library by google, Body pose detection with Face mesh. Use for buliding 3d character and map it to human interaction",
    btnbg: "primary",
    link: "/holistic",
  },
  {
    image: bg4,
    title: "Selfie Segmentation",
    subtitle: "Change Background Tool demo",
    description:
      "Using MediaPipe a Deep learing & ML library by google, Change bacground and apply effects",
    btnbg: "primary",
    link: "/selfiesegmentation",
  },
];

const Starter = () => {
  return (
    <div>
      <h4 className="mb-3">Speech Therapy Research, Tool kit</h4>
      <h6>Instructions</h6>
      <ul>
        <li>
          <p>
            In video calling module, create room and share the link a friend or
            open in different Tab
          </p>
        </li>
        <li>
          <p>
            In all Camera modules except video call module, click on camera
            button turn Webcamera on and off
          </p>
        </li>
        <li>
          <p>
            Camera module will take some time load (3-5 sec depends on internet
            speed)
          </p>
        </li>
        <li>
          <p>In case of Blank page, please reload the page.</p>
        </li>
        <li>
          <p>In hand mapping module show your hands to camera for results.</p>
        </li>
        <li>
          <p>Speech recognition is speech to text, English only</p>
        </li>
      </ul>

      <Row>
        {BlogData.map((blg, index) => (
          <Col sm="6" lg="6" xl="3" key={index}>
            <Blog
              image={blg.image}
              title={blg.title}
              subtitle={blg.subtitle}
              text={blg.description}
              color={blg.btnbg}
              link={blg.link}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Starter;
