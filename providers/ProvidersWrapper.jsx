"use client";

import Preloader from "@/components/Preloader";
import ToastProvider from "./ToastProvider";
import RefreshPage from "@/components/Refresh";

function ProvidersWrapper({ children }) {
  return (
    <ToastProvider>
      <Preloader>{children}</Preloader>
      <RefreshPage />
    </ToastProvider>
  );
}

export default ProvidersWrapper;
