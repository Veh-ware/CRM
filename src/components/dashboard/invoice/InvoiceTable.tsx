'use client'

import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Stack, Typography, TablePagination, CircularProgress } from '@mui/material';
import { Visibility, Delete } from '@mui/icons-material';

interface Order {
    _id: string;
    title: string;
    description: string;
    discountPrice: number;
    price: number;
    status: string;
    brand: {
        _id: string;
        title: string;
        description: string;
        image: string;
    };
}

interface InvoiceTableProps {
    orders: Order[];
    onOpenModal: (order: Order) => void;
    onDeleteOrder: (orderId: string) => void;
    page: number;
    rowsPerPage: number;
    totalOrders: number;  // total orders to pass for pagination
    handleChangePage: (event: unknown, newPage: number) => void;
    handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isLoading: boolean; 
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
    orders,
    onOpenModal,
    onDeleteOrder,
    page,
    rowsPerPage,
    totalOrders,
    handleChangePage,
    handleRowsPerPageChange,
    isLoading
}) => {
    const hasOrders = orders.length > 0;

    return (
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, marginTop: '1rem' }}>
            <Table>
                <TableHead sx={{ backgroundColor: '#F5F5F5' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Brand</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Discount</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Price</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center" sx={{ padding: '16px' }}>
                                <CircularProgress size={40} />
                            </TableCell>
                        </TableRow>
                    ) : hasOrders ? (
                        orders.map((order) => (
                            <TableRow key={order._id} sx={{ '&:hover': { backgroundColor: '#f0f8ff' } }}>
                                <TableCell>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <img
                                            src={order.brand ? order.brand.image : '/default-image.png'}
                                            alt={order.brand ? order.brand.title : 'Default Brand'}
                                            style={{ width: 50, height: 50, borderRadius: '50%', border: '2px solid #3498DB', backgroundColor: 'black' }}
                                        />
                                        <Typography variant="body2" sx={{ color: '#34495E' }}>
                                            {order.brand ? order.brand.title : 'Default Brand'}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 500, color: '#34495E' }}>{order.title}</TableCell>
                                <TableCell sx={{ fontSize: 14, color: '#7F8C8D' }}>
                                    {order.description.split(' ').slice(0, 5).join(' ') +
                                        (order.description.split(' ').length > 5 ? '...' : '')}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 500, color: order.discountPrice === 0 ? 'red' : 'green', textAlign: 'center' }}>
                                    ${order.discountPrice === 0 ? '--' : order.discountPrice}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 500, color: '#27AE60' }}>${order.price}</TableCell>
                                <TableCell sx={{ fontWeight: 500, color: '#3498DB' }}>{order.status}</TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={2}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => onOpenModal(order)}
                                            sx={{
                                                padding: 1,
                                                borderRadius: '50%',
                                                '&:hover': { backgroundColor: '#E3F2FD' },
                                            }}
                                        >
                                            <Visibility sx={{ fontSize: 24 }} />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() => onDeleteOrder(order._id)}
                                            sx={{
                                                padding: 1,
                                                borderRadius: '50%',
                                                '&:hover': { backgroundColor: '#FFEBEE' },
                                            }}
                                        >
                                            <Delete sx={{ fontSize: 24, color: '#8B0000' }} />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} align="center" sx={{ padding: '16px', fontWeight: 500, color: '#7F8C8D' }}>
                                No results found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={totalOrders}  // Pass total orders for pagination
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </TableContainer>
    );
};

export default InvoiceTable;
