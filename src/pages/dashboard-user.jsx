/* React */
import { memo, useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

/* MUI */
import { Box, Grid, Typography, Tabs, Tab } from "@mui/material";

/* Styles */
import "../global.css";
import "../styles/dashboard.css";

// @mui Icons
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

/* Components */
import { grey } from "../theme/palette";
import { useResponsive } from "../hooks/use-responsive";
import { GlobalDataContext } from "../Providers/GlobalDataProvider";
import { AuthContext } from "../Providers/AuthDataProvider";
import { getUserByUid } from "../firebase/UserOperations";
import UserDashboardTab from "../layouts/dashboard/Tabs/UserDashboardTab";
// import ProfileTab from "../layouts/dashboard/Tabs/ProfileTab"; 
// import UsersTab from "../layouts/dashboard/Tabs/UsersTab";
// import DashboardTab from "../layouts/dashboard/Tabs/DashboardTab";

/* Tabs */

const CustomTabPanel = (props) => {
  const { children, value, index, ...other } = props;
  const mdUp = useResponsive("up", "md");

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: mdUp ? 3 : 0 }}>{children}</Box>}
    </div>
  );
};

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const TemperatureDashboardUser = () => {
  const { dashboardName, setDashboardName } = useContext(GlobalDataContext);
  const { currentUser } = useContext(AuthContext);

  /* Tabs Variables */
  const [tabValue, setTabValue] = useState(0);
  const mdDown = useResponsive("down", "md");
  const mdUp = useResponsive("up", "md");

  const location = useLocation();
  const navigate = useNavigate();

  /* User */
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    if (location.pathname === "/dashboard/home") {
      setTabValue(0);
      setDashboardName("Dashboard");
    } 
    // else if (location.pathname === "/dashboard/profile") {
    //   setTabValue(1);
    //   setDashboardName("Profile");
    // }
  }, [location.pathname]);

  useEffect(() => {
    const fetchData = async () => {
      const userdata = await getUserByUid(currentUser.email);
      console.log(userdata);
      if (userdata.role === "admin") setIsUser(true)
        else setIsUser(false)
    };
    fetchData();
  }, [currentUser]);

  const handleTabChange = (event, newValue) => {
    const paths = [
      "/dashboard/home", 
      // "/dashboard/profile"
    ];
    navigate(paths[newValue]);
    setTabValue(newValue);
  };

  return (
    <>
      <Box
        component="div"
        sx={{
          height: mdDown ? 200 : 300,
          position: "relative",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url('/assets/background/bg-8.jpg')`,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div className="overlay"></div>

        {/* Heading */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            textAlign: "left",
            zIndex: 2,
            width: "100%",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: grey[200],
              textAlign: mdUp ? "left" : "center",
              ml: mdUp ? 20 : 0,
              m: mdDown ? "0 auto" : null,
            }}
          >
            {dashboardName}
          </Typography>
        </Box>

        {/* Tabs */}
        <Grid container sx={{ display: "flex", zIndex: 2 }}>
          <Grid item xs={12}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                zIndex: 2,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="Dashboard Tabs"
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: "white", // Change indicator color
                  },
                  "& .MuiTab-root": {
                    color: "white", // Change tab label color
                    opacity: 0.7, // Adjust opacity for unselected tabs
                    "&.Mui-selected": {
                      opacity: 1, // Full opacity for selected tab
                      color: "white", // Ensure color stays white in dark mode
                    },
                    fontSize: mdDown ? "16px" : "20px",
                  },
                }}
              >
                <Tab label="Dashboard" {...a11yProps(0)} />
                {/* <Tab label="Profile" {...a11yProps(1)} /> */}
              </Tabs>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <CustomTabPanel value={tabValue} index={0}>
        <UserDashboardTab />
      </CustomTabPanel>
      {/* <CustomTabPanel value={tabValue} index={1}>
        <ProfileTab />
      </CustomTabPanel> */}
    </>
  );
};

const MemoisedTemperatureDashboardUser = memo(TemperatureDashboardUser);

export default MemoisedTemperatureDashboardUser;
