import React, { useEffect, useState } from "react"
import {
  Typography,
  Autocomplete,
  TextField,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material"
import axios from "axios"

const InventoryComponentCard = () => {
  const [componentsList, setComponentsList] = useState([])
  const [selectedType, setSelectedType] = useState(null)

  const baseURL = import.meta.env.VITE_BACKEND_BASE_URL

  const fetchComponentData = async () => {
    try {
      const response = await axios.get(`${baseURL}/inventory/components`)

      if (response?.data?.success) {
        setComponentsList(response.data.components || [])
        setSelectedType(response.data.components[0]?.componentName) // default
      }
    } catch (error) {
      console.error("Error fetching components:", error)
    }
  }

  useEffect(() => {
    fetchComponentData()
  }, [])

  const componentNames = componentsList.map((item) => item.componentName)

  const selectedComponent = componentsList.find(
    (item) => item.componentName === selectedType
  )

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Box
        sx={{
          height: 380,
          background: "white",
          borderRadius: "5px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" color="primary" ml={3} fontWeight="bold">
            Inventory Summary
          </Typography>

          <Box
            sx={{
              backgroundColor: "error.light",
              height: "100%",
              p: 1,
              width: "auto",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "4px",
            }}
          >
            <Typography variant="subtitle2">Total Components</Typography>
            <Typography component="span" variant="h5">
              {componentsList.length}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            p: 3,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Autocomplete
            options={componentNames}
            value={selectedType}
            onChange={(event, newValue) => setSelectedType(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Component"
                variant="outlined"
                size="small"
                fullWidth
              />
            )}
            sx={{ mb: 2 }}
            isOptionEqualToValue={(option, value) => option === value}
          />

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <List
              dense
              sx={{
                height: "200px",
                overflowY: "auto",
              }}
            >
              {selectedComponent?.specifications.map((spec, index) => (
                <ListItem
                  key={index}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight="medium">
                        {spec.specification}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {spec.quantity}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
              {selectedComponent?.specifications.map((spec, index) => (
                <ListItem
                  key={index}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight="medium">
                        {spec.specification}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {spec.quantity}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default InventoryComponentCard
