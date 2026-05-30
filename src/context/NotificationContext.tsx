"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import Toast, { ToastType } from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";

interface NotificationContextType {
  showToast: (message: string, type?: ToastType) => void;
  confirm: (options: ConfirmOptions) => void;
}

interface ConfirmOptions {
  title: string;
  message: string;
  onConfirm: (motive?: string) => void;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "info" | "success" | "warning";
  requiredConfirmValue?: string;
  showMotiveInput?: boolean;
  motivePlaceholder?: string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: (motive?: string) => void;
    confirmText?: string;
    cancelText?: string;
    type?: "danger" | "info" | "success" | "warning";
    requiredConfirmValue?: string;
    showMotiveInput?: boolean;
    motivePlaceholder?: string;
  } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    setToast({ message, type });
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    setConfirmState({
      isOpen: true,
      title: options.title,
      message: options.message,
      onConfirm: (motive?: string) => {
        options.onConfirm(motive);
        setConfirmState(null);
      },
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      type: options.type || "info",
      requiredConfirmValue: options.requiredConfirmValue,
      showMotiveInput: options.showMotiveInput,
      motivePlaceholder: options.motivePlaceholder,
    });
  }, []);

  return (
    <NotificationContext.Provider value={{ showToast, confirm }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {confirmState && (
        <ConfirmModal
          isOpen={confirmState.isOpen}
          title={confirmState.title}
          message={confirmState.message}
          onConfirm={confirmState.onConfirm}
          onCancel={() => setConfirmState(null)}
          confirmText={confirmState.confirmText}
          cancelText={confirmState.cancelText}
          type={confirmState.type}
          requiredConfirmValue={confirmState.requiredConfirmValue}
          showMotiveInput={confirmState.showMotiveInput}
          motivePlaceholder={confirmState.motivePlaceholder}
        />
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
