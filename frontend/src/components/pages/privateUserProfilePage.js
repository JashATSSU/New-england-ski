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
  const [savedImage, setSavedImage] = useState(null);
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
      setCapturedImage(image); // Sets profile picture
    }
  };

  const uploadPhoto = async (image) => {
    try {
      const response = await axios.post('http://localhost:8081/api/upload-profile-picture', { image });
      if (response.data && response.data.imageUrl) {
        setSavedImage(response.data.imageUrl); // Set the saved image URL
        setCapturedImage(response.data.imageUrl); // Set it as the current captured image
      } else {
        console.error('Upload failed:', response);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const image = reader.result;
        setCapturedImage(image); // Sets uploaded image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfilePicture = async () => {
    if (capturedImage) {
      await uploadPhoto(capturedImage); // Upload the captured or selected image to S3
    }
  };

  useEffect(() => {
    setUser(getUserInfo());
    // Optionally, load the saved image URL from S3 if applicable
  }, []);

  if (!user) return <div className="flex items-center justify-center h-screen"><h4>Log in to view this page.</h4></div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 to-white p-4">
      <div className="w-full h-full flex items-center justify-center">
        <Card className="w-full max-w-2xl p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <Card.Body>
            <div className="text-center">
              {/* Profile Image Section */}
              <div className="flex justify-center">
                <Image
                  src={savedImage || capturedImage || 'https://via.placeholder.com/150'}
                  className="w-48 h-48 object-cover rounded-full border-4 border-gray-400 mx-auto"
                  alt="Profile"
                />
              </div>
              <h1 className="text-4xl mt-4 font-semibold text-gray-800">Profile</h1>
              <h2 className="text-2xl mt-2 font-semibold text-gray-800">{user.username}</h2>
              <p className="text-lg text-gray-500">{user.email}</p>

              {/* User Preferences Section */}
              <div className="mt-4 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">User Preferences</h2>
                <Form.Group>
                  <Dropdown onSelect={(eventKey) => setPreference({ ...preference, sport: eventKey })}>
                    <Dropdown.Toggle className="bg-blue-600 text-white border-none hover:bg-blue-700 transition duration-200">
                      Preferred Sport: {preference.sport || 'Select your sport'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item eventKey="Skiing">Skiing</Dropdown.Item>
                      <Dropdown.Item eventKey="Snowboarding">Snowboarding</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>

                {/* Trail Type Dropdown */}
                <Form.Group>
                  <Dropdown onSelect={(eventKey) => setPreference({ ...preference, trail: eventKey })}>
                    <Dropdown.Toggle className="bg-blue-600 text-white border-none hover:bg-blue-700 transition duration-200">
                      Trail Type: {preference.trail || 'Select trail type'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item eventKey="Powder">Powder</Dropdown.Item>
                      <Dropdown.Item eventKey="Compact">Compact</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>

                {/* Activity Status Dropdown */}
                <Form.Group>
                  <Dropdown onSelect={(eventKey) => setPreference({ ...preference, status: eventKey })}>
                    <Dropdown.Toggle className="bg-blue-600 text-white border-none hover:bg-blue-700 transition duration-200">
                      Activity Status: {preference.status || 'Select your status'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item eventKey="At the Mountain">At the Mountain</Dropdown.Item>
                      <Dropdown.Item eventKey="At the Lodge">At the Lodge</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>

                {/* Express Yourself Section */}
                <Form.Group>
                  <h2 className="text-lg font-bold text-gray-800">Express Yourself:</h2>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="Share your thoughts..." 
                    className="mt-2" 
                  />
                  <button type="submit" className="mt-2">Submit</button>
                </Form.Group>

              </div>

              {/* Upload Buttons */}
              <div className="mt-4 flex justify-between">
                <Button 
                  className="w-1/2 bg-blue-600 text-white hover:bg-blue-700 transition duration-200" 
                  onClick={() => { handleUploadModal(); startCamera(); }}
                >
                  Capture Profile Picture
                </Button>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="w-1/2 ml-2"
                />
              </div>

              {/* Save Profile Picture Button */}
              {capturedImage && (
                <Button
                  variant="success"
                  className="mt-4"
                  onClick={handleSaveProfilePicture}
                >
                  Save as Profile Picture
                </Button>
              )}
            </div>
            <Button variant="primary" className="mt-6" onClick={handleShow}>
              Log Out
            </Button>

            {/* Log Out Modal */}
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
              <Modal.Header closeButton>
                <Modal.Title>Log Out</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to log out?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleLogout}>Yes</Button>
              </Modal.Footer>
            </Modal>

            {/* Camera Modal */}
            <Modal show={uploadModal} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Capture Profile Picture</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="flex justify-center">
                  <video ref={videoRef} className="w-full h-auto border" />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                <Button className="mt-2" onClick={capturePhoto}>
                  Capture Photo
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
