// src/components/navbar.js
import React, { useEffect, useState } from "react";
import getUserInfo from '../utilities/decodeJwt';
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
        <Nav className="me-auto">
          {!isAuthenticated && <Nav.Link href="/">Start</Nav.Link>}
          <Nav.Link href="/home">Home</Nav.Link>
          <Nav.Link href="/privateUserProfile">Profile</Nav.Link>
          <Nav.Link href="/searchSkiResorts">Search Ski Resorts</Nav.Link>
          <Nav.Link href="/MapSearch">Search Trail Map</Nav.Link> {/* Ensure the case is consistent */}
        </Nav>
      </Container>
    </ReactNavbar>
  );
}
