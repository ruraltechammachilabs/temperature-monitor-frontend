/* React */
import { useState, useEffect } from "react";

/* MUI */
import Box from "@mui/material/Box";

/* Components */
import PropTypes from "prop-types";
import Chart, { useChart } from "/src/components/chart";
// import { onValue, ref } from "firebase/database";
// import { getChartData } from '../../../firebase/operations'
// import { GraphDataContext } from "../../../Providers/GraphDataProvider";

export const SmokeGraph = ({chartInfo}) => {
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
  // const { smokeGraphData } = useContext(GraphDataContext)

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
            return `${Number(value)}`;
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
  //   if(smokeGraphData) {
  //     setChartData(smokeGraphData)
  //   }
  // }, [smokeGraphData])

  // useEffect( () => {

  //   const fetchData = async () => {
  //     getChartData('Smoke', (data) => {
  //       setChartData(data)
  //     })
  //   }

  //   fetchData()
    
  // }, [])

  return (

      <Box sx={{  pb: 1 }}>
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
    // </Card>
  );
}

SmokeGraph.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
  chartInfo: PropTypes.array
};

export default SmokeGraph
