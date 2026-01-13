"use client";

import { useEffect } from "react";

export default function useQueryGuard() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasPlan = params.has("plan");
    const hasTool = params.has("tool");

    // If both plan+tool, remove tool first
    if (hasPlan && hasTool) {
      params.delete("tool");
      const nextQuery = params.toString();
      const newUrl = nextQuery
        ? `${window.location.pathname}?${nextQuery}`
        : window.location.pathname;

      if (newUrl !== window.location.href) {
        // ✅ Replace URL first, then reload
        window.history.replaceState({}, "", newUrl);
        window.location.reload();
      }
      return;
    }

    // If tool → plan shift
    if (hasPlan && !hasTool) {
      // Reload only if not already at correct URL
      if (!window.location.href.includes("plan")) {
        window.location.reload();
      }
    }
  }, []); // Empty dependency, run only once per page load
}
