// src/components/navbar.js
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
        {/* Use the NavBar brand as a primary navigation link */}
        <ReactNavbar.Brand href="/">New England Mountain Minder</ReactNavbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/home">Homepage</Nav.Link>
          <Nav.Link href="/privateUserProfile">Profile</Nav.Link>
          <Nav.Link href="/searchSkiResorts">Ski Resorts</Nav.Link>
          <Nav.Link href="/MapSearch">Trail Maps</Nav.Link> 
          <Nav.Link href="/SkiResortWebcam">Resort Webcams</Nav.Link>
        </Nav>
      </Container>
    </ReactNavbar>
  );
}
