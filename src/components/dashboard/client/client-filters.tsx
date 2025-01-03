"use client";

import * as React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

interface CustomersFiltersProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData?: () => void; 
}

export function CustomersFilters({ onChange, onResetData }: CustomersFiltersProps): React.JSX.Element {
  const [inputValue, setInputValue] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    if (onChange) {
      onChange(event);
    }
  };

  React.useEffect(() => {
    if (inputValue === "") {
      if (onResetData) {
        onResetData(); 
      }
    }
  }, [inputValue, onResetData]);

  return (
    <OutlinedInput
        value={inputValue}  
        onChange={handleChange}  
        fullWidth
        placeholder="Search client"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="1.5rem" />
          </InputAdornment>
        }
        sx={{
          width: 'auto', 
          maxWidth: '250px', 
          borderRadius: 1,
          '& .MuiOutlinedInput-root': {
            paddingLeft: 2,
            paddingRight: 2,
          },
          '& .MuiOutlinedInput-input': {
            paddingTop: 2,
            paddingBottom: 2,
          },
        }}
      />
  );
}
