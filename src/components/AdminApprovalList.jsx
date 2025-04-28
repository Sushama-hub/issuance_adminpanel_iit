import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material"
import axios from "axios"
import React, { useEffect, useState } from "react"

export default function AdminApproval() {
  const [approveMsg, setApproveMsg] = useState("")
  const [users, setUsers] = useState([])
  const [isApproved, setIsApproved] = useState(false)
  const baseURL = import.meta.env.VITE_BACKEND_BASE_URL

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${baseURL}/admin/pending-approvals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      // console.log("response====", response?.data)
      setUsers(response?.data?.users || [])
      if (response?.data?.success && response?.data?.users.length === 0) {
        setApproveMsg("User approved as admin")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleApproveUser = async (userId) => {
    console.log("handleApproveUser called", userId)
    await axios.put(`${baseURL}/admin/approve/${userId}`)
    alert("User approved as admin")
    window.location.reload()
  }

  const handleRemoveUser = async (userId) => {
    console.log("handleApproveUser called", userId)
    alert("Do You Want To Denied User!")
    await axios.delete(`${baseURL}/admin/deletePendingUser/${userId}`)
    window.location.reload()
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <>
      {/* <Box
        sx={{
          minHeight: "85vh",
          width: "100%",
          backgroundColor: "#f4f4f4",
          padding: 2,
          mt: 1.5,
        }}
      > */}
      {/* <Alert severity="success" sx={{ border: "1px solid green" }}>
        {approveMsg}
      </Alert> */}
      {users.length > 0 && (
        <>
          <Typography
            variant="h5"
            gutterBottom
            fontWeight="bold"
            color="primary"
          >
            Pending Admin Approvals Requests
          </Typography>

          <Box
            sx={{
              maxHeight: 300,
              //   overflowY: users.length > 5 ? "scroll" : "auto",
              overflowY: "auto",
              border: "1px solid #ccc",
              borderRadius: 2,
              p: 1,
            }}
          >
            {users.map((user) => (
              <Card key={user._id} sx={{ mb: 1, borderRadius: 2 }}>
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 0, // Less vertical padding
                    px: 2, // Optional: a little horizontal padding
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      onClick={() => handleApproveUser(user?._id)}
                      sx={{ whiteSpace: "nowrap", mt: 2 }} //prevents line break inside button
                    >
                      Approve as Admin
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleRemoveUser(user?._id)}
                      sx={{ whiteSpace: "nowrap", mt: 2 }} //prevents line break inside button
                    >
                      cancel
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </>
      )}
      {/* </Box> */}
    </>
  )
}
