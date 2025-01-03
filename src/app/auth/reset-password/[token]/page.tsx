'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';

export default function ResetPasswordPage(): React.JSX.Element {
    const [isPending, setIsPending] = React.useState<boolean>(false);
    const { token } = useParams<{ token: string }>() as { token: string };
    console.log(token);
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<any>({
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: any) => {
        if (data.password !== data.confirmPassword) {
            Swal.fire({
                title: "Error",
                text: "Passwords do not match.",
                icon: "error",
            });
            return;
        }

        setIsPending(true);

        try {
            const response = await axios.post(
                `https://api-vehware-crm.vercel.app/api/auth/reset/${token}`, 
                {
                    newPassword: data.password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                Swal.fire({
                    title: "Password Reset Successful!",
                    text: "Your password has been reset successfully.",
                    icon: "success",
                }).then(() => {
                    window.location.href = '/auth/sign-in'; 
                });
            }
        } catch (error: any) {
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || 'Something went wrong, please try again.',
                icon: 'error',
            });
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Layout>
            <GuestGuard>
                <Stack spacing={4}>
                    <Typography variant="h5">Reset your password</Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={2}>
                            <Controller
                                name="password"
                                control={control}
                                rules={{
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                }}
                                render={({ field }) => (
                                    <FormControl error={Boolean(errors.password)} fullWidth>
                                        <InputLabel>Password</InputLabel>
                                        <OutlinedInput {...field} label="Password" type="password" />
                                        {errors.password && (
                                            <FormHelperText>{String(errors.password.message)}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                            <Controller
                                name="confirmPassword"
                                control={control}
                                rules={{
                                    required: 'Confirm Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Confirm password must be at least 6 characters',
                                    },
                                }}
                                render={({ field }) => (
                                    <FormControl error={Boolean(errors.confirmPassword)} fullWidth>
                                        <InputLabel>Confirm Password</InputLabel>
                                        <OutlinedInput {...field} label="Confirm Password" type="password" />
                                        {errors.confirmPassword && (
                                            <FormHelperText>{String(errors.confirmPassword.message)}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                            <Button disabled={isPending} type="submit" variant="contained">
                                {isPending ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </GuestGuard>
        </Layout>
    );
}
