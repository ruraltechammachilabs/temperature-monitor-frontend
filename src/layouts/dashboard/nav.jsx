import { useEffect } from "react";
import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import { alpha } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";

import { usePathname } from "../../routes/hooks";
import { useResponsive } from "../../hooks/use-responsive";
import { useTranslation } from "react-i18next";

import { RouterLink } from "../../routes/components";
import { CustomScrollBar } from "../../components/scrollbar";
import SvgColor from "../../components/svg-color";
import { account } from "/src/_mock/account";

import { NAV } from "./config-layout";

// import HeaderStyles from "./header.module.css";
// import { Grid } from "@mui/material";

export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const upLg = useResponsive("up", "lg");
  // const mdDown = useResponsive("down", "md");
  // const mdUp = useResponsive("up", "md");

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const icon = (name) => (
    <SvgColor
      src={`/assets/icons/navbar/${name}.svg`}
      sx={{ width: 1, height: 1 }}
    />
  );

  const navConfig = [
    // {
    // 	title: "dashboard",
    // 	path: "/",
    // 	icon: icon("ic_analytics"),
    // },
    {
      title: t("nav.Dashboard"),
      path: "/dashboard",
      icon: icon("ic_house"),
    },
    {
      title: "Settings",
      path: "/settings",
      icon: icon("ic_settings"),
    },
    // {
    // 	title: "user",
    // 	path: "/user",
    // 	icon: icon("ic_user"),
    // },
  ];

  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: "flex",
        borderRadius: 1.5,
        alignItems: "center",
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Avatar src={account.photoURL} alt="photoURL" />

      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{account.displayName}</Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {account.role}
        </Typography>
      </Box>
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  const renderContent = (
    <CustomScrollBar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* {mdDown && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            // marginRight: "5vw",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Grid container>
            <Grid item xs={6} className={HeaderStyles.navImgWrapper}>
              <img
                src={AmritaMultiLogo}
                alt="Amrita"
                className={HeaderStyles.navImgLogo}
              />
            </Grid>
            <Grid item xs={6} className={HeaderStyles.navImgWrapper}>
              <img
                src={NabardLogo}
                alt="Amrita"
                className={HeaderStyles.navImgLogo}
              />
            </Grid>
          </Grid>
        </Stack>
      )} */}
      {/* <Logo sx={{ mt: 3, ml: 10 }} /> */}

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />
    </CustomScrollBar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: "fixed",
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

function NavItem({ item }) {
  const pathname = usePathname();

  const active = item.path === pathname;

  return (
    <ListItemButton
      component={RouterLink}
      href={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: "body2",
        color: "text.secondary",
        textTransform: "capitalize",
        fontWeight: "fontWeightMedium",
        ...(active && {
          color: "primary.main",
          fontWeight: "fontWeightSemiBold",
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          "&:hover": {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>

      <Box component="span">{item.title} </Box>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};
