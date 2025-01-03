import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress } from '@mui/material';

interface AttendanceModalProps {
    id: any;
    token: any;
    modalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<any>>; // Function to set modal state
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({ id, token, modalOpen, setModalOpen }) => {
    const [attendaneToMark, setAttendaneToMark] = useState<{
        date: string;
        checkIn: string;
        checkOut: string;
    }>({
        date: '',
        checkIn: '',
        checkOut: '',
    });

    const [loading, setLoading] = useState<boolean>(false);

    const handleAttendanceValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAttendaneToMark((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleMarkAttendance = async () => {
        if (!attendaneToMark.date) {
            Swal.fire({
                title: 'Missing Information',
                text: 'Please fill in all fields before saving.',
                icon: 'warning',
                customClass: {
                    popup: 'swal-popup',
                },
            });
            setModalOpen(false);
            return;
        }

        if (!attendaneToMark.checkIn || !attendaneToMark.checkOut) {
            Swal.fire({
                title: 'Mark attendance without Check-in/Check-out?',
                text: "This employee will be marked absent, are you sure you want to proceed?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, mark absent',
                cancelButtonText: 'No, go back',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setModalOpen(false);
                    await makeApiCall();
                } else {
                    setModalOpen(true);
                }
            });
            setModalOpen(false);
        } else {
            await makeApiCall();
        }
    };

    const makeApiCall = async () => {
        setLoading(true);

        try {
            const response = await axios.post(
                `https://api-vehware-crm.vercel.app/api/attendance/single-add/${id}`,
                {
                    userType: 'Employee',
                    date: attendaneToMark?.date,
                    checkInTime: attendaneToMark?.checkIn || null,
                    checkOutTime: attendaneToMark?.checkOut || null,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                Swal.fire({
                    title: 'Successfully Marked Attendance',
                    icon: 'success',
                    customClass: {
                        popup: 'swal-popup',
                    },
                }).then(() => {
                    setAttendaneToMark({ date: '', checkIn: '', checkOut: '' });
                });
                setModalOpen(false);
            }
        } catch (error: any) {
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.error || 'Something went wrong, please try again.',
                icon: 'error',
                customClass: {
                    popup: 'swal-popup',
                },
            });
            setModalOpen(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 600, fontSize: 20, color: 'primary.main' }}>
                Mark Attendance
            </DialogTitle>
            <DialogContent sx={{ paddingTop: 2 }}>
                <TextField
                    label="Date"
                    name="date"
                    type="date"
                    value={attendaneToMark?.date || ''}
                    onChange={handleAttendanceValueChange}
                    fullWidth
                    margin="normal"
                    sx={{
                        '& .MuiInputLabel-root': { fontWeight: 500 },
                        '& .MuiInputBase-root': { borderRadius: '8px' },
                    }}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Check-in"
                    name="checkIn"
                    type="time"
                    value={attendaneToMark?.checkIn || ''}
                    onChange={handleAttendanceValueChange}
                    fullWidth
                    margin="normal"
                    sx={{
                        '& .MuiInputLabel-root': { fontWeight: 500 },
                        '& .MuiInputBase-root': { borderRadius: '8px' },
                    }}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Check-out"
                    name="checkOut"
                    type="time"
                    value={attendaneToMark?.checkOut || ''}
                    onChange={handleAttendanceValueChange}
                    fullWidth
                    margin="normal"
                    sx={{
                        '& .MuiInputLabel-root': { fontWeight: 500 },
                        '& .MuiInputBase-root': { borderRadius: '8px' },
                    }}
                    InputLabelProps={{ shrink: true }}
                />
            </DialogContent>
            <DialogActions sx={{ padding: '16px' }}>
                <Button
                    onClick={() => setModalOpen(false)}
                    color="secondary"
                    sx={{
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': { backgroundColor: 'grey.200' },
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleMarkAttendance}
                    color="primary"
                    disabled={loading}
                    sx={{
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': { backgroundColor: 'primary.dark', color: 'white' },
                    }}
                >
                    {loading ? <CircularProgress size={20} /> : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AttendanceModal;
