import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Snackbar,
} from "@mui/material";

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Inventory,
  AssignmentTurnedIn,
  Storage,
  ListAlt,
  Edit,
  ContentCopy,
} from "@mui/icons-material";
// import MonthWiseBarChart from "../components/MonthWiseBarChart";

export default function DashboardAdmin() {
  const [data, setData] = useState({
    currentlyIssued: 0,
    returnedOrConsumed: 0,
    totalInventory: 0,
    totalIssuedComponents: 0,
  });
  const [allIssuanceData, setAllIssuanceData] = useState([]);
  const [copySuccess, setCopySuccess] = useState(false);

  const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;
  const userFormURL = `${window.location.origin}/user_form`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(userFormURL);
      setCopySuccess(true);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleCloseSnackbar = () => {
    setCopySuccess(false);
  };

  useEffect(() => {
    const fetchIssuanceData = async () => {
      try {
        const response = await axios.get(`${baseURL}/user/get-user`);
        const allFetchedData = response?.data?.data || [];
        setAllIssuanceData(allFetchedData);

        const totalIssuedCount = allFetchedData.length;
        const currentlyIssuedCount = allFetchedData.filter(
          (item) => item.status === "Issued"
        ).length;

        const returnedOrConsumedCount = allFetchedData.filter(
          (item) => item.status === "Returned" || item.status === "Consumed"
        ).length;

        setData((prevData) => ({
          ...prevData,
          currentlyIssued: currentlyIssuedCount,
          returnedOrConsumed: returnedOrConsumedCount,
          totalIssuedComponents: totalIssuedCount,
        }));
      } catch (error) {
        console.error("Error fetching issuance data:", error);
      }
    };

    const fetchInventoryData = async () => {
      try {
        const response = await axios.get(`${baseURL}/inventory`);
        const inventoryData = response?.data?.data || [];

        setData((prevData) => ({
          ...prevData,
          totalInventory: inventoryData.length,
        }));
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      }
    };

    fetchIssuanceData();
    fetchInventoryData();
  }, [baseURL]);

  return (
    <Box
      sx={{
        minHeight: "85vh",
        width: "100%",
        backgroundColor: "#f4f4f4",
        padding: "40px 20px",
        // padding: 2,
        mt: 1.5,
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        color="primary"
        gutterBottom
        mb={2}
      >
        📊 Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        <StatCard
          title="Currently Issued"
          value={data?.currentlyIssued}
          icon={<Inventory fontSize="large" />}
          color="#3f51b5"
          link="/issued_records"
        />
        <StatCard
          title="Total Returned/ Consumed"
          value={data?.returnedOrConsumed}
          icon={<AssignmentTurnedIn fontSize="large" />}
          color="#43A047"
          link="/returned_consumed"
        />
        <StatCard
          title="Total Inventory"
          value={data?.totalInventory}
          icon={<Storage fontSize="large" />}
          // color="#FB8C00"
          color="#257180"
          link="/inventory_records"
        />
        <StatCard
          title="Total Issued Components"
          value={data?.totalIssuedComponents}
          icon={<ListAlt fontSize="large" />}
          color="#8E24AA"
        />
      </Grid>

      {/* Bar Chart Section */}
      {/* <Card sx={{ marginTop: "20px", padding: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          📊 Month-wise Issuance Chart
        </Typography>
        <MonthWiseBarChart data1={allIssuanceData} />
      </Card> */}

      {/* User Form Button */}
      <Card
        sx={{
          marginTop: "20px",
          textAlign: "center",
          padding: 3,
          background: "#E3F2FD",
        }}
      >
        <CardContent>
          <Edit sx={{ fontSize: 50, color: "#1976d2" }} />
          <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
            Need to Issue a Component?
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
            Click below to fill out the issuance form.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <a
              href="/user_form"
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{ marginRight: 1 }}
              >
                📄 Fill Issuance Form
              </Button>
            </a>

            <Button
              variant="outlined"
              color="primary"
              onClick={handleCopyLink}
              startIcon={<ContentCopy />}
            >
              Copy Form Link
            </Button>
          </Box>

          <Snackbar
            open={copySuccess}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            message="Link copied to clipboard!"
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          />
        </CardContent>
      </Card>
    </Box>
  );
}

function StatCard({ title, value, icon, color, link }) {
  const path = location.pathname + `${link}`;
  return (
    <Grid item xs={12} sm={6} md={3}>
      {link ? (
        <Link to={path} style={{ textDecoration: "none" }}>
          <StatCardContent
            title={title}
            value={value}
            icon={icon}
            color={color}
          />
        </Link>
      ) : (
        <StatCardContent
          title={title}
          value={value}
          icon={icon}
          color={color}
        />
      )}
    </Grid>
  );
}

function StatCardContent({ title, value, icon, color }) {
  return (
    <Card
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${color}, rgb(66, 71, 77))`,
        // background: `linear-gradient(135deg, ${color}, rgb(45, 50, 56))`,
        color: "white",
        borderRadius: "12px",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 0,
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
        },
        // ------------------------------
        position: "relative",
        "&:after": {
          content: '""',
          position: "absolute",
          width: 210,
          height: 210,
          background: color,
          borderRadius: "50%",
          top: { xs: -105, sm: -85 },
          right: { xs: -140, sm: -95 },
          opacity: 0.3,
          zIndex: 0,
        },
        "&:before": {
          content: '""',
          position: "absolute",
          width: 210,
          height: 210,
          background: color,
          borderRadius: "50%",
          top: { xs: -155, sm: -125 },
          right: { xs: -70, sm: -15 },
          opacity: 0.4,
          zIndex: 0,
        },

        // Make sure your content stays above pseudo elements
        "& > *": {
          position: "relative",
          zIndex: 1,
        },
      }}
    >
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ fontSize: "50px", opacity: 0.7 }}>{icon}</Box>
        <Box>
          <Typography variant="body1" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
