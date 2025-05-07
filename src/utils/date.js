// Helper to format to DD-MM-YYYY
export const formatDateToDDMMYYYY = (dateStr) => {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

// Helper to format to YYYY-MM-dd
export const formatDateToYYYYMMDD = (dateStr) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}` // Format: YYYY-MM-DD
}
