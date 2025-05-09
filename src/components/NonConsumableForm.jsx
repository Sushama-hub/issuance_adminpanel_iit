import { Card, Typography, Box, Grid } from "@mui/material"
import NonConsumableCsvUploader from "./NonConsumableCsvUploader"
import YearTagList from "./YearTagList"

const NonConsumableForm = () => {
  return (
    <>
      <Box
        sx={{
          minHeight: "85vh",
          width: "100%",
          backgroundColor: "#f5f5f5",
          padding: 2,
          mt: 1.5,
        }}
      >
        <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
          Non Consumable Stock Form
        </Typography>

        <Grid container spacing={4}>
          {/* CSV Uploader Section */}
          <Grid item xs={12} md={12}>
            <Card
              elevation={3}
              sx={{
                borderRadius: "15px 5px",
                padding: "20px",
                height: "auto",
              }}
            >
              <NonConsumableCsvUploader />
            </Card>
          </Grid>
        </Grid>
        <YearTagList />
      </Box>
    </>
  )
}

export default NonConsumableForm
