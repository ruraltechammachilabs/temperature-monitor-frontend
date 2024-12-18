/* React */
import { useState, useEffect, useContext } from "react";

/* MUI */
import Box from "@mui/material/Box";

/* Components */
import PropTypes from "prop-types";
import Chart, { useChart } from "/src/components/chart";
import { CircularProgress } from "@mui/material";
import { GraphDataContext } from "../../../Providers/GraphDataProvider";

export const SmokeGraph = () => {
  // const { labels, colors, series, options } = chart;

  // const chartOptions = useChart({
  //   colors,
  //   // plotOptions: {
  //   //   bar: {
  //   //     columnWidth: "16%",
  //   //   },
  //   // },
  //   fill: {
  //     type: series.map((i) => i.fill),
  //   },
  //   labels,
  //   xaxis: {
  //     type: 'datetime',
  //   },
  //   tooltip: {
  //     shared: true,
  //     intersect: false,
  //     y: {
  //       formatter: (value) => {
  //         if (typeof value !== "undefined") {
  //           return `${value.toFixed(1)}`;
  //         }
  //         return value;
  //       },
  //     },
  //   },
  //   ...options,
  // });

  const [chartData, setChartData] = useState([]);
  const [loadChart, setLoadChart] = useState(false);
  const { smokeGraphData } = useContext(GraphDataContext)

  const chartOptions = useChart({
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
    chart: {
      zoom: {
        autoScaleYaxis: true,
      },
    },

    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== "undefined") {
            return `${Number(value)}`;
          }
          return value;
        },
      },
    },
  });

  useEffect(() => {
    setLoadChart(true)
    if(smokeGraphData) {
      setChartData(smokeGraphData)
      setTimeout(() => {
        setLoadChart(false)
      }, 1000)
    }
  }, [smokeGraphData])

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
        <Box sx={{ pb: 1 }}>
          <Chart
            dir="ltr"
            type="area"
            series={[
              {
                name: "Humidity",
                type: "area",
                fill: "gradient",
                data: chartData,
              },
            ]}
            options={chartOptions}
            width="100%"
            height={300}
          />
        </Box>
      )}
    </>
  );
};

SmokeGraph.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
  chartInfo: PropTypes.array,
};

export default SmokeGraph;
