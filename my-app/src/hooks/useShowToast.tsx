"use client"

import { Bounce, toast } from "react-toastify";


export const useShowToast = (text: string, status: "success" | "error" | "warning" | "retry-warning", onRetry?: () => void) => {
  const retryButton = (
    <button
      onClick={onRetry}
      className="text-blue-500 hover:text-blue-700 ml-2 font-semibold h-2 w-3"
    >
      Retry
    </button>
  );
  status === "success" ? toast.success(text, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  })
    : status === "error" ? toast.error(text, {
      position: "top-center",
      autoClose: 8000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    }) : status === "warning" ? toast.warn(text, {
      position: "top-center",
      autoClose: 8000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    }) : toast.warn(
      <div className="flex items-center">
        <span>{text}</span>
        {retryButton}
      </div>,
      {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      }
    )
};