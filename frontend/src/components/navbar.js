import React, { useEffect, useState } from "react";
import { getUserInfo } from '../utilities/decodeJwt';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import ReactNavbar from 'react-bootstrap/Navbar';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchedUser = getUserInfo();
    setUser(fetchedUser);
  }, []);

  const isAuthenticated = user && user.id;

  return (
    <ReactNavbar bg="dark" variant="dark">
      <Container>
        {/* Brand Name Styling */}
        <ReactNavbar.Brand 
          href="/" 
          style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FFD700' }} // Gold color
        >
          New England Mountain Minder
        </ReactNavbar.Brand>
        {/* Divider */}
        <div style={{ borderLeft: '2px solid #FFD700', height: '30px', margin: '0 15px' }} />
        <Nav className="me-auto">
          <Nav.Link href="/home">Home</Nav.Link>
          <Nav.Link href="/privateUserProfile">Profile</Nav.Link>
          <Nav.Link href="/searchSkiResorts">Ski Resorts</Nav.Link>
          <Nav.Link href="/MapSearch">Trail Maps</Nav.Link> 
          <Nav.Link href="/SkiResortWebcam">Resort Webcams</Nav.Link>
        </Nav>
      </Container>
    </ReactNavbar>
  );
}
