import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { mobileData } from '../data/mobiles';

const Mobiles = () => {
  const firstFiveImages = mobileData.slice(0, 5);

  return (
    <>
      <Container className="mt-4">
        <h2 className="mb-4">Mobiles</h2>
        <Row className="g-4">
          {firstFiveImages.map((item, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3} xl={2}>
              <Card className="h-100 text-center">
                <Link to="/mobiles">
                  <Card.Img
                    variant="top"
                    src={item.image}
                    alt={`Mobile ${index + 1}`}
                    className="p-3"
                    style={{ height: '200px', objectFit: 'contain' }}
                  />
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Mobiles;
