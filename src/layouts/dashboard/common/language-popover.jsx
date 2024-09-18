import { useState } from 'react';
import { useTranslation } from "react-i18next";

import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

const LANGS = [
  {
    value: 'en',
    label: 'English',
    icon: '/assets/icons/ic_flag_en.svg',
  },
  {
    value: 'or',
    label: 'Odia',
    icon: '/assets/icons/ic_flag_in.svg',
  },
  {
    value: 'hi',
    label: 'Hindi',
    icon: '/assets/icons/ic_flag_in.svg',
  },
];

export const LanguagePopover = () => {
  const [open, setOpen] = useState(null);
  const [lang, setLang] = useState("English")
  const { i18n } = useTranslation();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = (value) => {
    i18n.changeLanguage(value)
    
    if(value === "en") setLang("English")
    if(value === "or") setLang("Odia")
    if(value === "hi") setLang("Hindi")

    setOpen(null);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        sx={{
          // width: 40,
          // height: 40,
          ...(open && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        {lang === "English" && <img src={LANGS[0].icon} alt={LANGS[0].label} />}
        {lang === "Odia" && <img src={LANGS[1].icon} alt={LANGS[1].label} />}
        {lang === "Hindi" && <img src={LANGS[2].icon} alt={LANGS[2].label} />}
        
        <Typography variant="subtitle2" sx={{ ml:1 }}>
          {lang}
        </Typography>
      </Button>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 180,
          },
        }}
      >
        {LANGS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === LANGS[0].value}
            onClick={() => handleClose(option.value)}
            sx={{ typography: 'body2', py: 1 }}
          >
            <Box component="img" alt={option.label} src={option.icon} sx={{ width: 28, mr: 2 }} />

            {option.label}
          </MenuItem>
        ))}
      </Popover>
    </>
  );
}

export default LanguagePopover