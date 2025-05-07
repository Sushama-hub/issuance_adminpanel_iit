import * as React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material"
import { useState, useEffect } from "react"
import { showInfoToast } from "../utils/toastUtils"
import { formatDateToYYYYMMDD } from "../utils/date"

export default function DialogBox({
  editDialogOpen,
  setEditDialogOpen,
  selectedEditRow,
  setSelectedEditRow,
  fields,
  onSubmit,
  heading,
  editValues, //editValues redundant
  setEditValues, //setEditValues redundant
}) {
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState(selectedEditRow || {})
  const [isFormValid, setIsFormValid] = useState(false)

  // Update formData when selectedEditRow changes
  useEffect(() => {
    if (selectedEditRow) {
      setFormData(selectedEditRow)
    }
  }, [selectedEditRow])

  // Validate form data
  const validateForm = (data) => {
    const newErrors = {}
    let isValid = true

    fields.forEach((field) => {
      const value = data[field.name]

      // Check if field is empty
      if (!value || value.toString().trim() === "") {
        newErrors[field.name] = `${field.label} is required`
        isValid = false
      }

      // Additional validation for quantity field if it exists
      if (
        field.name === "quantity" ||
        field.name === "groundBalance" ||
        field.name === "ledgerBalance"
      ) {
        const numValue = Number(value)
        if (isNaN(numValue) || numValue <= 0) {
          newErrors[field.name] = "Field must be greater than 0"
          isValid = false
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const newFormData = { ...formData, [name]: value }

    setFormData(newFormData)
    setSelectedEditRow(newFormData)

    // Validate form after each change
    const isValid = validateForm(newFormData)
    setIsFormValid(isValid)
  }

  const handleEditSubmit = async () => {
    if (isFormValid) {
      await onSubmit()
    }
  }

  const handleCancel = () => {
    setEditDialogOpen(false)
    showInfoToast("Edit cancelled")
    setSelectedEditRow(null)
    setFormData({})
    setErrors({})
    setIsFormValid(false)
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
          {heading}
        </DialogTitle>
        <DialogContent>
          {fields.map((field, index) => (
            <TextField
              key={index}
              // id={id}
              label={field.label}
              name={field.name}
              type={field.type || "text"}
              // value={editValues[name]}
              // value={selectedEditRow?.[field.name] || ""}
              // value={
              //   field.type === "date"
              //     ? formatDateToYYYYMMDD(selectedEditRow?.[field.name])
              //     : selectedEditRow?.[field.name] || ""
              // }
              value={
                field.type === "date"
                  ? formatDateToYYYYMMDD(formData?.[field.name])
                  : formData?.[field.name] || ""
              }
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              // autoFocus
              autoFocus={index === 0}
              required
              margin="dense"
              error={Boolean(errors[field.name])} // specific error for each input
              helperText={errors[field.name]} // specific helper text for each input
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleEditSubmit}
            // disabled={isDisabledButton()}
            disabled={!isFormValid}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
