import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../../utilities/decodeJwt';
import Slideshow from './Slideshow'; // Import Slideshow component

const HomePage = () => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        localStorage.removeItem('accessToken');
        return navigate('/');
    };

    useEffect(() => {
        setUser(getUserInfo());
    }, []);

    if (!user) return (
        <div style={styles.container}>
            <h4 style={styles.message}>Log in to view this page.</h4>
        </div>
    );

    const { username } = user;

    return (
        <div style={styles.wrapper}>
            <Slideshow /> {/* Add the Slideshow component */}
            <div style={styles.cardContainer}>
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Welcome, {username}!</h3>
                    <p style={styles.cardText}>Discover the best ski resorts and conditions in New England.</p>
                </div>
                <button onClick={(e) => handleClick(e)} style={styles.button}>
                    Log Out
                </button>
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        position: 'relative',
        width: '100%',
        height: '100vh', // Full viewport height
        overflow: 'hidden',
    },
    cardContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1, // Ensure the card container is above the slideshow
        textAlign: 'center',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)', // Semi-transparent white background
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
        color: '#333', // Dark text color for better contrast
        marginBottom: '1.5rem', // Space between card and button
    },
    cardTitle: {
        fontSize: '2rem',
        marginBottom: '0.5rem',
    },
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
    cardText: {
        fontSize: '1.2rem',
    },
    button: {
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        zIndex: 1, // Ensure the button is above the slideshow
    },
};

export default HomePage;
