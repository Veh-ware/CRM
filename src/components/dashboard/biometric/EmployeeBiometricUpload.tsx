'use client';

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Box, Button, Typography, Grid, Card, CardContent } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

interface FormattedData {
  userId: string | number; 
  userType: string; 
  date: string; 
  checkInTime: number; 
  checkOutTime: number; 
}

interface UploadAndDisplayProps {
  onFileUpload: (data: any) => void;
}

const UploadAndDisplay: React.FC<UploadAndDisplayProps> = ({ onFileUpload }) => {
  const [jsonData, setJsonData] = useState<any[]>([]); 
  const [headers, setHeaders] = useState<string[]>([]); 
  const getData = localStorage.getItem("AdminloginData");
  const token = JSON.parse(getData!).token;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); 
        const [headerRow, ...rows] = parsedData; 

        const validRows = rows.filter((row: any) => {
          const userId = row[0];
          const userType = row[1];
          const checkInTime = row[2];
          const checkOutTime = row[3];
          const date = row[4];

          return userId && userType && !isNaN(checkInTime) && !isNaN(checkOutTime) && formatExcelDate(date) !== "Invalid Date";
        });

        setHeaders(headerRow as string[]); 
        setJsonData(validRows); 

        onFileUpload(validRows);
      };
      reader.readAsBinaryString(file);
    }
  };

  const formatExcelDate = (serial: number): string => {
    if (isNaN(serial) || serial <= 0) {
      return "Invalid Date"; 
    }

    const date = new Date((serial - 25569) * 86400 * 1000);

   
    if (isNaN(date.getTime())) {
      return "Invalid Date"; 
    }

    return date.toISOString().split('T')[0]; 
  };

  const formatTime = (decimal: number): string => {
    if (isNaN(decimal) || decimal < 0) {
   
      return "Invalid Time";
    }

    const totalMinutes = decimal * 1440; 
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const handleSendData = async () => {
    const formattedData: FormattedData[] = jsonData.map((row) => {
      const checkInDecimal = row[2];
      const checkOutDecimal = row[3];

      const checkInTime = checkInDecimal;
      const checkOutTime = checkOutDecimal;

      return {
        userId: row[0],
        userType: row[1],
        date: formatExcelDate(row[4]),
        checkInTime,
        checkOutTime,
      };
    }).filter(item => item.date !== "Invalid Date"); 

    const dataToSend = {
      date: formattedData[0]?.date, 
      dailyRecords: formattedData.map((item) => {
        const { date, ...rest } = item;
        return rest;
      }),
    };

    if (formattedData.length === 0) {
      Swal.fire("Error", "No valid data to send.", "error", 
        
      );


      
      return;
    }

    try {
      const response = await axios.post(
        "https://api-vehware-crm.vercel.app/api/attendance/add",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { unsaved, saved } = response.data.data;
      const successfulUsers = saved.map((success: any) => `User ID: ${success.userId}`);
      const failedUsers = unsaved.map((error: any) =>
        `User ID: ${error.userId} - Reason: ${error.reason || "Employee not found"}`
      );

      let alertMessage = "";

      if (successfulUsers.length > 0) {
        alertMessage += `✅ **Attendance Added**\n${successfulUsers.join("\n")}\n\n`;
      }

      if (failedUsers.length > 0) {
        alertMessage += `❌ **Failed to Add Attendance**\n${failedUsers.join("\n")}\n\n`;
        alertMessage += `➡️ **Action Required**: Please add missing employees to the database and try again.`;
      }

      Swal.fire({
        title: successfulUsers.length > 0 ? "Partial Success" : "Error",
        html: `<pre>${alertMessage}</pre>`,
        icon: successfulUsers.length > 0 ? "warning" : "error",
        showConfirmButton: true,
      });
    } catch (error) {
      console.log("Error sending data:", error);
      Swal.fire("Error", "Failed to send data. Please try again.", "error");
    }
  };
  

  return (
    
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          minHeight: "150vh",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            mb: 4, 
          }}
        >
          Upload Excel File
        </Typography>
  
        <Button
          variant="contained"
          component="label"
          sx={{
            px: 4,
            py: 2,
            backgroundColor: "blue.800",
            color: "#fff",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 123, 255, 0.3)",
            "&:hover": {
              backgroundColor: "blue.900",
            },
            mb: 3,
          }}
        >
          Upload File
          <input
            type="file"
            accept=".xlsx, .xls"
            hidden
            onChange={handleFileUpload}
          />
        </Button>
  
        {jsonData.length > 0 && (
          <Button
            variant="contained"
            color="success"
            onClick={handleSendData}
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
              px: 3,
              py: 1.5,
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 200, 83, 0.3)",
              "&:hover": {
                backgroundColor: "#2e7d32",
              },
            }}
          >
            Send Data
          </Button>
        )}
  
        {jsonData.length > 0 && (
          <Grid
            container
            spacing={2}
            sx={{
              mt: 2,
              justifyContent: "center",
            }}
          >
            {jsonData.map((row, rowIndex) => (
              <Grid item xs={12} sm={6} md={4} key={rowIndex}>
                <Card
                  sx={{
                    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.15)",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    p: 3,
                    backgroundColor: "#ffffff",
                    transition: "transform 0.2s ease-in-out",
                    width: "100%", 
                    maxWidth: "500px", 
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <CardContent>
                    {headers.map((header, colIndex) => (
                      <Box
                        key={colIndex}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1.5,
                          borderBottom: "1px solid #f0f0f0",
                          pb: 0.7,
                          gap: "2px",
                          flexDirection: { xs: "column", sm: "row" }, 
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.9rem",
                            color: "#555",
                            minWidth: "100px", 
                            textAlign: "left",
                          }}
                        >
                          {header}:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.85rem",
                            color: "#333",
                            textAlign: "right",
                            flex: 2, 
                          }}
                        >
                          {header === "Date"
                            ? formatExcelDate(row[colIndex])
                            : header === "Check In Time" || header === "Check Out Time"
                            ? formatTime(row[colIndex])
                            : row[colIndex] || "N/A"}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>



  );
};

export default UploadAndDisplay;
