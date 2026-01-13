"use client";

import { useEffect } from "react";

export default function Support() {
  useEffect(() => {
    if (window.Tawk_API) return;

    var Tawk_API = window.Tawk_API || {};
    var Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/69639688aae923197d507091/1jemggskv";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script);

    window.Tawk_API = Tawk_API;
    window.Tawk_LoadStart = Tawk_LoadStart;
  }, []);

  return null;
}
