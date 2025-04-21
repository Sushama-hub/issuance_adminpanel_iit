import React from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Typography, Box } from "@mui/material"

// const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];
const COLORS = ["#3f51b5", "#43A047", "#FB8C00"]

// Add this new custom legend renderer component after the COLORS constant
const CustomLegend = (props) => {
  const { payload } = props

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        width: "100%",
        paddingTop: "20px",
      }}
    >
      {payload.map((entry, index) => (
        <div
          key={`legend-${index}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              backgroundColor: entry.color,
              borderRadius: "2px",
            }}
          />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

const StatusPieChart = ({ graphData }) => {
  // Process the data to get status-wise counts and percentages
  const processData = () => {
    const statusCounts = {
      issued: 0,
      returned: 0,
      consumed: 0,
    }

    // Count total items for each status
    graphData.forEach((item) => {
      statusCounts[item.status.toLowerCase()]++
    })

    // Calculate total count
    const total = Object.values(statusCounts).reduce(
      (sum, count) => sum + count,
      0
    )

    // Convert to array with percentages
    return Object.entries(statusCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      percentage: total > 0 ? ((value / total) * 100).toFixed(1) : 0,
    }))
  }

  const data = processData()

  // Custom tooltip content
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ margin: "0 0 5px 0" }}>{data.name}</p>
          <p style={{ margin: "0" }}>Count: {data.value}</p>
          <p style={{ margin: "0" }}>Percentage: {data.percentage}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <Box sx={{ width: "100%", height: 330, p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Status Distribution
      </Typography>
      <Box sx={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />

            <Legend
              content={<CustomLegend />}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  )
}

export default StatusPieChart
