import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import { Card, Image } from 'react-bootstrap';

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  if (!user) return (<div style={styles.container}><h4>Log in to view this page.</h4></div>);

  return (
    <div style={styles.container}>
      <div style={styles.row}>
        <div style={styles.col}>
          <Card style={styles.card}>
            <Card.Body>
              <div style={styles.profileHeader}>
                <Image
                  src={user.profilePicture || 'https://via.placeholder.com/150'}
                  roundedCircle
                  style={styles.profilePicture}
                />
                <h1 style={styles.profileUsername}>{user.username}</h1>
                <p style={styles.profileEmail}>{user.email}</p>
                <p style={styles.profileBio}>{user.bio || 'This user has no bio.'}</p>
              </div>
              <Button variant="primary" style={styles.button} onClick={handleShow}>
                Log Out
              </Button>
              <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Log Out</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to Log Out?</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleLogout}>
                    Yes
                  </Button>
                </Modal.Footer>
              </Modal>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Styles object
const styles = {
  container: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  col: {
    width: '100%',
    maxWidth: '600px',
  },
  card: {
    padding: '2rem',
    borderRadius: '15px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  profileHeader: {
    textAlign: 'center',
  },
  profilePicture: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
  },
  profileUsername: {
    fontSize: '2rem',
    margin: '1rem 0',
  },
  profileEmail: {
    fontSize: '1.2rem',
    color: '#555',
  },
  profileBio: {
    fontSize: '1rem',
    color: '#777',
  },
  button: {
    marginTop: '1rem',
  },
};

export default PrivateUserProfile;
