import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import moment from "moment";

// Sample data (replace this with your fetched data)
const data = [
  {
    createdAt: "2025-03-07T09:54:50.151Z",
    // ...other fields
  },
  {
    createdAt: "2025-03-07T09:56:39.680Z",
  },
  {
    createdAt: "2025-02-07T09:56:39.680Z",
  },
  {
    createdAt: "2025-01-07T09:56:39.680Z",
  },
  {
    createdAt: "2025-01-08T09:56:39.680Z",
  },
  // add more as per your data...
];

const MonthWiseBarChart = ({ data1 }) => {
  console.log("data/---", data1);
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    // Step 1: Process the data month-wise
    const monthCount = {};

    data.forEach((item) => {
      const month = moment(item.createdAt).format("MMMM"); // E.g., March, January, etc.
      monthCount[month] = (monthCount[month] || 0) + 1;
    });

    // Step 2: Prepare xAxis and series data
    const months = Object.keys(monthCount); // ['January', 'February', ...]
    const counts = Object.values(monthCount); // [2, 1, ...]

    // Optional: To ensure months are always in correct order
    const allMonths = moment.months(); // ['January', 'February', ...]
    const xAxisMonths = [];
    const seriesCounts = [];

    allMonths.forEach((m) => {
      xAxisMonths.push(m);
      seriesCounts.push(monthCount[m] || 0);
    });

    // Step 3: ECharts options
    const option = {
      title: {
        text: "Month-wise Components Data",
        left: "center",
      },
      tooltip: {},
      xAxis: {
        type: "category",
        data: xAxisMonths,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: seriesCounts,
          type: "bar",
          itemStyle: {
            color: "#5470C6",
          },
        },
      ],
    };

    chart.setOption(option);

    // Cleanup on unmount
    return () => {
      chart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }} />;
};

export default MonthWiseBarChart;
