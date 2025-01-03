'use client'
import { IconButton } from '@mui/material'
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'


const BackIcon: React.FC = () => {
    const handleBackClick = () => {
        window.history.back();
    };
    return (
        <div>
            <IconButton style={{ padding: '10px', marginBottom: '10px', borderRadius: "10px" }} onClick={handleBackClick}   >
                <FaArrowLeft />
            </IconButton>
        </div>
    )
}

export default BackIcon
