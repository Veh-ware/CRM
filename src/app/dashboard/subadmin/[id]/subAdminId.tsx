'use client';

import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress, Box, CardActions, IconButton, Divider, Avatar, Grid, Button, Container, CardHeader } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';
import Swal from 'sweetalert2';
import EmolyeeAttendace from '../../employ/[id]/EmployeeAttendance';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Subadmin {
    _id: string;
    cnic: string;
    dob: string;
    email: string;
    gender: string;
    name: string;
    phone: string;
    salary: number;
    type: string;
    avatar?: string;
    amount?: number;
    serviceType: string;
    position: string;
    joiningDate: string;
    leavingDate: string;
    officeTiming: {
        startTime: string;
        endTime: string;
    };
}






function Page() {
    const params = useParams();
    const id = params?.id;
    const [subadmin, setSubAdmins] = useState<Subadmin | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("Subadmin ID is missing.");
            setLoading(false);
            return;
        }

        const fetchSubadmin = async () => {
            try {
                const adminLoginData = localStorage.getItem("AdminloginData");

                if (!adminLoginData) {
                    throw new Error("Admin login data is missing");
                }

                const parsedData = JSON.parse(adminLoginData);

                if (!parsedData.token) {
                    throw new Error("Token is missing in admin login data");
                }

                const response = await axios.get(
                    `https://api-vehware-crm.vercel.app/api/credentials/admin/${id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${parsedData.token}`,
                        },
                    }
                );
                setSubAdmins(response.data.data);
                console.log(response.data.data)

            } catch (err) {
                setError(err instanceof Error ? err.message : "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchSubadmin();

    }, [id]);


    const handleDelete = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const adminLoginData: string | null = localStorage.getItem('AdminloginData');

                    if (adminLoginData) {
                        const token = JSON.parse(adminLoginData).token;

                        const response = await axios.delete(
                            `https://api-vehware-crm.vercel.app/api/auth/delete/${id}`,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        if (response.status === 200) {
                            Swal.fire('Deleted!', 'The sub-admin has been deleted.', 'success');
                        }
                    }
                } catch (err) {
                    setError('Failed to delete the sub-admin.');
                    Swal.fire('Error!', 'There was an issue deleting the sub-admin.', 'error');
                }
                setLoading(false);
            }
        });
    };


    function handleback() {
        window.history.back();
    }



    if (loading) {
        return (
           <Grid container justifyContent="center" alignItems="center" sx={{ height: '96vh' }}>
                           <CircularProgress />
                       </Grid>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography variant="h6" color="error">{error}</Typography>
            </Container>
        );
    }

    if (!subadmin) {
        return (
            <Container>
                <Typography variant="h6">No Subadmin Found</Typography>
            </Container>
        );
    }

    return (
        <>


            <Container sx={{ padding: '20px', backgroundColor: '#f4f6f8', minHeight: '100vh', borderRadius: 6 }}>

                <Box sx={{ position: 'relative', marginBottom: 4 }}>
                    <Button
                        onClick={handleback}
                        sx={{
                            position: 'absolute',
                            top: 10,
                            left: -10,
                           
                            fontWeight: 'bold',
                            textTransform: 'none',
                            color: '#273f73',
                            fontSize: '22px',
                           
                        }}
                    >
                        <ArrowBackIcon sx={{ fontSize: '34px' }} />
                    </Button>
                </Box>

                <Card sx={{ maxWidth: 1000, margin: 'auto', borderRadius: 4, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff', padding: 3 }}>
                    <CardHeader
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }} 
                        avatar={
                            <Avatar
                                src={subadmin.avatar || '/default-avatar.jpg'}
                                alt={subadmin.name}
                                sx={{ width: 100, height: 100, border: '4px solidrgb(23, 57, 91)', backgroundColor: '#273f73', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)' }}
                            />
                        }
                        title={<Typography variant="h4" sx={{ fontWeight: 'bold', color: '#273f73' }}>{subadmin.name}</Typography>}
                        action={
                            <IconButton onClick={handleDelete} sx={{ color: '#d32f2f', '&:hover': { color: '#b71c1c' } }}>
                                <DeleteIcon />
                            </IconButton>
                        }
                    />
                    <Divider sx={{ marginBottom: 2 }} />
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                                    <strong>Email:</strong> {subadmin.email}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                                    <strong>Gender:</strong> {subadmin.gender}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                                    <strong>Phone:</strong> {subadmin.phone}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                                    <strong>Salary:</strong> ${subadmin.salary}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                                    <strong>Position:</strong> {subadmin.position}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                                    <strong>Date of Birth:</strong> {new Date(subadmin.dob).toLocaleDateString()}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                                    <strong>Joining Date:</strong> {new Date(subadmin.joiningDate).toLocaleDateString()}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                                    <strong>Office Start Time:</strong> {subadmin.officeTiming?.startTime}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                                    <strong>Office End Time:</strong> {subadmin.officeTiming?.endTime}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Card sx={{ maxWidth: 1000, margin: 'auto', marginTop: 4, borderRadius: 4, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff', padding: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#273f73' }}>
                        Employee Attendance
                    </Typography>
                    <Divider />
                    <Box mt={2}>
                        <EmolyeeAttendace />
                    </Box>
                </Card>
            </Container>


        </>


    );
}

export default Page;
