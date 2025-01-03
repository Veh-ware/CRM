'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import { blue } from '@mui/material/colors';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Input,
} from "@mui/material";
import axios from 'axios';
import moment from "moment";


const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export function AccountDetailsForm(): React.JSX.Element {

  const getData = localStorage.getItem("AdminloginData");
  const token = JSON.parse(getData!).token;
  const ID = JSON.parse(getData!)._id;

  const [formData, setFormData] = React.useState({
    name: '',
    contact: '',
    cnic: '',
    dob: '',
    gender: '',
    salary: '',
    id: '',
  });

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('AdminloginData');
      if (storedData) {
        const userData = JSON.parse(storedData);
        setFormData({
          name: userData.name || '',
          contact: userData.phone || '',
          cnic: userData.cnic || '',
          dob: userData.dob || '',
          gender: userData.gender || '',
          salary: userData.salary || '',
          id: userData._id || '',
        });
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target as HTMLInputElement | { name: string; value: string };
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://api-vehware-crm.vercel.app/api/auth/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Profile updated successfully!',
          confirmButtonColor: '#3085d6',
        });

        if (typeof window !== 'undefined') {
          const updatedData = {
            ...JSON.parse(localStorage.getItem('AdminloginData') || '{}'),
            ...formData,
          };
          localStorage.setItem('AdminloginData', JSON.stringify(updatedData));
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Failed to update profile.',
          confirmButtonColor: '#d33',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred. Please try again.',
        confirmButtonColor: '#d33',
      });
    } finally {
      setLoading(false);
    }
  };






  const [attendanceData, setAttendanceData] = useState<any[]>([]);



  useEffect(() => {
    if (ID) {
      const fetchAttendanceData = async () => {
        try {
          const response = await axios.get(
            `https://api-vehware-crm.vercel.app/api/attendance/get/${ID}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setAttendanceData(response.data.data.attendance || []);
        } catch (err) {
          console.log("Error fetching attendance data:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchAttendanceData();
    } else {
      console.log("No ID provided");
    }
  }, [ID, token]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Card
          sx={{
            maxWidth: 800,
            mx: 'auto',
            mt: 1,
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: 'white',
          }}
        >
          <CardHeader
            subheader="Update your profile information"
            title="Profile"
            sx={{
              textAlign: 'center',
              color: blue[800],
              fontSize: '4rem',
              fontWeight: 'bold',
            }}
          />
          <Divider sx={{ mb: 6 }} />
          <CardContent>
            <Grid container spacing={3}>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Full Name</InputLabel>
                  <OutlinedInput
                    value={formData.name}
                    onChange={handleChange}
                    label="Full Name"
                    name="name"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Contact</InputLabel>
                  <OutlinedInput
                    value={formData.contact}
                    onChange={handleChange}
                    label="Contact"
                    name="contact"
                    type="tel"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>CNIC</InputLabel>
                  <OutlinedInput
                    value={formData.cnic}
                    onChange={handleChange}
                    label="CNIC"
                    name="cnic"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Date of Birth</InputLabel>
                  <OutlinedInput
                    value={formData.dob}
                    onChange={handleChange}
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    inputProps={{
                      style: {
                        padding: '10px 14px',
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={formData.gender}
                    onChange={handleChange}
                    label="Gender"
                    name="gender"
                  >
                    {genders.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Salary</InputLabel>
                  <OutlinedInput
                    value={formData.salary}
                    onChange={handleChange}
                    label="Salary"
                    name="salary"
                    type="number"
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ mt: 3, mb: 2 }} />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: blue[600],
                '&:hover': {
                  bgcolor: blue[800],
                },
              }}
            >
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </CardActions>
        </Card>
      </form>




      <Box sx={{ margin: "30px" }}>
          <TableContainer
            component={Paper}
            sx={{

              overflow: "hidden",
              boxShadow: 3,
              padding: "16px",
            }}
          >
            <Table>
              <TableHead sx={{ bgcolor: "primary.main", color: "white" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", fontSize: 16, textAlign: "center" }}>
                    Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: 16, textAlign: "center" }}>
                    Check-In
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: 16, textAlign: "center" }}>
                    Check-Out
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData && Array.isArray(attendanceData) && attendanceData.length > 0 ? (
                  attendanceData.map((data) => (
                    <TableRow
                      key={data._id}
                      sx={{
                        "&:nth-of-type(odd)": { bgcolor: "grey.100" },
                        "&:nth-of-type(even)": { bgcolor: "grey.50" },
                        "&:hover": {
                          bgcolor: "#abacc4",
                          cursor: "pointer",
                          transition: "background-color 0.3s ease",
                        },
                        "& td": {
                          fontSize: 14,
                          padding: "16px 24px",
                        },
                      }}
                    >
                      <TableCell align="center">
                        {moment(data.date).format("DD-MM-YYYY")}
                      </TableCell>

                      <TableCell sx={{ textAlign: "center" }}>{data.checkInTime}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{data.checkOutTime}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      sx={{
                        textAlign: "center",
                        fontSize: 16,
                        padding: "20px",
                      }}
                    >
                      No attendance data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
      </Box>
    </div>
  );
}
