import React, { useState, useEffect } from 'react';
import homepageImage1 from '../images/homepage-image-1.webp';
import homepageImage2 from '../images/homepage-image-2.jpeg';
import homepageImage3 from '../images/homepage-image-3.jpeg';
import homepageImage4 from '../images/homepage-image-4.jpeg';
import homepageImage5 from '../images/homepage-image-5.jpeg';

const Slideshow = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = [
        homepageImage1,
        homepageImage2,
        homepageImage3,
        homepageImage4,
        homepageImage5,
    ];

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(intervalId);
    }, [images.length]);

    return (
        <div style={styles.slideshowContainer}>
            <img
                src={images[currentIndex]}
                alt="Slideshow"
                style={styles.image}
            />
        </div>
    );
};

const styles = {
    slideshowContainer: {
        position: 'relative',
        width: '100%',
        height: '100vh', // Full viewport height
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
};

export default Slideshow;
