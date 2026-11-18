'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

type Item = {
  label: string
  href?: string
  disabled?: boolean
  danger?: boolean
  onSelect?: () => void
}

export function ActionMenu({ items, busy }: { items: Item[]; busy?: boolean }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointer(event: MouseEvent) {
      const target = event.target as Node
      if (menuRef.current?.contains(target) || buttonRef.current?.contains(target)) return
      setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('mousedown', onPointer)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onPointer)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  function toggle() {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) setPos({ top: rect.bottom + 6, left: rect.right })
    setOpen((value) => !value)
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        disabled={busy}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={toggle}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium shadow-sm transition hover:bg-[var(--surface-muted)] disabled:opacity-60"
      >
        {busy ? 'Salvando…' : 'Ações'}
        <span aria-hidden className="text-[10px] text-[var(--muted-foreground)]">
          ▾
        </span>
      </button>
      {open ? (
        <div
          ref={menuRef}
          role="menu"
          style={{ top: pos.top, left: pos.left }}
          className="fixed z-50 min-w-40 -translate-x-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-1 shadow-lg"
        >
          {items.map((item) => {
            const className = `block w-full px-3 py-2 text-left text-sm transition hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-40 ${
              item.danger ? 'text-red-600 dark:text-red-400' : ''
            }`
            if (item.href) {
              return (
                <Link key={item.label} href={item.href} role="menuitem" className={className} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              )
            }
            return (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                disabled={item.disabled || busy}
                className={className}
                onClick={() => {
                  setOpen(false)
                  item.onSelect?.()
                }}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      ) : null}
    </>
  )
}
