import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import path from '../../utils/path';
import Swal from 'sweetalert2';

const FinalRegister = () => {
    const { status } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (status === 'failed') {
            Swal.fire('Oops!', 'This link has expired!', 'error').then(() => {
                navigate(`/${path.LOGIN}`);
            });
        }
        if (status === 'success') {
            Swal.fire('Congratulations!', 'Registration successful. Please log in!', 'success').then(() => {
                navigate(`/${path.LOGIN}`);
            });
        }
    }, [status, navigate]);

    return (
        <div className='h-screen w-screen bg-gray-100'></div>
    );
}

export default FinalRegister;