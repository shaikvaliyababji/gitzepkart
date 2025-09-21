import React, { useState } from "react";
import { acData } from "../data/ac";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
} from "react-bootstrap";

const AcPage = () => {
  const [selectedProduct, setSelectedProduct] = useState([]);

  const companyHandler = (company) => {
    if (selectedProduct.includes(company)) {
      setSelectedProduct(selectedProduct.filter((item) => item !== company));
    } else {
      setSelectedProduct([...selectedProduct, company]);
    }
  };

  const filteredProduct =
    selectedProduct.length === 0
      ? acData
      : acData.filter((item) => selectedProduct.includes(item.company));

  const companies = [...new Set(acData.map((item) => item.company))];

  return (
    <>
      <Navbar />
      <Container fluid className="py-4" style={{ backgroundColor: "#f0f8ff" }}>
        <Row className="gx-4 gy-4">
          {/* Sidebar */}
<Col md={3} style={{ minWidth: "250px" }}>
  <Card
    className="p-3 shadow-sm rounded-4 filter-sidebar"
    style={{ position: "sticky", top: "100px", zIndex: "1010" }}
  >
    <h5 className="mb-3 text-center fw-bold text-primary text-uppercase">
      Filter by Company
    </h5>
    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
      {companies.map((company) => (
        <Form.Check
          key={company}
          type="checkbox"
          id={`check-${company}`}
          label={company}
          checked={selectedProduct.includes(company)}
          onChange={() => companyHandler(company)}
          className="mb-2"
        />
      ))}
    </div>
    {selectedProduct.length > 0 && (
      <div className="text-center mt-3">
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => setSelectedProduct([])}
        >
          Clear Filters
        </button>
      </div>
    )}
  </Card>
</Col>


          {/* Products */}
          <Col md={9}>
            <Row className="g-4">
              {filteredProduct.map((item) => (
                <Col md={4} key={item.id}>
                  <Card className="h-100 shadow-sm rounded-3">
                    <Link to={`/ac/${item.id}`}>
                      <Card.Img
                        variant="top"
                        src={item.image}
                        alt={item.model}
                        className="img-fluid p-3"
                        style={{ height: "220px", objectFit: "contain" }}
                      />
                    </Link>
                    <Card.Body>
                      <Card.Title className="fs-6 fw-bold text-primary">
                        {item.company}
                      </Card.Title>
                      <Card.Text>{item.model}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AcPage;
