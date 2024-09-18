/* React */
import { useState, useEffect } from "react";

/* MUI */
import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import CardHeader from "@mui/material/CardHeader";

/* Components */
import PropTypes from "prop-types";
import Chart, { useChart } from "/src/components/chart";
// import { onValue, ref } from "firebase/database";
// import { getChartData } from '../../../firebase/operations'
// import { GraphDataContext } from "../../../Providers/GraphDataProvider";

export const HumidityGraph = ({chartInfo}) => {
  // const { labels, colors, series, options } = chart;

  // const chartOptions = useChart({
  //   colors,
  //   fill: {
  //     type: series.map((i) => i.fill),
  //   },
  //   labels,
  //   xaxis: {
  //     type: 'datetime',
  //     labels: {
  //       formatter: (value, timestamp) => {
  //         // Assuming timestamp argument is available:
  //         if (timestamp) {
  //           const date = new Date(timestamp);
  //           const hours = date.getHours();
  //           const minutes = date.getMinutes().toString().padStart(2, '0');
  //           const meridiem = hours >= 12 ? 'PM' : 'AM';
  //           return `${hours === 0 ? 12 : hours % 12}:${minutes} ${meridiem}`;
  //         } else {
  //           // Handle cases where timestamp argument is not available:
  //           console.warn('Timestamp argument not available in formatter function. Consider converting value to a Date object for formatting.');
  //           return value; // Fallback to displaying the raw value
  //         }
  //       },
  //     }
  //   },
  //   tooltip: {
  //     shared: true,
  //     intersect: false,
  //     y: {
  //       formatter: (value) => {
  //         if (typeof value !== "undefined") {
  //           return `${value.toFixed(1)} %`;
  //         }
  //         return value;
  //       },
  //     },
  //   },
  //   ...options,
  // });

  const [chartData, setChartData] = useState([]);
  // const { humidGraphData } = useContext(GraphDataContext)

  const chartOptions = useChart({
    // fill: {
    //   type: series.map((i) => i.fill),
    // },  
    // labels,
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: (value) => {
          const date = new Date(value)
          return date.toLocaleTimeString('en-US', { 
            hour12: true, 
            hour: 'numeric', 
            minute: '2-digit' 
          })
        }
      },
      fill: {
        type: 'gradient',
      }
    },
    chart: {
      zoom: {
        autoScaleYaxis: true
      }
    },
    
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== "undefined") {
            return `${value.toFixed(1)} %`;
          }
          return value;
        },
      },
    },
    // ...options,
  });

  useEffect(() => {
    if(chartInfo) {
      setChartData(chartInfo)
    }
  }, [chartInfo])

  // useEffect(() => {
  //   if(humidGraphData) {
  //     setChartData(humidGraphData)
  //   }
  // }, [humidGraphData])

  // useEffect( () => {

  //   const fetchData = async () => {
  //     getChartData('Humidity', (data) => {
  //       setChartData(data)
  //     })
  //   }

  //   fetchData()
    
  // }, [])

  return (
      <Box sx={{ p: 1, pb: 1 }}>
        <Chart
          dir="ltr"
          type="area"
          series={[{
            name: "Humidity",
            type: "area",
            fill: "gradient",
            data: chartData
          }]}
          options={chartOptions}
          width="100%"
          height={200}
        />
      </Box>
  );
}

HumidityGraph.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
  chartInfo: PropTypes.array
};

export default HumidityGraph
