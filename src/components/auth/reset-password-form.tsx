'use client';

import * as React from 'react';
import Alert from '@mui/material/Alert';
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

export function ResetPasswordForm(): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false); 
  const [formData, setFormData] = React.useState<any>(null); 

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: any) => {
    setIsPending(true); 
    setFormData(data);  

    try {
      const response = await axios.post(
        'https://api-vehware-crm.vercel.app/api/auth/forget',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Password Reset Link Sent!",
          text: "Please check your email for the reset link.",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/auth/sign-in';
          }
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
    <Stack spacing={4}>
      <Typography variant="h5">Reset password</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email address', 
              },
            }}
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)} fullWidth>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email && (
                  <FormHelperText>{String(errors.email.message)}</FormHelperText> 
                )}
              </FormControl>
            )}
          />
          <Button disabled={isPending} type="submit" variant="contained">
            {isPending ? 'Sending...' : 'Send recovery link'}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
