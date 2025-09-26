import type { Pagination, Category, CauseListItem, Donation, CartItem, CartSummary } from '@/types/api'

export function toNumber(v: unknown, fallback = 0): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v)
    return Number.isFinite(n) ? n : fallback
  }
  return fallback
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function mapCategory(input: unknown): Category {
  const obj = (input ?? {}) as Record<string, unknown>
  return {
    id: String(obj.id ?? ''),
    name: String(obj.name ?? ''),
    description: obj.description as string | undefined,
    icon: obj.icon as string | undefined,
    color: obj.color as string | undefined,
    cause_count: typeof obj.cause_count === 'number' ? obj.cause_count : toNumber(obj.cause_count, 0)
  }
}

export function mapCauseListItem(input: unknown): CauseListItem {
  const obj = (input ?? {}) as Record<string, unknown>
  const target = toNumber(obj.target_amount, 0)
  const current = toNumber(obj.current_amount, 0)
  const rawProgress = typeof obj.progress_percentage === 'number' ? (obj.progress_percentage as number) : (target > 0 ? (current / target) * 100 : 0)
  const creator = (obj.creator ?? {}) as Record<string, unknown>
  const organizerId = (() => {
    const raw = obj.organizer_id
    if (typeof raw === 'string') return raw
    if (typeof raw === 'object' && raw !== null && 'id' in (raw as Record<string, unknown>)) {
      const maybeId = (raw as Record<string, unknown>).id
      if (typeof maybeId === 'string') return maybeId
    }
    return undefined
  })()
  const maybeTitle = typeof obj.title === 'string' ? obj.title : (typeof obj.name === 'string' ? obj.name : '')
  return {
    id: String(obj.id ?? ''),
    title: String(maybeTitle),
    description: String(obj.description ?? ''),
    target_amount: target,
    current_amount: current,
    progress_percentage: clamp(toNumber(rawProgress, 0), 0, 100),
    status: String(obj.status ?? ''),
    category: mapCategory(obj.category ?? {}),
    creator: {
      id: String(creator.id ?? ''),
      full_name: String(creator.full_name ?? ''),
      profile_picture: creator.profile_picture as string | undefined,
    },
    created_at: String(obj.created_at ?? ''),
    updated_at: String(obj.updated_at ?? ''),
    deadline: obj.deadline as string | undefined,
    featured_image: (obj.featured_image as string | undefined) ?? (typeof (obj as Record<string, unknown>).cover_image === 'string' ? (obj as Record<string, unknown>).cover_image as string : undefined),
    donation_count: toNumber(obj.donation_count, 0),
    is_featured: Boolean(obj.is_featured),
    organizer_id: organizerId
  }
}

type AnyPagination = { count?: unknown; next?: unknown; previous?: unknown; results?: unknown }

export function mapPagination<TOut>(p: AnyPagination, mapper: (x: unknown) => TOut): Pagination<TOut> {
  const results = Array.isArray(p?.results) ? (p.results as unknown[]) : []
  return {
    count: toNumber(p?.count, 0),
    next: typeof p?.next === 'string' ? (p.next as string) : null,
    previous: typeof p?.previous === 'string' ? (p.previous as string) : null,
    results: results.map(mapper)
  }
}

export function mapDonation(input: unknown): Donation {
  const obj = (input ?? {}) as Record<string, unknown>
  const cause = (obj.cause ?? {}) as Record<string, unknown>
  const donor = (obj.donor ?? {}) as Record<string, unknown>
  const recipient = (obj.recipient ?? {}) as Record<string, unknown>
  const causeCreator = (cause.creator ?? {}) as Record<string, unknown>
  const causeTitle = typeof cause.title === 'string' ? cause.title : (typeof (cause as Record<string, unknown>).name === 'string' ? (cause as Record<string, unknown>).name as string : '')
  return {
    id: String(obj.id ?? ''),
    amount: toNumber(obj.amount, 0),
    currency: String(obj.currency ?? 'GHS'),
    status: String(obj.status ?? 'pending') as Donation['status'],
    donated_at: String(obj.donated_at ?? ''),
    transaction_id: (obj.transaction_id as string | null) ?? null,
    cause: {
      id: String(cause.id ?? ''),
      title: String(causeTitle),
      creator: {
        id: String(causeCreator.id ?? ''),
        full_name: String(causeCreator.full_name ?? ''),
      },
    },
    donor: {
      id: String(donor.id ?? ''),
      full_name: String(donor.full_name ?? ''),
      email: String(donor.email ?? ''),
    },
    recipient: {
      id: String(recipient.id ?? ''),
      full_name: String(recipient.full_name ?? ''),
    },
  }
}

export function mapCartItem(input: unknown): CartItem {
  const obj = (input ?? {}) as Record<string, unknown>
  const cause = (obj.cause ?? {}) as Record<string, unknown>
  const causeTitle2 = typeof cause.title === 'string' ? cause.title : (typeof (cause as Record<string, unknown>).name === 'string' ? (cause as Record<string, unknown>).name as string : '')
  const cover = typeof (cause as Record<string, unknown>).cover_image === 'string' ? (cause as Record<string, unknown>).cover_image as string : undefined
  const rawAmount = ((): unknown => {
    const o = obj as Record<string, unknown>
    return o.amount ?? (o as Record<string, unknown>).donation_amount
  })()
  return {
    id: String(obj.id ?? ''),
    cause: {
      id: String(cause.id ?? ''),
      title: String(causeTitle2),
      featured_image: (cause.featured_image as string | undefined) ?? cover,
    },
    amount: toNumber(rawAmount, 0),
    created_at: String(obj.created_at ?? ''),
  }
}

export function mapCartSummary(input: unknown): CartSummary {
  const obj = (input ?? {}) as Record<string, unknown>
  const items = Array.isArray(obj.items) ? (obj.items as unknown[]).map(mapCartItem) : []
  return {
    cart_id: typeof obj.cart_id === 'string' ? (obj.cart_id as string) : undefined,
    items,
    total_amount: toNumber(obj.total_amount, 0),
    item_count: toNumber(obj.item_count, 0),
  }
}
