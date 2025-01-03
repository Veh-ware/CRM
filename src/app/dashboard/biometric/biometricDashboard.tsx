'use client';

import React, { useEffect, useState } from 'react';
import UploadAndDisplay from '../../../components/dashboard/biometric/EmployeeBiometricUpload'; // Corrected import path

function DashboardPage() {
  const [employeeData, setEmployeeData] = useState<any>(null);

  const handleFileUpload = (data: any) => {

    const formatTime = (decimal: number) => {
      const totalMinutes = decimal * 1440; // 1440 minutes in a day
      const hours = Math.floor(totalMinutes / 60);
      const minutes = Math.floor(totalMinutes % 60);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12; // Convert 24-hour format to 12-hour
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };
    data.forEach((row: any) => {
      row[2] = formatTime(row[2]);
      row[3] = formatTime(row[3]);
    });
    setEmployeeData(data); 
  };


  return (
    <UploadAndDisplay onFileUpload={handleFileUpload} />
  );

}

export default DashboardPage;