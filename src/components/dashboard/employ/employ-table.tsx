'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import Link from 'next/link';
import { CircularProgress } from '@mui/material';

export interface Customer {
  _id: string;
  avatar: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  salary: string;
  position: string;
  joiningDate:string;
  leavingDate:string;
  
}

interface CustomersTableProps {
  count: number;
  rows: Customer[];
  page: number;
  rowsPerPage: number;
  loading: boolean;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CustomersTable({
  count,
  rows,
  page,
  rowsPerPage,
  loading,
  onPageChange,
  onRowsPerPageChange,
}: CustomersTableProps): React.JSX.Element {
  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Salary</TableCell>
             <TableCell>Position</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <Link href={`/dashboard/employ/${row._id}`} key={row._id} passHref legacyBehavior>
                  <TableRow hover key={row._id} sx={{ cursor: 'pointer' }}>
                    <TableCell>
                      <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                        <Avatar src={row.avatar} />
                        <Typography variant="subtitle2">{row.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>Pakistan</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.salary}</TableCell>
                     <TableCell>{row.position}</TableCell> 
                  </TableRow>
                </Link>
              ))
            )}
          </TableBody>


        </Table>
      </Box>
      <Divider />

      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
