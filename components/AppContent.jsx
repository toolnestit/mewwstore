"use client";

import { getPorudctContent } from "@/controllers/basics/user";
import { useQueryParams } from "@/lib/useQueryParams";
import { checkExpire } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { PortableText } from "@portabletext/react";
import { enqueueSnackbar } from "notistack";
import { Button } from "./ui/button";
import { Loader, X } from "lucide-react";

function AppContent({ access }) {
  const [showDialog, setShowDialog] = useState(false);
  const [appName, setAppName] = useState("");
  const { getQuery, deleteQuery } = useQueryParams();
  const [content, setcontent] = useState();
  const name = getQuery("app");
  useEffect(() => {
    const isValid = checkExpire(access, name);
    if (name || isValid) {
      setAppName(name);
      setShowDialog(true);
      fetchContent();
    }
  }, [name]);

  const fetchContent = useCallback(async () => {
    const content = await getPorudctContent(name);
    setcontent(content?.content);
  });

  const handleClose = () => {
    setShowDialog(false);
    deleteQuery("app");
  };

  return (
    <div>
      {showDialog && (
        <section className="flex justify-center w-full items-center backdrop-blur-[8px] bg-black/20 h-screen fixed top-0 px-5 z-[99]">
          {content ? (
            <div className="bg-white max-w-[700px] flex flex-col p-7 w-full rounded-md relative">
              <button
                onClick={() => {
                  handleClose();
                }}
                className=" absolute right-5 top-5"
              >
                <X />
              </button>
              <PortableText value={content} components={ptComponents} />
            </div>
          ) : (
            <>
              <Loader size={40} className="text-white animate-spin" />
            </>
          )}
        </section>
      )}
    </div>
  );
}

export default AppContent;

export const ptComponents = {
  // Standard blocks like headings and paragraphs
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold my-1">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold my-1">{children}</h2>
    ),
    h3: ({ children }) => <h3 className="text-xl font-semibold">{children}</h3>,
    normal: ({ children }) => <p className="text-base mb-3">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-3">
        {children}
      </blockquote>
    ),
  },

  // Inline marks
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },

  types: {
    ubtton: ({ value }) => {
      return (
        <Button
          className={`py-3.5`}
          onClick={() => {
            if (value.redirectUrl) {
              window.location.href = value.redirectUrl;
              return;
            }
            navigator.clipboard.writeText(value?.copyValue).then(() => {
              enqueueSnackbar("Copy to clipboard successfull");
            });
          }}
        >
          {value?.name || "Click Me"}
        </Button>
      );
    },
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      return (
        <img
          src={`https://cdn.sanity.io/images/YOUR_PROJECT_ID/production/${value.asset._ref}.jpg`}
          alt={value.alt || "Image"}
          className="my-4 rounded-lg"
        />
      );
    },
  },

  // List items
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-5 mb-3">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal ml-5 mb-3">{children}</ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li className="mb-1">{children}</li>,
    number: ({ children }) => <li className="mb-1">{children}</li>,
  },
};
