'use client';

import {
    Grid,
    Stack,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    CircularProgress,
    IconButton,
    useMediaQuery,
    useTheme,
    InputAdornment,
    TextField
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { red } from '@mui/material/colors';

interface SubAdmin {
    _id: string;
    name: string;
    email: string;
    phone: string;
    dob: string;
    cnic: string;
    salary: string;
}

function SubAdminPage() {
    const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]); 
    const [loading, setLoading] = useState<boolean>(true); 
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0); 
    const [rowsPerPage, setRowsPerPage] = useState(5); 
    const [searchTerm, setSearchTerm] = useState<string>(''); 
    const [totalSubAdmins, setTotalSubAdmins] = useState<number>(0);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchSubAdmins = async () => {
            try {
                const adminLoginData: string | null = localStorage.getItem('AdminloginData');
                if (adminLoginData) {
                    const token = JSON.parse(adminLoginData).token;
                    const skip = page * rowsPerPage;
                    const limit = rowsPerPage; 

                    const response = await axios.get('https://api-vehware-crm.vercel.app/api/credentials/admins', {
                        params: { skip, limit },
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.status === 200) {
                        setSubAdmins(response.data.data.admins);
                        setTotalSubAdmins(response.data.data.total); 
                    }
                } else {
                    setError('Admin login data is missing.');
                }
            } catch (err) {
                setError('Failed to fetch data.');
            } finally {
                setLoading(false); 
            }
        };

        fetchSubAdmins();
    }, [page, rowsPerPage]); 

    const handleDelete = async (id: string) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const adminLoginData: string | null = localStorage.getItem('AdminloginData');
                    if (adminLoginData) {
                        const token = JSON.parse(adminLoginData).token;
                        const response = await axios.delete(
                            `https://api-vehware-crm.vercel.app/api/auth/delete/${id}`,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        if (response.status === 200) {
                            setSubAdmins((prev) => prev.filter((subAdmin) => subAdmin._id !== id));
                            Swal.fire('Deleted!', 'The sub-admin has been deleted.', 'success');
                        }
                    }
                } catch (err) {
                    setError('Failed to delete the sub-admin.');
                    Swal.fire('Error!', 'There was an issue deleting the sub-admin.', 'error');
                }
                setLoading(false);
            }
        });
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); 
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const filteredSubAdmins = subAdmins.filter((subAdmin) =>
        subAdmin.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <Grid container justifyContent="center" alignItems="center" sx={{ height: '96vh' }}>
                <CircularProgress />
            </Grid>
        );
    }

    if (error) {
        return (
            <Grid container justifyContent="center" alignItems="center" sx={{ height: '96vh' }}>
                <Typography color="error">{error}</Typography>
            </Grid>
        );
    }

    return (
        <Grid item xs={12}>
        <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
                mb: 3,
                p: 2,
                backgroundColor: 'background.paper',
                borderRadius: '8px',
            }}
        >
            <TextField
                label="Search here"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                    width: '100%',
                    maxWidth: '300px',
                    borderRadius: '8px',
                    boxShadow: 1,
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                    ),
                }}
            />
        </Stack>
    
        <TableContainer sx={{ overflowX: 'auto', borderRadius: '8px', boxShadow: 10 }}>
            <Table>
                <TableHead sx={{ backgroundColor: 'primary.main' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Email</TableCell>
                        {!isSmallScreen && <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Contact</TableCell>}
                        {!isSmallScreen && <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Date of Birth</TableCell>}
                        <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>CNIC</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Salary</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: 'white' }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredSubAdmins.map((subAdmin) => (
                   <TableRow
                   key={subAdmin._id}
                   sx={{
                       '&:hover': { backgroundColor: '#f0f0f0' },
                       '&:nth-of-type(even)': { backgroundColor: '#fafafa' },
                   }}
               >
                   <TableCell sx={{  maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                       <Link
                           href={`/dashboard/subadmin/${subAdmin._id}`}
                           style={{
                               textDecoration: 'none',
                               color: 'inherit',
                               display: 'block',
                           }}
                       >
                           {subAdmin.name}
                       </Link>
                   </TableCell>
                   <TableCell sx={{  maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                       <Link
                           href={`/dashboard/subadmin/${subAdmin._id}`}
                           style={{
                               textDecoration: 'none',
                               color: 'inherit',
                               display: 'block',
                           }}
                       >
                           {subAdmin.email}
                       </Link>
                   </TableCell>
                   {!isSmallScreen && <TableCell sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                       <Link
                           href={`/dashboard/subadmin/${subAdmin._id}`}
                           style={{
                               textDecoration: 'none',
                               color: 'inherit',
                               display: 'block',
                           }}
                       >
                           {subAdmin.phone}
                       </Link>
                   </TableCell>}
                   {!isSmallScreen && <TableCell sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                       <Link
                           href={`/dashboard/subadmin/${subAdmin._id}`}
                           style={{
                               textDecoration: 'none',
                               color: 'inherit',
                               display: 'block',
                           }}
                       >
                           {formatDate(subAdmin.dob)}
                       </Link>
                   </TableCell>}
                   <TableCell sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                       <Link
                           href={`/dashboard/subadmin/${subAdmin._id}`}
                           style={{
                               textDecoration: 'none',
                               color: 'inherit',
                               display: 'block',
                           }}
                       >
                           {subAdmin.cnic}
                       </Link>
                   </TableCell>
                   <TableCell sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                       <Link
                           href={`/dashboard/subadmin/${subAdmin._id}`}
                           style={{
                               textDecoration: 'none',
                               color: 'inherit',
                               display: 'block',
                           }}
                       >
                           {subAdmin.salary}
                       </Link>
                   </TableCell>
                   <TableCell align="right">
                       <IconButton
                           onClick={(e) => {
                               e.stopPropagation();
                               handleDelete(subAdmin._id);
                           }}
                           color="error"
                           sx={{
                               padding: isSmallScreen ? '6px' : '12px',
                               color: red[800],
                               '&:hover': {
                                   backgroundColor: 'white',
                                   color: red[500],
                               },
                           }}
                       >
                           <DeleteIcon fontSize={isSmallScreen ? 'small' : 'medium'} />
                       </IconButton>
                   </TableCell>
               </TableRow>
               
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    
        <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalSubAdmins} 
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
                mt: 2,
                '& .MuiTablePagination-selectLabel': {
                    fontWeight: 'bold',
                },
                '& .MuiTablePagination-select': {
                    borderRadius: '8px',
                    backgroundColor: 'background.paper',
                    boxShadow: 1,
                },
                '& .MuiTablePagination-actions': {
                    color: 'text.primary',
                },
            }}
        />
    </Grid>
    
    );
}

export default SubAdminPage;
