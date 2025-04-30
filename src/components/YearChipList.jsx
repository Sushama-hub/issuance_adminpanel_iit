import * as React from "react"
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import axios from "axios"
import { useState, useEffect } from "react"
import AddIcon from "@mui/icons-material/Add"
import { useNavigate } from "react-router-dom"

export default function BasicChips() {
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false)
  const [newYear, setNewYear] = useState("")

  const navigate = useNavigate()

  const baseURL = import.meta.env.VITE_BACKEND_BASE_URL

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token")
      // `${baseURL}/nonConsumableStock/getAllFinancialYears`,
      const response = await axios.get(`${baseURL}/year/yearFetch`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      // setData(response?.data?.data)
      setData(response?.data?.years)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const handleClick = (year) => {
    console.info("You clicked the Chip.", year)

    const storedUser = JSON.parse(localStorage.getItem("user"))

    const routeBase =
      storedUser?.role === "master"
        ? "/dashboard/master/non_consumable_stock"
        : "/dashboard/admin/non_consumable_stock"

    // pass year as route param or query param
    navigate(`${routeBase}?year=${year}`)
  }

  const handleSubmitYear = async () => {
    // console.log("handleSubmitYear", newYear)

    // Check if the year already exists in the array of objects
    const alreadyExists = data.some((item) => item.year === newYear)
    // console.log("alreadyExists=====", alreadyExists)

    // //---------------- 1.---------Add to local data as manually
    // if (newYear && !alreadyExists) {
    //   setData((prevData) => [...prevData, { year: newYear }])
    //   // setNewYear("")
    //   // setOpen(false)
    // } else {
    //   alert("Year already exists!")
    //   return
    // }

    // ---------- 2. OR ---------------------
    // if (alreadyExists) {
    //   alert("Year already exists!")
    //   return
    // }

    // setData((prevData) => [...prevData, { year: newYear }])
    // setNewYear("")
    // setOpen(false)

    if (alreadyExists) {
      alert("Year already exists!")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        `${baseURL}/year/create`,
        { year: newYear },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response?.data.success) {
        alert("session year added successfully!")
        setNewYear("")
        setOpen(false)
        fetchData()
      }
    } catch (error) {
      console.error("Error Submitting data:", error)
    }
  }

  const handleDelete = async (id) => {
    // console.info("You clicked the delete icon.", id)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.delete(`${baseURL}/year/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response?.data?.success) {
        alert("Do you want to delete this session!")
        fetchData()
      }
    } catch (error) {
      console.error("Error deleting data:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <Typography
        variant="h6"
        color="text.secondary"
        fontWeight="bold"
        mb={2}
        mt={3}
      >
        Click on a year below to view the Non Consumable Stock Table for that
        year.
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          p: 1,
          backgroundColor: "#f0f4f8",
          borderRadius: 4,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: "80%",
            overflow: "",
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {data.map((item, index) => (
            <Chip
              key={index}
              // label={typeof item === "string" ? item : item.year}
              label={item.year}
              variant="outlined"
              color="primary"
              onClick={() => handleClick(item.year)}
              onDelete={() => handleDelete(item?._id)}
            />
          ))}
          {/* <Chip
            label="Chip Filled"
            onClick={handleClick}
            variant="outlined"
            color="primary"
          /> */}
        </Stack>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            width: "20%",
          }}
        >
          <Typography variant="caption" color="textSecondary">
            Click Icon to Add Year
          </Typography>
          <IconButton
            color="primary"
            onClick={() => setOpen(!open)}
            size="small"
            sx={{ border: "1px solid #1976d2" }}
          >
            <AddIcon />
          </IconButton>
          {open && (
            <>
              <TextField
                size="small"
                label="Add Year"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                placeholder="eg:- 2024-2025"
                sx={{
                  width: "80%",
                  my: 1,
                  "& input::placeholder": {
                    fontSize: "0.80rem",
                  },
                }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleSubmitYear}
                disabled={!newYear}
              >
                Add
              </Button>
            </>
          )}
        </Box>
      </Box>
    </>
  )
}
