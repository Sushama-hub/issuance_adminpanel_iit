// MasterDashboard.jsx
import { useEffect, useState } from "react"
import axios from "axios"

export function Approve() {
  const [users, setUsers] = useState([])
  //   console.log(users)
  const baseURL = import.meta.env.VITE_BACKEND_BASE_URL

  useEffect(() => {
    const token = localStorage.getItem("token")
    axios
      .get(`${baseURL}/admin/allUsers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      //   .then((res) => setUsers(res.data))
      .then((res) => {
        console.log(res.data) // 👈 Check what you're actually getting
        setUsers(res.data.users || []) // 👈 adjust as per backend response
      })
  }, [])

  const approveUser = async (userId) => {
    await axios.put(`${baseURL}/admin/approve/${userId}`)
    alert("User approved as admin")
    window.location.reload()
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Users Pending Admin Approval</h2>
      {users?.map((user) => (
        <div
          key={user._id}
          className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded"
        >
          <span>
            {user.name} ({user.email})
          </span>
          <button
            onClick={() => approveUser(user._id)}
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            Approve as Admin
          </button>
        </div>
      ))}
    </div>
  )
}
