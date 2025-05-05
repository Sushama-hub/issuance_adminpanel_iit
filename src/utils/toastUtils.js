import { toast, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export const showSuccessToast = (message) => {
  toast.success(message, {
    autoClose: 1500,
    transition: Slide,
    style: { width: "auto" },
  })
}

export const showErrorToast = (message) => {
  toast.error(message, {
    autoClose: 1500,
    transition: Slide,
    style: { width: "auto" },
  })
}

export const showInfoToast = (message) => {
  toast.info(message, {
    autoClose: 1500,
    transition: Slide,
    style: { width: "auto" },
  })
}
export const showWarningToast = (message) => {
  toast.info(message, {
    autoClose: 1500,
    transition: Slide,
    style: { width: "auto" },
  })
}
