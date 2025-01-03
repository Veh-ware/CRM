'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { usePopover } from '@/hooks/use-popover';
import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';
import AddIcon from '@mui/icons-material/Add';
import { ListItemIcon } from '@mui/material';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<any>(false);
  const userPopover = usePopover<HTMLDivElement>();

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={() => { setOpenNav(true); }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
          



            <Link
              href="/AddUsers"
              sx={{
                display: 'inline-flex', 
                alignItems: 'center', 
                backgroundColor: '#273f73', // Dark navy blue background
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                fontWeight: '600', 
                fontSize: '1rem', 
                textDecoration: 'none', 
                textAlign: 'center', 
                transition: 'all 0.3s ease', 

                '&:hover': {
                  backgroundColor: '#254ca1', 
                  transform: 'scale(1.05)', 
                  boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)',
                },
                '&:active': {
                  transform: 'scale(0.97)', 
                },
                '&:hover *': {
                  textDecoration: 'none', 
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: 'white',
                  marginRight: '-30px',
                  fontSize: '1.25rem', 
                }}
              >
                <AddIcon /> 
              </ListItemIcon>
              Add User
            </Link>

            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src="/assets/avatar.png"
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
      </Box>

      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
      <MobileNav
        onClose={() => { setOpenNav(false); }}
        open={openNav}
      />
    </React.Fragment>
  );
}