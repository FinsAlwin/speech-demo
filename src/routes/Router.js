import { lazy } from "react";
import { Navigate } from "react-router-dom";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/***** Pages ****/

const Starter = lazy(() => import("../views/Starter.js"));
const About = lazy(() => import("../views/About.js"));
const Alerts = lazy(() => import("../views/ui/Alerts"));
const Badges = lazy(() => import("../views/ui/Badges"));
const Buttons = lazy(() => import("../views/ui/Buttons"));
const Cards = lazy(() => import("../views/ui/Cards"));
const Grid = lazy(() => import("../views/ui/Grid"));
const Tables = lazy(() => import("../views/ui/Tables"));
const Forms = lazy(() => import("../views/ui/Forms"));
const Breadcrumbs = lazy(() => import("../views/ui/Breadcrumbs"));

const VideoCall = lazy(() => import("../views/VideoCall"));
const FMesh = lazy(() => import("../views/FMesh"));
const HandD = lazy(() => import("../views/HandD"));
const Holistic = lazy(() => import("../views/Holistic"));
const Objectron = lazy(() => import("../views/Objectron"));
const SelfieSegmentation = lazy(() => import("../views/SelfieSegmentation"));
const SpeechRecognition = lazy(() => import("../views/SpeechRecognition"));
const GameSession = lazy(() => import("../views/game/GameSession"));
/*****Routes******/

const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/starter" /> },
      { path: "/starter", exact: true, element: <Starter /> },
      { path: "/call", exact: true, element: <VideoCall /> },
      { path: "/faceMesh", exact: true, element: <FMesh /> },
      { path: "/hands", exact: true, element: <HandD /> },
      { path: "/holistic", exact: true, element: <Holistic /> },
      { path: "/objectron", exact: true, element: <Objectron /> },
      {
        path: "/selfiesegmentation",
        exact: true,
        element: <SelfieSegmentation />,
      },
      {
        path: "/speechrecognition",
        exact: true,
        element: <SpeechRecognition />,
      },
      { path: "/call/:roomId", exact: true, element: <VideoCall /> },
      { path: "/snake", exact: true, element: <GameSession /> },
      {
        path: "/snake/:sessionId/:roomId",
        exact: true,
        element: <GameSession />,
      },
      { path: "/about", exact: true, element: <About /> },
      { path: "/alerts", exact: true, element: <Alerts /> },
      { path: "/badges", exact: true, element: <Badges /> },
      { path: "/buttons", exact: true, element: <Buttons /> },
      { path: "/cards", exact: true, element: <Cards /> },
      { path: "/grid", exact: true, element: <Grid /> },
      { path: "/table", exact: true, element: <Tables /> },
      { path: "/forms", exact: true, element: <Forms /> },
      { path: "/breadcrumbs", exact: true, element: <Breadcrumbs /> },
    ],
  },
];

export default ThemeRoutes;
