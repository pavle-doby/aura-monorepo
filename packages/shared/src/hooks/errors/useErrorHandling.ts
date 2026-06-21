import axios from "axios";
import { FieldValues, UseFormSetError } from "react-hook-form";
import { useCallback, useEffect } from "react";
import type { i18n } from "i18next";
import { getZodLocale } from "../../utils";
import { authErrorMessages } from "./consts/authErrorMessages";
import { userErrorMessages } from "./consts/userErrorMessages";
import { sharedErrorMessages } from "./consts/sharedErrorMessages";

const allErrorMessages = {
  ...sharedErrorMessages,
  ...authErrorMessages,
  ...userErrorMessages,
};

/**
 * TODO@pavle: Separate this into 2 hooks:
 * - `useErrorHandlingForm` — for form submissions, which will handle field-level errors and root errors.
 * - `useErrorHandlingAction` — for standalone actions, which will always show a toast notification.
 */

/**
 * Custom hook for handling API errors in forms and standalone actions.
 *
 * - `handleErrorForm` — maps Zod field issues to individual field errors and
 *   falls back to a root error when no issues are present; auto-invoked when
 *   `error` changes.
 * - `handleErrorAction` — always displays a toast; use for mutations outside
 *   of a form context.
 *
 * @param error - Error to handle automatically via effect (uses `handleErrorForm`).
 * @param setError - React Hook Form setter used by `handleErrorForm` for field and root errors.
 * @param showToastError - Callback to display a toast notification, used by `handleErrorAction`.
 */
export function useErrorHandling<T extends FieldValues>({
  i18n,
  error = null,
  setError,
  showToastError,
  t,
}: {
  i18n: i18n;
  error?: Error | null;
  setError?: UseFormSetError<T>;
  t?: (key: string) => string;
  showToastError?: ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => string | number;
}) {
  // ####################################
  // #region Error Handling Functions
  // ####################################

  const showErrorFormField = useCallback(
    ({ field, message }: { field: string; message: string }) => {
      setError?.(field as Parameters<UseFormSetError<T>>[0], {
        type: "server",
        message,
      });
    },
    [setError]
  );

  const showErrorFormRoot = useCallback(
    ({ message }: { message: string }) => {
      setError?.("root" as Parameters<UseFormSetError<T>>[0], {
        type: "server",
        message,
      });
    },
    [setError]
  );

  /**
   * Handles API errors for form submissions.
   *
   * ! P.S. When used, you need to handle form error and show proper alert for the form.
   */
  const handleErrorForm = useCallback(
    (responseError: Error) => {
      if (!axios.isAxiosError(responseError)) return;

      const data = responseError.response?.data as any | undefined;
      if (!data) return;

      if (Array.isArray(data.error?.issues) && data.error.issues.length > 0) {
        // Handle Zod validation errors — set individual field errors
        const locale = getZodLocale(i18n);

        for (const issue of data.error.issues) {
          const messageLocal = locale.localeError(issue);
          const messageStr =
            typeof messageLocal === "string" ? messageLocal : messageLocal?.message;
          const messageFallback = issue.message;

          const message = messageStr || messageFallback;

          showErrorFormField({ field: issue.path.join("."), message });
        }
        return;
      }

      // No field-level issues — set root error (or toast if showAlert is false)
      const mapped = allErrorMessages[data.code as keyof typeof allErrorMessages];
      if (mapped) {
        showErrorFormRoot({ message: t ? t(mapped.message) : mapped.message });
      } else {
        showErrorFormRoot({ message: data.error?.message ?? responseError.message });
      }
    },
    [showErrorFormField, showErrorFormRoot, i18n, t]
  );

  /**
   * Handles API errors for standalone actions (not tied to a form).
   *
   * Always displays a toast notification with the error message.
   */
  const handleErrorAction = useCallback(
    (responseError: Error) => {
      if (!axios.isAxiosError(responseError)) return;

      const data = responseError.response?.data as any | undefined;
      if (!data) return;

      // Always display a toast regardless of showAlert
      const mapped = allErrorMessages[data.code as keyof typeof allErrorMessages];
      if (mapped) {
        showToastError?.({
          title: t ? t(mapped.title) : mapped.title,
          description: t ? t(mapped.message) : mapped.message,
        });
      } else {
        showToastError?.({
          title: data.error?.message ?? responseError.message,
          description: "Sorry this went wrong... Please try again!",
        });
      }
    },
    [showToastError, t]
  );

  // ####################################
  // #endregion Error Handling Functions
  // ####################################

  useEffect(() => {
    if (error) {
      handleErrorForm(error);
    }
  }, [error, handleErrorForm]);

  return { handleErrorForm, handleErrorAction };
}
