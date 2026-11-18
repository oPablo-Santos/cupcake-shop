'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type Item = {
  label: string
  href?: string
  disabled?: boolean
  danger?: boolean
  onSelect?: () => void
}

const MENU_WIDTH = 224

export function ActionMenu({ items, busy }: { items: Item[]; busy?: boolean }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  function place() {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return
    const left = Math.min(Math.max(12, rect.right - MENU_WIDTH), window.innerWidth - MENU_WIDTH - 12)
    const estimated = 12 + items.length * 40
    const below = rect.bottom + 8
    const top = below + estimated > window.innerHeight - 12 ? Math.max(12, rect.top - estimated - 8) : below
    setPos({ top, left })
  }

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
    function onLayout() {
      place()
    }
    window.addEventListener('mousedown', onPointer)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onLayout)
    window.addEventListener('scroll', onLayout, true)
    return () => {
      window.removeEventListener('mousedown', onPointer)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onLayout)
      window.removeEventListener('scroll', onLayout, true)
    }
  }, [open, items.length])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        disabled={busy}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => {
          place()
          setOpen((value) => !value)
        }}
        className={`action-trigger ${open ? 'action-trigger-open' : ''}`}
      >
        <span className="sr-only">{busy ? 'Salvando' : 'Ações'}</span>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <circle cx="5" cy="12" r="1.7" />
          <circle cx="12" cy="12" r="1.7" />
          <circle cx="19" cy="12" r="1.7" />
        </svg>
      </button>
      {open
        ? createPortal(
        <div ref={menuRef} id={menuId} role="menu" style={{ top: pos.top, left: pos.left, width: MENU_WIDTH }} className="action-menu">
          {items.map((item) => {
            const className = `action-menu-item ${item.danger ? 'action-menu-danger' : ''} ${item.disabled ? 'action-menu-current' : ''}`
            const body = (
              <>
                <span>{item.label}</span>
                {item.disabled ? <span className="action-menu-badge">Atual</span> : null}
              </>
            )
            if (item.href) {
              return (
                <Link key={item.label} href={item.href} role="menuitem" className={className} onClick={() => setOpen(false)}>
                  {body}
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
                {body}
              </button>
            )
          })}
        </div>,
          document.body,
        )
        : null}
    </>
  )
}
