/* React */
import { useContext, useEffect, useState } from "react";

/* MUI */
import {
  Container,
  Box,
  Paper,
  Grid,
  Avatar,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";

/* Components */
import ProfileForm from "../../../sections/Profile/ProfileForm";
import { AuthContext } from "../../../Providers/AuthDataProvider";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const ProfileTab = () => {

  const [profileRole, setProfileRole] = useState("")
  const { dbUser } = useContext(AuthContext)

  useEffect(() => {
    setProfileRole(dbUser.role)
  }, [dbUser])

  const ProfileImage = () => {
    return (
      <Stack direction="column" spacing={2}>
        <Avatar
          alt="Avatar"
          src="/assets/images/avatars/avatar_12.jpg"
          sx={{
            width: 144,
            height: 144,
            padding: "8px",
            borderStyle: "dashed",
            borderColor: "rgba(145, 158, 171, 0.2)",
            img: {
              borderRadius: "50%",
            },
          }}
        />
        <h2 style={{
          textTransform: 'capitalize'
        }} >{ profileRole }</h2>
        {/* <Typography
              variant="subtitle2"
              gutterBottom
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              Verified
              <VerifiedIcon color="success" />
            </Typography> */}
      </Stack>
    );
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Item
              sx={{ display: "flex", justifyContent: "center", pt: 15, pb: 15 }}
            >
              <ProfileImage />
            </Item>
          </Grid>
          <Grid item xs={12} md={8}>
            <ProfileForm />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProfileTab;
