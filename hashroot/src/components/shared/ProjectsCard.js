import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { LinkContainer } from "react-router-bootstrap";

const ProjectsCard = () => {
  return (
    <Card className="text-center shadow-sm">
      <Card.Header as="h5">Projects</Card.Header>
      <Card.Body>
        <Stack gap={3}>
          <div>
            <Card.Text>
              To view the list of projects you have access to, click the button
              below
            </Card.Text>
            <LinkContainer to="/projects">
              <Button variant="primary">View Projects</Button>
            </LinkContainer>
          </div>
          <div>
            <Card.Text>To create a project, click the button below</Card.Text>
            <LinkContainer to="/projects/create">
              <Button variant="primary">+ Create a Project</Button>
            </LinkContainer>
          </div>
        </Stack>
      </Card.Body>
    </Card>
  );
};

export default ProjectsCard;
