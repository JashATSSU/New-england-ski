import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Card, Image, Form, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import axios from "axios";

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [user, setUser] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [preference, setPreference] = useState({ sport: '', trail: '', status: '' });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const handleClose = () => {
    setShow(false);
    setUploadModal(false);
    if (cameraStream) cameraStream.getTracks().forEach((track) => track.stop());
  };

  const handleShow = () => setShow(true);
  const handleUploadModal = () => setUploadModal(true);

  const handleLogout = async () => {
    localStorage.clear();
    navigate("/");
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
      console.error("Error accessing the camera:", error);
    }
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const image = canvasRef.current.toDataURL("image/png");
      setCapturedImage(image);
      uploadPhoto(image);
      setCameraStream(null);
    }
  };

  const uploadPhoto = async (image) => {
    try {
      const response = await axios.post('http://localhost:8081/api/upload-profile-picture', { image });
      if (response.data && response.data.imageUrl) {
        localStorage.setItem('profilePicture', response.data.imageUrl);
        setCapturedImage(response.data.imageUrl);
      } else {
        console.error('Upload failed:', response);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  useEffect(() => {
    setUser(getUserInfo());
    const storedImage = localStorage.getItem('profilePicture');
    if (storedImage) setCapturedImage(storedImage);
  }, []);

  if (!user) return <div className="flex items-center justify-center h-screen"><h4>Log in to view this page.</h4></div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 to-white">
      <div className="w-full max-w-lg">
        <Card className="p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <Card.Body>
            <div className="text-center">
              <Image
                src={capturedImage || 'https://via.placeholder.com/150'}
                className="w-36 h-36 object-cover rounded-full border-4 border-gray-400"
                alt="Profile"
              />
              <h1 className="text-3xl mt-4 font-semibold text-gray-800">{user.username}</h1>
              <p className="text-lg text-gray-500">{user.email}</p>

              {/* User Preferences Section */}
              <Form.Group className="mt-4 text-center space-y-4">
                <Dropdown onSelect={(eventKey) => setPreference({ ...preference, sport: eventKey })}>
                  <Dropdown.Toggle className="btn-primary">Preferred Sport</Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item eventKey="Skiing">Skiing</Dropdown.Item>
                    <Dropdown.Item eventKey="Snowboarding">Snowboarding</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown onSelect={(eventKey) => setPreference({ ...preference, trail: eventKey })}>
                  <Dropdown.Toggle className="btn-primary">Trail Type</Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item eventKey="Powder">Powder</Dropdown.Item>
                    <Dropdown.Item eventKey="Compact">Compact</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown onSelect={(eventKey) => setPreference({ ...preference, status: eventKey })}>
                  <Dropdown.Toggle className="btn-primary">Activity Status</Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item eventKey="At the Mountain">At the Mountain</Dropdown.Item>
                    <Dropdown.Item eventKey="At the Lodge">At the Lodge</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>

              <Button className="mt-4" onClick={() => { handleUploadModal(); startCamera(); }}>
                Capture Profile Picture
              </Button>

            </div>
            <Button variant="primary" className="mt-6" onClick={handleShow}>
              Log Out
            </Button>

            {/* Log Out Modal */}
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
              <Modal.Header closeButton>
                <Modal.Title>Log Out</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to Log Out?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleLogout}>Yes</Button>
              </Modal.Footer>
            </Modal>

            {/* Camera Modal */}
            <Modal show={uploadModal} onHide={handleClose} backdrop="static" keyboard={false}>
              <Modal.Header closeButton>
                <Modal.Title>Take a Photo</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <video ref={videoRef} className="w-full rounded-lg" />
                <canvas ref={canvasRef} className="w-full mt-4 rounded-lg" />
                <Button variant="primary" className="mt-4" onClick={capturePhoto}>
                  Capture
                </Button>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
              </Modal.Footer>
            </Modal>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default PrivateUserProfile;
