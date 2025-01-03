'use client';
import { useState, useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Grid,
    Divider,
    CircularProgress,
    IconButton,
    Modal,
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
} from "@mui/material";
import { grey, red, blue } from "@mui/material/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import BackIcon from "@/components/BackIcon";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import dayjs from "dayjs";
import EditIcon from '@mui/icons-material/Edit';
import AttendanceModal from "./singleEmployeeAttendance";
import moment from "moment";


interface Employee {
    _id: string;
    cnic: string;
    dob: string;
    email: string;
    gender: string;
    name: string;
    phone: string;
    salary: number;
    type: string;
    position: string;
    joiningDate: string;
    leavingDate: string | undefined;
    avatar?: string;
    officeTiming: {
        startTime: string;
        endTime: string;
    };
}

export default function EmployeeDetails() {
    const { id } = useParams<{ id: string }>() || {};
    const router = useRouter();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editedEmployee, setEditedEmployee] = useState<any>(null);
    const [attendaneToMark, setAttendaneToMark] = useState<any>({
        date: '',
        checkIn: '',
        checkOut: '',
    });
    const [success, setSuccess] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null); 
    const [isModalOpen, setIsModalOpen] = useState<any>(false);

    const getData = localStorage.getItem("AdminloginData");
    const token = JSON.parse(getData!).token;


    useEffect(() => {
        const fetchEmployee = async () => {
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
                    `https://api-vehware-crm.vercel.app/api/credentials/employee/${id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${parsedData.token}`,
                        },
                    }
                );

                setEmployee(response.data.data);
                setEditedEmployee(response.data.data); // Initialize editedEmployee with employee data
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEmployee();
        }
    }, [id]);

    const handleDelete = async () => {
        try {
            const adminLoginData = localStorage.getItem("AdminloginData");

            if (!adminLoginData) {
                throw new Error("Admin login data is missing");
            }

            const parsedData = JSON.parse(adminLoginData);

            if (!parsedData.token) {
                throw new Error("Token is missing in admin login data");
            }

            await axios.delete(
                `https://api-vehware-crm.vercel.app/api/auth/delete/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${parsedData.token}`,
                    },
                }
            );

            setLoading(false);
            setSuccess("Employee deleted successfully.");
            Swal.fire("Deleted!", "Employee deleted successfully.", "success");
            setTimeout(() => {
                router.push("/dashboard/employ");
            }, 2000);
        } catch (err) {
            setLoading(false);
            setDeleteError(err instanceof Error ? err.message : "Failed to delete employee.");
            Swal.fire("Error", err instanceof Error ? err.message : "Failed to delete employee.", "error");
        }
    };

    const handleDeleteConfirmation = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to delete this employee? This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire("Cancelled", "Your employee is safe.", "info");
            }
        });
    };



    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedEmployee({
            ...editedEmployee!,
            [e.target.name]: e.target.value,
        });
    };


    // const handleAttendanceValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target;
    //     setAttendaneToMark(prevState => ({
    //         ...prevState,
    //         [name]: value,
    //     }));
    // };



    const convertToAmPm = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        const suffix = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedTime = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${suffix}`;
        return formattedTime;
    };



    const handleSaveChanges = async () => {
        if (!editedEmployee) return;
        try {
            const adminLoginData = localStorage.getItem("AdminloginData");

            if (!adminLoginData) {
                throw new Error("Admin login data is missing");
            }

            const parsedData = JSON.parse(adminLoginData);

            if (!parsedData.token) {
                throw new Error("Token is missing in admin login data");
            }

            setLoading(true);

            // Ensure the date is formatted correctly
            const formattedDob = formatDate(editedEmployee.dob);
            const formattedJoiningDate = formatDate(editedEmployee.joiningDate);
            const formattedLeavingDate = editedEmployee.leavingDate === 'Present' ? 'Present' : (editedEmployee.leavingDate ? formatDate(editedEmployee.leavingDate) : undefined);


            // let data = { ...editedEmployee, dob: formattedDob, joiningDate: formattedJoiningDate, leavingDate: formattedLeavingDate }

            // console.log(data)

            const response = await axios.patch(
                `https://api-vehware-crm.vercel.app/api/auth/update-employee/${id}`,
                { ...editedEmployee, dob: formattedDob, joiningDate: formattedJoiningDate, leavingDate: formattedLeavingDate },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${parsedData.token}`,
                    },
                }
            );

            if (response.status === 200) {

                setEmployee(response.data.data);
                setOpenEditModal(false);

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Employee updated successfully!",
                    confirmButtonColor: "#3085d6",
                }).then(() => {

                    setSuccess('');
                });

            } else {
                throw new Error(response.data.message || "Failed to update employee.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred.");
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err instanceof Error ? err.message : "An error occurred.",
                confirmButtonColor: "#d33",
            });
        } finally {
            setLoading(false);
        }
    };



    const formatDate = (dateString: string): string => {
        return dayjs(dateString).format("YYYY-MM-DD");
    };



    const isValidDate = (dateString: string | undefined): boolean => {
        if (!dateString || dateString === 'Present') return true;
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    };




    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    if (!employee) {
        return (
            <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6" color="textSecondary">
                    Employee not found
                </Typography>
            </Box>
        );
    }




    return (
        <Box sx={{ p: 4, backgroundColor: grey[100] }}>
            <Grid item xs={12} sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <BackIcon />
                <IconButton
                    onClick={handleDeleteConfirmation}
                    sx={{
                        color: red[700],
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '12px',
                        '&:hover': {
                            backgroundColor: 'white',
                            color: 'red'
                        },
                        transition: 'all 0.3s ease',
                        marginBottom: 2
                    }}
                >
                    <DeleteIcon sx={{ fontSize: 30 }} />
                </IconButton>
            </Grid>

            {isModalOpen && <AttendanceModal id={id} token={token} modalOpen={isModalOpen} setModalOpen={setIsModalOpen} />}

            <Grid container spacing={2} maxWidth="lg">
                <Grid item xs={2}>
                    <Button
                        onClick={() => setIsModalOpen(!isModalOpen)}
                        sx={{
                            backgroundColor: "#1565c0",
                            color: "#fff",
                            borderRadius: "8px",
                            padding: "8px 16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            "&:hover": {
                                backgroundColor: "#42a5f5",
                            },
                            "&:disabled": {
                                backgroundColor: "primary.dark",
                                color: "#757575",
                            },
                            transition: "background-color 0.3s ease",
                        }}
                    >
                        Mark Attendance
                    </Button>
                </Grid>
                <Grid item xs={10}>
                    <Typography
                        variant="h3"
                        align="center"
                        gutterBottom
                        sx={{
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 700,
                            color: blue[800],
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            margin: '0 auto',
                            mb: 3
                        }}
                    >
                        Employee Details
                    </Typography>
                </Grid>


                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 8,
                        textAlign: 'center',
                        height: '100%',
                        boxShadow: 4,
                        borderRadius: 3,
                        backgroundColor: '#ffffff',
                        border: `1px solid ${grey[300]}`,
                        '&:hover': { boxShadow: 8 },
                    }}>
                        <Avatar
                            src={employee?.avatar || ""}
                            sx={{
                                width: 120,
                                height: 120,
                                mb: 4,
                                bgcolor: blue[800],
                                color: "common.white",
                                fontSize: "2.5rem",
                                fontWeight: "bold",
                                border: `4px solid #ffffff`,
                                boxShadow: 3,
                            }}
                        >
                            {employee?.name.charAt(0)}
                        </Avatar>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: "'Poppins', sans-serif",
                                fontWeight: 600,
                                color: blue[800],
                                textTransform: "capitalize",
                                marginBottom: 1,
                            }}
                        >
                            {employee?.name}
                        </Typography>
                        <Typography color="textSecondary" variant="body2" sx={{ fontStyle: 'italic' }}>
                            {employee?.type.toUpperCase()}
                        </Typography>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={8}>
                    <Card sx={{ boxShadow: 4, borderRadius: 3, backgroundColor: "#ffffff" }}>
                        <CardContent>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    fontFamily: "'Poppins', sans-serif",
                                    fontWeight: 600,
                                    color: blue[800],
                                    marginBottom: 2,
                                }}
                            >
                                Personal Information
                            </Typography>
                            <Divider sx={{ mb: 3, backgroundColor: grey[300] }} />
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" sx={{ color: grey[700] }}>
                                        <strong>CNIC:</strong> {employee?.cnic}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" sx={{ color: grey[700] }}>
                                        <strong>Date of Birth:</strong> {employee?.dob ? new Date(employee.dob).toLocaleDateString() : "N/A"}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" sx={{ color: grey[700] }}>
                                        <strong>Email:</strong> {employee?.email}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" sx={{ color: grey[700] }}>
                                        <strong>Phone:</strong> {employee?.phone}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" sx={{ color: grey[700] }}>
                                        <strong>Gender:</strong> {employee?.gender}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" sx={{ color: grey[700] }}>
                                        <strong>Salary:</strong> {`$${employee?.salary.toLocaleString()}`}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" sx={{ color: grey[700] }}>
                                        <strong>Joining Date:</strong> {employee?.joiningDate ? formatDate(employee.joiningDate) : "N/A"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" sx={{ color: grey[700] }}>
                                        <strong>Leaving Date:</strong> {employee?.leavingDate || "Present"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" sx={{ color: grey[700] }}>
                                        <strong>Position:</strong> {employee?.position}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" sx={{ color: grey[700] }}>
                                        <strong>Office Start Time:</strong> {employee?.officeTiming?.startTime}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" sx={{ color: grey[700] }}>
                                        <strong>Office End Time:</strong> {employee?.officeTiming?.endTime}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Button
                                onClick={() => setOpenEditModal(true)}
                                color="primary"
                                disabled={loading}
                                sx={{
                                    backgroundColor: "#1565c0",
                                    color: "#fff",
                                    borderRadius: "8px",
                                    padding: "8px 16px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    "&:hover": {
                                        backgroundColor: "#42a5f5",
                                    },
                                    "&:disabled": {
                                        backgroundColor: "primary.dark",
                                        color: "#757575",
                                    },
                                    transition: "background-color 0.3s ease",
                                }}
                            >
                                <EditIcon />
                                Edit
                            </Button>

                        </CardContent>
                    </Card>
                </Grid>


                <Dialog
                    open={openEditModal}
                    onClose={() => setOpenEditModal(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ fontWeight: 600, fontSize: 20, color: 'primary.main' }}>
                        Edit Employee
                    </DialogTitle>
                    <DialogContent sx={{ paddingTop: 2 }}>
                        <TextField
                            label="Name"
                            name="name"
                            value={editedEmployee?.name || ''}
                            onChange={handleEditChange}
                            fullWidth
                            margin="normal"
                            sx={{
                                '& .MuiInputLabel-root': { fontWeight: 500 },
                                '& .MuiInputBase-root': { borderRadius: '8px' },
                            }}
                        />
                        <TextField
                            label="CNIC"
                            name="cnic"
                            value={editedEmployee?.cnic || ''}
                            onChange={handleEditChange}
                            fullWidth
                            margin="normal"
                            sx={{
                                '& .MuiInputLabel-root': { fontWeight: 500 },
                                '& .MuiInputBase-root': { borderRadius: '8px' },
                            }}
                        />
                        <TextField
                            label="Date of Birth"
                            name="dob"
                            type="date"
                            value={
                                editedEmployee?.dob
                                    ? new Date(editedEmployee.dob).toISOString().split('T')[0]
                                    : ''
                            }
                            onChange={handleEditChange}
                            fullWidth
                            margin="normal"
                            sx={{
                                '& .MuiInputLabel-root': { fontWeight: 500 },
                                '& .MuiInputBase-root': { borderRadius: '8px' },
                            }}
                        />
                        <TextField
                            label="Phone"
                            name="phone"
                            value={editedEmployee?.phone || ''}
                            onChange={handleEditChange}
                            fullWidth
                            margin="normal"
                            sx={{
                                '& .MuiInputLabel-root': { fontWeight: 500 },
                                '& .MuiInputBase-root': { borderRadius: '8px' },
                            }}
                        />
                        <TextField
                            label="Salary"
                            name="salary"
                            value={editedEmployee?.salary || ''}
                            onChange={handleEditChange}
                            fullWidth
                            margin="normal"
                            type="number"
                            sx={{
                                '& .MuiInputLabel-root': { fontWeight: 500 },
                                '& .MuiInputBase-root': { borderRadius: '8px' },
                            }}
                        />
                        <TextField
                            label="Joining Date"
                            name="joiningDate"
                            type="date"
                            value={
                                editedEmployee?.joiningDate
                                    ? new Date(editedEmployee.joiningDate).toISOString().split('T')[0]
                                    : ''
                            }
                            onChange={handleEditChange}
                            fullWidth
                            margin="normal"
                            sx={{
                                '& .MuiInputLabel-root': { fontWeight: 500 },
                                '& .MuiInputBase-root': { borderRadius: '8px' },
                            }}
                        />
                        <TextField
                            label="Leaving Date"
                            name="leavingDate"
                            type="date"
                            value={
                                editedEmployee?.leavingDate === 'Present'
                                    ? ''
                                    : editedEmployee?.leavingDate && isValidDate(editedEmployee?.leavingDate)
                                        ? new Date(editedEmployee.leavingDate).toISOString().split('T')[0]
                                        : ''
                            }
                            onChange={handleEditChange}
                            fullWidth
                            margin="normal"
                            sx={{
                                '& .MuiInputLabel-root': { fontWeight: 500 },
                                '& .MuiInputBase-root': { borderRadius: '8px' },
                            }}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: editedEmployee?.leavingDate === 'Present' ? (
                                    <InputAdornment position="start">
                                        <Typography variant="body2" sx={{ color: 'grey' }}>
                                            Present
                                        </Typography>
                                    </InputAdornment>
                                ) : null,
                            }}
                        />
                        <Button
                            onClick={() => {
                                setEditedEmployee((prevEmployee : any) => {
                                    if (prevEmployee === null) return null;
                                    return {
                                        ...prevEmployee,
                                        leavingDate: prevEmployee.leavingDate === 'Present' ? '' : 'Present',
                                    };
                                });
                            }}
                            sx={{
                                marginTop: 2,
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: 'primary.light',
                                    color: 'white',
                                },
                            }}
                        >
                            {editedEmployee?.leavingDate === 'Present'
                                ? 'Edit Leaving Date'
                                : 'Set as Present'}
                        </Button>
                        <TextField
                            label="Position"
                            name="position"
                            value={editedEmployee?.position || ''}
                            onChange={handleEditChange}
                            fullWidth
                            margin="normal"
                            sx={{
                                '& .MuiInputLabel-root': { fontWeight: 500 },
                                '& .MuiInputBase-root': { borderRadius: '8px' },
                            }}
                        />
                        <TextField
                            label="Office Start Time"
                            name="startTime"
                            value={
                                editedEmployee?.officeTiming?.startTime
                                    ? moment(editedEmployee?.officeTiming?.startTime, "hh:mm A").format("HH:mm")
                                    : ''
                            }
                            onChange={(e) => {
                                // Format the time entered by user and update it
                                setEditedEmployee({
                                    ...editedEmployee!,
                                    officeTiming: {
                                        ...editedEmployee?.officeTiming,
                                        startTime: moment(e.target.value, "HH:mm").format("hh:mm A") // Save in 12-hour format
                                    }
                                });
                            }}
                            fullWidth
                            type="time"
                            margin="normal"
                            sx={{
                                '& .MuiInputLabel-root': { fontWeight: 500 },
                                '& .MuiInputBase-root': { borderRadius: '8px' },
                            }}
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            label="Office End Time"
                            name="endTime"
                            value={
                                editedEmployee?.officeTiming?.endTime
                                    ? moment(editedEmployee?.officeTiming?.endTime, "hh:mm A").format("HH:mm")
                                    : ''
                            }
                            onChange={(e) => {
                                setEditedEmployee({
                                    ...editedEmployee!,
                                    officeTiming: {
                                        ...editedEmployee?.officeTiming,
                                        endTime: moment(e.target.value, "HH:mm").format("hh:mm A") // Save in 12-hour format
                                    }
                                });
                            }}
                            fullWidth
                            type="time"
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
                            onClick={() => setOpenEditModal(false)}
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
                            onClick={handleSaveChanges}
                            color="primary"
                            disabled={loading}
                            sx={{
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': { backgroundColor: 'primary.dark' },
                            }}
                        >
                            {loading ? <CircularProgress size={20} /> : 'Save'}
                        </Button>
                    </DialogActions>
                </Dialog>




            </Grid>
        </Box>
    );
}