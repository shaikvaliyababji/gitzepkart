import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { watchData } from "../data/watch";
import { Link } from "react-router-dom";

const Watch = () => {
  const firstFiveImages = watchData.slice(0, 5);

  return (
    <Container className="content-wrapper mt-4">
      <h2 className="mb-4">Watches</h2>
      <Row>
        {firstFiveImages.map((item, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3} xl={2} className="mb-4">
            <Card className="h-100 text-center">
              <Link to="/watch">
                <Card.Img
                  variant="top"
                  src={item.image}
                  alt={`watch-${index}`}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "contain",
                    padding: "1rem"
                  }}
                />
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Watch;
