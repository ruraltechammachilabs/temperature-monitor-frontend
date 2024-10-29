import { useState } from "react";

/* MUI */
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import { alpha } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";

/* MUI Icons */
import DownloadIcon from "@mui/icons-material/Download";

/* Components */
import HelpIcon from "/assets/icons/help_icon.png";

// import HelpCenterIcon from "@mui/icons-material/HelpCenter";

const SlideTransition = (props) => {
  return <Slide {...props} direction="up" />;
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const HelpPopover = () => {
  const [open, setOpen] = useState(null);

  // Snackbar
  const [state, setState] = useState({
    open: false,
    Transition: Fade,
  });

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  /* Snackbar methods */
  const handleSnackbarOpen = (Transition) => () => {
    setState({
      open: true,
      Transition,
    });
  };

  const handleSnackbarClose = () => {
    setState({
      ...state,
      open: false,
    });
  };

  const downloadFile = () => {
	const pdfUrl = "/assets/files/user_manual.pdf";
	const link = document.createElement("a");
	link.href = pdfUrl;
	link.download = "User_Manual.pdf";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 56,
          height: 56,
          //   background: (theme) => alpha(theme.palette.grey[500], 0.08),
          //   ...(open && {
          //     background: (theme) =>
          //       `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          //   }),
          mr: 2,
        }}
      >
        <Avatar
          src={HelpIcon}
          alt="Help"
          sx={{
            width: 55,
            height: 55,
            // border: (theme) => `solid 2px ${theme.palette.background.default}`,
            textTransform: "capitalize",
          }}
        />
      </IconButton>
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            // ml: 0.75,
            ml: 8,
            width: 200,
          },
        }}
      >
        {/* <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            Download User Manual
          </Typography>
        </Box> */}

        <Divider sx={{ borderStyle: "dashed", m: 0 }} />

        <MenuItem
          // disableRipple
          // disableTouchRipple
          sx={{
            typography: "body2",
            color: "primary.main",
            py: 1.5,
            fontWeight: 600,
            p: "1rem",
			display: 'flex',
			justifyContent: 'center'
          }}
		  onClick={downloadFile}
        >
          User Manual
          <DownloadIcon sx={{ ml: 2 }} />
        </MenuItem>
      </Popover>
    </>
  );
};

export default HelpPopover;
