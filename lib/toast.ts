// lib/toast.ts
"use client";

import { toast } from "sonner";

export function showErrorToast(message: string) {
  toast.error(message);
}

export function showSuccessToast(message: string) {
  toast.success(message);
}

export function showInfoToast(message: string) {
  toast(message);
}

export function showWarningToast(message: string) {
  toast.warning(message);
}

export function showLoadingToast(message: string) {
  toast.loading(message);
}
