import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.clear();
        window.location.reload();
        navigate('/');
    }, [navigate]);

    return null;
};

export default Logout;