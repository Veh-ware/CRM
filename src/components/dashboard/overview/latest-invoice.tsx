'use client'

import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';  
import TableRow from '@mui/material/TableRow';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import dayjs from 'dayjs';
import Link from 'next/link';
import { AppContext } from '@/contexts/isLogin';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

const statusMap: Record<string, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' }> = {
  PENDING: { label: 'PENDING', color: 'primary' },
  PAID: { label: 'PAID', color: 'secondary' },
  refunded: { label: 'Refunded', color: 'error' },
};

interface Order {
  _id: string;
  orderTo: string;
  title: string;
  amount: number;
  status: string;
  createdAt: Date;
}


export interface LatestOrdersProps {
  orders?: Order[];
  sx?: SxProps;
}

export function LatestInvoice({ orders = [], sx }: LatestOrdersProps): React.JSX.Element {

  const [invoiveData, setInvoiveData] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { storedValue } = useContext(AppContext)!;


  useEffect(() => {

    const fetchEmployData = async () => {
      const adminData = storedValue;
      if (adminData) {
        try {
          const { token } = adminData;
          const response = await axios.get('https://api-vehware-crm.vercel.app/api/global/data', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          setInvoiveData(response.data.data.recentOrder.slice(0, 6));
          setLoading(false)

        } catch (error) {
          setLoading(false)
          console.log('Error fetching employee data:', error);
        }
      }
    };

    fetchEmployData();
  }, []);


  return (
<Card sx={{ height: "auto", ...sx }}>
  <CardHeader title="Latest invoice" />
  <Divider />
  <Box sx={{ maxHeight: 'auto', overflowY: 'auto' }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Order</TableCell>
          <TableCell>Customer</TableCell>
          <TableCell sortDirection="desc">Date</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <Box sx={{
            marginLeft: '400px',
          
            height: '200px', 
            padding: '120px 0px'
          }}>
            <CircularProgress />
          </Box>
        ) : (
          invoiveData.map((order) => {
            const { label, color } = statusMap[order.status] ?? { label: 'Unknown', color: 'default' };

            return (
              <TableRow hover key={order._id}>
                <TableCell>{order.orderTo}</TableCell>
                <TableCell>{order.title}</TableCell>
                <TableCell>{dayjs(order.createdAt).format('MMM D, YYYY')}</TableCell>
                <TableCell>
                  <Chip color={color} label={label} size="small" />
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  </Box>
  <Divider />
  <CardActions sx={{ justifyContent: 'flex-end' }}>
    <Link href="/dashboard/invoice">
      <Button
        color="inherit"
        endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
        size="small"
        variant="text"
      >
        View all
      </Button>
    </Link>
  </CardActions>
</Card>



  
  );
}


