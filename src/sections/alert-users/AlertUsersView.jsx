/* React */
import { useContext, useState, useEffect, forwardRef } from "react";

/* MUI */
import {
  Grid,
  Fab,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Avatar,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemAvatar,
  Box,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Snackbar,
  Fade,
  Slide,
} from "@mui/material";

/* MUI Icons */
import AddIcon from "@mui/icons-material/Add";
import RestoreIcon from "@mui/icons-material/Restore";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PhoneForwardedIcon from "@mui/icons-material/PhoneForwarded";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
// import SmsIcon from '@mui/icons-material/Sms';

/* Styles */
import "../../styles/dashboard.css";

/* Components */
import { GlobalDataContext } from "../../Providers/GlobalDataProvider";
import { grey } from "../../theme/palette";
import {
  getAllAlertUsers,
  deleteAlertUser,
} from "../../firebase/AlertUserOperations";
import { useResponsive } from "../../hooks/use-responsive";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AlertUsersView = ({ addAlertUserEvent }) => {
  const { isNewAlertUserAdded, setIsAlertUserRemoved, isAlertUserRemoved } =
    useContext(GlobalDataContext);
  const [cardHeight, setCardHeight] = useState("34dvh");
  const [alertUsers, setAlertUsers] = useState([
    // {
    // 	name: "Gokul Dev",
    // 	phone: "8848433125",
    // 	updates: [0, 1, 2],
    // },
  ]);

  const [currentAlertNumber, setCurrentAlertNumber] = useState("000");
  const [currentAlertUser, setCurrentAlertUser] = useState({});

  const xsUp = useResponsive("up", "xs");
  const mdUp = useResponsive("up", "md");
  const mdDown = useResponsive("down", "md");
  const lgDown = useResponsive("down", "lg");
  const lgUp = useResponsive("up", "lg");
  const xlDown = useResponsive("down", "xl");
  const xlUp = useResponsive("up", "xl");

  const items = [
    {
      label: "Regular updates",
      icon: <RestoreIcon />,
    },
    {
      label: "Stage updates",
      icon: <EventNoteIcon />,
    },
    {
      label: "Power up updates",
      icon: <PowerSettingsNewIcon />,
    },
    {
      label: "Calls",
      icon: <PhoneForwardedIcon />,
    },
  ];

  // Snackbar
  const [deleteUserSnackbarState, setDeleteUserSnackbarState] = useState({
    open: false,
    Transition: Fade,
    vertical: "bottom",
    horizontal: "center",
  });

  /* Alert User Snackbar methods */
  const handleDeleteUserSnackbarOpen = (Transition) => () => {
    setDeleteUserSnackbarState({
      ...deleteUserSnackbarState,
      open: true,
      Transition,
    });
  };

  const handleDeleteUserSnackbarClose = (Transition) => () => {
    setDeleteUserSnackbarState({
      ...deleteUserSnackbarState,
      open: false,
    });
  };

  /* Delete Alert User Dialog */

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenDeleteDialog = (user) => {
    setOpenDeleteDialog(true);
    setCurrentAlertNumber(user.phone);
    setCurrentAlertUser(user);
  };

  const handleAgreeDeleteDialog = (user) => {
    handleDeleteUserSnackbarOpen(deleteUserSnackbarState.Transition);
    handleCloseDeleteDialog();
    handleDeleteAlertUser(user);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const alertusers = await getAllAlertUsers();
      if (alertusers.length > 0 && alertusers !== undefined) {
        setAlertUsers(alertusers);
      }
    };

    fetchData();
  }, []);

  /* Fetch new Alert Users Data When Alert User */
  useEffect(() => {
    if (isNewAlertUserAdded || isAlertUserRemoved) {
      const fetchData = async () => {
        await getAllAlertUsers().then((alertusers) => {
          setAlertUsers(alertusers);
        });
      };

      fetchData();
    }
  }, [isNewAlertUserAdded, isAlertUserRemoved]);

  const handleAddUserClick = () => {
    addAlertUserEvent();
  };

  const handleDeleteAlertUser = async (alertUser) => {
    const deleteuser = await deleteAlertUser(alertUser);
    if (deleteuser) {
      setIsAlertUserRemoved(true);

      setTimeout(() => {
        setIsAlertUserRemoved(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (lgUp && xlDown) {
      setCardHeight("42dvh");
    } else if (mdUp && lgDown) {
      setCardHeight("44dvh");
    } else if (xsUp && mdDown) {
      setCardHeight("40dvh");
    } else if (xlUp) {
      setCardHeight("40dvh");
    }
  }, [xsUp, mdDown, mdUp, lgUp, xlDown, xlUp, lgDown]);

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          p: 3,
        }}
      >
        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <Card
            sx={{
              minHeight: "40dvh",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: (theme) => `dashed 2px ${theme.palette.divider}`,
              borderRadius: "15px",
            }}
            className="custom-card"
          >
            <CardActionArea
              onClick={handleAddUserClick}
              sx={{
                height: "100%",
                // minHeight: (mdUp && xlDown) ? "45dvh" : "37dvh",
                // minHeight: cardHeight,
              }}
            >
              <CardContent
                sx={{
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  height: "100%",
                  minHeight: cardHeight,
                }}
              >
                <Stack>
                  <Avatar
                    sx={{
                      bgcolor: grey[400],
                    }}
                  >
                    <AddIcon />
                  </Avatar>
                  <Typography
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      fontWeight: 600,
                      color: grey[500],
                      mt: 1,
                    }}
                  >
                    Add
                  </Typography>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        {alertUsers &&
          alertUsers.map((user, index) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={index}>
                <Card
                  sx={{
                    // minHeight: "25dvh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                  }}
                  className="custom-card"
                >
                  <Stack
                    sx={{
                      pt: 3,
                      pb: 2,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      background:
                        "linear-gradient(to right, rgba(177,15,87,0.8) 0%, rgba(209,9,70,0.6) 35%, rgba(255,40,107,0.7) 70%, rgba(174,0,94,0.6) 100%)",
                    }}
                  >
                    {/* Picture */}
                    <Avatar
                      sx={{
                        // bgcolor: secondary.light
                        // bgcolor: grey[400],
                        bgcolor: "transparent",
                      }}
                      src="/assets/icons/dashboard/bell-icon.png"
                    />

                    {/* User Name */}
                    <Typography
                      sx={{
                        display: "flex",
                        // alignItems: 'center',
                        justifyContent: "center",
                        fontWeight: 600,
                        color: grey[100],
                        letterSpacing: 2,
                        mt: 1,
                      }}
                    >
                      {user.name}
                    </Typography>

                    {/* Phone Number */}
                    <Typography
                      sx={{
                        display: "flex",
                        // alignItems: 'center',
                        justifyContent: "center",
                        fontWeight: 500,
                        color: grey[100],
                        letterSpacing: 2,
                        mt: 1,
                      }}
                    >
                      {user.phone}
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      // p: 1,
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "end",
                      width: "100%",
                      background:
                        "linear-gradient(to right, rgba(177,15,87,0.8) 0%, rgba(209,9,70,0.6) 35%, rgba(255,40,107,0.7) 70%, rgba(174,0,94,0.6) 100%)",
                      m: 0,
                      position: "relative",
                    }}
                  >
                    <Fab
                      size="small"
                      sx={{
                        position: "absolute",
                        right: 40,
                        bottom: -20,
                      }}
                      //   onClick={() => handleDeleteAlertUser(user)}
                      onClick={() => handleOpenDeleteDialog(user)}
                    >
                      <DeleteRoundedIcon />
                    </Fab>
                  </Box>

                  <CardContent>
                    <Stack
                      sx={{
                        p: 1,
                        display: "flex",
                        justifyContent: "center",

                        alignItems: "center",
                      }}
                    >
                      {/* Picture */}
                      {/* <Avatar
                        sx={{
                          // bgcolor: secondary.light
                          bgcolor: grey[400],
                        }}
                      ></Avatar> */}

                      {/* User Name */}
                      {/* <Typography
                        sx={{
                          display: "flex",
                          // alignItems: 'center',
                          justifyContent: "center",
                          fontWeight: 600,
                          color: grey[500],
                          mt: 1,
                        }}
                      >
                        {user.name}
                      </Typography> */}

                      {/* Phone Number */}
                      {/* <Typography
                        sx={{
                          display: "flex",
                          // alignItems: 'center',
                          justifyContent: "center",
                          fontWeight: 500,
                          color: grey[500],
                          mt: 1,
                        }}
                      >
                        {user.phone}
                      </Typography> */}
                      <List
                        dense
                        sx={{
                          bgcolor: "transparent",
                        }}
                      >
                        {items.map((updateItem, index) => {
                          const labelId = `checkbox-list-secondary-label-${index}`;
                          return (
                            <ListItem
                              key={index}
                              disablePadding
                              sx={{
                                bgcolor: "transparent",
                              }}
                              secondaryAction={
                                user.updates.includes(index) ? (
                                  <CheckCircleRoundedIcon color="success" />
                                ) : (
                                  <CancelRoundedIcon color="error" />
                                )
                              }
                            >
                              <ListItemButton>
                                <ListItemAvatar
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {updateItem.icon}
                                </ListItemAvatar>
                                <ListItemText
                                  id={labelId}
                                  primary={updateItem.label}
                                  sx={{
                                    fontSize: "large",
                                    mr: 2,
                                  }}
                                />
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Stack>
                  </CardContent>
                  {/* </CardActionArea> */}
                </Card>
              </Grid>
            );
          })}
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: deleteUserSnackbarState.vertical,
          horizontal: deleteUserSnackbarState.horizontal,
        }}
        TransitionComponent={deleteUserSnackbarState.Transition}
        open={deleteUserSnackbarState.open}
        onClose={handleDeleteUserSnackbarClose}
        message={
          'Alert number "' + currentAlertNumber + '" deleted successfully'
        }
        key={deleteUserSnackbarState.Transition.name}
        autoHideDuration={3000}
      />
      <Dialog
        open={openDeleteDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDeleteDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Delete Selected Number ?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            The mobile number "{currentAlertNumber}" will no longer receive
            Alerts. Are you sure you want to delete the user ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Disagree</Button>
          <Button onClick={() => handleAgreeDeleteDialog(currentAlertUser)}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AlertUsersView;
