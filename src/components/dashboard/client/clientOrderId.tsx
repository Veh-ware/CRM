import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  AlertTitle,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  Divider
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface Order {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPrice: number;

  clientId: string;
  brand: {
    title: string;
  };
}

interface ClientOrdersProps {
  clientId: any;
}

const ClientOrders: React.FC<ClientOrdersProps> = ({ clientId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const getData = localStorage.getItem('AdminloginData');
        const token = JSON.parse(getData!).token;

        const response = await axios.get(
          `https://api-vehware-crm.vercel.app/api/order/client-order/${clientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.data.length === 0) {
          setError('No order has been generated for this client.');
        }

        if (Array.isArray(response.data.data)) {
          setOrders(response.data.data);
        } else {
          setError('Received data is not an array');
        }
      } catch (err: any) {
        setError('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [clientId]);

  const handleOpen = (order: Order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const truncateDescription = (description: string) => {
    const words = description.split(' ');
    if (words.length > 15) {
      return words.slice(0, 15).join(' ') + '...';
    }
    return description;
  };

  if (loading) {
    return <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
    }}
  >
    <CircularProgress />
  </Box>
  }

  if (error) {
    return (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          textAlign: 'center',
          marginTop: '2rem',
        }}
      >
        <Alert
          severity="error"
          sx={{
            width: '100%',
            maxWidth: '500px',
          }}
        >
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <TableContainer component={Paper} sx={{ marginTop: 3, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Discount </TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.title}</TableCell>
                <TableCell>{truncateDescription(order.description)}</TableCell>
                <TableCell>${order.price}</TableCell>
                <TableCell sx={{
                  color: order.discountPrice === 0 ? 'red' : 'green'
                }}
                >
                  ${order.discountPrice == 0 ? '--' : order.discountPrice}</TableCell>
                <TableCell>{order.brand ? order.brand.title : 'N/A'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(order)} color="primary">
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      {/* Modal for Order Details */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        sx={{
          borderRadius: 2, // Rounded corners for the modal
          boxShadow: 3, // Subtle box shadow for depth
        }}
      >
        <DialogTitle sx={{
          fontWeight: 'bold',
          textAlign: 'center', // Center the title
          fontSize: '1.5rem', // Slightly larger font size for a more prominent title
          color: '#444', // Darker shade for a more refined look
          paddingTop: 3, // Top padding for better spacing from the modal's top edge
          paddingBottom: 4, // Reduced bottom padding for a more compact look
          borderBottom: '1px solid #ddd', // Light border at the bottom for separation
          backgroundColor: '#f7f7f7', // Subtle background color to distinguish the title area
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Light shadow for depth
          borderRadius: 1, // Rounded corners for the title area
          textTransform: 'capitalize', // Capitalize the title for better readability
          marginBottom: 3,
        }}>
          Order Details
        </DialogTitle>


        <DialogContent>
          {selectedOrder && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Order ID */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" fontWeight="bold" sx={{ width: '40%', color: '#555' }}>
                  Order ID:
                </Typography>
                <Typography variant="body1" sx={{ width: '55%', textAlign: 'right', color: '#222' }}>
                  {selectedOrder._id}
                </Typography>
              </Box>

              {/* Divider for a clean separation between sections */}
              <Divider sx={{ marginY: 1 }} />

              {/* Title */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" fontWeight="bold" sx={{ width: '40%', color: '#555' }}>
                  Title:
                </Typography>
                <Typography variant="body1" sx={{ width: '55%', textAlign: 'right', color: '#222' }}>
                  {selectedOrder.title}
                </Typography>
              </Box>

              {/* Divider for separation */}
              <Divider sx={{ marginY: 1 }} />

              {/* Description */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" fontWeight="bold" sx={{ width: '40%', color: '#555' }}>
                  Description:
                </Typography>
                <Typography variant="body2" sx={{ width: '55%', textAlign: 'right', color: '#222', marginBottom: 1 }}>
                  {selectedOrder.description}
                </Typography>
              </Box>

              {/* Divider for separation */}
              <Divider sx={{ marginY: 1 }} />

              {/* Price */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" fontWeight="bold" sx={{ width: '40%', color: '#555' }}>
                  Price:
                </Typography>
                <Typography variant="body1" sx={{ width: '55%', textAlign: 'right', color: '#222' }}>
                  ${selectedOrder.price}
                </Typography>
              </Box>

              {/* Divider for separation */}
              <Divider sx={{ marginY: 1 }} />

              {/* Discount Price */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" fontWeight="bold" sx={{ width: '40%', color: '#555' }}>
                  Discount Price:
                </Typography>
                <Typography variant="body1" sx={{ width: '55%', textAlign: 'right', color: selectedOrder.discountPrice === 0 ? 'red' : 'green' }}>
                  ${selectedOrder.discountPrice === 0 ? '--' : selectedOrder.discountPrice}
                </Typography>
              </Box>

              {/* Divider for separation */}
              <Divider sx={{ marginY: 1 }} />

              {/* Brand */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" fontWeight="bold" sx={{ width: '40%', color: '#555' }}>
                  Brand:
                </Typography>
                <Typography variant="body1" sx={{ width: '55%', textAlign: 'right', color: '#222' }}>
                  {selectedOrder.brand?.title || 'N/A'}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            sx={{ fontWeight: 'bold', padding: '8px 20px' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientOrders;
