interface ConfirmOptions {
  title: string;
  text: string;
  confirmText: string;
  cancelText?: string;
}

/**
 * Confirmation dialog built on SweetAlert2 (never the browser's default alert/confirm).
 * Loaded on demand and styled with the theme's own classes, so it follows light and dark mode.
 */
export async function confirmAction({ title, text, confirmText, cancelText = "Keep it" }: ConfirmOptions): Promise<boolean> {
  const Swal = (await import("sweetalert2")).default;
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    focusCancel: true,
    buttonsStyling: false,
    customClass: {
      popup: "rounded-box! bg-base-100! text-base-content! border! border-base-300!",
      title: "font-heading! text-base-content!",
      htmlContainer: "text-base-content/70!",
      confirmButton: "btn btn-error mx-1",
      cancelButton: "btn btn-ghost mx-1",
    },
  });
  return result.isConfirmed;
}
