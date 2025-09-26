import { ReactNode } from 'react'

type EmptyProps = {
  title?: string
  description?: string
  action?: ReactNode
}

export function Empty({ title = 'Nothing here yet', description, action }: EmptyProps) {
  return (
    <div className="rounded-md border p-6 text-center">
      <div className="text-sm font-medium">{title}</div>
      {description && <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">{description}</div>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}

export default Empty
