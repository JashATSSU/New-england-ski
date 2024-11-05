import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Card, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from '../../utilities/decodeJwt';
import axios from "axios";

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('https://example.com/default-avatar.png');
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const handleClose = () => {
    setShow(false);
    stopCamera();
  };

  const handleShow = () => {
    startCamera();
    setShow(true);
  };

  const handleLogout = async () => {
    setUser(null);
    setProfileImageUrl('https://example.com/default-avatar.png');
    localStorage.removeItem('profilePictureUrl');
    navigate("/");
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(error => console.error("Error playing video:", error));
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
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
    }
  };

  const uploadPhoto = async (image) => {
    const userId = user.id;
    try {
      const response = await axios.post('http://localhost:8081/api/upload-profile-picture', {
        image,
        userId,
      });
      const updatedUser = response.data.user;
      setProfileImageUrl(updatedUser.profilePictureUrl);
      localStorage.setItem('profilePictureUrl', updatedUser.profilePictureUrl);
      console.log("Profile picture uploaded successfully:", updatedUser.profilePictureUrl);
    } catch (error) {
      console.error('Error uploading photo:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = getUserInfo();
      if (fetchedUser) {
        setUser(fetchedUser);
        const storedProfilePic = localStorage.getItem('profilePictureUrl');
        if (storedProfilePic) {
          setProfileImageUrl(storedProfilePic);
        } else {
          try {
            const response = await axios.get(`http://localhost:8081/api/get-profile-picture/${fetchedUser.id}`);
            const profilePicUrl = response.data.profilePictureUrl;
            if (profilePicUrl) {
              setProfileImageUrl(profilePicUrl);
              localStorage.setItem('profilePictureUrl', profilePicUrl);
            } else {
              setProfileImageUrl('https://example.com/default-avatar.png');
            }
          } catch (error) {
            console.error('Error fetching profile picture:', error);
            setProfileImageUrl('https://example.com/default-avatar.png');
          }
        }
      }
    };
    fetchUser();
  }, []);

  if (!user) return (
    <div style={styles.container}>
      <h4 style={styles.message}>Log in to view this page.</h4>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 to-white p-4">
      <div className="w-full h-full flex items-center justify-center">
        <Card className="w-full max-w-2xl p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <Card.Body>
            <div className="text-center">
              <div className="flex justify-center">
                <Image
                  src={profileImageUrl}
                  className="w-48 h-48 object-cover rounded-full border-4 border-gray-400 mx-auto"
                  alt="Profile"
                />
              </div>
              <h1 className="text-4xl mt-4 font-semibold text-gray-800">Profile</h1>
              <h2 className="text-2xl mt-2 font-semibold text-gray-800">{user?.username}</h2>
              <p className="text-lg text-gray-500">{user?.email}</p>

              <div className="mt-4 flex justify-between">
                <Button 
                  className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" 
                  onClick={handleShow}
                >
                  Upload Profile Picture
                </Button>
                <Button 
                  className="w-1/2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" 
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <video ref={videoRef} width="100%" />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div className="flex justify-between">
            <Button onClick={startCamera} className="mt-3">Start Camera</Button>
            <Button onClick={capturePhoto} className="mt-3">Capture Photo</Button>
          </div>
          {capturedImage && <Image src={capturedImage} className="mt-3" />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            if (capturedImage) {
              uploadPhoto(capturedImage);
              setCapturedImage(null);
              handleClose();
            }
          }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  message: {
    color: '#333',
    fontSize: '1.5rem',
  },
};

export default PrivateUserProfile;
