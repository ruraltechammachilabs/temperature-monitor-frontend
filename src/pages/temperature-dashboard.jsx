/* React */
import { memo, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

/* MUI */
import { Box } from "@mui/material";

/* Styles */
import "../global.css";
import "../styles/dashboard.css";

// @mui Icons
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

/* Components */
import { useResponsive } from "../hooks/use-responsive";
import { AuthContext } from "../Providers/AuthDataProvider";
import { getUserByUid } from "../firebase/UserOperations";
import MemoisedTemperatureDashboardAdmin from "./dashboard-admin";
import MemoisedTemperatureDashboardUser from "./dashboard-user";
// import { grey } from "../theme/palette";
// import SensorSettings from "./sensor-settings";
// import DashboardTab from "../layouts/dashboard/Tabs/DashboardTab";
// import { GlobalDataContext } from "../Providers/GlobalDataProvider";
// import ProfileTab from "../layouts/dashboard/Tabs/ProfileTab";
// import AlertUsersTab from "../layouts/dashboard/Tabs/AlertUsersTab";
// import UsersTab from "../layouts/dashboard/Tabs/UsersTab";

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

const TemperatureDashboard = () => {
  const { currentUser, setCurrentUser, setDbUser } = useContext(AuthContext);

  const navigate = useNavigate();

  /* User */
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (Object.keys(currentUser).length > 0) {
        const userdata = await getUserByUid(currentUser.email);
        if (userdata.role === "admin") setIsAdmin(true);
        else setIsAdmin(false);
      } else {
        const localUser = JSON.parse(localStorage.getItem("userInfo"));
        if (localUser !== null && localUser !== undefined) {
          if (Object.keys(localUser).length > 0) {
            const userdata = await getUserByUid(localUser.user.email);
            setCurrentUser(userdata);
            setDbUser(userdata);
            if (userdata.role === "admin") setIsAdmin(true);
            else setIsAdmin(false);
          }
        } else {
          navigate("/auth/login");
        }
      }
    };
    fetchData();
  }, [currentUser]);

  return (
    <>
      {isAdmin && <MemoisedTemperatureDashboardAdmin />}
      {isAdmin === false && <MemoisedTemperatureDashboardUser />}
    </>
  );
};

const MemoisedTemperatureDashboard = memo(TemperatureDashboard);

export default MemoisedTemperatureDashboard;
