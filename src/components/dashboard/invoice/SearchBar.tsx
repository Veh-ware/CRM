import React, { ChangeEvent } from 'react';
import { InputAdornment, OutlinedInput, TextField } from '@mui/material';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        onSearch(event.target.value);
    };

    return (
        <OutlinedInput
            onChange={handleSearchChange}
            fullWidth
            placeholder="Search invoices"
            startAdornment={
                <InputAdornment position="start">
                    <MagnifyingGlassIcon fontSize="1.5rem" />
                </InputAdornment>
            }
            sx={{
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
};

export default SearchBar;
