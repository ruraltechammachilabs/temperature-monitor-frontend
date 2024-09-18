import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

import Chart, { useChart } from "/src/components/chart";

export const DetailedTemperatureGraph = ({
  title,
  subheader,
  chart,
  ...other
}) => {
  const { labels, colors, series, options } = chart;

  const chartOptions = useChart({
    colors,
    // plotOptions: {
    //   bar: {
    //     columnWidth: "16%",
    //   },
    // },
    fill: {
      type: series.map((i) => i.fill),
    },
    labels,
    xaxis: {
      type: 'datetime',
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
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }}>
        <Chart
          dir="ltr"
          type="area"
          series={series}
          options={chartOptions}
          width="100%"
          height={180}
        />
      </Box>
    </Card>
  );
}

DetailedTemperatureGraph.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

export default DetailedTemperatureGraph
