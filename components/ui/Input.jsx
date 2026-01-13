"use client";

import clsx from "clsx";
import { Check, Info, TriangleAlert } from "lucide-react";
import React, { useState, forwardRef, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Input = forwardRef(function Input(
  {
    type = "text",
    required,
    placeholder,
    inputId,
    className,
    alert,
    size = "md", // <--- NEW
    parentClassName,
    ...props
  },
  ref
) {
  const [isActive, setIsActive] = useState(false);
  const defaultRef = useRef(null);
  const internalRef = ref || defaultRef;

  /* ------------------- sizing classes ------------------- */
  const sizes = {
    sm: {
      wrapper: "h-10",
      labelTop: "top-0.5 text-xs",
      labelDefault: "top-3 text-sm",
      inputPadding: "pt-4 text-sm",
    },
    md: {
      wrapper: "h-14",
      labelTop: "top-1 text-sm",
      labelDefault: "top-4 text-lg",
      inputPadding: "pt-5",
    },
    lg: {
      wrapper: "h-16",
      labelTop: "top-1 text-base",
      labelDefault: "top-5 text-xl",
      inputPadding: "pt-6",
    },
  };

  const S = sizes[size];

  /* Value detection + autofill handling */
  useEffect(() => {
    const inputEl = internalRef.current;
    if (!inputEl) return;

    const checkValue = () => {
      const val = String(inputEl.value || "");
      setIsActive(val.length > 0);
    };

    checkValue();

    const onInput = () => checkValue();
    const onChange = () => checkValue();
    const onFocus = () => setIsActive(true);
    const onBlur = () => checkValue();

    inputEl.addEventListener("input", onInput);
    inputEl.addEventListener("change", onChange);
    inputEl.addEventListener("focus", onFocus);
    inputEl.addEventListener("blur", onBlur);

    const t1 = setTimeout(checkValue, 50);
    const t2 = setTimeout(checkValue, 500);

    const poll = setInterval(checkValue, 250);
    const stopPoll = setTimeout(() => clearInterval(poll), 1100);

    return () => {
      inputEl.removeEventListener("input", onInput);
      inputEl.removeEventListener("change", onChange);
      inputEl.removeEventListener("focus", onFocus);
      inputEl.removeEventListener("blur", onBlur);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(stopPoll);
      clearInterval(poll);
    };
  }, [internalRef]);

  return (
    <div className={`flex flex-col gap-1 w-full ${parentClassName}`}>
      <label
        htmlFor={inputId}
        className={clsx(
          "relative w-full border border-black group rounded-sm pl-3 flex flex-col justify-center focus-within:ring-1 ring-offset-1 focus-within:ring-black/50",
          S.wrapper
        )}
      >
        <span
          className={clsx(
            "absolute left-3 text-black/50 transition-all duration-200",
            isActive ? S.labelTop : S.labelDefault,
            "group-focus:top-1 group-focus:text-sm"
          )}
        >
          {placeholder}
          {required && <span className="text-orange-600">*</span>}
        </span>

        <input
          id={inputId}
          ref={internalRef}
          className={clsx(
            className,
            "w-full outline-none bg-transparent",
            S.inputPadding
          )}
          type={type}
          {...props}
        />
      </label>

      <AnimatePresence>
        {alert?.text?.length > 0 && (
          <motion.span
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={clsx(
              "text-md flex items-center gap-2 overflow-hidden",
              alert.type === "succes"
                ? "text-green-500"
                : alert.type === "error"
                ? "text-red-500"
                : "text-yellow-400"
            )}
          >
            {alert.type === "succes" ? (
              <Check size={size === "lg" ? 24 : size === "sm" ? 16 : 20} />
            ) : alert.type === "error" ? (
              <Info
                strokeWidth={1.5}
                size={size === "lg" ? 24 : size === "sm" ? 16 : 20}
              />
            ) : (
              <TriangleAlert
                size={size === "lg" ? 24 : size === "sm" ? 16 : 20}
              />
            )}
            {alert.text}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
});

export default Input;
