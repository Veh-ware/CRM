import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Divider, Button, CardMedia, CardContent, Card, Snackbar, Alert, IconButton } from '@mui/material';
import PDFDownloadUI from '../../../app/dashboard/invoice/PDFDownloadUI';
import { toast } from 'react-toastify';
import { AiOutlineLink } from 'react-icons/ai';
import CloseIcon from '@mui/icons-material/Close';



interface Order {
  _id: string;
  title: string;
  description: string;
  discountPrice: number;
  price: number;
  status: string;
  brand: {
    _id: string;
    title: string;
    description: string;
    image: string;
  };
}

interface OrderDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  selectedOrder: Order | any;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ open, onClose, selectedOrder }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const payment = () => {
    if (!selectedOrder || !selectedOrder.sessionId) {
      setSnackbarMessage('No valid order to copy the payment link.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const paymentLink = `${window.location.origin}/Payments/${selectedOrder.sessionId}`;

    navigator.clipboard
      .writeText(paymentLink)
      .then(() => {
        setSnackbarMessage('Payment link copied to clipboard!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error('Failed to copy payment link:', err);
        setSnackbarMessage('Failed to copy payment link. Please try again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };







  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        borderRadius: '20px',
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
        padding: 3,
      }}
    ><DialogTitle
    sx={{
      display: 'flex',
      justifyContent: 'space-between', // Align title and icon to opposite sides
      alignItems: 'center', // Vertically center the items
      fontWeight: 'bold',
      fontSize: 32,
      color: '#2C3E50',
      textAlign: 'center',
      paddingTop: 3,
      marginBottom: 4,
      position: 'relative', // Ensure positioning context
    }}
  >
    <span style={{ flexGrow: 1, textAlign: 'center' }}>Order Details</span> {/* Title in center */}
    <IconButton
      onClick={onClose}
      sx={{
        color: 'black', // Default color of the icon (can adjust based on your design)
        fontSize: '24px', // Adjust icon size
        padding: '8px', // Padding around the icon
        '&:hover': {
          backgroundColor: 'transparent', // Remove the background on hover
          color: '#3498DB', // Change icon color on hover
        },
      }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  

      <DialogContent sx={{ paddingTop: 2 }}>
        {selectedOrder && (
          <Grid container spacing={4}>
            {/* Product Image and Info */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.08)',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  padding: 2,
                }}
              >
                <CardMedia
                  component="img"
                  image={selectedOrder.brand.image}
                  alt={selectedOrder.brand.title}
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    backgroundColor: '#000',
                    borderRadius: '12px',
                  }}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#2C3E50',
                      marginBottom: 1,
                      textTransform: 'capitalize',
                    }}
                  >
                    Title: {selectedOrder.brand.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: 14,
                      color: '#7F8C8D',
                      lineHeight: 1.6,
                    }}
                  >
                    Description: {selectedOrder.brand.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Order Details */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ fontWeight: 500, color: '#2C3E50' }}>
                Order Title:
              </Typography>
              <Typography variant="body1" sx={{ fontSize: 16, color: '#34495E' }}>
                {selectedOrder.title}
              </Typography>

              <Divider sx={{ my: 2, borderColor: '#BDC3C7' }} />

              <Typography variant="h6" sx={{ fontWeight: 500, color: '#2C3E50' }}>
                Description:
              </Typography>
              <Typography variant="body1" sx={{ fontSize: 14, color: '#7F8C8D' }}>
                {selectedOrder.description}
              </Typography>

              <Divider sx={{ my: 2, borderColor: '#BDC3C7' }} />

              <Typography variant="h6" sx={{ fontWeight: 500, color: '#2C3E50' }}>
                Discount Price:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: 16,
                  color: selectedOrder.discountPrice === 0 ? '#E74C3C' : '#27AE60',
                }}
              >
                ${selectedOrder.discountPrice !== 0 ? selectedOrder.discountPrice : '--'}
              </Typography>

              <Divider sx={{ my: 2, borderColor: '#BDC3C7' }} />

              <Typography variant="h6" sx={{ fontWeight: 500, color: '#2C3E50' }}>
                Price:
              </Typography>
              <Typography variant="body1" sx={{ fontSize: 16, color: '#27AE60' }}>
                ${selectedOrder.price !== 0 ? selectedOrder.price : '-'}
              </Typography>

              <Divider sx={{ my: 2, borderColor: '#BDC3C7' }} />

              <Typography variant="h6" sx={{ fontWeight: 500, color: '#2C3E50' }}>
                Status:
              </Typography>
              <Typography variant="body1" sx={{ fontSize: 14, color: '#3498DB' }}>
                {selectedOrder.status}
              </Typography>


            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ paddingBottom: 3, paddingTop: 2 }}>
        {/* Copy Payment Link - styled as text */}
        <Typography
          sx={{
            fontSize: 14,
            color: 'black',
            textDecoration: 'none',
            cursor: 'pointer',
            borderRadius: '5px',
            mt: 0,
            ml: 0,
            marginRight: '10px', // Reduced marginRight for a slight shift towards the left
            marginLeft: '40px', // Added marginLeft to shift it slightly towards the right
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {

              color: 'grey',
              transition: 'all 0.3s ease',
            },
          }}
          onClick={payment}
        >

          <AiOutlineLink style={{ marginRight: '6px', fontSize: '20' }} /> {/* Link Icon with spacing */}
          Copy Payment Link
        </Typography>

        
        {selectedOrder && <PDFDownloadUI selectedOrder={selectedOrder} />}
      </DialogActions>

      {/* Snackbar for alerts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            width: '100%',
            borderRadius: '8px',
            backgroundColor: snackbarSeverity === 'success' ? '#ffffff' : 'transparent',  // White background for success
            color: snackbarSeverity === 'success' ? '#27AE60' : 'inherit',  // Green text for success
            border: snackbarSeverity === 'success' ? '1px solid #27AE60' : 'none', // Border for success
          }}
        >
          {snackbarMessage}
        </Alert>

      </Snackbar>
    </Dialog>


  );
};

export default OrderDetailsDialog;