'use client';

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  Typography,
  Avatar,
  Grid,
  Divider,
  CircularProgress,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  SelectChangeEvent,
  InputAdornment
} from "@mui/material";
import Swal from "sweetalert2";
import BackIcon from "@/components/BackIcon";
import { grey, teal, red, blue } from "@mui/material/colors";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';
import ClientOrders from '@/components/dashboard/client/clientOrderId'


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
  avatar?: string;
  serviceType: string;
  country: string;
}


interface OrderData {
  brandId: string;
  clientId: string;
  title: string;
  description: string;
  price: string;
  discountPrice: string;
}


export default function clientDetails() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id; // Ensure id is a string


  const router = useRouter(); // To redirect after deletion
  const [deleteError, setDeleteError] = useState<string | null>(null); // For delete errors
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [brands, setBrands] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false); // State to handle modal visibility

  const getData = localStorage.getItem("AdminloginData");
  const token = JSON.parse(getData!).token;

  const [orderData, setOrderData] = useState<OrderData>({
    brandId: '',
    clientId: id || '', // Use the resolved `id` here
    title: '',
    description: '',
    price: '',
    discountPrice: '',

  }); // State to hold order form data

  const [formErrors, setFormErrors] = useState({
    title: '',
    price: '',
    discountPrice: '',
    description: '',
    brandId: '',

  });

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDropdownChange = (e: SelectChangeEvent<string>) => {
    setOrderData(prevState => ({
      ...prevState,
      brandId: e.target.value,
    }));
  };

  const validateForm = () => {
    let errors = {
      title: '',
      price: '',
      discountPrice: '',
      description: '',
      brandId: '',
    };

    if (!orderData.title) {
      errors.title = 'Title is required';
    }

    if (!orderData.price) {
      errors.price = 'Price is required';
    }


    if (!orderData.description) {
      errors.description = 'Description is required';
    }

    if (!orderData.brandId) {
      errors.brandId = 'Brand is required';
    }

    setFormErrors(errors);

    return !Object.values(errors).some(error => error !== '');
  };

  const handleOrderSubmit = async () => {
    // Validate the form before submitting
    if (!validateForm()) {
      return;
    }


    try {
      const response = await axios.post(
        'https://api-vehware-crm.vercel.app/api/order/create-order',
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response) {
        Swal.fire({
          title: "Successfully Created!",
          text: "Thank You",
          icon: "success",
        });
      }

    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again.",
        icon: "error",
      });
    }

    handleModalClose();
  };




  useEffect(() => {
    if (!id) {
      setError("Employee ID is missing.");
      setLoading(false);
      return;
    }

    const fetchEmployee = async () => {
      try {
        if (!token) {
          throw new Error("Token is missing in admin login data");
        }

        const response = await axios.get(
          `https://api-vehware-crm.vercel.app/api/brand/get`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBrands(response.data.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);


  //Get Single CLient Data APi
  useEffect(() => {
    if (!id) {
      setError("Employee ID is missing.");
      setLoading(false);
      return;
    }

    const fetchEmployee = async () => {
      try {
        if (!token) {
          throw new Error("Token is missing in admin login data");
        }

        const response = await axios.get(
          `https://api-vehware-crm.vercel.app/api/credentials/client/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEmployee(response.data.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
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
        `https://api-vehware-crm.vercel.app/api/auth/delete-client/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parsedData.token}`,
          },
        }
      );

      Swal.fire("Deleted!", "Employee deleted successfully.", "success");
      setEmployee(null);
      setTimeout(() => {
        router.push("/dashboard/employ");
      }, 2000);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete the employee"
      );
    }
  };

  const confirmDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "The employee was not deleted.", "info");
      }
    });
  };



  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
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
          Client not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 4, sm: 6 },
        backgroundColor: grey[100],
        minHeight: "100vh",
        position: "relative",
        borderRadius: '20px',
      }}
    >
      <Grid
        item
        xs={6}
        sx={{
          position: "absolute",
          top: -50,
          left: 2,
          zIndex: 30,
        }}
      >
        <BackIcon />
      </Grid>

      <Grid item xs={12} sx={{ position: "absolute", top: 16, right: 16 }}>
        <IconButton
          onClick={confirmDelete}
          sx={{
            color: red[700],
            borderRadius: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px",
            "&:hover": {
              color: "red",
            },
            transition: "all 0.3s ease",
            marginBottom: 2,
          }}
        >
          <DeleteIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </Grid>

      <Grid
        container
        spacing={4}
        maxWidth="lg"
        sx={{
          margin: "0 auto",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Grid item xs={12} sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              color: blue[800],
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
          >
            Client Details
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 3,
                  textAlign: "center",
                  height: "100%",
                  boxShadow: 6,
                  borderRadius: 4,
                  background: `linear-gradient(to bottom, ${blue[50]}, #fff)`,
                  border: `1px solid ${grey[300]}`,
                  "&:hover": {
                    boxShadow: 10,
                  },
                }}
              >
                <Avatar
                  src={employee.avatar || ""}
                  sx={{
                    width: { xs: 100, sm: 140 },
                    height: { xs: 100, sm: 140 },
                    mb: 2,
                    bgcolor: blue[800],
                    color: "common.white",
                    fontSize: { xs: "2rem", sm: "2.5rem" },
                    fontWeight: "bold",
                    border: 4,
                    boxShadow: 3,
                  }}
                >
                  {employee.name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    color: blue[800],
                    textTransform: "capitalize",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  }}
                >
                  {employee.name}
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body2"
                  sx={{
                    fontStyle: "italic",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  {employee.type.toUpperCase()}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={8}>
              <Card
                sx={{
                  boxShadow: 6,
                  borderRadius: 4,
                  backgroundColor: "#ffffff",
                  p: 3,
                  width: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    color: blue[800],
                    mb: 2,
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                >
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2, backgroundColor: grey[300] }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: grey[700],
                        mb: 1,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      <strong>Service:</strong> {employee.serviceType}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: grey[700],
                        mb: 1,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      <strong>Date of Birth:</strong> {new Date(employee.dob).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: grey[700],
                        mb: 1,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      <strong>Email:</strong> {employee.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: grey[700],
                        mb: 1,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      <strong>Phone:</strong> {employee.phone}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: grey[700],
                        mb: 1,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      <strong>Country:</strong> {employee.country}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>




      {/* // Add Order Model */}
      <IconButton
        onClick={handleModalOpen}
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          bgcolor: "primary.main",
          color: "white",
          padding: "12px 10px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          fontSize: "0.9rem",
          fontWeight: "bold",
          textTransform: "capitalize",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s ease",
          "&:hover": {
            bgcolor: "primary.dark",
            transform: "scale(1.05)",
          },
        }}
      >
        <AddIcon sx={{ fontSize: "1.5rem" }} />
        Add Order
      </IconButton>

      {/* Error Message */}
      {deleteError && (
        <Typography
          variant="body2"
          color="error"
          sx={{
            mt: 3,
            textAlign: "center",
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: "0.75rem", sm: "1rem" },
          }}
        >
          {deleteError}
        </Typography>
      )}

      {/* Order Form Modal */}
      <Dialog
        open={openModal}
        onClose={handleModalClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
            zIndex: 1301,
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            color: "primary.main",
          }}
        >
          Add Order
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={orderData.title}
            onChange={handleOrderChange}
            fullWidth
            margin="normal"
            required
            variant="outlined"
            sx={{ "& .MuiInputBase-root": { borderRadius: 2 } }}
            error={!!formErrors.title}
            helperText={formErrors.title}
          />
          <TextField
            label="Price"
            name="price"
            value={orderData.price}
            onChange={handleOrderChange}
            fullWidth
            margin="normal"
            required
            type="number"
            variant="outlined"
            sx={{ "& .MuiInputBase-root": { borderRadius: 2 } }}
            error={!!formErrors.price}
            helperText={formErrors.price}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />

          <TextField
            label="Discount"
            name="discountPrice"
            value={orderData.discountPrice}
            onChange={handleOrderChange}
            fullWidth
            margin="normal"
            required
            type="number"
            variant="outlined"
            sx={{ "& .MuiInputBase-root": { borderRadius: 2 } }}
            error={!!formErrors.discountPrice}
            helperText={formErrors.discountPrice}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
          <TextField
            label="Description"
            name="description"
            value={orderData.description}
            onChange={handleOrderChange}
            fullWidth
            margin="normal"
            required
            multiline
            rows={4}
            variant="outlined"
            sx={{ "& .MuiInputBase-root": { borderRadius: 2 } }}
            error={!!formErrors.description}
            helperText={formErrors.description}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Brand</InputLabel>
            <Select
              value={orderData.brandId}
              onChange={handleDropdownChange}
              label="Brand"
              error={!!formErrors.brandId}
            >
              {brands.map((brand: any) => (
                <MenuItem key={brand._id} value={brand._id}>
                  {brand.title}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{formErrors.brandId}</FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleOrderSubmit}
            color="primary"
            sx={{
              backgroundColor: 'blue', // Set primary background color to blue
              color: 'white', // Set text color to white
              padding: '12px 22px', // Add padding for a better look
              borderRadius: '8px', // Round the corners
              fontSize: '16px', // Adjust font size
              fontWeight: 'bold', // Make the text bold
              '&:hover': {
                backgroundColor: 'darkblue', // Change color on hover
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add shadow on hover
              },
            }}
          >
            Submit
          </Button>

        </DialogActions>
      </Dialog>





      <ClientOrders clientId={Array.isArray(id) ? id[0] : id ?? ''} />

    </Box>

  );

}
