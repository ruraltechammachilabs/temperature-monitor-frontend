import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";

import ApexCharts from 'apexcharts'
import Chart, { useChart } from "../../../components/chart";
// import { getChartData, getChartDataByDateTime } from "../../../firebase/operations";
// import { fbDB } from "../../../firebase/firebaseConfig";
// import { GraphDataContext } from "../../../Providers/GraphDataProvider";

export const TemperatureGraph = ({chartInfo}) => {

  const [chartData, setChartData] = useState([]);
  const chartRef = useRef(null);
  // const { tempGraphData } = useContext(GraphDataContext)

  const chartOptions = useChart({
    // fill: {
    //   type: series.map((i) => i.fill),
    // },  
    // labels,
    id: 'realtime-chart',
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
    if(chartInfo) {
      setChartData(chartInfo)
    }
  }, [chartInfo])

  // Trigger update when chartData changes
  useEffect(() => {
    ApexCharts.exec('realtime-chart', 'updateSeries', [
      {
        name: "Temperature",
        type: "area",
        fill: "gradient",
        data: chartData,
      },
    ]);
    console.log(chartData)
  }, [chartData]);

  // useEffect(() => {
  //   if(tempGraphData) {
  //     console.log("temperature graph data set !", tempGraphData)
  //     setChartData(tempGraphData)
  //   }
  // }, [tempGraphData])

  /* useEffect( () => {

    const fetchData = async () => {
      // getChartData('Temperature', (data) => {
      //   // console.log("Temp Chart Data -> ", data)
      //   setChartData(data)
      // })
      getChartDataByDateTime((data) => {
        console.log("Temp Chart Data -> ", data)
      })
    }

    fetchData()
    
  }, []) */


  return (
      <Box sx={{ p: 1 }}>
        <Chart
          key={chartData.length}
          
          ref={chartRef}
          dir="ltr"
          type="area"
          // series={[data: chartData]}
          series={[{
            name: "Temperature",
            type: "area",
            fill: "gradient",
            data: chartData
          }]}
          options={chartOptions}
          width="100%"
          height={300}
        />
      </Box>
  );
}

TemperatureGraph.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
  chartInfo: PropTypes.array
};

export default TemperatureGraph
