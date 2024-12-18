/* React */
import { useState, useEffect, useContext } from "react";

/* MUI */
import Box from "@mui/material/Box";
import { CircularProgress } from "@mui/material";

/* Components */
import PropTypes from "prop-types";
import Chart, { useChart } from "/src/components/chart";
import { GraphDataContext } from "../../../Providers/GraphDataProvider";

export const HumidityGraph = () => {
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
  const [loadChart, setLoadChart] = useState(false);
  const { humidGraphData } = useContext(GraphDataContext)

  // const chartOptions = useChart({
  //   xaxis: {
  //     type: "datetime",
  //     labels: {
  //       formatter: (value) => {
  //         const date = new Date(value);
  //         return date.toLocaleTimeString("en-US", {
  //           hour12: true,
  //           hour: "numeric",
  //           minute: "2-digit",
  //         });
  //       },
  //     },
  //     fill: {
  //       type: "gradient",
  //     },
  //   },
  //   chart: {
  //     zoom: {
  //       autoScaleYaxis: true,
  //     },
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
  // });

  const chartOptions = useChart({
    id: 'realtime-chart',
    xaxis: {
      type: 'datetime',
      animations: { 
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 100, // Set the speed of real-time update animation
        },
      },
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
    
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== "undefined") {
            const val = Number(value)
            return `${val.toFixed(1)} %`;
          }
          return value;
        },
      },
    },
  });

  useEffect(() => {
    setLoadChart(true)
    if(humidGraphData) {
      setChartData(humidGraphData)
      setTimeout(() => {
        setLoadChart(false)
      }, 1000)
    }
  }, [humidGraphData])

  return (
    <>
      {loadChart ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <Box sx={{ p: 1 }}>
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
          height={300}
        />
      </Box>
      )}
    </>
  );
};

HumidityGraph.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
  chartInfo: PropTypes.array,
};

export default HumidityGraph;
