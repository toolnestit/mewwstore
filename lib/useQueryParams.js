"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Clone current params
  const createParams = () => new URLSearchParams(searchParams.toString());

  // 🔹 Get a single query param
  const getQuery = (key) => {
    return searchParams.get(key);
  };

  // 🔹 Check if a key exists
  const hasQuery = (key) => {
    return searchParams.has(key);
  };

  // 🔹 Get all params as an object
  const getAll = () => {
    const obj = {};
    for (const [key, value] of searchParams.entries()) {
      obj[key] = value;
    }
    return obj;
  };

  // 🔹 Add or update a param
  const setQuery = (key, value, options = { replace: false }) => {
    const params = createParams();
    params.set(key, value);

    const method = options.replace ? "replace" : "push";
    router[method](`${pathname}?${params.toString()}`);
  };

  // 🔹 Delete a param
  const deleteQuery = (key, options = { replace: false }) => {
    const params = createParams();
    params.delete(key);

    const method = options.replace ? "replace" : "push";
    const url = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router[method](url);
  };

  const clearQuery = (options = { replace: false }) => {
    const method = options.replace ? "replace" : "push";
    router[method](pathname);
  };

  return {
    // GETTERS
    getQuery,
    hasQuery,
    getAll,

    // SETTERS
    setQuery,
    deleteQuery,
    clearQuery,
  };
}
