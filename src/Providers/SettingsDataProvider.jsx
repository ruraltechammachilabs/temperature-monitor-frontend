import { createContext, useState } from "react";

export const SettingsDataContext = createContext({
  userData: {},
  setUserData: () => {},
});

// Define a provider component that will provide the context to its children
const SettingsDataProvider = ({ children }) => {
  const [userData, setUserData] = useState({});

  

  return (
    <SettingsDataContext.Provider
      value={{
        userData,
        setUserData,
      }}
    >
      {children}
    </SettingsDataContext.Provider>
  );
};

export default SettingsDataProvider;
