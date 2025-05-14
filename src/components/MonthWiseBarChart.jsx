import React, { useState, useEffect, useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material"

const MonthWiseBarChart = ({ graphData }) => {
  const currentDate = new Date()
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())

  const { availableYears, yearMonthMap } = useMemo(() => {
    if (!Array.isArray(graphData)) {
      return { availableYears: [], yearMonthMap: {} }
    }

    const years = new Set()
    const monthMap = {}

    // Sort data by createdAt to get the latest date for each year
    const sortedData = [...graphData].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )

    sortedData.forEach((item) => {
      if (item?.createdAt) {
        const date = new Date(item.createdAt)
        const year = date.getFullYear()
        const month = date.getMonth() // 0-11

        years.add(year)

        // Store the highest month number for each year
        if (monthMap[year] === undefined || month > monthMap[year]) {
          monthMap[year] = month
        }
      }
    })

    return {
      availableYears: Array.from(years).sort((a, b) => b - a),
      yearMonthMap: monthMap,
    }
  }, [graphData])

  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0])
    }
  }, [availableYears, selectedYear])

  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value))
  }

  // Process the data to get month-wise counts for selected year
  const processData = () => {
    if (!Array.isArray(graphData)) return []

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]

    // Get the last month for the selected year
    const lastMonthForYear = yearMonthMap[selectedYear] ?? -1
    if (lastMonthForYear === -1) return []

    const monthCounts = {}
    // Only initialize months up to the last month with data for the selected year
    for (let i = 0; i <= lastMonthForYear; i++) {
      monthCounts[months[i]] = {
        month: months[i],
        issued: 0,
        returned: 0,
        consumed: 0,
      }
    }

    graphData.forEach((item) => {
      if (item?.createdAt && item?.status) {
        const date = new Date(item.createdAt)
        const year = date.getFullYear()
        const month = date.toLocaleString("default", { month: "short" })

        if (year === selectedYear && monthCounts[month]) {
          const status = item.status.toLowerCase()
          if (
            status === "issued" ||
            status === "returned" ||
            status === "consumed"
          ) {
            monthCounts[month][status]++
          }
        }
      }
    })

    // Convert to array and maintain month order
    return Object.values(monthCounts)
  }

  const data = processData()

  return (
    <Box sx={{ width: "100%", height: "100%", p: 3 }}>
      {/* <Box sx={{ width: "100%", height: 325, padding: 3 }}> */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
          Monthly Issuance Statistics
        </Typography>

        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="year-select-label">Select Year</InputLabel>
          <Select
            labelId="year-select-label"
            value={selectedYear}
            label="Select Year"
            onChange={handleYearChange}
          >
            {availableYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ height: 275 }}>
        {data.length > 0 ? (
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="issued" stackId="a" fill="#3f51b5" name="Issued" />
              <Bar
                dataKey="returned"
                stackId="a"
                fill="#43A047"
                name="Returned"
              />
              <Bar
                dataKey="consumed"
                stackId="a"
                fill="#FB8C00"
                name="Consumed"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Box
            sx={{
              height: "calc(100% - 50px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No data available for {selectedYear}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default MonthWiseBarChart
