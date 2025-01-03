'use client'

import React, { useState } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, FormHelperText, Grid, Container, Typography, IconButton, InputAdornment, Snackbar, Alert } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';


interface FormData {
    name: string;
    email: string;
    password: string;
    gender: string;
    cnic: number;
    phone: number;
    salary: number;
    dob: string;
    addedBy: string;
    type: "sub-admin";
    position: string;
    joiningDate: string;
    leavingDate: string;
    officeTiming: {
        startTime: string;
        endTime: string;
    };
}

const UserForm: React.FC = () => {
    const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        mode: 'onBlur',
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');


    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const onSubmit = (data: FormData) => {
        console.log(data);

        const adminLoginData: string | null = localStorage.getItem('AdminloginData');

        data.type = "sub-admin";




        axios.post('https://api-vehware-crm.vercel.app/api/auth/signup', data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(adminLoginData!).token}`,
            },
        })
            .then((res) => {
                console.log(res.data);

                setSnackbarMessage('Admin Added Successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            })
            .catch((error: any) => {
                // console.log(e);

                setSnackbarMessage((error.response?.data?.error || "Internal Server Error"));
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };


    return (
        <Container maxWidth="sm" sx={{ mt: { xs: 70, sm: 0 } }}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1.8rem', sm: '3rem' },
                    textAlign: 'center',
                    letterSpacing: '0.5px',
                    lineHeight: 1.2,
                    paddingBottom: 2,
                    mb: 3,
                }}
            >
                Add Sub-Admin
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="name"
                            control={control}
                            rules={{
                                required: 'Name is required',
                                minLength: { value: 3, message: 'Name must be at least 3 characters' },
                                maxLength: { value: 20, message: 'Name must be at most 20 characters' },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Name"
                                    fullWidth
                                    variant="outlined"
                                    error={Boolean(errors.name)}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: 'Email is required',
                                pattern: {
                                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: 'Invalid email address',
                                },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email"
                                    fullWidth
                                    variant="outlined"
                                    error={Boolean(errors.email)}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="password"
                            control={control}
                            rules={{
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters long",
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                                    message:
                                        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                                },
                            }}
                            render={({ field }) => {
                                const [showPassword, setShowPassword] = React.useState(false);

                                const handleTogglePassword = () => { setShowPassword((prev) => !prev); };

                                return (
                                    <TextField
                                        {...field}
                                        label="Password"
                                        fullWidth
                                        variant="outlined"
                                        type={showPassword ? "text" : "password"}
                                        error={Boolean(errors.password)}
                                        helperText={errors.password?.message}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={handleTogglePassword} edge="end">
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                );
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            name="gender"
                            control={control}
                            rules={{ required: 'Gender is required' }}
                            render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.gender)}>
                                    <InputLabel>Gender</InputLabel>
                                    <Select {...field} label="Gender">
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                    </Select>
                                    {errors.gender ? <FormHelperText>{errors.gender?.message}</FormHelperText> : null}
                                </FormControl>
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            name="cnic"
                            control={control}
                            rules={{
                                required: 'CNIC is required',
                                minLength: { value: 13, message: 'CNIC must be at least 13 digits' },
                                maxLength: { value: 13, message: 'CNIC must be at most 13 digits' },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="CNIC"
                                    fullWidth
                                    variant="outlined"
                                    type="number"
                                    error={Boolean(errors.cnic)}
                                    helperText={errors.cnic?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            name="phone"
                            control={control}
                            rules={{
                                required: 'Phone number is required',
                                minLength: { value: 10, message: 'Phone number must be at least 10 digits' },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Phone"
                                    fullWidth
                                    variant="outlined"
                                    type="number"
                                    error={Boolean(errors.phone)}
                                    helperText={errors.phone?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            name="salary"
                            control={control}
                            rules={{ required: 'Salary is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Salary"
                                    fullWidth
                                    variant="outlined"
                                    type="number"
                                    error={Boolean(errors.salary)}
                                    helperText={errors.salary?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            name="position"
                            control={control}
                            rules={{ required: 'Position is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Position"
                                    fullWidth
                                    variant="outlined"
                                    type="text"
                                    error={Boolean(errors.position)}
                                    helperText={errors.position?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            name="dob"
                            control={control}
                            rules={{ required: 'Date of Birth is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Date of Birth"
                                    fullWidth
                                    variant="outlined"
                                    type="date"
                                    error={Boolean(errors.dob)}
                                    helperText={errors.dob?.message}
                                    InputLabelProps={{ shrink: true }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="joiningDate"
                            control={control}
                            rules={{
                                required: "Joining Date is required",
                                validate: (value: string) => value !== "" || "Invalid date format (yyyy-mm-dd)",
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Joining Date"
                                    fullWidth
                                    variant="outlined"
                                    type="date"
                                    error={Boolean(errors.joiningDate)}
                                    helperText={errors.joiningDate?.message}
                                    InputLabelProps={{ shrink: true }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="officeTiming.startTime"
                            control={control}
                            rules={{ required: 'Office Start Timing is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Office Start Timing "
                                    fullWidth
                                    variant="outlined"
                                    type="time"
                                    error={Boolean(errors.officeTiming?.startTime)}
                                    helperText={errors.officeTiming?.startTime?.message}
                                    InputLabelProps={{ shrink: true }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="officeTiming.endTime"
                            control={control}
                            rules={{ required: 'Office End Timing is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Office End Time"
                                    fullWidth
                                    variant="outlined"
                                    type="time"
                                    error={Boolean(errors.officeTiming?.endTime)}
                                    helperText={errors.officeTiming?.endTime?.message}
                                    InputLabelProps={{ shrink: true }}
                                />
                            )}
                        />
                    </Grid>


                    <Grid item xs={12}>
                        <Button type="submit" fullWidth variant="contained" color="primary">
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </Container>
    );
};

export default UserForm;
