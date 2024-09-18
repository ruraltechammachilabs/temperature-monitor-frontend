import { useMemo, useContext } from 'react';
import GaugeChart from "react-gauge-chart";
import { GlobalDataContext } from '../../Providers/GlobalDataProvider';

const Gauge = ({ percent, name, isLoading = false }) => {
  const { toggleDark } = useContext(GlobalDataContext);

  // Memoized color functions using a custom hook
  const useMemoizedColor = (baseColor, darkModifier) => {
    return useMemo(() => {
      return toggleDark ? baseColor - darkModifier : baseColor + darkModifier;
    }, [toggleDark, baseColor, darkModifier]);
  };

  const needleColor = useMemoizedColor("#595858"); // Adjust dark mode offset as needed
  const textColor = useMemoizedColor("#000", 150); // Adjust dark mode offset as needed

  // const chartStyle = {
  //   height: 200,
  // };

  const setValueByType = useMemo(((value) => {
    if (name === "Temperature") {
      return value + " °C";
    } else if (name === "Humidity") {
      return value + " %";
    } else {
      return " ";
    }
  }), [name]);

  // Memoized gauge configuration based on props and memoized colors
  const gaugeProps = useMemo(() => ({
    id: `gauge-chart7`,
    style: {
      height: 200
    },
    percent: percent,
    animDelay: 0,
    needleColor,
    needleBaseColor: '#c8ccca',
    colors: ['#a2cf6e', '#4caf50', '#FFC371', '#FF5F6D'],
    nrOfLevels: 4,
    formatTextValue: (value) => setValueByType(value),
    textColor,
  }), [percent, needleColor, textColor, setValueByType]);

  // Conditional rendering for loading state (optional)
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <GaugeChart {...gaugeProps} />
  );
};

export default Gauge;
