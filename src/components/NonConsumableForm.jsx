import React, { useEffect, useState } from "react";
import { Card, Typography, Box, Grid } from "@mui/material";
import NonConsumableCsvUploader from "./NonConsumableCsvUploader";
import YearTagList from "./YearTagList";
import { showErrorToast } from "../utils/toastUtils";
import { apiRequest } from "../utils/api";

const NonConsumableForm = () => {
  const [yearData, setYearData] = useState([]);
  const [yearDataMap, setYearDataMap] = useState({});

  const fetchYearData = async () => {
    try {
      const response = await apiRequest.get(
        "/nonConsumableStock/getAllFinancialYears"
      );
      // console.log("response...", response?.data);

      setYearData(response?.data?.years || []);
      response?.data?.years?.map((item) => {
        fetchTableData(item?.year);
      });
    } catch (error) {
      console.error("Error fetching year list:", error);
    }
  };

  const fetchTableData = async (year) => {
    if (!year) return;
    try {
      const response = await apiRequest.get(
        `/nonConsumableStock/nonConsumableStockFilter/${year}`
      );

      // const hasData = response?.data?.data?.length > 0
      const hasData = response?.data?.yearData?.data?.length > 0;

      // store this info to track whether a year has data or not
      setYearDataMap((prev) => ({ ...prev, [year]: !hasData }));
    } catch (error) {
      console.error("Error fetching table data", error);
      showErrorToast(`Failed to fetch data for year: ${year}`);
    }
  };
  useEffect(() => {
    fetchYearData();
  }, []);

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
              <NonConsumableCsvUploader
                yearData={yearData}
                fetchYearData={fetchYearData}
              />
            </Card>
          </Grid>
        </Grid>
        <YearTagList
          yearData={yearData}
          fetchYearData={fetchYearData}
          yearDataMap={yearDataMap}
        />
      </Box>
    </>
  );
};

export default NonConsumableForm;
