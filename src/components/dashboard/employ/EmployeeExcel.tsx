'use client';

import React, { useRef, useState, ChangeEvent, useContext } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { AppContext } from '@/contexts/isLogin';
import Swal from 'sweetalert2';

interface Employee {
    name: string;
    email: string;
    phone: number;
    cnic: number;
    gender: string;
    salary: number;
    type: string;
    dob: Date;
    password: string;
    position: string;
    joiningDate: Date;
    startTime: any;
    endTime: any;
}

const EmployeeExcel: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [employeeData, setEmployeeData] = useState<Employee[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { storedValue } = useContext(AppContext)!;

    // Function to handle Excel file upload
    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData: Employee[] = XLSX.utils.sheet_to_json(sheet);

            let hasError = false;

            const updatedData = parsedData.map((employee) => {
                const formattedEmployee = { ...employee };

                // Validate and format date fields (DOB and Joining Date)
                formattedEmployee.dob = validateAndFormatDate(employee.dob);
                formattedEmployee.joiningDate = validateAndFormatDate(employee.joiningDate);

                // If any date is invalid, flag the error
                if (!formattedEmployee.dob || !formattedEmployee.joiningDate) {
                    hasError = true;
                }
                console.log(formattedEmployee, "formattedEmployee")
                return formattedEmployee;
            });

            if (hasError) {
                Swal.fire({
                    title: "Error",
                    text: "Excel data contains invalid date(s). Please check and upload again.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
                return; // Stop further processing if dates are invalid
            }


            setEmployeeData(updatedData);
            setOpen(true); // Open modal to show data

            // Clear the file input value
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };

        reader.readAsArrayBuffer(file);
    };



    const handleClose = () => {
        setOpen(false);
    };
    const validateAndFormatDate = (date: any) => {
        if (typeof date === 'number') {
            console.log(date, "date");

            const parsedDate = XLSX.SSF.parse_date_code(date);
            console.log(parsedDate, "parsedDate");


            if (parsedDate && parsedDate.y && parsedDate.m && parsedDate.d) {
                const constructedDate = new Date(parsedDate.y, parsedDate.m - 1, parsedDate.d);
                console.log(constructedDate, "constructedDate")
                if (!isNaN(constructedDate.getTime())) {
                    return constructedDate.toISOString().split('T')[0];
                }
            }

            return '';
        }

        return date;
    };


    const handleSend = async () => {
        // let hasError = false;

        // const updatedData = employeeData.map((employee) => {
        //     const formattedEmployee = { ...employee };

        //     // Validate and format date fields (DOB and Joining Date)
        //     formattedEmployee.dob = validateAndFormatDate(employee.dob);
        //     formattedEmployee.joiningDate = validateAndFormatDate(employee.joiningDate);

        //     // If any date is invalid, flag the error
        //     if (!formattedEmployee.dob || !formattedEmployee.joiningDate) {
        //         hasError = true;
        //     }

        //     return formattedEmployee;
        // });

        // if (hasError) {
        //     Swal.fire({
        //         title: "Error",
        //         text: "Excel data contains invalid date(s). Please check and upload again.",
        //         icon: "error",
        //         confirmButtonText: "OK",
        //     });
        //     return; // Stop further processing if dates are invalid
        // }

        // Prepare data for API call
        const formattedData = {
            employeeArr: employeeData.map(employee => ({
                name: employee.name,
                email: employee.email,
                password: employee.password,
                phone: `+92${employee.phone}`, // Add country code to phone number
                cnic: employee.cnic.toString(), // Ensure CNIC is a string
                salary: employee.salary,
                type: employee.type,
                dob: new Date(employee.dob).toISOString().split('T')[0], // Already formatted
                gender: employee.gender,
                position: employee.position,
                joiningDate: new Date(employee.joiningDate).toISOString().split('T')[0], // Already formatted
                officeTiming: {
                    startTime: employee.startTime,
                    endTime: employee.endTime,
                }
            }))
        };

        console.log(formattedData, "<----formattedData")
        try {
            const res = await axios.post('https://api-vehware-crm.vercel.app/api/auth/signup', formattedData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedValue.token}`,
                },
            });

            Swal.fire({
                title: "Success",
                text: "Employee added successfully",
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (error) {
            console.error('Error sending data:', error);
            Swal.fire({
                title: "Error",
                text: 'There was an issue sending the data.',
                icon: "error",
                confirmButtonText: "OK",
            });
        }

        setOpen(false); // Close modal after sending
    };

    return (
        <div>
            <Button variant="contained" component="label" sx={{ mb: 2 }}>
                Upload Excel File
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    hidden
                    onChange={handleFileUpload}
                    ref={fileInputRef} // Attach the file input ref
                />
            </Button>

            {/* Modal to preview uploaded data */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Uploaded Employee Details</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>CNIC</TableCell>
                                    <TableCell>Gender</TableCell>
                                    <TableCell>Salary</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Date of Birth</TableCell>
                                    <TableCell>Password</TableCell>
                                    <TableCell>Position</TableCell>
                                    <TableCell>Joining Date</TableCell>
                                    <TableCell>Start Time</TableCell>
                                    <TableCell>End Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employeeData.map((employee, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{employee.name}</TableCell>
                                        <TableCell>{employee.email}</TableCell>
                                        <TableCell>{employee.phone}</TableCell>
                                        <TableCell>{employee.cnic}</TableCell>
                                        <TableCell>{employee.gender}</TableCell>
                                        <TableCell>{employee.salary}</TableCell>
                                        <TableCell>{employee.type}</TableCell>
                                        <TableCell>{new Date(employee.dob).toLocaleDateString()}</TableCell>
                                        <TableCell>{employee.password}</TableCell>
                                        <TableCell>{employee.position}</TableCell>
                                        <TableCell>{new Date(employee.joiningDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{employee.startTime}</TableCell>
                                        <TableCell>{employee.endTime}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSend}>Send</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EmployeeExcel;

