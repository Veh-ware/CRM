"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Alert,
  IconButton,
  TableCell,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useParams } from "next/navigation";
import { Delete as DeleteIcon, Visibility as VisibilityIcon } from "@mui/icons-material";
import Swal from "sweetalert2";

// Define Params type
interface Params {
  id?: string;
}

const BrandingDetails = (): React.JSX.Element | null => {
  const params = useParams() as Params;
  const id = params?.id;

  const [branding, setBranding] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<boolean>(false);

  const [openModal, setOpenModal] = useState<boolean>(false); // For modal visibility
  const [selectedOrder, setSelectedOrder] = useState<any>(null); // Store selected order details for the modal
  const [selectedOrderIndex, setSelectedOrderIndex] = useState<number>(-1); // Initialize with -1


  const adminLoginData = localStorage.getItem("AdminloginData");
  if (!adminLoginData) {
    throw new Error("Admin login data is missing");
  }

  const parsedData = JSON.parse(adminLoginData);

  const router = useRouter();

  useEffect(() => {
    if (!id || deleted) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);

        // Fetch branding details
        const brandingResponse = await axios.get(
          `https://api-vehware-crm.vercel.app/api/brand/get/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${parsedData.token}`,
            },
          }
        );
        setBranding(brandingResponse.data.data);

        // Fetch order details
        const orderResponse = await axios.get(
          `https://api-vehware-crm.vercel.app/api/brand/visualizedBrand/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${parsedData.token}`,
            },
          }
        );
        setOrderDetails(orderResponse.data.data.visualizedBrand);
        console.log(orderResponse.data.data);

        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError("Failed to fetch brand or order details");
      }
    };

    fetchDetails();
  }, [id, deleted]);



  const handleOpenModal = (order: any, index: number) => {
    setSelectedOrder(order);
    setSelectedOrderIndex(index); // Save the index for modal use
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrder(null);
    setSelectedOrderIndex(-1); // Reset to -1 instead of null
  };



  const handleDelete = async () => {
    if (!id) {
      console.error("ID is missing");
      return;
    }

    try {
      setDeleting(true);

      await axios.delete(
        `https://api-vehware-crm.vercel.app/api/brand/delete/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parsedData.token}`,
          },
        }
      );

      Swal.fire("Deleted!", "Brand deleted successfully.", "success");
      setBranding(null);
      setDeleted(true);
      setDeleting(false);
      setTimeout(() => {
        router.push("/dashboard/branding");
      }, 2000);
    } catch (err: any) {
      console.error("Error deleting the brand:", err.response?.data || err.message);
      setDeleting(false);
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
        Swal.fire("Cancelled", "The brand was not deleted.", "info");
      }
    });
  };




  // Helper function to truncate text
  const truncateText = (text: string, wordLimit: number): string => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress size={50} color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ margin: 2 }}>
        {error}
      </Alert>
    );
  }

  if (deleted) {
    return null;
  }

  if (!branding) {
    return null;
  }

  return (
    <Box sx={{ padding: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Branding Info Card */}
      <Card sx={{ width: { xs: '100%', sm: 600, md: 1000 }, boxShadow: 3, borderRadius: 2, overflow: "hidden", marginBottom: 6 }}>
        <CardMedia
          component="img"
          width="100%"
          
          image={branding?.image || "https://via.placeholder.com/300"}
          alt={branding?.title || "Brand Image"}
          sx={{ objectFit: "cover", backgroundColor: "black",  height: '300px',   }}
        />
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
            {branding?.title || "Brand Title"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2, textAlign: "center" }}>
            {branding?.description || "Brand description goes here."}
          </Typography>


          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <IconButton
              onClick={confirmDelete}
              disabled={deleting}
              sx={{
                color: "error.main",
                padding: 1,
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* Order Details Section */}
      {orderDetails?.length > 0 ? (
        <TableContainer component={Paper} sx={{ width: "100%", marginBottom: 3, borderRadius: 2, boxShadow: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="order details table">
            {/* Table Header */}
            <TableHead sx={{ backgroundColor: "primary.main", color: "white" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white" }}>Order #</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white" }}>Title</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white" }}>Description</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white" }}>Price</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white" }}>Discounted Price</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white" }}>Client ID</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white" }}>Created At</TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {orderDetails.map((order: any, index: number) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.08)", // Hover effect
                    },
                    backgroundColor: index % 2 === 0 ? "rgba(255, 255, 255, 0.8)" : "transparent", // Zebra striping
                    borderBottom: "1px solid #e0e0e0", // Adding bottom border for better visual separation
                  }}
                >
                  <TableCell sx={{ textAlign: "center", padding: "16px" }}>{index + 1}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "500", padding: "16px" }}>
                    {order?.title || "No title available"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "500", padding: "16px" }}>
                    {truncateText(order?.description || "No description available", 15)}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontWeight: "500",
                      padding: "16px",
                      color: order?.status === "PENDING" ? "warning.main" :
                        order?.status === "SUCCESS" ? "success.main" :
                          order?.status === "FAILED" ? "error.main" :
                            order?.status === "CANCELED" ? "error.main" :
                              "text.secondary", // Default color if status is not recognized
                    }}
                  >
                    {order?.status || "No status available"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "500", padding: "16px" }}>
                    ${order?.price || 0}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "900", padding: "16px",color: order.discountPrice === 0 ? 'red' : 'green' }}>
                    ${order.discountPrice === 0 ? '--' : order.discountPrice.toFixed(2)}
                  </TableCell>

                  <TableCell sx={{ textAlign: "center", fontWeight: "500", padding: "16px" }}>
                    {order?.clientId || "N/A"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "500", padding: "16px" }}>
                    {new Date(order?.createdAt).toLocaleString() || "N/A"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", padding: "16px" }}>
                    <IconButton onClick={() => handleOpenModal(order, index)} sx={{ color: "primary.main" }}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body2" color="text.secondary">No orders found</Typography>
      )}

      {/* Modal for Viewing Order Details */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
        sx={{
          '& .MuiPaper-root': { borderRadius: '16px' },
          '& .MuiDialogContent-root': { padding: '24px 32px' },
          '& .MuiDialogActions-root': { padding: '16px 24px' },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "primary.main",
            paddingBottom: "16px",
            borderBottom: "2px solid #eee",
            textAlign: 'left', // Left-aligned title
            marginBottom: '16px', // Proper spacing from the content
          }}
        >
          Order Details
        </DialogTitle>

        <DialogContent sx={{ paddingTop: "16px", paddingBottom: "24px" }}>
          {selectedOrder ? (
            <>
              {/* Order # */}
              <Box sx={{ display: 'flex', marginBottom: "16px", alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: "600", width: "150px" }}>
                  <strong>Order #:</strong>
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "400", color: "text.secondary" }}>
                  {selectedOrderIndex >= 0 ? selectedOrderIndex + 1 : "N/A"}
                </Typography>
              </Box>

              {/* Title */}
              <Box sx={{ display: 'flex', marginBottom: "16px", alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: "600", width: "150px" }}>
                  <strong>Title:</strong>
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "400", color: "text.secondary" }}>
                  {selectedOrder.title}
                </Typography>
              </Box>

              {/* Description */}
              <Box sx={{ display: 'flex', marginBottom: "16px", alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: "600", width: "150px" }}>
                  <strong>Description:</strong>
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "400", color: "text.secondary", flex: 1 }}>
                  {selectedOrder.description}
                </Typography>
              </Box>

              {/* Status */}
              <Box sx={{ display: 'flex', marginBottom: "16px", alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: "600", width: "150px" }}>
                  <strong>Status:</strong>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "400",
                    color: selectedOrder.status === "PENDING" ? "orange" :
                      selectedOrder.status === "SUCCESS" ? "green" :
                        selectedOrder.status === "FAILED" ? "red" : "gray"
                  }}
                >
                  {selectedOrder.status}
                </Typography>
              </Box>

              {/* Price */}
              <Box sx={{ display: 'flex', marginBottom: "16px", alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: "600", width: "150px" }}>
                  <strong>Price:</strong>
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "400", color: "text.secondary" }}>
                  ${selectedOrder.price?.toFixed(2)}
                </Typography>
              </Box>

              {/* Discounted Price */}
              <Box sx={{ display: 'flex', marginBottom: "16px", alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: "600", width: "150px" }}>
                  <strong>Discounted Price:</strong>
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "900", textAlign: "center",  color: selectedOrder.discountPrice === 0 ? 'red' : 'green' }}>
                  ${selectedOrder.discountPrice === 0 ? '--' : selectedOrder.discountPrice.toFixed(2)}
                </Typography>

              </Box>

              {/* Client ID */}
              <Box sx={{ display: 'flex', marginBottom: "16px", alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: "600", width: "150px" }}>
                  <strong>Client ID:</strong>
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "400", color: "text.secondary" }}>
                  {selectedOrder.clientId || "N/A"}
                </Typography>
              </Box>

              {/* Created At */}
              <Box sx={{ display: 'flex', marginBottom: "16px", alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: "600", width: "150px" }}>
                  <strong>Created At:</strong>
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "400", color: "text.secondary" }}>
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </>
          ) : (
            <CircularProgress sx={{ display: 'block', margin: '0 auto' }} />
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleCloseModal}
            color="primary"
            variant="contained"
            sx={{
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "10px",
              padding: "8px 20px",

              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              '&:hover': {
                backgroundColor: "primary.dark",
                boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)"
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );

};
export default BrandingDetails;