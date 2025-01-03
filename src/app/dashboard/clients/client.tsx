'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CustomersFilters } from '@/components/dashboard/client/client-filters';
import { CustomersTable } from '@/components/dashboard/client/client-table';
import type { Customer } from '@/components/dashboard/client/client-table';
import { CircularProgress, TablePagination } from '@mui/material';
import { Box } from '@mui/system';



export default function Employee(): React.JSX.Element {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [originalEmployees, setOriginalEmployees] = useState<Customer[]>([]); 
  const [employ, setEmploy] = useState<Customer[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true);
        setError(null);
        const adminLoginData: string | null = localStorage.getItem('AdminloginData');
        const response = await axios.get("https://api-vehware-crm.vercel.app/api/credentials/clients", {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(adminLoginData!).token}`,
          },
        });
        setOriginalEmployees(response.data.data.clients); 
        setEmploy(response.data.data.clients);
      } catch (err) {
        setError('Failed to fetch customers.');
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  const handleFilterEmploy = (value: string) => {
    const filtered = value.trim() === ""
      ? originalEmployees
      : originalEmployees.filter((customer) =>
          customer.name.toLowerCase().includes(value.toLowerCase())
        );
    setEmploy(filtered);
    setPage(0); 
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  const paginatedEmployees = employ ? employ.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [];

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          textAlign: 'center',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Client</Typography>
        </Stack>
      </Stack>
      <CustomersFilters
        onChange={(e) => { handleFilterEmploy(e.target.value); }}
        onResetData={() => { setEmploy(originalEmployees); }} 
      />
      <CustomersTable
        count={employ.length}
        page={page}
        rows={paginatedEmployees}
        rowsPerPage={rowsPerPage}
      />
      <TablePagination
        component="div"
        count={employ.length} 
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Stack>
  );
}
