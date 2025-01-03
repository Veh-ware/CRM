'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Card, CardActions, CardHeader, Divider, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import Link from 'next/link';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { AppContext } from '@/contexts/isLogin';
import Avatar from '@mui/material/Avatar';

export interface Employ {
  id: string;
  image: string;
  avatar: string;
  name: string;
  position: string;
  department: string;
  lastUpdated: Date;
}

export interface LatestEmployProps {
  employ?: Employ[];
  sx?: SxProps;
}

export const LatestEmploy: React.FC<LatestEmployProps> = ({ employ = [], sx }) => {
  const [userType, setUserType] = useState<string>('');
  const [employData, setEmployData] = useState<Employ[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { storedValue } = useContext(AppContext)!;


  useEffect(() => {
    const getUserType = () => {
      const adminData = storedValue;
      if (adminData) {
        try {
          const parsedData = adminData;
          setUserType(parsedData.type || '');
        } catch (error) {
          setLoading(false)
          console.log('Error parsing AdminloginData:', error);
        }
      }
    };

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
          setEmployData(response.data.data.recentEmployees.slice(0, 5));
          setLoading(false)

        } catch (error) {
          setLoading(false)
          console.log('Error fetching employee data:', error);
        }
      }
    };

    getUserType();
    fetchEmployData();
  }, []);

  if (userType === 'employee') return null;

  return (
    <Card sx={{ height: "auto", ...sx }}>
      <CardHeader title="Recent Join Employ" />
      <Divider />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '120px 0px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {employData.map((employee, index) => (
            <ListItem divider={index < employData.length - 1} key={index}>
              <ListItemAvatar>
                {employee.image ? (
                  <Box
                    component="img"
                    src={employee.image}
                    sx={{ borderRadius: 1, height: '48px', width: '48px' }}
                  />
                ) : (
                  <Avatar src={employee.avatar} />
                )}
              </ListItemAvatar>
              <ListItemText
                primary={employee.name}
                primaryTypographyProps={{ variant: 'subtitle1' }}
                secondary={`Joined ${dayjs(employee.lastUpdated).format('MMM D, YYYY')}`}
                secondaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Link href="/dashboard/employ" passHref>
          <Button
            color="inherit"
            endIcon={<ArrowRightIcon />}
            size="small"
            variant="text"
          >
            View all
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};
