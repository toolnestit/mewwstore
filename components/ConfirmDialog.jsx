"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmDialog({
  triggerText = "Open",
  title = "Are you sure?",
  description = "",
  confirmText = "Yes",
  cancelText = "Cancel",
  onConfirm = () => {},
  asChildTrigger = false,
  triggerClassName = "",
}) {
  const isValidElement = React.isValidElement(triggerText);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild={asChildTrigger}>
        {asChildTrigger && isValidElement ? (
          React.cloneElement(triggerText)
        ) : (
          <Button className={triggerClassName}>{triggerText}</Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">{cancelText}</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={onConfirm}>
              {confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
