import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Typography, Box, Button } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import homePagepic from "../../src/assets/home-page-pic.png";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Home = () => {
  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    padding: "20px",
  };

  const imageStyle = {
    width: "90%", // Adjusted width to make the image smaller
    height: "auto",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease-in-out",
    animation: "fadeIn 1s ease-in-out",
  };

  const textStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "20px",
    animation: "slideIn 1s ease-in-out",
    color: "#000000", // Black text color
  };

  const buttonStyle = {
    marginTop: "20px",
    transition: "background-color 0.3s ease-in-out",
    backgroundColor: "#007bff", // Blue button background
    color: "#ffffff", // White button text
  };

  const handleMouseEnter = (e) => {
    e.target.style.transform = "scale(1.05)";
  };

  const handleMouseLeave = (e) => {
    e.target.style.transform = "scale(1)";
  };

  return (
    <Container fluid style={containerStyle}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
        `}
      </style>
      <Row className="align-items-center">
        <Col xs={12} md={6}>
          <img
            src={homePagepic}
            alt="Placeholder"
            style={imageStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </Col>
        <Col xs={12} md={6} style={textStyle}>
          <Box>
            <h1 className="my-3 display-3 fw-bold ls-tight">
              Gluco Guide <br />
              <span style={{ color: "purple" }}>
                Your personal health assistant
              </span>
            </h1>
            <Typography variant="body1">
              Gluco Guide is a digital health companion designed to help you
              manage your health effectively. By tracking your blood pressure,
              sugar levels, and other vital information, it provides
              personalized insights and dietary recommendations.
            </Typography>
            <Button sx={{ mt: 2 }} style={{ backgroundColor: "purple" }}>
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "white" }}
              >
                Get Started
              </Link>
            </Button>
          </Box>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
