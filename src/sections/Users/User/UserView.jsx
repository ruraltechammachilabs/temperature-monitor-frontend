/* React */
import { 
  useContext, 
  // useState, 
  // useEffect 
} from "react";

/* MUI */
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  Stack,
  // Fab,
} from "@mui/material";

/* MUI Icons */
// import EditRoundedIcon from "@mui/icons-material/EditRounded";
// import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

/* Styles */
import "../../../styles/dashboard.css";

/* Components */
import { grey, secondary } from "../../../theme/palette";
import { GlobalDataContext } from "../../../Providers/GlobalDataProvider";
// import { useResponsive } from "../../../hooks/use-responsive";

const UserView = ({ user }) => {
  const { toggleDark } = useContext(GlobalDataContext);

  // const mdUp = useResponsive("up", "md");

  return (
    <Grid item xs={6} md={4} lg={3}>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 2,
        }}
        className="custom-card"
      >
        {/* <Stack
          sx={{
            pt: 3,
            pb: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            // background: "linear-gradient(to right, rgba(177,15,87,0.8) 0%, rgba(209,9,70,0.6) 35%, rgba(255,40,107,0.7) 70%, rgba(174,0,94,0.6) 100%)",
            // background: "linear-gradient(to right, #ff4e50, #f9d423)",
          }}
        > */}
        {/* Picture */}
        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            sx={{
              mt: 3,
              pt: 1,
              pb: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Avatar
              sx={{
                // bgcolor: secondary.light
                // bgcolor: grey[400],
                bgcolor: secondary.light,
                width: 60,
                height: 60,
              }}
              src={
                user.role === "Admin"
                  ? "/assets/images/avatars/avatar_12.jpg"
                  : "/assets/images/avatars/avatar_13.jpg"
              }
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              // pt: 3,
              // pb: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* User Name */}
            <Typography
              sx={{
                display: "flex",
                justifyContent: "center",
                fontWeight: 600,
                // color: grey[100],
                color: toggleDark ? grey[100] : grey[800],
                letterSpacing: 2,
                mt: 1,
              }}
            >
              {user.displayName}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              // pt: 3,
              // pb: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* Email */}
            <Typography
              sx={{
                display: "flex",
                // alignItems: 'center',
                justifyContent: "center",
                fontWeight: 500,
                // color: grey[100],
                color: toggleDark ? grey[100] : grey[800],
                letterSpacing: 1,
                mt: 1,
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.8rem",
                  md: "1rem",
                },
              }}
            >
              {user.email}
            </Typography>
          </Grid>
        </Grid>

        {/* User Name */}
        {/* <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              fontWeight: 600,
              // color: grey[100],
              color: toggleDark ? grey[100] : grey[800],
              letterSpacing: 2,
              mt: 1,
            }}
          >
            {user.displayName}
          </Typography> */}

        {/* Email */}
        {/* <Typography
            sx={{
              display: "flex",
              // alignItems: 'center',
              justifyContent: "center",
              fontWeight: 500,
              // color: grey[100],
              color: toggleDark ? grey[100] : grey[800],
              letterSpacing: 1,
              mt: 1,
            }}
          >
            {user.email}
          </Typography> */}
        {/* </Stack> */}
        <CardContent>
          <Stack
            sx={{
              p: 1,
              display: "flex",
              justifyContent: "center",

              alignItems: "center",
            }}
          ></Stack>
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            background: "linear-gradient(to right, #ff4e50, #f9d423)",
            p: 2,
            position: "relative",
          }}
        >
          <Grid container>
            {/* <Grid item xs={12}>
              <Stack
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "end",
                  width: "100%",
                }}
              >
                <Fab
                  size="small"
                  sx={{
                    position: "absolute",
                    right: 40,
                    top: -20,
                  }}
                >
                  <DeleteRoundedIcon />
                </Fab>
                <Fab
                  size="small"
                  sx={{
                    position: "absolute",
                    right: 90,
                    top: -20,
                  }}
                >
                  <EditRoundedIcon />
                </Fab>
              </Stack>
            </Grid> */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{
                  textAlign: "center",
                  width: "100%",
                  color: grey[100],
                  letterSpacing: 1,
                  textTransform: "capitalize",
                }}
              >
                {user.role}
              </Typography>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default UserView;
