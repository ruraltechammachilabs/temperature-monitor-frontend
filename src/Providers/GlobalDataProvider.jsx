import { createContext, useState } from "react";

export const GlobalDataContext = createContext({

  dataRead: [],
  setDataRead: () => {},

  userData: {},
  setUserData: () => {},

  users: [],
  setUsers:() => {},

  dashboardName: 'Dashboard',
  setDashboardName: () => {},

  toggleDark: false,
  setToggleDark: () => {},

  tempTimestampData: [],
  setTempTimestampData: () => {},

  humidityTimestampData: [],
  setHumidityTimestampData: () => {},

  smokeTimestampData: [],
  setSmokeTimeStampData: () => {},
  
  isNewAlertUserAdded: false, 
  setIsNewAlertUserAdded: () => {},
  
  isAlertUserRemoved: false, 
  setIsAlertUserRemoved: () => {},
});

// Define a provider component that will provide the context to its children
const GlobalDataProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [users, setUsers] = useState([]);
  const [dashboardName, setDashboardName] = useState("Dashboard");
  const [toggleDark, setToggleDark] = useState(false);

  const [dataRead, setDataRead] = useState([]);
  const [tempTimestampData, setTempTimestampData] = useState([]);
  const [humidityTimestampData, setHumidityTimestampData] = useState([]);
  const [smokeTimestampData, setSmokeTimeStampData] = useState([]);

  const [isNewAlertUserAdded, setIsNewAlertUserAdded] = useState(false)
  const [isAlertUserRemoved, setIsAlertUserRemoved] = useState(false)

  return (
    <GlobalDataContext.Provider
      value={{
        userData,
        setUserData,

        users,
        setUsers,

        isNewAlertUserAdded,
        setIsNewAlertUserAdded,

        isAlertUserRemoved, 
        setIsAlertUserRemoved,

        dashboardName, 
        setDashboardName,

        toggleDark,
        setToggleDark,

        dataRead, 
        setDataRead,

        tempTimestampData,
        setTempTimestampData,

        humidityTimestampData,
        setHumidityTimestampData,

        smokeTimestampData,
        setSmokeTimeStampData,
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};

export default GlobalDataProvider;
