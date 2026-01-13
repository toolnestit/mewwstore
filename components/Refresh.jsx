"use client";

import { useQueryParams } from "@/lib/useQueryParams";
import { useEffect } from "react";

function RefreshPage() {
  const { hasQuery, deleteQuery } = useQueryParams();

  useEffect(() => {
    if (!hasQuery("refresh")) return;

    if (sessionStorage.getItem("refresh-done")) {
      deleteQuery("refresh");
      return;
    }

    sessionStorage.setItem("refresh-done", "1");
    deleteQuery("refresh");

    setTimeout(() => {
      window.location.reload();
    }, 100);
  }, [hasQuery, deleteQuery]);

  return null;
}

export default RefreshPage;
