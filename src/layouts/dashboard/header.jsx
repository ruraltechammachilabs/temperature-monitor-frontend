/* React */
import { useContext, useMemo } from "react";
import PropTypes from "prop-types";
import classNames from 'classnames';

/* MUI */
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import LightModeIcon from '@mui/icons-material/LightMode';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import Fab from '@mui/material/Fab';
import Box from "@mui/material/Box";

/* Components */
import { grey } from "../../theme/palette"
import { HEADER } from "./config-layout"
import { useResponsive } from "../../hooks/use-responsive"
import AmritaLogo from "/assets/images/logos/amrita-logo.png"
import AmmachiLabsLogo from "/assets/images/logos/ammachilabs-logo.png"
import { GlobalDataContext } from '../../Providers/GlobalDataProvider'
import AccountPopover from '../../layouts/dashboard/common/account-popover'

/* Styles */
import { bgBlur } from "../../theme/css";
import HeaderStyles from "./header.module.css";

export default function Header({ onOpenNav }) {
  const theme = useTheme();
  const { toggleDark, setToggleDark } = useContext(GlobalDataContext)

  const lgUp = useResponsive("up", "lg");
  const mdUp = useResponsive("up", "md");

  const textDarkColor = useMemo(() => (toggleDark ? grey[100] : grey[900]), [toggleDark]);
  
  const toggleDarkMode = () => {
    setToggleDark(!toggleDark)
  }

  const renderContent = (
    <>
      {/* {!lgUp && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1 }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )} */}

      {/* <Searchbar /> */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        {/* <img
          src={PlantIcon}
          alt="Sapling"
          className={HeaderStyles.headerlogo}
        /> */}
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
          color={textDarkColor}
        >
          Data Center Monitoring
        </Typography>
      </Box>

      {/* <Box sx={{ flexGrow: 1 }} /> */}

      {mdUp && 
        <Box 
          spacing={1} 
          sx={{ 
            display: "flex", 
            flexDirection: "row", 
            alignItems: "center", 
            justifyContent: "center", 
            marginRight: 10
          }}>
          <img 
            src={AmritaLogo} alt="Amrita" 
            className={classNames(HeaderStyles.imglogo, HeaderStyles.amritaLogo)} 
          />
          {/* <img src={CwegeLogo} alt="Amrita" className={HeaderStyles.imglogo} /> */}
          <img 
            src={AmmachiLabsLogo} 
            alt="Amrita" 
            className={classNames(HeaderStyles.imglogo, HeaderStyles.amritaLogo, HeaderStyles.ammachilabsLogo)} 
          />
          {/* <img src={NabardLogo} alt="Amrita" className={HeaderStyles.imglogo} /> */}
      </Box>}
      <Fab size="small" aria-label="dark mode" onClick={toggleDarkMode} sx={{ mr: 2 }}>
       { toggleDark ?  <LightModeIcon color="warning" /> : <NightsStayIcon /> } 
      </Fab>

      <AccountPopover />
        {/* <Switch {...label} defaultChecked color="secondary" /> */}
          {/* <LanguagePopover /> */}
    </>
  );

  return (
    <AppBar
      sx={{
        boxShadow: "none",
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(["height"], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          /* uncomment this to add nav css to header */
          // width: `calc(100% - ${NAV.WIDTH + 1}px)`,
          height: HEADER.H_DESKTOP,
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
