import { Grid, Card, CardContent, Typography, Box, Alert } from "@mui/material";

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Inventory,
  AssignmentTurnedIn,
  Storage,
  ListAlt,
} from "@mui/icons-material";
import MonthWiseBarChart from "../components/MonthWiseBarChart";
import StatusPieChart from "../components/StatusPieChart";
import AdminApprovalButton from "../components/AdminApprovalButton";
import InventorySummary from "../components/InventorySummary";
import ReIssueLogDialog from "../components/dialog/ReIssueLogDialog";

export default function DashboardMaster() {
  const [data, setData] = useState({
    currentlyIssued: 0,
    returnedOrConsumed: 0,
    totalInventory: 0,
    totalIssuedComponents: 0,
  });
  const [allIssuanceData, setAllIssuanceData] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);

  const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;
  const user = JSON.parse(localStorage.getItem("user"));

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
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}/inventory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      const inventoryData = response?.data?.data || [];

      setData((prevData) => ({
        ...prevData,
        totalInventory: inventoryData.length,
      }));
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}/master/pending-approvals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPendingUsers(response?.data?.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchIssuanceData();
    fetchInventoryData();
    if (user?.role === "master") fetchPendingUsers();
  }, [baseURL, user]);

  return (
    <Box
      sx={{
        minHeight: "85vh",
        width: "100%",
        backgroundColor: "#f4f4f4",
        padding: "40px 20px",
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

      <AdminApprovalButton pendingUsers={pendingUsers} />

      {/* Inventory Summary Section */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* <Grid item xs={12} md={4}>
          <Card>
            <InventorySummary />
          </Card>
        </Grid> */}

        {/* Charts Section */}
        <Grid item xs={12} md={8}>
          <Card>
            {/* <Card sx={{ padding: 4 }}> */}
            <MonthWiseBarChart graphData={allIssuanceData} />
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <InventorySummary />
          </Card>
        </Grid>
      </Grid>
      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* <Grid item xs={12} md={8}>
          <Card sx={{ padding: 4 }}>
            <MonthWiseBarChart graphData={allIssuanceData} />
          </Card>
        </Grid> */}
        <Grid item xs={12} md={8}>
          <Card>
            {/* <Card sx={{ padding: 4 }}> */}
            <StatusPieChart graphData={allIssuanceData} />
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              padding: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h6"
              color="primary"
              fontWeight="bold"
              gutterBottom
            >
              Re-issue Log Details
            </Typography>

            <ReIssueLogDialog />
          </Card>
        </Grid>
      </Grid>
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
