import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import { Card, Image } from 'react-bootstrap';

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [uploadModal, setUploadModal] = useState(false); // State for upload options modal
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleClose = () => {
    setShow(false);
    setUploadModal(false); // Close upload modal when done
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop()); // Stop the camera stream
    }
  };
  const handleShow = () => setShow(true);
  const handleUploadModal = () => setUploadModal(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.clear();
    navigate("/");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setCapturedImage(base64String);
        localStorage.setItem('profilePicture', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing the camera:', error);
    }
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const image = canvasRef.current.toDataURL('image/png');
      setCapturedImage(image);
      localStorage.setItem('profilePicture', image);
      setCameraStream(null);
    }
  };

  useEffect(() => {
    setUser(getUserInfo());
    const storedImage = localStorage.getItem('profilePicture');
    if (storedImage) {
      setCapturedImage(storedImage);
    }
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
                  src={capturedImage || user.profilePicture || 'https://via.placeholder.com/150'}
                  roundedCircle
                  style={styles.profilePicture}
                />
                <h1 style={styles.profileUsername}>{user.username}</h1>
                <p style={styles.profileEmail}>{user.email}</p>
                <p style={styles.profileBio}>{user.bio || 'This user has no bio.'}</p>
                <Button variant="secondary" style={styles.button} onClick={handleUploadModal}>
                  Upload Profile Picture
                </Button>
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

              <Modal
                show={uploadModal}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Upload Profile Picture</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>Would you like to upload a photo from your library or take a photo?</p>
                  <Button variant="primary" style={styles.uploadButton} onClick={() => document.getElementById('fileInput').click()}>
                    Upload from Library
                  </Button>
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Button variant="secondary" style={styles.uploadButton} onClick={startCamera}>
                    Take a Photo
                  </Button>
                  <div style={styles.cameraContainer}>
                    <video ref={videoRef} style={styles.video} />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    {capturedImage && (
                      <Image src={capturedImage} style={styles.capturedImage} />
                    )}
                    <Button variant="success" style={styles.captureButton} onClick={capturePhoto}>
                      Capture Photo
                    </Button>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
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
  uploadButton: {
    margin: '0.5rem',
  },
  cameraContainer: {
    marginTop: '1rem',
    textAlign: 'center',
  },
  video: {
    width: '100%',
    maxWidth: '100%',
    borderRadius: '8px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
  },
  capturedImage: {
    marginTop: '1rem',
    width: '100%',
    maxWidth: '150px',
    borderRadius: '8px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
  },
  captureButton: {
    marginTop: '1rem',
  },
};

export default PrivateUserProfile;
