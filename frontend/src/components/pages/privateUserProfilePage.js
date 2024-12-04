import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Card, Image, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from '../../utilities/decodeJwt';
import axios from "axios";

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('https://example.com/default-avatar.png');
  const [cameraStream, setCameraStream] = useState(null);
  const [bio, setBio] = useState('');
  const [isBioEditing, setIsBioEditing] = useState(false);
  const [preferences, setPreferences] = useState('snowboarder'); // 'snowboarder' or 'skier'
  const [location, setLocation] = useState('mountain'); // 'mountain' or 'lodge'
  const [isEditingPreferences, setIsEditingPreferences] = useState(false); // To control the edit state of preferences
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

  const handleBioSave = () => {
    if (bio.length <= 255) {
      setIsBioEditing(false);
      // Here you can add a request to save the bio to your backend if needed
    } else {
      alert('Bio must be 255 characters or less');
    }
  };

  const handleBioDelete = () => {
    setBio('');
    setIsBioEditing(false);
  };

  const handlePreferencesSave = () => {
    setIsEditingPreferences(false); // Stop editing preferences when the user saves
  };

  const handlePreferencesCancel = () => {
    setIsEditingPreferences(false); // Stop editing preferences when the user cancels
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
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-200 to-white p-4">
      <div className="w-full max-w-4xl p-8">
        <Card className="w-full p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
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

              <div className="my-4">
                <label htmlFor="preferences" className="block text-xl font-semibold text-gray-700">Preferences</label>
                <div className="mt-2">
                  {isEditingPreferences ? (
                    <div>
                      <Form.Group>
                        <Form.Label>Choose your activity:</Form.Label>
                        <Form.Control
                          as="select"
                          value={preferences}
                          onChange={(e) => setPreferences(e.target.value)}
                        >
                          <option value="snowboarder">Snowboarder</option>
                          <option value="skier">Skier</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Where do you prefer to be?</Form.Label>
                        <Form.Control
                          as="select"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        >
                          <option value="mountain">On the Mountain</option>
                          <option value="lodge">At the Lodge</option>
                        </Form.Control>
                      </Form.Group>
                      <div className="mt-3">
                        <Button onClick={handlePreferencesSave}>Save</Button>
                        <Button variant="secondary" onClick={handlePreferencesCancel} className="ml-3">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg text-gray-500">
                        Activity: {preferences === 'snowboarder' ? 'Snowboard' : 'Ski'}
                      </p>
                      <p className="text-lg text-gray-500">
                        Location: {location === 'mountain' ? 'On the Mountain' : 'At the Lodge'}
                      </p>
                      <Button onClick={() => setIsEditingPreferences(true)} className="mt-3">Edit Preferences</Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="my-4">
                {isBioEditing ? (
                  <>
                    <Form.Control
                      as="textarea"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Enter your bio"
                      maxLength={255}
                      className="mt-2"
                    />
                    <Button onClick={handleBioSave} className="mt-3">Save Bio</Button>
                    <Button variant="danger" onClick={handleBioDelete} className="mt-3 ml-3">Delete Bio</Button>
                  </>
                ) : (
                  <>
                    <p className="text-lg text-gray-500">{bio || 'No bio yet.'}</p>
                    <Button onClick={() => setIsBioEditing(true)} className="mt-3">Edit Bio</Button>
                  </>
                )}
              </div>

              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleShow}
              >
                Upload Profile Picture
              </Button>
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
