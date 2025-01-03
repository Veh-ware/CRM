'use client';

import * as React from 'react';
import { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { AppContext } from '@/contexts/isLogin';
import Swal from 'sweetalert2';

interface AddBrandProps {
    open: boolean;
    handleClose: () => void;
}

export default function AddBrand({ open, handleClose }: AddBrandProps) {
    const { storedValue } = useContext(AppContext)!;
    const [file, setFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        image: null as any,
        description: '',
    });
    const [errors, setErrors] = useState<any>({});

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setFormData({ ...formData, image: file });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async () => {
        const newErrors: any = {};

        if (!formData.title) {
            newErrors.title = 'Title is required';
        }

        if (!file) {
            newErrors.image = 'Image is required';
        }

        if (!formData.description || formData.description.length < 15) {
            newErrors.description = 'Description must be at least 15 characters';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            // Create FormData for sending file data
            const data = new FormData();
            data.append('title', formData.title);
            data.append('image', formData.image);
            data.append('description', formData.description);

            const response = await axios.post('https://api-vehware-crm.vercel.app/api/brand/add', data, {
                headers: {
                    'Authorization': `Bearer ${storedValue.token}`,
                },
            });

            let resp: any = response.data;

            if (resp.status === 200) {
                setFormData({
                    title: '',
                    image: null as any,
                    description: '',
                });
                setFile(null);
                setImagePreview(null);
                handleClose();
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Brand added successfully!',
                    confirmButtonText: 'OK',
                }).then(() => {
                    console.log('Form submitted successfully');
                });
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong! Please try again.',
                confirmButtonText: 'OK',
            });
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            style={{ zIndex: 1301 }}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Add Brand</DialogTitle>
            <DialogContent>
                <TextField
                    name="title"
                    label="Title"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData.title}
                    onChange={handleFormChange}
                    error={!!errors.title}
                    helperText={errors.title}
                />

                <div style={{ marginBottom: '16px' }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        id="image-upload"
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="image-upload">
                        <Button
                            component="span"
                            startIcon={<CloudUploadIcon />}
                            variant="outlined"
                            fullWidth
                        >
                            {file ? 'Image Selected' : 'Select Image'}
                        </Button>
                    </label>
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                                objectFit: 'cover',
                                marginTop: '16px',
                                borderRadius: '20px',
                            }}
                        />
                    )}
                    {errors.image && (
                        <div style={{ color: 'red', marginTop: '8px' }}>{errors.image}</div>
                    )}
                </div>

                <TextField
                    name="description"
                    label="Description"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={handleFormChange}
                    error={!!errors.description}
                    helperText={errors.description}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleFormSubmit} variant="contained" color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}

