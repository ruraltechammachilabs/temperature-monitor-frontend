import { createContext, useState } from "react";

export const GraphDataContext = createContext({

  tempGraphData: [],
  setTempGraphData: () => {},

  humidGraphData: [],
  setHumidGraphData: () => {},

  smokeGraphData: [],
  setSmokeGraphData: () => {}
});

// Define a provider component that will provide the context to its children
const GraphDataProvider = ({ children }) => {
  const [tempGraphData, setTempGraphData] = useState([]);
  const [humidGraphData, setHumidGraphData] = useState([]);
  const [smokeGraphData, setSmokeGraphData] = useState([]);

  return (
    <GraphDataContext.Provider
      value={{
        tempGraphData, 
        setTempGraphData,
        
        humidGraphData, 
        setHumidGraphData,
        
        smokeGraphData, 
        setSmokeGraphData,
      }}
    >
      {children}
    </GraphDataContext.Provider>
  );
};

export default GraphDataProvider;
