import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { blue } from '@mui/material/colors';

import { config } from '@/config';
import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={4} sx={{ alignItems: 'center', minHeight: '100vh', p: 3 }}>
      <div>
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center', 
            color: blue[800], 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
          }}
        >
          Account
        </Typography>
      </div>
      <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
        <Grid lg={4} md={6} xs={12}>
          <AccountInfo />
        </Grid>
        <Grid lg={8} md={6} xs={12}>
          <AccountDetailsForm />
        </Grid>
      </Grid>
    </Stack>
  );
}
