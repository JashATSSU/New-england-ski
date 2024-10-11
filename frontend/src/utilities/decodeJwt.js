import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

const getUserInfo = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return undefined;
    
    const decodedToken = jwt_decode(accessToken);
    return decodedToken;
}

const useUserProfile = () => {
    const [pictureUrl, setPictureUrl] = useState('');

    useEffect(() => {
        const userInfo = getUserInfo();
        if (userInfo && userInfo.profilePictureUrl) {
            setPictureUrl(userInfo.profilePictureUrl);
        }
    }, []);

    return { pictureUrl };
}

export { getUserInfo, useUserProfile };
