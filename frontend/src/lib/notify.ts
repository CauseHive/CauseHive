export type ToastVariant = 'default' | 'success' | 'error'
export type ToastPayload = { title?: string; description?: string; variant?: ToastVariant; duration?: number }

export function emitToast(payload: ToastPayload) {
  try {
    window.dispatchEvent(new CustomEvent('app:toast', { detail: payload }))
  } catch (err) {
    // no-op in non-browser environments; log for visibility
    // (This helps in e2e / SSR scenarios where window may not accept CustomEvent)
    // eslint-disable-next-line no-console
    console.warn('emitToast failed (non-browser or blocked):', payload, err)
  }
}
