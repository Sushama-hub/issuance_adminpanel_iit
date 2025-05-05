import * as React from "react"
import axios from "axios"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material"
import { useState } from "react"
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
} from "../utils/toastUtils"

export default function DialogBox({
  editDialogOpen,
  setEditDialogOpen,
  editRow,
  setEditRow,
  editValues,
  setEditValues,
  fetchTableData,
}) {
  const [errors, setErrors] = useState({})

  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL

  //  Validate Single Field
  const validateField = (name, value) => {
    let error = ""

    switch (name) {
      case "componentName":
        if (!value || value.trim() === "") {
          error = "Component Name is required"
        }
        break

      case "specification":
        if (!value || value.trim() === "") {
          error = "Specification is required"
        }
        break

      case "quantity":
        if (value === "" || value === null || Number(value) <= 0) {
          error = "Quantity must be greater than zero"
        }
        break

      default:
        break
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }))
  }

  //   Handle Input Change in Edit Dialog
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditValues((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Real-time validation as user types
    validateField(name, value)
  }

  // Handle Edit Form Submit
  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(
        `${baseUrl}/inventory/${editRow._id}`,
        editValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response?.data?.success === true) {
        showSuccessToast("Inventory item updated successfully!")
        setEditDialogOpen(false)
        setEditRow(null)
        fetchTableData()
      }
    } catch (error) {
      console.error("Error updating item", error)
      showErrorToast("Something went wrong while updating!")
    }
  }

  const isDisabledButton = () => {
    const { componentName, specification, quantity } = editValues
    // Basic validations
    if (
      !componentName ||
      componentName.trim() === "" ||
      !specification ||
      specification.trim() === "" ||
      quantity === "" ||
      quantity === null ||
      Number(quantity) <= 0
    ) {
      return true // Disable button
    }

    return false // Enable button
  }

  const handleCancel = () => {
    setEditDialogOpen(false)
    showInfoToast("Edit cancelled")
  }

  return (
    <>
      <Dialog
        open={editDialogOpen}
        // onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle color="primary" fontWeight="bold" fontSize={20}>
          Edit Inventory Item
        </DialogTitle>
        <DialogContent>
          {[
            {
              id: "componentName",
              label: "Component Name",
              name: "componentName",
            },
            {
              id: "specification",
              label: "Specification",
              name: "specification",
            },
            {
              id: "quantity",
              label: "quantity",
              name: "quantity",
              type: "number",
            },
          ].map(({ id, label, name, type }, index) => (
            <TextField
              key={index}
              id={id}
              label={label}
              name={name}
              type={type || "text"}
              value={editValues[name]}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              autoFocus
              required
              margin="dense"
              error={Boolean(errors[name])} // specific error for each input
              helperText={errors[name]} // specific helper text for each input
            />
          ))}
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button> */}
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleEditSubmit}
            disabled={isDisabledButton()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
