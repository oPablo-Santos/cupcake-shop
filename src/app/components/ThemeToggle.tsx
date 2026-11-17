'use client'

import { useTheme } from '@/app/components/ThemeProvider'
import { IconMoon, IconSun } from '@/app/components/icons'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative flex h-9 w-16 items-center rounded-full border border-[var(--border)] bg-[var(--surface-muted)] p-1 transition hover:border-[var(--accent)]/40 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      role="switch"
      aria-checked={isDark}
    >
      <span
        className={`absolute flex h-7 w-7 items-center justify-center rounded-full bg-[var(--card)] shadow-sm transition-transform duration-300 ${
          isDark ? 'translate-x-7 text-amber-400' : 'translate-x-0 text-[var(--accent)]'
        }`}
      >
        {isDark ? <IconSun /> : <IconMoon />}
      </span>
      <span className="flex w-full justify-between px-1.5 text-[var(--muted-foreground)] opacity-60">
        <IconMoon className="h-3.5 w-3.5" />
        <IconSun className="h-3.5 w-3.5" />
      </span>
    </button>
  )
}
