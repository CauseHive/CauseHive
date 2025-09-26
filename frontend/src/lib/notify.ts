export type ToastVariant = 'default' | 'success' | 'error'
export type ToastPayload = { title?: string; description?: string; variant?: ToastVariant; duration?: number }

export function emitToast(payload: ToastPayload) {
  try {
    window.dispatchEvent(new CustomEvent('app:toast', { detail: payload }))
  } catch {
    // no-op in non-browser environments
  }
}
