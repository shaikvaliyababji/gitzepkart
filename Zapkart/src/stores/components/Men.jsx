import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { menData } from '../data/men';
import { Link } from 'react-router-dom';

const Men = () => {
  const firstFiveImages = menData.slice(0, 5);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Men Fashion</h2>
      <Row>
        {firstFiveImages.map((item, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3} xl={2} className="mb-4">
            <Card className="h-100 text-center">
              <Link to="/men">
                <Card.Img
                  variant="top"
                  src={item.image}
                  alt={`Men Fashion ${index + 1}`}
                  className="p-3"
                  style={{ height: '250px', objectFit: 'contain' }}
                />
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Men;
