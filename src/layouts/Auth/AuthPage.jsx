// hooks
import {useResponsive} from "../../hooks/use-responsive";
// @mui
import { styled } from "@mui/material/styles";
import { 
    Grid, 
    Container, 
} from "@mui/material";

// components
import AuthBackground from "/assets/background/login-bg.jpg";
import LoginForm from "./LoginForm";
import AmmachilabsLogo from "/assets/images/logos/ammachilabs-logo.png";

const StyledRoot = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const StyledSection = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: "40%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

const AuthPage = () => {
  const mdUp = useResponsive("up", "md");

  return (
    <>
      <title> Login </title>

      <StyledRoot>
        {mdUp && (
          <StyledSection
            sx={{
              background: `linear-gradient(to right, rgba(177,15,87,0.2) 0%, rgba(209,9,70,0.2) 35%, rgba(255,40,107,0.2) 70%, rgba(174,0,94,0.2) 100%), url(${AuthBackground})`,
              opacity: 0.8,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
          </StyledSection>
        )}

        <Container maxWidth="xl">
          <StyledContent>
            <Grid container maxWidth="xl" spacing={2}>
              <Grid
                item
                xs={12}
                sx={{
                  mb: 3,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src={AmmachilabsLogo}
                  alt=""
                  style={{
                    width: 220,
                    height: 50,
                  }}
                />
              </Grid>
            </Grid>
            <LoginForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
};

export default AuthPage;
