import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { Delete, DeleteTwoTone, Edit } from "@mui/icons-material";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "../utils/toastUtils";
import { apiRequest } from "../utils/api";
import ConfirmDialog from "./dialog/ConfirmDialog";

export default function YearTagList({ yearData, fetchYearData, yearDataMap }) {
  const [open, setOpen] = useState(false);
  const [newYear, setNewYear] = useState("");
  const [editClick, setEditClick] = useState(false);
  const [editableYear, setEditableYear] = useState({
    id: "",
    year: "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionData, setActionData] = useState(null);

  const navigate = useNavigate();

  const handleClick = (year) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const routeBase =
      storedUser?.role === "master"
        ? "/dashboard/master/non_consumable_stock"
        : "/dashboard/admin/non_consumable_stock";

    // pass year as route param or query param
    navigate(`${routeBase}?year=${year}`);
  };

  const handleSubmitYear = async () => {
    // Check if the year already exists in the array of objects
    const alreadyExists = yearData?.some((item) => item?.year === newYear);

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
      showWarningToast("Year already exists!");
      return;
    }

    try {
      const response = await apiRequest.post("/year/create", { year: newYear });

      if (response?.data?.success) {
        showSuccessToast(
          response?.data?.message || "Session year added successfully!"
        );
        await fetchYearData();
      }
    } catch (error) {
      console.error("Error Submitting data:", error);
      showErrorToast("Failed to add year. Please try again.");
    } finally {
      setNewYear("");
      setOpen(false);
    }
  };

  const handleDeleteClick = async (id, year) => {
    setActionData({ id, year });
    setConfirmOpen(true);
  };

  const handleEditClick = async (id, year) => {
    setEditableYear({ id, year });
    setEditClick(true);
  };

  const handleEditYear = async () => {
    // console.info("You submit  EDIT year.", editableYear)
    try {
      const response = await apiRequest.patch(`/year/${editableYear?.id}`, {
        year: editableYear?.year,
      });

      if (response?.data?.success) {
        showSuccessToast(
          response?.data?.message || "Year updated successfully!"
        );
        await fetchYearData();
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      showErrorToast(
        `Failed to update year ${editableYear}. Please try again.`
      );
    } finally {
      setEditClick(false);
      setEditableYear({ id: "", year: "" });
    }
  };

  const handleConfirmDialogSubmit = async (actionData) => {
    try {
      const response = await apiRequest.delete(`/year/${actionData?.id}`);

      if (response?.data?.success) {
        showSuccessToast(
          response?.data?.message || "Year Deleted successfully!"
        );
        await fetchYearData();
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      showErrorToast(
        `Failed to delete year ${actionData?.year}. Please try again.`
      );
    } finally {
      setConfirmOpen(false);
      setActionData(null);
    }
  };

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
        {yearData?.length > 0 ? (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              width: "80%",
              height: "100%",
              overflow: "",
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {yearData?.map((item, index) => {
              const isEmpty = yearDataMap[item.year]; // true if empty
              return (
                <Box
                  key={index}
                  size="small"
                  sx={{
                    borderRadius: "10px 5px",
                    border: "1px solid #1976d2",
                    color: "#1976d2",
                    fontWeight: "bold",
                    fontSize: 13,
                    p: 0.5,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#BBDEFB" },
                  }}
                >
                  <Box component="span" onClick={() => handleClick(item?.year)}>
                    {item?.year}
                  </Box>

                  {isEmpty && (
                    <>
                      <Edit
                        sx={{ height: 17, p: 0, ml: 0.5 }}
                        onClick={() => handleEditClick(item?._id, item?.year)}
                      />
                      <DeleteTwoTone
                        sx={{ height: 17, p: 0, m: 0 }}
                        onClick={() => handleDeleteClick(item?._id, item?.year)}
                      />
                    </>
                  )}
                </Box>
              );
            })}
          </Stack>
        ) : (
          <Box
            sx={{
              width: "80%",
              height: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 14,
              fontWeight: 500,
              color: "#555",
            }}
          >
            Please add a session year to get started.
          </Box>
        )}

        {editClick ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              width: "20%",
            }}
          >
            <Typography variant="caption" color="primary" fontWeight="bold">
              Edit This Financial Year
            </Typography>

            <TextField
              size="small"
              label="Edit Year"
              value={editableYear?.year}
              // onChange={(e) => setEditableYear(e.target.value)}
              onChange={(e) =>
                setEditableYear((prev) => ({ ...prev, year: e.target.value }))
              }
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
              onClick={handleEditYear}
              disabled={!editableYear?.year?.trim()}
              endIcon={<Edit />}
            >
              Edit
            </Button>
          </Box>
        ) : (
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
                  onChange={(e) => setNewYear(e.target.value.trim())}
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
        )}
      </Box>

      {/* Confirm Dialog */}
      <ConfirmDialog
        title="Delete Session?"
        text={`Are you sure you want to delete the year session "${actionData?.year}"?`}
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onSubmit={handleConfirmDialogSubmit}
        actionData={actionData}
        setActionData={setActionData}
      />
    </>
  );
}
