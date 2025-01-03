'use client';

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Input,
} from "@mui/material";
import { useParams } from "next/navigation";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import { Edit, Schedule } from "@mui/icons-material";
import { bgcolor } from "@mui/system";

interface AttendanceRow {
  date: string;
  checkInTime: string;
  checkOutTime: string;
  present: string;
  _id: string;
  status: string;
}

const AttendanceTable: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [attendanceData, setAttendanceData] = useState<AttendanceRow[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editingRow, setEditingRow] = useState<AttendanceRow | null>(null);
  const [editedCheckIn, setEditedCheckIn] = useState<string>("");
  const [editedCheckOut, setEditedCheckOut] = useState<string>("");
  const [isAbsent, setIsAbsent] = useState<boolean>(false);  // Track absence state
  const [errors, setErrors] = useState({ checkIn: "", checkOut: "" });  // Error messages


  const getData = localStorage.getItem("AdminloginData");
  const token = JSON.parse(getData!).token;

  useEffect(() => {
    if (id) {
      const fetchAttendanceData = async () => {
        try {
          const response = await axios.get(
            `https://api-vehware-crm.vercel.app/api/attendance/get/${id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setAttendanceData(response.data.data.attendance || []);
        } catch (err) {
          console.log("Error fetching attendance data:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchAttendanceData();
    } else {
      console.log("No ID provided");
    }
  }, [id, token]);





  const handleEdit = (row: AttendanceRow) => {
    setEditingRow(row);
    setEditedCheckIn(moment(row.checkInTime).format("HH:mm"));
    setEditedCheckOut(moment(row.checkOutTime).format("HH:mm"));
    setIsAbsent(false);  // Reset absence state when editing
    setErrors({ checkIn: "", checkOut: "" });  // Clear any errors
    setOpenModal(true);
  };

  const handleSave = async () => {
    if (!editingRow) return;

    // Validation: If not absent, ensure check-in and check-out times are provided
    if (!isAbsent && (!editedCheckIn || !editedCheckOut)) {
      setErrors({
        checkIn: editedCheckIn ? "" : "Check-in time is required.",
        checkOut: editedCheckOut ? "" : "Check-out time is required.",
      });
      return;
    }

    // Prepare values to send to the API
    const formattedCheckIn = isAbsent || editedCheckIn === "Invalid date" ? null : editedCheckIn;
    const formattedCheckOut = isAbsent || editedCheckOut === "Invalid date" ? null : editedCheckOut;

    try {
      await axios.patch(
        `https://api-vehware-crm.vercel.app/api/attendance/update`,
        {
          date: editingRow.date,
          checkInTime: formattedCheckIn,
          checkOutTime: formattedCheckOut,
          userId: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAttendanceData((prev) =>
        prev.map((row) =>
          row._id === editingRow._id
            ? {
              ...row,
              checkInTime: moment(formattedCheckIn, "HH:mm").format("hh:mm A"),
              checkOutTime: moment(formattedCheckOut, "HH:mm").format("hh:mm A"),
            }
            : row
        )
      );

      setOpenModal(false);
      setEditingRow(null);
      Swal.fire({
        icon: 'success',
        title: 'Attendance Edited Successfully!',
        text: 'The attendance has been successfully updated.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'swal2-popup',
        },
        didOpen: () => {
          const swalPopup = document.querySelector('.swal2-popup');
          if (swalPopup) {
            (swalPopup as HTMLElement).style.zIndex = '9999';
          }
        },
      });
    } catch (err) {
      console.log("Error saving updated attendance data:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to update attendance. Please try again.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
        customClass: {
          popup: 'swal2-popup',
        },
        didOpen: () => {
          const swalPopup = document.querySelector('.swal2-popup');
          if (swalPopup) {
            (swalPopup as HTMLElement).style.zIndex = '9999';
          }
        },
      });
      setOpenModal(false);
    }
  };

  // "Absent" Button handler
  const handleAbsent = () => {
    setIsAbsent(true);  // Mark as absent
    setEditedCheckIn("");  // Clear check-in time
    setEditedCheckOut("");  // Clear check-out time
  };

  // "Present" Button handler
  const handlePresent = () => {
    setIsAbsent(false);  // Mark as present
    setEditedCheckIn(moment(editingRow?.checkInTime).format("HH:mm"));  // Restore check-in time
    setEditedCheckOut(moment(editingRow?.checkOutTime).format("HH:mm"));  // Restore check-out time
  };




  return (

    <Box sx={{ margin: "30px", overflowX: "auto" }}> {/* Ensure horizontal scrolling */}
      {loading ? (
        <Box sx={{ textAlign: "center", padding: "40px" }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 3,
            padding: "16px",
            minWidth: "600px", // Minimum width to avoid shrinking the table too much
          }}
        >
          <Table sx={{ minWidth: "600px" }}> {/* Set a minimum width to prevent collapsing */}
            <TableHead sx={{ bgcolor: "primary.main", color: "white" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: { xs: 12, sm: 14, md: 16 }, textAlign: "center" }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: { xs: 12, sm: 14, md: 16 }, textAlign: "center" }}>
                  Check-In
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: { xs: 12, sm: 14, md: 16 }, textAlign: "center" }}>
                  Check-Out
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: { xs: 12, sm: 14, md: 16 }, textAlign: "center" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: { xs: 12, sm: 14, md: 16 }, textAlign: "center" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceData && Array.isArray(attendanceData) && attendanceData.length > 0 ? (
                attendanceData.map((data) => (
                  <TableRow
                    key={data._id}
                    sx={{
                      "&:nth-of-type(odd)": {
                        bgcolor: "background.paper", // Light background for odd rows
                      },
                      "&:nth-of-type(even)": {
                        bgcolor: "background.default", // Darker background for even rows
                      },
                      "&:hover": {
                        bgcolor: "gray", // Subtle hover effect
                        cursor: "pointer",
                        transition: "background-color 0.3s ease",
                      }
                    }}
                  >
                    {/* Date Column */}
                    <TableCell sx={{ textAlign: "center", fontWeight: 500 }}>
                      {moment(data.date).format("DD/MM/YYYY")}
                    </TableCell>

                    {/* Check-in Time Column */}
                    <TableCell sx={{ textAlign: "center", fontWeight: 500 }}>
                      {data.checkInTime || "--"}
                    </TableCell>

                    {/* Check-out Time Column */}
                    <TableCell sx={{ textAlign: "center", fontWeight: 500 }}>
                      {data.checkOutTime || "--"}
                    </TableCell>

                    {/* Status Column with Conditional Styling */}
                    <TableCell sx={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{
                          bgcolor:
                            data.status === "Present"
                              ? "success.main"
                              : data.status === "Late"
                                ? "warning.main"
                                : "error.main",
                        }}
                      >
                        {data.status}
                      </Button>
                    </TableCell>


                    {/* Edit Button Column */}
                    <TableCell sx={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(data)}
                        startIcon={<Edit />}
                        sx={{
                          fontWeight: 600,
                          textTransform: "none", // Remove default text transform
                          "&:hover": {
                            backgroundColor: "primary.dark", // Darker hover effect
                          },
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5} // Updated colspan to match table columns
                    sx={{
                      textAlign: "center",
                      fontSize: { xs: 14, sm: 16 },
                      padding: "20px",
                    }}
                  >
                    No attendance data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}


      {/* Dialog for editing attendance */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="sm"
        sx={{
          zIndex: 13010,
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          Edit Attendance
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Absent Button */}
            {!isAbsent && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleAbsent}
                sx={{
                  marginBottom: "15px",
                  alignSelf: "flex-start",
                  padding: "5px 15px", // Smaller button size
                }}
              >
                Absent
              </Button>
            )}

            {/* Check-In and Check-Out Times or "Absent" message */}
            {isAbsent ? (
              <Typography variant="h6" sx={{ textAlign: "center", color: "red" }}>
                This employee is absent.
              </Typography>
            ) : (
              <>
                {/* Check-In Time */}
                <TextField
                  label="Check-In Time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={moment(editedCheckIn, "hh:mm A").format("HH:mm")}
                  onChange={(e) => {
                    setEditedCheckIn(moment(e.target.value, "HH:mm").format("hh:mm A"));
                    setErrors((prev) => ({ ...prev, checkIn: "" }));  // Reset error on input change
                  }}
                  helperText="Select the time you checked in"
                  variant="outlined"
                  sx={{
                    "& .MuiInputBase-root": { paddingRight: "10px" },
                    "& .MuiInputLabel-root": { top: "5px" },
                    "& label.Mui-focused": { color: "#1976d2" },
                    "& .MuiInputBase-input": { paddingLeft: "10px" },
                  }}
                />
                {errors.checkIn && <span style={{ color: "red" }}>{errors.checkIn}</span>}

                {/* Check-Out Time */}
                <TextField
                  label="Check-Out Time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={moment(editedCheckOut, "hh:mm A").format("HH:mm")}
                  onChange={(e) => {
                    setEditedCheckOut(moment(e.target.value, "HH:mm").format("hh:mm A"));
                    setErrors((prev) => ({ ...prev, checkOut: "" }));  // Reset error on input change
                  }}
                  helperText="Select the time you checked out"
                  variant="outlined"
                  sx={{
                    "& .MuiInputBase-root": { paddingRight: "10px" },
                    "& .MuiInputLabel-root": { top: "5px" },
                    "& label.Mui-focused": { color: "#1976d2" },
                    "& .MuiInputBase-input": { paddingLeft: "10px" },
                  }}
                />
                {errors.checkOut && <span style={{ color: "red" }}>{errors.checkOut}</span>}
              </>
            )}

            {/* Present Button */}
            {isAbsent && (
              <Button
                variant="outlined"
                color="primary"
                onClick={handlePresent}
                sx={{
                  marginTop: "15px",
                  alignSelf: "flex-start",
                }}
              >
                Present
              </Button>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, mb: 2 }}>
          <Button onClick={() => setOpenModal(false)} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary" startIcon={<Schedule />}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </Box>

  );
};

export default AttendanceTable;
