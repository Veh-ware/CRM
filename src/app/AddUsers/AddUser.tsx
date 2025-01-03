'use client';

import React, { useEffect, useState, Suspense } from 'react';
import UserForm from './create-sub-admin';
import { useSearchParams } from 'next/navigation';
import AddEmployeeForm from './create-employee';
import ClientForm from './create-client';
import { Typography, Box } from '@mui/material';

const getUserType = () => {
  const adminData = localStorage.getItem('AdminloginData');
  return adminData ? JSON.parse(adminData).type : null;
};

const renderForm = (userType: string | null, slug: string) => {
  switch (userType) {
    case 'admin':
      return renderAdminForm(slug);
    case 'employee':
      return renderEmployeeForm(slug);
    case 'sub-admin':
      return renderSubAdminForm(slug);
    default:
      return <Typography variant="h5" color="textPrimary">Please log in to continue</Typography>;
  }
};

const renderAdminForm = (slug: string) => {
  switch (slug) {
    case 'create-sub-admin':
      return <UserForm />;
    case 'create-employee':
      return <AddEmployeeForm />;
    case 'create-client':
      return <ClientForm />;
    default:
      return <Typography variant="h5" color="textPrimary">Select a component from the layout</Typography>;
  }
};


const renderEmployeeForm = (slug: string) => {
  if (slug === 'create-client' || !slug) {
    return <ClientForm />;
  }
  return <Typography variant="h5" color="textPrimary" sx={{ textAlign: 'center', marginTop: '50px' }} >
    You don't have permission to view this page
  </Typography>;
};


const renderSubAdminForm = (slug: string) => {
  if (slug === 'create-employee') {
    return <AddEmployeeForm />;
  }
  return <ClientForm />;
};

export default function AddUser() {
  const [userType, setUserType] = useState<string | null>(null);
  

  useEffect(() => {
    setUserType(getUserType());
  }, []);


  const FormContent = () => {
    const searchParams = useSearchParams();
    const slug = searchParams?.get('slug') || 'create-client';

    return renderForm(userType, slug);
  };

  return (
    <Box sx={{ height: '100vh', position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          left: -22,
          right: -24,
          bottom: -30,
          backgroundImage: 'url(https://img.freepik.com/free-vector/abstract-background-wallpaper-grey-geometric-circle-pattern-vector_53876-140223.jpg)',
          backgroundSize: 'cover', // Ensures full coverage
          backgroundPosition: 'center', // Ensures the image is aligned with the top-center of the screen
          backgroundRepeat: 'repeat', // Prevents image repetition
          filter: 'blur(0px)',
          zIndex: 1,
          opacity: 0.5,
          height: '800px', // Ensures the background fills the screen
        }}
      />
  
      <Box
        sx={{
          position: 'relative',
          zIndex: 8,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          overflow: 'auto',
          padding: '10px',
        }}
      >
        <Suspense fallback={<Typography>Loading...</Typography>}>
          <FormContent />
        </Suspense>
      </Box>
    </Box>
  );
  
  
  
}
