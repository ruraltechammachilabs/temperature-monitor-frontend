/* React */
import { useState, useEffect, useContext } from "react";

/* MUI */
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";

/* Components */
import PropTypes from "prop-types";
import Chart, { useChart } from "../../../components/chart";
import { GraphDataContext } from "../../../Providers/GraphDataProvider";

export const TemperatureGraph = () => {
  const [chartData, setChartData] = useState([]);
  const [loadChart, setLoadChart] = useState(false);
  const { tempGraphData } = useContext(GraphDataContext);

  const chartOptions = useChart({
    id: "realtime-chart",
    xaxis: {
      type: "datetime",
      labels: {
        formatter: (value) => {
          const date = new Date(value);
          return date.toLocaleTimeString("en-US", {
            hour12: true,
            hour: "numeric",
            minute: "2-digit",
          });
        },
      },
      fill: {
        type: "gradient",
      },
    },

    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== "undefined") {
            return `${value.toFixed(1)} °C`;
          }
          return value;
        },
      },
    },
  });

  useEffect(() => {
    setLoadChart(true);
    if (tempGraphData && tempGraphData.length > 0) {
      setChartData(tempGraphData);
      setTimeout(() => {
        setLoadChart(false);
      }, 1000);
    } else {
      setChartData([]);
      setLoadChart(false);
    }
  }, [tempGraphData]);

  // Trigger update when chartData changes
  // useEffect(() => {
  //   ApexCharts.exec('realtime-chart', 'updateSeries', [
  //     {
  //       name: "Temperature",
  //       type: "area",
  //       fill: "gradient",
  //       data: chartData,
  //     },
  //   ]);
  // }, [chartData]);

  return (
    <>
      {/* {
        loadChart ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
            <CircularProgress />
          </div>
        ) : ( */}
      {loadChart ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <Box sx={{ p: 1 }}>
          {chartData.length === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <h4>No Data Available</h4>
            </div>
          ) : (
            <Chart
              key={chartData.length}
              dir="ltr"
              type="area"
              series={[
                {
                  name: "Temperature",
                  type: "area",
                  fill: "gradient",
                  data: chartData,
                },
              ]}
              options={chartOptions}
              width="100%"
              height={300}
            />
          )}
        </Box>
      )}
    </>
  );
};

TemperatureGraph.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
  chartInfo: PropTypes.array,
};

export default TemperatureGraph;
