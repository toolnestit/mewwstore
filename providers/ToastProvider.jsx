"use client";

import { SnackbarProvider } from "notistack";
import React from "react";

function ToastProvider({ children }) {
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      {children}
    </SnackbarProvider>
  );
}

export default ToastProvider;
