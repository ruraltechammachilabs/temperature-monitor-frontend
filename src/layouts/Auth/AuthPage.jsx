// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";

// hooks
import {useResponsive} from "../../hooks/use-responsive";
// @mui
import { styled } from "@mui/material/styles";
import { 
    Grid, 
    Container, 
    Box 
    // Tab, 
    // Tabs, 
} from "@mui/material";

// components
import AuthBackground from "/assets/background/login-bg.jpg";
import LoginForm from "./LoginForm";
import AmritaLogo from "/assets/images/logos/amrita-logo.png";
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

// const StyledAuthTabs = styled((props) => (
// 	<Tabs
// 		{...props}
// 		TabIndicatorProps={{
// 			children: <span className="MuiTabs-indicatorSpan" />,
// 		}}
// 	/>
// ))({
// 	"& .MuiTabs-indicator": {
// 		display: "flex",
// 		justifyContent: "center",
// 		backgroundColor: "transparent",
// 	},
// 	"& .MuiTabs-indicatorSpan": {
// 		maxWidth: 0,
// 		width: "100%",
// 	},
// });

// const AuthTab = styled(Tab)({
// 	"&.Mui-selected": {
// 		border: "1px solid #AF0C3E",
// 		boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
// 		backgroundImage:
// 			"linear-gradient(to right, rgba(177,15,87,0.8) 0%, rgba(209,9,70,0.6) 	35%, rgba(255,40,107,0.5) 70%, rgba(174,0,94,0.5) 100%)",
// 		backgroundColor: "#AF0C3E",
// 		opacity: 0.7,
// 		color: "#fff",
// 	},
// 	borderRadius: "50px",
// });

const AuthPage = () => {
//   const location = useLocation();
  // const [activeTab, setActiveTab] = useState(
  // 	location.pathname === "/auth/register" ? 1 : 0
  // );
  const mdUp = useResponsive("up", "md");
//   const lgUp = useResponsive("up", "lg");

  // const handleTabChange = (event, value) => {
  // 	setActiveTab(value);
  // };

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
            {/* <Box
              component="img"
              src={AmritaLogo}
              sx={{
                width: 180,
                height: 180,
                mt: 1,
                position: "absolute",
                top: "10px",
                left: "1.5em",
              }}
            /> */}
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
            {/* <StyledAuthTabs
							value={activeTab}
							onChange={handleTabChange}
							variant="fullWidth"
						>
							<AuthTab
								label="Login"
								component={Link}
								to="/auth/login"
							/>
							<AuthTab
								label="Register"
								component={Link}
								to="/auth/register"
							/>
						</StyledAuthTabs> */}
            <LoginForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
};

export default AuthPage;
