import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { config } from '@/config';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestInvoice } from '@/components/dashboard/overview/latest-invoice';

import { LatestEmploy } from '@/components/dashboard/overview/latest-employ';
import { Sales } from '@/components/dashboard/overview/sales';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Traffic } from '@/components/dashboard/overview/traffic';

export const metadata = { title: `Vehware | Dashboard ` } satisfies Metadata;

export default function Page(): React.JSX.Element {



  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value="$24k" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers diff={16} trend="up" sx={{ height: '100%' }} value="1.6k" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TasksProgress sx={{ height: '100%' }} value={95} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} value="$15k" />
      </Grid>
     
      <Grid lg={4} md={6} xs={12}>
        <LatestEmploy
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={8} xs={12}>
        <LatestInvoice
          // orders={[
          //   {
          //     id: 'ORD-007',
          //     customer: { name: 'Ekaterina Tankova' },
          //     amount: 30.5,
          //     status: 'pending',
          //     createdAt: dayjs().subtract(10, 'minutes').toDate(),
          //   },
          //   {
          //     id: 'ORD-006',
          //     customer: { name: 'Cao Yu' },
          //     amount: 25.1,
          //     status: 'delivered',
          //     createdAt: dayjs().subtract(10, 'minutes').toDate(),
          //   },
          //   {
          //     id: 'ORD-004',
          //     customer: { name: 'Alexa Richardson' },
          //     amount: 10.99,
          //     status: 'refunded',
          //     createdAt: dayjs().subtract(10, 'minutes').toDate(),
          //   },
          //   {
          //     id: 'ORD-003',
          //     customer: { name: 'Anje Keizer' },
          //     amount: 96.43,
          //     status: 'pending',
          //     createdAt: dayjs().subtract(10, 'minutes').toDate(),
          //   },
          //   {
          //     id: 'ORD-002',
          //     customer: { name: 'Clarke Gillebert' },
          //     amount: 32.54,
          //     status: 'delivered',
          //     createdAt: dayjs().subtract(10, 'minutes').toDate(),
          //   },
          //   {
          //     id: 'ORD-001',
          //     customer: { name: 'Adam Denisov' },
          //     amount: 16.76,
          //     status: 'delivered',
          //     createdAt: dayjs().subtract(10, 'minutes').toDate(),
          //   },
          // ]}
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
}
