import { useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';

import { darkPalette, palette } from './palette';
import { shadows } from './shadows';
import { overrides } from './overrides';
import { typography } from './typography';
import { customShadows, customDarkThemeShadows } from './custom-shadows';
import { GlobalDataContext } from '../Providers/GlobalDataProvider';

const ThemeProvider = ({ children }) => {

  const { toggleDark } = useContext(GlobalDataContext)

  const memoizedValue = useMemo(
    () => ({
      palette: palette(),
      typography,
      shadows: shadows(),
      customShadows: customShadows(),
      shape: { borderRadius: 8 },
    }),
    []
  );

  const darkMemoizedValue = useMemo(
    () => ({
      palette: darkPalette(),
      typography,
      shadows: shadows(),
      customShadows: customDarkThemeShadows(),
      shape: { borderRadius: 8 },
    }),
    []
  );

  const lightTheme = createTheme(memoizedValue)
  const darkTheme = createTheme(darkMemoizedValue)

  // const [theme, setTheme] = useState(lightTheme)

  const [theme, setTheme] = useState(lightTheme);

useEffect(() => {
  if(toggleDark) {
    setTheme(darkTheme)
  } else {
    setTheme(lightTheme)
  }
}, [toggleDark])

useEffect(() => {
  theme.components = overrides(theme)
}, [theme])

  return (
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

export default ThemeProvider