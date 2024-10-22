import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Card, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from '../../utilities/decodeJwt';
import axios from "axios";

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null); // Local image state
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const handleClose = () => {
    setShow(false);
    if (cameraStream) cameraStream.getTracks().forEach((track) => track.stop());
  };

  const handleShow = () => setShow(true);

  const handleLogout = async () => {
    navigate("/");
  };

  // Start the camera stream
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

  // Capture photo from camera
  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const image = canvasRef.current.toDataURL("image/png");
      setCapturedImage(image); // Update captured image in state
      persistProfilePicture(image); // Force persistence of the image
    }
  };

  // Function to upload the photo to the server
  const uploadPhoto = async (image) => {
    try {
      const userId = user.id; // Get the logged-in user ID
      const response = await axios.post('http://localhost:8081/api/upload-profile-picture', {
        image: image, // Base64 image string
        userId: userId // Pass the user ID
      });

      // Update the user's profile picture in state and persist it
      const updatedUser = response.data.user;
      setUser(updatedUser);
      setCapturedImage(updatedUser.profilePictureUrl); // Display uploaded image
      persistProfilePicture(updatedUser.profilePictureUrl); // Force persistence of the image

      console.log("Profile picture uploaded successfully:", updatedUser.profilePictureUrl);
    } catch (error) {
      console.error('Error uploading photo:', error.response ? error.response.data : error.message);
    }
  };

  // Handle file upload (manual selection)
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const image = reader.result;
        setCapturedImage(image); // Update captured image in state
        persistProfilePicture(image); // Force persistence of the image
      };
      reader.readAsDataURL(file);
    }
  };

  // Save the profile picture (either captured or uploaded)
  const handleSaveProfilePicture = async () => {
    if (capturedImage) {
      await uploadPhoto(capturedImage); // Upload the image to the backend
    }
  };

  // Fetch the user information and profile picture from the backend
  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = getUserInfo(); // Assuming this function gets user info from JWT
      if (fetchedUser) {
        setUser(fetchedUser);

        try {
          const response = await axios.get(`http://localhost:8081/api/get-profile-picture/${fetchedUser.id}`);
          const profilePicUrl = response.data.profilePictureUrl;

          // Set profile picture from the backend or use previously stored one
          setCapturedImage(profilePicUrl || localStorage.getItem('profilePicture'));
          
          // Persist it if it's a new one from the backend
          if (profilePicUrl) {
            persistProfilePicture(profilePicUrl);
          }
        } catch (error) {
          console.error('Error fetching profile picture:', error);
          // Fallback logic: use the previously saved picture (from localStorage)
          const persistedPicture = localStorage.getItem('profilePicture');
          if (persistedPicture) {
            setCapturedImage(persistedPicture); // Use the persisted image if available
          }
        }

        console.log("Fetched user:", fetchedUser);
      }
    };
    fetchUser();
  }, []);

  // Persist profile picture in localStorage to ensure it stays put
  const persistProfilePicture = (image) => {
    localStorage.setItem('profilePicture', image); // Store the image in localStorage
  };

  // If the user is not logged in, show a message
  if (!user) return <div className="flex items-center justify-center h-screen"><h4>Log in to view this page.</h4></div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 to-white p-4">
      <div className="w-full h-full flex items-center justify-center">
        <Card className="w-full max-w-2xl p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <Card.Body>
            <div className="text-center">
              <div className="flex justify-center">
                <Image
                  src={capturedImage || user.profilePictureUrl || 'https://example.com/default-avatar.png'} // Display either the uploaded, saved, or default image
                  className="w-48 h-48 object-cover rounded-full border-4 border-gray-400 mx-auto"
                  alt="Profile"
                />
              </div>
              <h1 className="text-4xl mt-4 font-semibold text-gray-800">Profile</h1>
              <h2 className="text-2xl mt-2 font-semibold text-gray-800">{user.username}</h2>
              <p className="text-lg text-gray-500">{user.email}</p>

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

      {/* Upload Profile Picture Modal */}
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
          <input type="file" accept="image/*" onChange={handleFileUpload} className="mt-3" />
          {capturedImage && <Image src={capturedImage} className="mt-3" />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveProfilePicture}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PrivateUserProfile;
