import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';  // Import the left arrow icon from react-icons
import EmployeeDetails from '@/components/dashboard/employ/EmolyeeDetails';
import AttendanceTable from './EmployeeAttendance';
import { Metadata } from 'next';
import { IconButton } from '@mui/material';
import BackIcon from '@/components/BackIcon';

export const metadata: Metadata = {
  title: "Employee Details",
  description: "Employee Details Page",
};

function page() {




  return (
    <div>
      {/* <BackIcon /> */}

      <EmployeeDetails />
      <AttendanceTable />
    </div>
  );
}

// Inline styles for the back button (you can replace this with your CSS)
const backButtonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  cursor: 'pointer',
  fontSize: '16px',
  display: 'flex',
  alignItems: 'center',
  marginBottom: '20px',
};

export default page;
