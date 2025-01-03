'use client';

import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

interface EmployeeData {
  userId: string;
  userType: string;
  date: string;
  checkInTime?: string;  // Made optional for better handling
  checkOutTime?: string; // Made optional for better handling
}

interface EmployeeBiometricProps {
  employeeData: EmployeeData[];
}

const EmployeeBiometric: React.FC<EmployeeBiometricProps> = ({ employeeData }) => {
  return (
    <Grid container spacing={3} />
  );
};

export default EmployeeBiometric;
