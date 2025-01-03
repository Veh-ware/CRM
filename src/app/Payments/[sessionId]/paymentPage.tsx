'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Alert, Snackbar, CircularProgress } from '@mui/material';
import '../../../styles/global.css';
import { AiOutlineCheckCircle } from 'react-icons/ai'; // Importing success icon from React Icons


export default function PaymentPage() {
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [snackbarDuration, setSnackbarDuration] = useState(500); // Duration for snackbar to show
  const [isSnackbarClosed, setIsSnackbarClosed] = useState(false); // To control the transition after snackbar

  const { sessionId } = useParams<any>();
  const stripe = useStripe();
  const elements = useElements();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(
          `https://api-vehware-crm.vercel.app/api/payment/get-payment-details/${sessionId}`
        );
        setPaymentDetails(response.data.data);
      } catch (error) {
        setSnackbarMessage('Unable to fetch payment details.');
        setOpenSnackbar(true);
      }
    };

    fetchPaymentDetails();
  }, [sessionId]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setSnackbarMessage('Stripe has not loaded yet. Please try again.');
      setOpenSnackbar(true);
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
      setSnackbarMessage('Please fill out your card details.');
      setOpenSnackbar(true);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(paymentDetails.clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            address: {
              postal_code: '85400',
            },
          },
        },
      });

      if (error) {
        setSnackbarMessage(`Payment Failed: ${error.message}`);
        setOpenSnackbar(true);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setSnackbarMessage(`Payment for ${paymentDetails.productDetails.product_title} completed successfully!`);
        setOpenSnackbar(true);
        setPaymentSuccessful(true);

        try {
          await axios.post(`https://api-vehware-crm.vercel.app/api/payment/create-payment/${sessionId}`);
        } catch (error) {
          console.log('Order status update failed', error);
        }

        // Wait for snackbar duration, then show the successful payment page
        setTimeout(() => {
          setIsSnackbarClosed(true);
        }, snackbarDuration);
      }
    } catch (err) {
      setSnackbarMessage('An unexpected error occurred during payment.');
      setOpenSnackbar(true);
    }
  };

  console.log(paymentDetails, "paymentDetails")

  if (!isHydrated || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <CircularProgress size={60} />
          <p className="text-lg font-semibold text-blue-700 mt-4">Loading, please wait...</p>
        </div>
      </div>
    );
  }

  if (paymentSuccessful && isSnackbarClosed) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-green-600 p-8 rounded-lg shadow-lg">
        <div className="text-center text-white">
          <AiOutlineCheckCircle className="mx-auto text-8xl mb-6" />
          <h1 className="text-4xl font-semibold mb-4">Payment Successful!</h1>
          <p className="text-xl mb-6">Thank you for your purchase. Your order is being processed.</p>
        </div>
      </div>
    );
  }



  return (


    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-white p-4 justify-center items-center">

      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-xl w-full max-w-screen-xl p-4 sm:p-6 space-y-8 md:space-y-0 md:space-x-8 lg:w-11/12 xl:w-11/12">

        {/* Order Details Section */}
        <div className="flex-1 bg-[#0e1e99] rounded-lg p-4 sm:p-4 shadow-xl w-full sm:w-[80%] lg:w-[70%] mx-auto order-1 sm:order-1 md:order-1">
          <div className="space-y-13 p-0 sm:p-6 rounded-lg shadow-xl mt-2">
            {/* Image Section */}
            <img
              src={paymentDetails.productDetails?.brand_image}
              alt={paymentDetails.productDetails?.product_title}
              className="h-[200px] sm:h-[300px] w-full object-cover rounded-lg shadow-lg bg-[#2132b6]"
            />

            <div className="space-y-4 pt-10"> {/* Add margin top here */}
              {/* Order Title Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#2132b6] rounded-lg shadow-md mt-4">
                <h1 className="text-lg sm:text-xl text-white">Order Title</h1>
                <h3 className="text-xl sm:text-2xl  text-white sm:mt-0 mt-2 text-right">
                  {paymentDetails.productDetails?.product_title}
                </h3>
              </div>

              {/* Order Description Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#2132b6] rounded-lg shadow-md mt-4">
                <h1 className="text-lg sm:text-xl text-white">Order Description</h1>
                <p className="text-gray-300 sm:mt-0 mt-2 text-right">
                  {paymentDetails.productDetails?.product_description}
                </p>
              </div>

              {/* Total Amount Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#2132b6] rounded-lg shadow-md mt-4">
                <h1 className="text-lg sm:text-xl text-white">Product Amount</h1>
                <h4 className="text-xl sm:text-2xl font-bold text-white sm:mt-0 mt-2 text-right">
                  ${paymentDetails.productAmount}
                </h4>
              </div>
              {/* Total Amount Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#2132b6] rounded-lg shadow-md mt-4">
                <h1 className="text-lg sm:text-xl text-white">Discount</h1>
                <h4 className="text-xl sm:text-2xl font-bold text-white sm:mt-0 mt-2 text-right">
                  ${paymentDetails.discountPrice}
                </h4>
              </div>
              {/* Total Amount Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#2132b6] rounded-lg shadow-md mt-4">
                <h1 className="text-lg sm:text-xl text-white">Total Amount</h1>
                <h4 className="text-xl sm:text-2xl font-bold text-white sm:mt-0 mt-2 text-right">
                  ${paymentDetails.totalAmount}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="flex-1 bg-gray-50 rounded-lg p-4 sm:p-6 space-y-6 shadow-xl order-2 sm:order-2 md:order-2">
          <h4 className="text-xl sm:text-2xl font-semibold text-gray-800">Complete Your Payment</h4>
          <p className="text-gray-600 text-sm sm:text-base">
            Enter your card details to proceed with the payment for the product.
          </p>

          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700">Card Number</label>
              <div className="p-4 border-2 border-gray-300 rounded-lg bg-white shadow-md focus-within:border-blue-500">
                <CardNumberElement />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <label className="block text-sm sm:text-base font-semibold text-gray-700">Expiry Date</label>
                <div className="p-4 border-2 border-gray-300 rounded-lg bg-white shadow-md focus-within:border-blue-500">
                  <CardExpiryElement />
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-sm sm:text-base font-semibold text-gray-700">CVC</label>
                <div className="p-4 border-2 border-gray-300 rounded-lg bg-white shadow-md focus-within:border-blue-500">
                  <CardCvcElement />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
            >
              Pay Now
            </button>
          </form>

          <div className="space-y-4 mt-8 p-4 border-t-2 border-gray-300">
            <h5 className="text-xl sm:text-2xl font-semibold text-gray-800">Order Summary</h5>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Price:</span>
              <span className="font-bold text-lg text-blue-600">${paymentDetails.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-semibold text-gray-600">Free</span>
            </div>
            <img
              src="https://cdn.shopify.com/s/files/1/2005/6615/files/Webp.net-resizeimage_large.png?v=1501670750"
              alt="Visa"
              className="w-full h-16 sm:h-24 object-contain mt-4"
            />
          </div>
        </div>

      </div>

      {/* Snackbar for displaying success message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={snackbarDuration}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>











  );
}
