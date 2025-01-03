'use client'

import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { ArrowBack, Dashboard, Home, PersonAdd, PersonSearch, Menu as MenuIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import CloseIcon from '@mui/icons-material/Close';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  slug: string;
  href?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleListItemClick = () => {
    if (isSmallScreen) {
      setOpen(false);
    }
  };

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem('AdminloginData') || '{}');
    setUserType(adminData?.type || null);
  }, []);

  const menuItems: MenuItem[] = [
    { text: 'Create Sub Admin', icon: <Dashboard />, slug: 'create-sub-admin' },
    { text: 'Create Employee', icon: <PersonAdd />, slug: 'create-employee' },
    { text: 'Create Client', icon: <PersonSearch />, slug: 'create-client' },
  ];

  const filteredMenuItems =
    userType === 'admin'
      ? menuItems
      : userType === 'sub-admin'
        ? menuItems.filter(item => item.slug !== 'create-sub-admin')
        : userType === 'employee'
          ? menuItems.filter(item => item.slug === 'create-client')
          : [];


  return (
    <div>
      {isSmallScreen ? <IconButton
        sx={{
          position: 'absolute',
          top: 6,
          left: 16,
          zIndex: 1000,
          color: '#fff',
          padding: '1rem',
          backgroundColor: 'black',
          '&:hover': {
            backgroundColor: 'black',
          },
        }}
        onClick={toggleDrawer}
      >
        <MenuIcon sx={{ color: 'white', fontSize: '1rem' }} />
      </IconButton> : null}

      {/* Drawer Component */}
      <Drawer
        sx={{
          width: 300,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 350,
            background: '#000',
            color: '#ffffff',
            padding: '16px',
            boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
          },
        }}
        variant={isSmallScreen ? 'temporary' : 'permanent'}
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true,
        }}
      >
       
        {isSmallScreen ? <IconButton
          sx={{
            position: 'absolute',
            top: 26,
            right: 22,
            color: '#fff',
            zIndex: 1200,
          }}
          onClick={toggleDrawer}
        >
          <CloseIcon sx={{ fontSize: '2rem' }} />
        </IconButton> : null}

      
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '20px',
          }}
        >
          <Link href="/dashboard">
            <ArrowBack
              sx={{
                color: '#fff',
                fontSize: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginTop: '5px',
                '&:hover': {
                  color: '#0335fc',
                },
              }}
            />
          </Link>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Create Account</h2>
        </div>

     
        <List
          sx={{
            width: { xs: '80%', sm: '70%', md: '90%' },
            margin: '0 auto',
          }}
        >
          {filteredMenuItems.map((item, index) => (
            <ListItem
              key={index}
              component={Link}
              href={item.href || `?slug=${item.slug}`}
              sx={{
                '&:hover': {
                  transform: 'scale(1.03)',
                  cursor: 'pointer',
                },
                transition: 'all 0.3s ease',
                borderRadius: 2,
                backgroundColor: '#fff',
                mb: 2,
                padding: '16px 20px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={toggleDrawer}
            >
              <ListItemIcon
                sx={{
                  color: '#0335fc',
                  minWidth: '40px',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: '#000',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

    
      <div className="flex-1 p-6">
        <div>{children}</div>
      </div>
    </div>

  );
};

export default DashboardLayout;
