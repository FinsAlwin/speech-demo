import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
  Button,
} from "reactstrap";

const Blog = (props) => {
  const navigate = useNavigate();

  const handleButtonClick = (link) => {
    navigate(link);
  };
  return (
    <Card>
      <CardImg alt="Card image cap" src={props.image} />
      <CardBody className="p-4">
        <CardTitle tag="h5">{props.title}</CardTitle>
        <CardSubtitle>{props.subtitle}</CardSubtitle>
        <CardText className="mt-6">{props.text}</CardText>
        <Button
          color={props.color}
          onClick={() => handleButtonClick(props.link)}
        >
          Open Module
        </Button>
      </CardBody>
    </Card>
  );
};

export default Blog;
